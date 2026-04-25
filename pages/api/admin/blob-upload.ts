import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const ALLOWED_EMAIL = 'gramikaweb@gmail.com';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const session = await getServerSession(request, response, authOptions);

    if (!session || session.user?.email !== ALLOWED_EMAIL) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    const body = request.body as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                // Optional: add your logic here to authorize the upload
                return {
                    allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
                    tokenPayload: JSON.stringify({
                        userId: session.user?.email,
                    }),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // Optional: add your logic here to handle the upload completion
                console.log('Blob upload completed', blob, tokenPayload);
            },
        });

        return response.status(200).json(jsonResponse);
    } catch (error) {
        return response.status(400).json({
            error: (error as Error).message,
        });
    }
}
