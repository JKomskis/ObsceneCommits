import { setEnvVariables, getQueueClient } from '../utils/util';

async function main() {
    const startDate = new Date(`2020-12-01T00:00:00.000Z`);
    const endDate = new Date(`2020-12-02T00:00:00.000Z`);

    setEnvVariables();
    const queueClient = getQueueClient();
    for (const currDate = startDate; currDate < endDate; currDate.setUTCHours(currDate.getUTCHours() + 1)) {
        console.log(currDate);
        await queueClient.sendMessage(Buffer.from(currDate.toISOString()).toString('base64'));
    }
}

main();
