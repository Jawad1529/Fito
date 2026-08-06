import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

// Local disk storage for now. When we move to Cloudinary, swap `storage` for
// multer.memoryStorage() and pipe req.file.buffer to the uploader — see the
// commented block at the bottom of this file.
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        // Never trust the client filename on disk — keep only the extension
        // and generate the rest, so traversal/overwrite isn't possible.
        const ext = path.extname(file.originalname).toLowerCase();
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${ext}`);
    },
});

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
        cb(new Error('Only JPEG, PNG, WebP, GIF and AVIF images are allowed'));
        return;
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 6 },
});

// Blogs take a single cover image; products take a gallery.
export const uploadSingleImage = upload.single('image');
export const uploadProductImages = upload.array('images', 6);

// Maps a stored file to the public URL express.static serves it from.
export const toImageUrl = (file) => (file ? `/uploads/${file.filename}` : undefined);

/* ---------------------------------------------------------------------------
 * Cloudinary version (enable later, replaces the disk storage above)
 * ---------------------------------------------------------------------------
 * import { v2 as cloudinary } from 'cloudinary';
 * import { CloudinaryStorage } from 'multer-storage-cloudinary';
 *
 * cloudinary.config({
 *     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 *     api_key: process.env.CLOUDINARY_API_KEY,
 *     api_secret: process.env.CLOUDINARY_API_SECRET,
 * });
 *
 * const storage = new CloudinaryStorage({
 *     cloudinary,
 *     params: { folder: 'fito', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
 * });
 *
 * // With CloudinaryStorage, multer puts the hosted URL on file.path, so:
 * export const toImageUrl = (file) => file?.path;
 * ------------------------------------------------------------------------- */
