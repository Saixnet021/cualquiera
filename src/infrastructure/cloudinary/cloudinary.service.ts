/**
 * Cloudinary Service — Infrastructure Layer (Server-Side Only)
 * 
 * NUNCA importes este módulo desde el cliente.
 * Úsalo solo en API Routes o Server Actions.
 */
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: object[];
  maxSizeBytes?: number;
}

const DEFAULT_OPTIONS: UploadOptions = {
  folder: 'pinguis/products',
  transformation: [
    { width: 800, height: 800, crop: 'fill', quality: 'auto:good' },
    { format: 'webp' },
  ],
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
};

export async function uploadImage(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: opts.folder,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        transformation: opts.transformation,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed: no result'));

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Genera una URL de imagen con transformaciones on-the-fly.
 * Útil para responsive images sin re-upload.
 */
export function getOptimizedUrl(
  publicId: string,
  width: number,
  height?: number
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
    secure: true,
  });
}
