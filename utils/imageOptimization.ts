// utils/imageOptimization.ts

// Cloudinary: arma la URL transformada (resize + formato + calidad automáticos).
// Queda privada del módulo — nadie de afuera necesita saber que es Cloudinary.
function buildCloudinaryUrl(
  url: string,
  width: number,
  quality: number | string = "auto",
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${width},f_auto,q_${quality}/`);
}

// Para usos fuera de next/image (ej. og:image, CSS background-image)
export function optimizeImageUrl(url: string, width = 600): string {
  return buildCloudinaryUrl(url, width);
}

// Loader interno para next/image cuando la imagen es remota (hoy: Cloudinary)
function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return buildCloudinaryUrl(src, width, quality);
}

// Único punto de decisión: qué loader usar según el origen de la imagen.
// isLocal=true  -> undefined, next/image usa su propio optimizador (archivos de /public)
// isLocal=false -> cloudinaryLoader, el CDN externo hace el resize/compresión
export function getImageLoader(isLocal: boolean) {
  return isLocal ? undefined : cloudinaryLoader;
}
