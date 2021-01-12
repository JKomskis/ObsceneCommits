require('dotenv').config();

const { StorageSharedKeyCredential, BlobServiceClient } = require('@azure/storage-blob');
const { mkdir } = require('fs/promises');
const { createReadStream } = require('fs');
const { createGunzip } = require('zlib');
const split = require('split2');
const { promisify } = require('util');
const glob = require('glob');

const globSync = promisify(glob);

const archivesFolder = 'archives';

function getContainerClient() {
    const account = process.env.ACCOUNT_NAME || '';
    const accountKey = process.env.ACCOUNT_KEY || '';
    const container = process.env.CONTAINER_NAME || '';
    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

    const blobClient = new BlobServiceClient(
        // When using AnonymousCredential, following url should include a valid SAS or support public access
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential,
    );

    return blobClient.getContainerClient(container);
}

async function getDownloadedFiles() {
    return await globSync(`${archivesFolder}/**/*.json.gz`);
}

async function downloadArchives() {
    const downloadedArchives = await getDownloadedFiles();
    const containerClient = getContainerClient();
    for await (const item of containerClient.listBlobsFlat()) {
        const downloadPath = `${archivesFolder}/${item.name}`;
        if (!downloadedArchives.includes(downloadPath)) {
            console.log(`Downloading ${item.name}`);
            await mkdir(downloadPath.substr(0, downloadPath.lastIndexOf('/')), {
                recursive: true,
            });
            await containerClient.getBlockBlobClient(item.name).downloadToFile(downloadPath);
        }
    }
}

module.exports = async function () {
    console.log('Creating commit list');
    await downloadArchives();

    let commits = [];
    for (const archive of await getDownloadedFiles()) {
        await new Promise((resolve) => {
            createReadStream(archive)
                .pipe(createGunzip())
                .pipe(split())
                .on('data', (buffer) => {
                    const eventObj = JSON.parse(buffer);
                    let fullRepoName = eventObj['repo']['name'];
                    let branchName = eventObj['payload']['ref'].startsWith('refs/heads/')
                        ? eventObj['payload']['ref'].substring(eventObj['payload']['ref'].indexOf('/', 5) + 1)
                        : '';
                    const commit = {
                        authorName: eventObj['actor']['display_login'],
                        authorUrl: `https://github.com/${eventObj['actor']['display_login']}`,
                        authorAvatarUrl: `${eventObj['actor']['avatar_url']}s=144`,
                        repoOwner: fullRepoName.split('/')[0],
                        repoName: fullRepoName.split('/')[1],
                        repoUrl: `https://github.com/${fullRepoName}`,
                        branchName: branchName,
                        branchUrl: `https://github.com/${fullRepoName}/tree/${branchName}`,
                        commitTime: eventObj['created_at'],
                    };
                    eventObj['payload']['commits'].forEach((eventCommit) => {
                        commits.push({
                            ...commit,
                            message: eventCommit['message'],
                            commitUrl: `https://github.com/${fullRepoName}/commit/${eventCommit['sha']}`,
                        });
                    });
                })
                .on('end', () => {
                    resolve();
                });
        });
    }

    return commits;
};
