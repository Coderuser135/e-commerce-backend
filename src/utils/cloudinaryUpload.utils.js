import cloudinary from "../configs/cloudinary.config.js";

export const uploadToCloudinary = (buffer, folderName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folderName
            },
            (error, result) => {
                if(error){
                    reject(error)
                } else{
                    resolve(result)
                }
            }
        )
        stream.end(buffer)
    })
}