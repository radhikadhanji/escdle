"use client";

import { useEffect, useState } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import Statistics from "@/components/Statistics";
import { songs } from "@/data/songs";
import { recordGame } from "@/data/stats";

export default function Game() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [song, setSong] = useState<(typeof songs)[number] | null>(null);
  const [input, setInput] = useState("");
  const [playedToday, setPlayedToday] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [finalGuesses, setFinalGuesses] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);
  const inputDisabled = revealed || correct || playedToday;
  const START = new Date("2026-01-01");
  type GameMode = "daily" | "endless";
  const [mode, setMode] = useState<GameMode>("daily");

  useEffect(() => {
    if (mode !== "daily") return;

    const today = new Date().toDateString();
    const lastPlay = localStorage.getItem("lastPlayDate");
    const savedResult = localStorage.getItem("currentResult");

    setSong(getDailySong());

    if (lastPlay === today && savedResult) {
      setPlayedToday(true);
      const result = JSON.parse(savedResult);
      setFinalGuesses(result.guesses);
      result.correct ? setCorrect(true) : setRevealed(true);
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "daily" || !playedToday) return;
    setTimeLeft(calculateTime());
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, playedToday]);

  if (!song) return null;

  function updateLastGame() {
    const now = new Date().toDateString();
    localStorage.setItem("lastPlayDate", now);
    setPlayedToday(true);
  }

  function saveResult(isCorrect: boolean, guessCount: number) {
    localStorage.setItem(
      "currentResult",
      JSON.stringify({
        songId: song?.id,
        correct: isCorrect,
        guesses: guessCount,
      }),
    );
  }

  function calculateTime() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function getDayIndex() {
    const now = new Date();
    const diffTime = now.getTime() - START.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function getDailySong() {
    const dayIndex = getDayIndex();
    return songs[dayIndex % songs.length];
  }

  function getEndlessSong(excludeId?: string) {
    let next;
    do {
      next = songs[Math.floor(Math.random() * songs.length)];
    } while (next.id === excludeId);
    return next;
  }

  function pickSong(prevId?: string) {
    return mode === "daily" ? getDailySong() : getEndlessSong(prevId);
  }

  function resetGame(nextSong?: (typeof songs)[number]) {
    setGuesses([]);
    setRevealed(false);
    setCorrect(false);
    setFinalGuesses(null);
    setInput("");
    setSong(nextSong ?? pickSong(song?.id));
  }

  return (
    <div className="w-full max-w-md p-6 text-center">
      <button
        className="fixed top-8 right-10 p-4"
        onClick={() => setShowStats(true)}
      >
        <img src="stats.png"></img>
      </button>
      <Statistics isVisible={showStats} onClose={() => setShowStats(false)} />
      <div className="p4 mb-10">
        Disclaimer: There is an issue currently where it takes 2-3 clicks of the
        play button to actually play the song instead of just one. I am in the
        process of fixing this.
      </div>
      <div id="title">
        <h1 className="text-3xl font-bold mb-4">
          escdle {mode === "endless" && "(endless mode)"}
        </h1>
      </div>

      <div className="mb-6">
        <MusicPlayer guessCount={guesses.length} song={song} />
      </div>

      <div id="container">
        {guesses.map((guess, index) => {
          const isCorrect = guess === song.title || guess === song.id;

          return (
            <div
              key={index}
              className={`mt-2 ${
                isCorrect ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCorrect ? "✅" : "❌"} {guess}
            </div>
          );
        })}
      </div>

      <input
        type="text"
        placeholder="Enter your guess here"
        className="w-full mb-4 rounded border px-3 py-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={inputDisabled}
      />

      <button
        className="w-full rounded bg-black text-white py-2 disabled:opacity-50"
        disabled={revealed || input.trim() === ""}
        onClick={() => {
          const nextGuesses = [...guesses, input.trim()];
          setGuesses(nextGuesses);
          setInput("");
          if (input == song.title || input == song.id) {
            setFinalGuesses(nextGuesses.length);
            setCorrect(true);
            if (mode === "daily") {
              saveResult(true, nextGuesses.length);
              recordGame(true, nextGuesses.length);
              updateLastGame();
            }
          } else if (guesses.length + 1 >= 5) {
            if (mode === "daily") {
              saveResult(false, nextGuesses.length);
              recordGame(false, nextGuesses.length);
              updateLastGame();
            }
            setRevealed(true);
          }
        }}
      >
        submit
        <br />
      </button>

      {mode === "daily" && (
        <a
          className="mt-4 font-bold p-2 outline"
          onClick={() => {
            setMode("endless");
            setPlayedToday(false);
            resetGame(getEndlessSong());
          }}
        >
          switch to endless mode
        </a>
      )}

      {mode === "endless" && (
        <a
          className="mt-4 font-bold p-2 outline"
          onClick={() => {
            setMode("daily");
            resetGame(getDailySong());
          }}
        >
          switch to daily mode
        </a>
      )}

      {revealed && (
        <p className="mt-4 text-red-600">
          Incorrect. Correct answer: {song.title} by {song.artist}
          {" - "}
          {song.country} {song.year}{" "}
        </p>
      )}

      {correct && (
        <p className="mt-4 text-green-600">
          You got it in {finalGuesses} tries! It was: {song.title} by{" "}
          {song.artist}
          {" - "}
          {song.country} {song.year}{" "}
        </p>
      )}

      {mode === "endless" && (correct || revealed) && (
        <a
          className="text-white-600 font-bold underline"
          onClick={() => resetGame()}
        >
          Another song?
        </a>
      )}

      {playedToday && (
        <p className="text-white-600 mt-2"> Next game in {timeLeft}</p>
      )}
    </div>
  );
}
