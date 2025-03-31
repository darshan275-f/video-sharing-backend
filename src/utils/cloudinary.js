import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
});

const fileUpload = async (filePath) => {
    try {
        if (!filePath) return null;

        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
        });

        console.log("File uploaded successfully!!", uploadResult.url);

        // Check if the file exists before deleting
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return uploadResult;
    } catch (error) {
        console.error("Upload failed:", error);
        
        // Check if the file exists before deleting
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return null;
    }
};

export { fileUpload };
