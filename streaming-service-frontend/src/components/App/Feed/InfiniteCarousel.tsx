"use client";
import React, { useRef, useEffect } from "react";
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
  const halfContentWidth = useRef(0);

  useEffect(() => {
    // Calculate the width of half the items when the component is first rendered
    if (containerRef.current) {
      const contentWidth = containerRef.current.scrollWidth / 2;
      halfContentWidth.current = contentWidth;
    }
  }, [items]);

  useAnimationFrame(() => {
    if (!containerRef.current) return;

    if (direction === "left") {
      x.current -= speed;
      if (x.current <= -halfContentWidth.current) {
        x.current = 0;
      }
    } else {
      x.current += speed;
      if (x.current >= 0) {
        x.current = -halfContentWidth.current;
      }
    }

    containerRef.current.style.transform = `translateX(${x.current}px)`;
  });

  return (
    <motion.div
      className="flex gap-14 py-9 no-scrollbar"
      ref={containerRef}
      style={{ willChange: "transform" }}
    >
      {[...items, ...items]}
    </motion.div>
  );
};

export default InfiniteCarousel;
