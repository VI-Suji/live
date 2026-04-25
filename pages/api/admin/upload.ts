import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { adminSanityClient } from '../../../sanity/config';
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
        maxFileSize: 500 * 1024 * 1024, // Increase to 500MB just in case
        keepExtensions: true,
    });

    try {
        console.log('Starting file upload parse...');
        
        const { fields, files } = await new Promise<{ fields: any, files: any }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('Formidable parse error:', err);
                    reject(err);
                    return;
                }
                resolve({ fields, files });
            });
        });
        
        console.log('Files received:', Object.keys(files));

        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!uploadedFile) {
            console.error('No file found in the request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Uploading to Sanity:', {
            filename: uploadedFile.originalFilename,
            size: uploadedFile.size,
            mimetype: uploadedFile.mimetype,
            filepath: uploadedFile.filepath
        });

        const fileStream = fs.createReadStream(uploadedFile.filepath);
        const type = req.query.type === 'file' ? 'file' : 'image';

        const asset = await adminSanityClient.assets.upload(type, fileStream, {
            filename: uploadedFile.originalFilename || 'upload',
            contentType: uploadedFile.mimetype || undefined,
        });

        console.log('Upload successful:', asset._id);
        return res.status(200).json(asset);
    } catch (error: any) {
        console.error('Detailed Upload error:', error);
        // Force JSON response for errors
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ 
            error: 'Upload failed', 
            details: error.message || 'Unknown error during upload',
            code: error.code 
        });
    }
}
