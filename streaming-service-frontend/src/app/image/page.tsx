"use client";
import React, { useEffect, useState } from "react";

const Song: React.FC = () => {
  return (
    <div>
      <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/662d343c3cbe45efb4a1f04a`} />
    </div>
  );
};

export default Song;
