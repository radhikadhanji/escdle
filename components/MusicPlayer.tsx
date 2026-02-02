"use client";

import { useRef } from "react";
import { songs } from "@/data/songs";

type MusicPlayerProps = {
  guessCount: number;
  song: {
    id: string;
    title: string;
    artist: string;
    year: number;
    country: string;
    audio: string;
  };
};

export default function MusicPlayer({ guessCount, song }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const durations = [3, 6, 9, 15, 20];

  const playSnippet = () => {
    if (!audioRef.current) return;
    const duration = durations[Math.min(guessCount, durations.length - 1)];
    audioRef.current.currentTime = 0;
    audioRef.current.play();

    setTimeout(() => {
      audioRef.current?.pause();
    }, duration * 1000);
  };
  return (
    <div>
      <audio ref={audioRef} src={song.audio} preload="auto"></audio>
      <button onClick={playSnippet}>
        <img src="play.png" alt="Play" />
      </button>
    </div>
  );
}
