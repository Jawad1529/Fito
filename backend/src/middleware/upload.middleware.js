import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'fito',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'pdf'],
        // 'auto' so medical-report PDFs upload as a raw resource instead of
        // being rejected as an invalid image.
        resource_type: 'auto',
    },
});

const ALLOWED_MIME = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'application/pdf',
];

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
        cb(new Error('Only JPEG, PNG, WebP, GIF, AVIF images or PDF files are allowed'));
        return;
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 12 },
});

// Blogs take a single cover image; products take a gallery.
export const uploadSingleImage = upload.single('image');
export const uploadProductImages = upload.array('images', 6);
// Consultation submissions carry three independent upload fields.
export const uploadConsultationFiles = upload.fields([
    { name: 'bodyPhotos', maxCount: 6 },
    { name: 'reports', maxCount: 4 },
    { name: 'paymentScreenshot', maxCount: 1 },
]);

// With CloudinaryStorage, multer puts the hosted URL on file.path.
export const toImageUrl = (file) => file?.path;
