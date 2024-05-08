"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-stone-800">
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-8xl font-bold text-white animate-bounce">404</h1>
        <p className="text-4xl font-medium text-white">Page Not Found</p>
        <a href="/" className="mt-4 text-xl text-blue-600 hover:underline">
          Go back home
        </a>
      </div>
    </div>
  );
}
