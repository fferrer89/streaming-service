import React from "react";
import Link from "next/link";
import Image from "next/image";
const ArtistProfileImage: React.FC<{ image_url: any }> = ({
  image_url,
  size,
}) => {
  const iurl = image_url
    ? `${process.env.NEXT_PUBLIC_BACKEND_EXPRESS_URL}/file/download/${image_url}`
    : "/img/ellipse.png";
  return <img src={iurl} width={size} height={size} alt="Profile image" />;
};

export default ArtistProfileImage;
