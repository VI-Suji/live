import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { sanityClient } from '../../../sanity/config';
import fs from 'fs';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export const config = {
    api: {
        bodyParser: false,
    },
};

const ALLOWED_EMAIL = 'gramikaweb@gmail.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user?.email !== ALLOWED_EMAIL) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = new IncomingForm({
        maxFileSize: 50 * 1024 * 1024, // 50MB Limit for large mobile photos
        keepExtensions: true,
    });

    try {
        const { files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        // Handle both array and single file cases (formidable v3)
        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileStream = fs.createReadStream(uploadedFile.filepath);
        const type = req.query.type === 'file' ? 'file' : 'image';

        const asset = await sanityClient.assets.upload(type, fileStream, {
            filename: uploadedFile.originalFilename || 'upload',
        });

        return res.status(200).json(asset);
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Upload failed' });
    }
}
