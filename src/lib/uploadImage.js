// Uploads an image straight from the browser to Cloudinary's free tier using
// an "unsigned" upload preset — no server, no secret key needed client-side,
// and no Firebase Blaze billing plan required.
//
// One-time setup (free, no credit card):
//   1. Create a free account at https://cloudinary.com
//   2. Dashboard → copy your "Cloud name"
//   3. Settings → Upload → Upload presets → Add upload preset
//      → Signing Mode: "Unsigned" → Save → copy the preset name
//   4. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET
//      in your .env (local) and in Vercel's Environment Variables.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImageToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Cloudinary upload failed');
  }

  const data = await res.json();
  return data.secure_url;
}
