// ArtistProfileImage.tsx
import Image from "next/image";
import React from "react";

interface ArtistProfileImageProps {
  image_url: string | null;
  size: number;
}

const ArtistProfileImage: React.FC<ArtistProfileImageProps> = ({
  image_url,
  size,
}) => {
  const imageUrl = image_url
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${image_url}`
    : "/img/ellipse.png";
  return (
    <Image
      src={imageUrl}
      width={size}
      height={size}
      alt="Profile Image"
      className="rounded-full"
    />
  );
};

export default ArtistProfileImage;
