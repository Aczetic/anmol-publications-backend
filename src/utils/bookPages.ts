import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2, r2Bucket } from './r2.js';

// book pages are kept in a private r2 bucket as anmol/books/<series>/<book>/page-001.webp ...
// the browser gets presigned links to them , which stop working after PAGE_LINK_EXPIRY_SECONDS
export const PAGE_LINK_EXPIRY_SECONDS = 60 * 60;

// folder is like anmol/books/brainstorm/brainstorm-4 (series/book)
export const pageKey = (folder: string, pageNumber: number) => {
    return `${folder}/page-${String(pageNumber).padStart(3, '0')}.webp`;
}

// links are signed locally , no request is made to r2 here
export const signedPageUrls = (folder: string, pageCount: number) => {
    return Promise.all(Array.from({ length: pageCount }, (_, idx) =>
        getSignedUrl(
            r2(),
            new GetObjectCommand({ Bucket: r2Bucket(), Key: pageKey(folder, idx + 1) }),
            { expiresIn: PAGE_LINK_EXPIRY_SECONDS }
        )
    ));
}
