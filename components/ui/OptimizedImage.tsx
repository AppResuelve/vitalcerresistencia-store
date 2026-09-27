// components/ui/OptimizedImage.tsx
"use client";
import Image, { ImageProps } from "next/image";
import { getImageLoader } from "@/utils/imageOptimization";

type OptimizedImageProps = Omit<ImageProps, "loader" | "src"> & {
  src?: string | null;
  isLocal?: boolean;
};

export function OptimizedImage({
  src,
  alt,
  isLocal = false,
  ...props
}: OptimizedImageProps) {
  if (!src) return null;
  return (
    <Image loader={getImageLoader(isLocal)} src={src} alt={alt} {...props} />
  );
}
