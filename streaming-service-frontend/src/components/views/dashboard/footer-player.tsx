"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { playSong, pauseSong, stopSong } from "../../../utils/redux/features/song/songSlice";
import { motion } from "framer-motion";
import Heart from "../../Svg/Heart";
import Shuffle from "../../Svg/Shuffle";
import Previous from "../../Svg/Previous";
import Play from "../../Svg/Play";
import Pause from "../../Svg/Pause";
import Next from "../../Svg/Next";
import Repeat from "../../Svg/Repeat";

const SPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying } = useSelector((state: RootState) => state.song);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentSong) {
      setCurrentTime(currentSong.currentTime);
      if (audioRef.current) {
        const songUrl = `http://localhost:4000/file/song/stream/${currentSong.song_url}`;
        audioRef.current.src = songUrl;
        if (isPlaying) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [currentSong, isPlaying]);

  const togglePlayPause = () => {
    if (currentSong) {
      if (isPlaying) {
        dispatch(pauseSong());
      } else {
        dispatch(playSong(currentSong));
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentSong) {
    return null;
  }

  const footerVariants = {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.footer
      className="fixed opacity-75 bottom-0 left-0 w-full bg-stone-900 shadow-lg col-span-6 p-3 grid grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={footerVariants}
    >
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />
      <div className="flex items-center">
        <img
          className="h-10 w-10 mr-4 flex-shrink-0"
          src={currentSong.artists[0].profile_image_url || "https://picsum.photos/56.webp?random=10"}
          alt={currentSong.title}
        />
        <div className="mr-4">
          <div className="text-sm text-white text-line-clamp-1 font-light">
            {currentSong.title}
          </div>
          <div className="text-xs text-gray-100 text-line-clamp-1">
            <span>{currentSong.artists[0].display_name}</span>
          </div>
        </div>
        <div className="flex items-center">
          <button className="text-green-200 p-1">
            <Heart />
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center mb-2">
          <button className="w-4 h-4 text-gray-100 mr-4">
            <Shuffle />
          </button>
          <button className="w-4 h-4 text-gray-100 mr-4">
            <Previous />
          </button>
          <button
            className="w-6 h-6 border border-gray-300 rounded-full flex text-gray-100 mr-4"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button className="w-4 h-4 text-gray-100 mr-4">
            <Next />
          </button>
          <button className="w-4 h-4 text-gray-100">
            <Repeat />
          </button>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-100 font-light">
            {formatTime(currentTime)}
          </span>
          <div className="overflow-hidden relative flex-1 mx-2 rounded">
            <div className="border-b-2 border-gray-400 rounded"></div>
            <div
              className="absolute inset-x-0 top-0 border-b-2 border-gray-100 rounded transform hover:border-green-200"
              style={{
                width: `${(currentTime / currentSong.duration) * 100}%`,
              }}
            ></div>
          </div>
          <span className="text-xs text-gray-100 font-light">
            {formatTime(currentSong.duration)}
          </span>
        </div>
      </div>
    </motion.footer>
  );
};

export default SPlayer;