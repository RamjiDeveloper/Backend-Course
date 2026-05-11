import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const initCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};
console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY:", process.env.CLOUDINARY_API_KEY);

const uploadOnCloudinary = async (localFilePath) => {
  try {
    initCloudinary(); // 🔥 important fix

    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Cloudinary ERROR:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
