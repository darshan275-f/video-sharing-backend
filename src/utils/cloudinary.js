import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
});

let fileUpload=async function(localStorage){
    try {
        if(!localStorage) return null;
        const uploadResult = await cloudinary.uploader
        .upload(
          localStorage, {
                resource_type:'auto',
            }
        )
        console.log("File uploded successfully!! ",uploadResult.url);
        fs.unlinkSync(localStorage);
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localStorage);
        return null;
    }
}

export {fileUpload};