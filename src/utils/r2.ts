import { S3Client } from '@aws-sdk/client-s3';

// cloudflare r2 is s3 compatible , so the aws sdk is used to talk to it
// the client is created on first use because the env is loaded after the imports run
let client: S3Client | null = null;

export const r2 = () => {
    if (!client) {
        client = new S3Client({
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT as string,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            },
        });
    }
    return client;
}

export const r2Bucket = () => process.env.R2_BUCKET as string;
