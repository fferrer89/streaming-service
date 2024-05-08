// src/components/App/SkeletonLoader.tsx
import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div
      className="w-24 h-24 bg-gray-300 animate-pulse rounded-lg border border-gray-200"
      style={{ minWidth: "150px", minHeight: "150px"}}
    />
  );
};

export default SkeletonLoader;
