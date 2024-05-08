"use client";
import React, { useEffect, useState } from "react";
import Player from "@madzadev/audio-player";
import "@madzadev/audio-player/dist/index.css";

const Song: React.FC = () => {
  return (
    <div>
      <Player
        trackList={[
          {
            url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/song/stream/662d3a293686f7f5eaf896d1`,
            title: "Madza - Chords of Life",
            tags: [""],
          },
        ]}
        includeTags={true}
        includeSearch={true}
        showPlaylist={true}
        sortTracks={true}
        autoPlayNextTrack={true}
      />
    </div>
  );
};

export default Song;
