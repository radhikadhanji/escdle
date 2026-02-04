"use client";
import { useEffect, useRef, useState } from "react";
declare global {
  interface Window {
    SC: any;
  }
}
type MusicPlayerProps = { guessCount: number; song: { audio: string } };

export default function MusicPlayer({ guessCount, song }: MusicPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);

  const durations = [2, 4, 8, 10, 20];

  useEffect(() => {
    if (!iframeRef.current || !window.SC) return;

    setWidgetReady(false);
    setIsPlaying(false);

    const widget = window.SC.Widget(iframeRef.current);
    widgetRef.current = widget;

    widget.load(song.audio, {
      auto_play: false,
    });

    widget.bind(window.SC.Widget.Events.READY, () => {
      setWidgetReady(true);
    });

    widget.bind(window.SC.Widget.Events.PLAY, () => {
      setIsPlaying(true);
    });

    widget.bind(window.SC.Widget.Events.PAUSE, () => {
      setIsPlaying(false);
    });

    return () => {
      widget.unbind(window.SC.Widget.Events.READY);
      widget.unbind(window.SC.Widget.Events.PLAY);
      widget.unbind(window.SC.Widget.Events.PAUSE);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [song.audio]);

  const togglePlay = () => {
    if (!widgetReady || !widgetRef.current) return;

    if (isPlaying) {
      widgetRef.current.pause();
      setIsPlaying(false);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      const duration = durations[Math.min(guessCount, durations.length - 1)];

      widgetRef.current.seekTo(0);
      widgetRef.current.play();
      setIsPlaying(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        widgetRef.current.pause();
        setIsPlaying(false);
        timeoutRef.current = null;
      }, duration * 1000);
    }
  };

  return (
    <div>
      <iframe
        ref={iframeRef}
        style={{ display: "none" }}
        allow="autoplay"
        src="https://w.soundcloud.com/player/?auto_play=false"
      />

      <button onClick={togglePlay} disabled={!widgetReady}>
        <img src={isPlaying ? "/pause.png" : "/play.png"} alt="Play/Pause" />
      </button>
    </div>
  );
}
