"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import "@madzadev/audio-player/dist/index.css";
import {
  playSong,
  pauseSong,
  stopSong,
  setNextSongs,
} from "../../../utils/redux/features/song/songSlice";
import NextSongsList from "./NextSongsList";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css"; 
const SPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const {
    currentSong,
    isPlaying,
    currentTime: SongTime,
    nextSongs,
  } = useSelector((state: RootState) => state.song);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressX = useMotionValue(0);


  useEffect(() => {
    if (currentSong) {
      if (audioRef.current) {
        const songUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/song/stream/${currentSong.song_url}`;
        audioRef.current.src = songUrl;
        if (isPlaying) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [currentSong, isPlaying]);


  const handleNextSong = () => {
    if (nextSongs.length > 0 && currentSong) {
      const currentIndex = nextSongs.findIndex(
        (song) => song._id === currentSong._id
      );
      if (currentIndex !== -1 && currentIndex < nextSongs.length - 1) {
        const nextSong = nextSongs[currentIndex + 1];
        dispatch(playSong({ song: nextSong, currentTime: 0 }));
        //dispatch(setNextSongs(nextSongs.slice(currentIndex + 1)));
      } else {
        dispatch(stopSong());
      }
    } else {
      dispatch(stopSong());
    }
  };
  const handlePreviousSong = () => {
    if (nextSongs.length > 0 && currentSong) {
      const currentIndex = nextSongs.findIndex(
        (song) => song._id === currentSong._id
      );
      if (currentIndex >= 0) {
        const previousSong = nextSongs[currentIndex - 1];
        dispatch(playSong({ song: previousSong, currentTime: 0 }));
        //dispatch(setNextSongs(nextSongs.slice(0, currentIndex)));
      }
    } else {
      dispatch(stopSong());
    }
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
      className="fixed opacity-75 bottom-0 left-0 w-full bg-stone-900 shadow-lg custom-player-footer h-200"
      initial="hidden"
      animate="visible"
      variants={footerVariants}
    >
      <div className="h-auto max-h-56 overflow-y-scroll">
        <NextSongsList
          nextSongs={nextSongs}
          currentSong={currentSong ? currentSong : null}
        />
      </div>
      <AudioPlayer
        autoPlay
        loop
        showSkipControls={true}
        layout={"stacked-reverse"}
        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/song/stream/${currentSong.song_url}`}
        onPlay={(e) => console.log("onPlay")}
        onClickNext={(e) => handleNextSong()}
        onClickPrevious={(e) => handlePreviousSong()}
      />
    </motion.footer>
  );
};

export default SPlayer;
