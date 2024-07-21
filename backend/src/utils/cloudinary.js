const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    let response;
    try {
        if (!localFilePath) {
            return null;
        }

        response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("File uploaded successfully", response.secure_url);
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        response = null; // Ensure response is null if an error occurs
    } finally {
        // Always clean up the temporary file
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("Temporary file deleted");
        }
    }
    return response;
};

exports.uploadOnCloudinary = uploadOnCloudinary;
