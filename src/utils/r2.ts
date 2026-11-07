import { S3Client } from '@aws-sdk/client-s3';

// cloudflare r2 is s3 compatible , so the aws sdk is used to talk to it
// CLOUDFLARE_R2_API is the bucket url : https://<account id>.r2.cloudflarestorage.com/<bucket name>
const bucketUrl = () => new URL(process.env.CLOUDFLARE_R2_API as string);

// the client is created on first use because the env is loaded after the imports run
let client: S3Client | null = null;

export const r2 = () => {
    if (!client) {
        client = new S3Client({
            region: 'auto',
            endpoint: bucketUrl().origin,
            credentials: {
                accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.CLOUDFLARE_R2_ACCESS_SECRET_KEY as string,
            },
        });
    }
    return client;
}

export const r2Bucket = () => bucketUrl().pathname.split('/').filter(Boolean)[0] as string;
