
"use client";
import React, { useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";

interface InfiniteCarouselProps {
  items: React.ReactNode[];
  speed?: number;
  direction?: "left" | "right";
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  items,
  speed = 0.4,
  direction = "left",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useRef(0);

  useAnimationFrame((t) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const contentWidth = containerRef.current.scrollWidth;

    if (direction === "left") {
      x.current -= speed;
      if (x.current <= -contentWidth) {
        x.current = 0;
      }
    } else {
      x.current += speed;
      if (x.current >= 0) {
        x.current = -contentWidth + containerWidth;
      }
    }

    containerRef.current.style.transform = `translateX(${x.current}px)`;
  });

  return (
    <motion.div
      className="flex gap-14 py-9 no-scrollbar"
      ref={containerRef}
    >
      {[...items, ...items]}
    </motion.div>
  );
};

export default InfiniteCarousel;