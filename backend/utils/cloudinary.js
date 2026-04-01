// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// export const uploadToCloudinary = async (file, folder = 'resumes') => {
//   try {
//     const result = await cloudinary.uploader.upload(file.tempFilePath, {
//       folder: folder,
//       resource_type: 'image',
//       format: 'pdf'
//     });

//     return {
//       url: result.secure_url,
//       publicId: result.public_id
//     };
//   // } catch (error) {
//   //   throw new Error('Failed to upload file to Cloudinary');
//   // }
//   }
//    catch (error) {
//   console.error("Cloudinary Error:", error);
//   throw error;
// }
// };

// export const deleteFromCloudinary = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//   } catch (error) {
//     console.error('Error deleting from Cloudinary:', error);
//   }
// };

// export default cloudinary;
// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';

// dotenv.config(); // 🔥 THIS WAS MISSING

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const uploadToCloudinary = async (file, folder = 'resumes') => {
//   try {
//     const result = await cloudinary.uploader.upload(file.tempFilePath, {
//       folder: folder,
//       resource_type: 'auto',
//       // format: 'pdf', // ✅ for PDFs
//     });

//     return {
//       url: result.secure_url,
//       publicId: result.public_id,
//     };
//   } catch (error) {
//     console.error("Cloudinary Error:", error);
//     throw error;
//   }
// };

// export const deleteFromCloudinary = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
//   } catch (error) {
//     console.error('Error deleting from Cloudinary:', error);
//   }
// };

// export default cloudinary;

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file, folder = 'resumes') => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: folder,
      resource_type: 'auto',   // automatically detect file type
      format: 'pdf',           // ensure file stays PDF
      access_mode: 'public',   // make file publicly accessible
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };

  } catch (error) {
    console.error("Cloudinary Error:", error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

export default cloudinary;