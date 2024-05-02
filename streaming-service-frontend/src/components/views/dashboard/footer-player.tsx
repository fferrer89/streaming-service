"use client";
import React, { useEffect, useState } from "react";
import Player from "@madzadev/audio-player";
import "@madzadev/audio-player/dist/index.css";

const SPlayer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-stone-900 shadow-lg col-span-6 p-4 grid grid-cols-3 gap-6">
      <div className="flex items-center">
        <img
          className="h-14 w-14 mr-4 flex-shrink-0"
          src="https://picsum.photos/56.webp?random=10"
          alt=""
        />
        <div className="mr-4">
          <div className="text-sm text-white text-line-clamp-1 font-light">
            Song Name
          </div>
          <div className="text-xs text-gray-100 text-line-clamp-1">
            <span>Artist Name</span>
          </div>
        </div>
        <div className="flex items-center">
          <button className="text-green-200 p-2">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z" />
            </svg>
          </button>
          <button className="text-gray-100 p-2">
            {/* <svg
              className="w-4 h-4"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="currentColor" fill-rule="evenodd">
                <path
                  d="M1 3v9h14V3H1zm0-1h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
                  fill-rule="nonzero"
                ></path>
                <path d="M10 8h4v3h-4z"></path>
              </g>
            </svg> */}
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center mb-3">
          <button className="w-5 h-5 text-gray-100 mr-6">
            <svg
              className="fill-current w-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M6.59 12.83L4.4 15c-.58.58-1.59 1-2.4 1H0v-2h2c.29 0 .8-.2 1-.41l2.17-2.18 1.42 1.42zM16 4V1l4 4-4 4V6h-2c-.29 0-.8.2-1 .41l-2.17 2.18L9.4 7.17 11.6 5c.58-.58 1.59-1 2.41-1h2zm0 10v-3l4 4-4 4v-3h-2c-.82 0-1.83-.42-2.41-1l-8.6-8.59C2.8 6.21 2.3 6 2 6H0V4h2c.82 0 1.83.42 2.41 1l8.6 8.59c.2.2.7.41.99.41h2z" />
            </svg>
          </button>
          <button className="w-5 h-5 text-gray-100 mr-6">
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M4 5h3v10H4V5zm12 0v10l-9-5 9-5z" />
            </svg>
          </button>
          <button className="w-8 h-8 border border-gray-300 rounded-full flex text-gray-100 mr-6">
            <svg
              className="fill-current h-5 w-5 m-auto"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
            </svg>
          </button>
          <button className="w-5 h-5 text-gray-100 mr-6">
            <svg
              className="fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 5h3v10h-3V5zM4 5l9 5-9 5V5z" />
            </svg>
          </button>
          <button className="w-5 h-5 text-gray-100">
            <svg
              className="fill-current w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-100 font-light">4:18</span>
          <div className="overflow-hidden relative flex-1 mx-2 rounded">
            <div className="border-b-4 border-gray-400 rounded"></div>
            <div className="absolute inset-x-0 top-0 -translate-x-48 border-b-4 border-gray-100 rounded transform hover:border-green-200"></div>
          </div>
          <span className="text-xs text-gray-100 font-light">5:13</span>
        </div>
      </div>
    </footer>
  );
};

export default SPlayer;
