"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/data/stats";

type StatisticsProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function Statistics({ isVisible, onClose }: StatisticsProps) {
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    setStats(getStats());
  }, [isVisible]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-25 backdrop-blur flex justify-center items-center z-50 ${
        isVisible
          ? "visible opacity-100"
          : "invisible opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className="w-[600px] outline-2 outline-offset-2 outline-solid bg-black p-4 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4 text-white">
          <p className="font-bold text-xl text-center">Daily Mode Statistics</p>
          <p>Games Played: {stats.gamesPlayed} </p>
          <p>Games Won: {stats.gamesWon}</p>
          <p>Games Lost: {stats.gamesLost}</p>
          <p>Win Rate: {stats.winRate}%</p>
          <p>Current Streak: {stats.currentStreak}</p>
          <p>Max Streak: {stats.maxStreak}</p>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="font-bold underline"
            onClick={() => {
              localStorage.removeItem("escdleStats");
              setStats(getStats());
            }}
          >
            Reset Stats
          </button>
          <button className="font-bold underline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
