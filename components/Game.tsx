"use client";

import { useEffect, useState } from "react";
import MusicPlayer from "@/components/MusicPlayer";
import { songs } from "@/data/songs";

export default function Game() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [song, setSong] = useState<(typeof songs)[number] | null>(null);
  const [input, setInput] = useState("");
  const [playedToday, setPlayedToday] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [finalGuesses, setFinalGuesses] = useState<number | null>(null);
  const inputDisabled = revealed || correct || playedToday;
  const START = new Date("2026-01-01");

  useEffect(() => {
    const today = new Date().toDateString();
    const lastPlay = localStorage.getItem("lastPlayDate");
    const savedResult = localStorage.getItem("currentResult");

    setSong(getDailySong());

    if (lastPlay === today && savedResult) {
      setPlayedToday(true);

      const result = JSON.parse(savedResult);
      setFinalGuesses(result.guesses);
      if (result.correct) {
        setCorrect(true);
      } else {
        setRevealed(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!playedToday) return;
    setTimeLeft(calculateTime());
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [playedToday]);

  if (!song) return null;

  function addIncorrectGuess(input: string) {
    const newGuess = document.createElement("div");
    newGuess.innerHTML = `❌ ${input}`;
    newGuess.classList.add("mt-2", "text-red-600");
    document.getElementById("container")?.appendChild(newGuess);
  }

  function addCorrectGuess(input: string) {
    const newGuess = document.createElement("div");
    newGuess.innerHTML = `✅ ${input}`;
    newGuess.classList.add("mt-2", "text-green-600");
    document.getElementById("container")?.appendChild(newGuess);
  }

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

  return (
    <div className="w-full max-w-md p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">escdle</h1>

      <div className="mb-6">
        <MusicPlayer guessCount={guesses.length} song={song} />
      </div>

      <div id="container"></div>
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
            addCorrectGuess(input);
            setCorrect(true);
            saveResult(true, nextGuesses.length);
            updateLastGame();
          } else if (guesses.length + 1 >= 5) {
            addIncorrectGuess(input);
            saveResult(false, nextGuesses.length);
            updateLastGame();
            setRevealed(true);
          } else {
            addIncorrectGuess(input);
          }
        }}
      >
        submit
      </button>

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

      {playedToday && (
        <p className="text-white-600 mt-2"> Next game in {timeLeft}</p>
      )}
    </div>
  );
}
