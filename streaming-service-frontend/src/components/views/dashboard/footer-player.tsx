"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { playSong, pauseSong, stopSong } from "../../../utils/redux/features/song/songSlice";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import Heart from "../../Svg/Heart";
import Shuffle from "../../Svg/Shuffle";
import Previous from "../../Svg/Previous";
import Play from "../../Svg/Play";
import Pause from "../../Svg/Pause";
import Next from "../../Svg/Next";
import Repeat from "../../Svg/Repeat";
import { getImageUrl } from "@/utils/tools/images";

const SPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, currentTime: SongTime } = useSelector((state: RootState) => state.song);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressX = useMotionValue(0);
  const progressWidth = useTransform(progressX, (value) => `${value}%`);

  useEffect(() => {
    if (currentSong) {
      setCurrentTime(SongTime);
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
        audioRef.current?.pause();

      } else {
        dispatch(playSong({song: currentSong, currentTime: audioRef.current?.currentTime || 0}));
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      progressX.set(progress);
    }
  };

  const handleProgressDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const progressBarWidth = progressBarRef.current?.offsetWidth || 0;
    const dragPosition = info.point.x - progressBarRef.current!.getBoundingClientRect().left;
    const progress = (dragPosition / progressBarWidth) * 100;
    progressX.set(progress);
    if (audioRef.current) {
      audioRef.current.currentTime = (progress / 100) * audioRef.current.duration;
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
          src={currentSong.album.cover_image_url ? getImageUrl(currentSong.album.cover_image_url) : "/img/music_note.jpeg"}
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
          <div ref={progressBarRef} className="overflow-hidden relative flex-1 mx-2 rounded">
            <div className="border-b-2 border-gray-400 rounded"></div>
            <motion.div
              className="absolute inset-x-0 top-0 border-b-2 rounded transform cursor-pointer"
              style={{ width: progressWidth, borderColor: "#C6AC8E" }}
              drag="x"
              dragConstraints={progressBarRef}
              dragElastic={0}
              onDragStart={(event, info) => event.stopPropagation()}
              onDrag={handleProgressDrag}
              onDragEnd={(event, info) => setCurrentTime((info.point.x / progressBarRef.current!.offsetWidth) * currentSong.duration)}
            ></motion.div>
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