import { AzureFunction, Context } from '@azure/functions';
import { createGunzip, createGzip } from 'zlib';
import split from 'split2';
import fetch from 'node-fetch';
import { wordList } from './wordList';
import { repoExcludeList } from './repoExcludeList';
import { Transform } from 'stream';
import { getUrl, getBlobName, getContainerClient } from '../utils/util';

const baseUrl = 'https://data.gharchive.org';
const wordRegExps = wordList.map((word) => {
    return new RegExp(`\\b${word}\\b`);
});

const queueTrigger: AzureFunction = async function (context: Context, myQueueItem: string): Promise<void> {
    const keepObsceneCommits = new Transform({
        transform(chunk, env, callback) {
            let eventObject = JSON.parse(chunk);
            if (!eventObject['public'] || !('payload' in eventObject) || !('commits' in eventObject['payload'])) {
                callback();
                return;
            }

            if (repoExcludeList.some((repo) => eventObject['repo']['url'].includes(repo))) {
                callback();
                return;
            }

            eventObject = {
                ...eventObject,
                payload: {
                    ...eventObject['payload'],
                    commits: eventObject['payload']['commits'].filter((commit) => {
                        // wordRegExps.forEach(word => {
                        //     if(word.test(commit['message'])) {
                        //         context.log(`FOUND ${word} IN ${commit['message']}`);
                        //     }
                        // });

                        return wordRegExps.some((word) => word.test(commit['message']));
                    }),
                },
            };

            if (eventObject['payload']['commits'].length > 0) {
                this.push(JSON.stringify(eventObject));
            }
            callback();
        },
    });

    const addNewlineTransform = new Transform({
        transform(chunk, enc, callback) {
            chunk += '\n';
            this.push(chunk);
            callback();
        },
    });

    context.log('Queue trigger function processed work item', myQueueItem);
    context.log(`Fetching ${baseUrl}/${getUrl(myQueueItem)}`);
    const response = await fetch(`${baseUrl}/${getUrl(myQueueItem)}`, {
        method: 'GET',
    });

    const stream = response.body
        .pipe(createGunzip())
        .pipe(split())
        .pipe(keepObsceneCommits)
        .pipe(addNewlineTransform)
        .pipe(createGzip());

    const containerClient = getContainerClient();
    const blobName = getBlobName(myQueueItem);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadStream(stream);
};

export default queueTrigger;
