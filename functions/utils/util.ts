import { readFileSync } from 'fs';

import {
    BlobServiceClient,
    ContainerClient,
    StorageSharedKeyCredential as BlobStorageSharedKeyCredential,
} from '@azure/storage-blob';
import {
    QueueClient,
    QueueServiceClient,
    StorageSharedKeyCredential as QueueStorageSharedKeyCredential,
} from '@azure/storage-queue';

export function getUrl(timestamp: string): string {
    const archiveDate = new Date(timestamp);
    const year = archiveDate.getUTCFullYear();
    const month = (archiveDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = archiveDate.getUTCDate().toString().padStart(2, '0');
    const hour = archiveDate.getUTCHours().toString();
    return `${year}-${month}-${day}-${hour}.json.gz`;
}

// Pad hour to two characters to lexicographical order of the blobs is also time order
export function getBlobName(timestamp: string): string {
    const archiveDate = new Date(timestamp);
    const year = archiveDate.getUTCFullYear();
    const month = (archiveDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = archiveDate.getUTCDate().toString().padStart(2, '0');
    const hour = archiveDate.getUTCHours().toString().padStart(2, '0');
    return `${year}/${month}/${day}/${year}-${month}-${day}-${hour}.json.gz`;
}

export function getContainerClient(): ContainerClient {
    const account = process.env.ACCOUNT_NAME || '';
    const accountKey = process.env.ACCOUNT_KEY || '';
    const container = process.env.ARCHIVE_CONTAINER_NAME || '';
    const sharedKeyCredential = new BlobStorageSharedKeyCredential(account, accountKey);

    const blobClient = new BlobServiceClient(
        // When using AnonymousCredential, following url should include a valid SAS or support public access
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential,
    );

    return blobClient.getContainerClient(container);
}

export function getQueueClient(): QueueClient {
    const account = process.env.ACCOUNT_NAME || '';
    const accountKey = process.env.ACCOUNT_KEY || '';
    const queueName = process.env.QUEUE_NAME || '';

    const sharedKeyCredential = new QueueStorageSharedKeyCredential(account, accountKey);
    const queueServiceClient = new QueueServiceClient(
        `https://${account}.queue.core.windows.net`,
        sharedKeyCredential,
        {},
    );
    return queueServiceClient.getQueueClient(queueName);
}

export function setEnvVariables(): void {
    const settingsString = readFileSync('./local.settings.json', 'utf-8');
    const settingsJson = JSON.parse(settingsString);

    Object.keys(settingsJson['Values']).forEach((name) => {
        process.env[name] = settingsJson['Values'][name];
    });
}
