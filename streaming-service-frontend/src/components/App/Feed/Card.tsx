"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface CardProps {
  image: string;
  songId: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ image, songId, rounded = "lg", onClick }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  return (
    <motion.img
      key={songId}
      src={image}
      alt="Album"
      height={200}
      width={200}
      className={`h-32 w-32 object-cover border-2 ${roundedClasses[rounded]} cursor-pointer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ filter: "brightness(1)" }}
      animate={{
        filter: isHovered ? "brightness(0.5)" : "brightness(1)",
        transition: { duration: 0.3 },
      }}
    />
  );
};

export default Card;