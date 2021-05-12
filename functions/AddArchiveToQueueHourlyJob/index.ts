import { AzureFunction, Context } from '@azure/functions';
import { getQueueClient } from '../utils/util';

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    const timeStamp = new Date(Date.now());

    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', timeStamp.toISOString());

    const queueClient = getQueueClient();

    const archiveDate = timeStamp;
    archiveDate.setUTCHours(archiveDate.getUTCHours() - 1);
    archiveDate.setUTCMinutes(0);
    archiveDate.setUTCSeconds(0);
    archiveDate.setUTCMilliseconds(0);

    await queueClient.sendMessage(Buffer.from(archiveDate.toISOString()).toString('base64'));
};

export default timerTrigger;
