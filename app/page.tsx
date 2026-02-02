"use client";

import Game from "@/components/Game";
import Modal from "@/components/Modal";
import { useState } from "react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <button
        className="fixed top-10 left-10 p-4"
        onClick={() => setShowModal(true)}
      >
        <img src="info.png"></img>
      </button>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)} />
      <Game />
    </main>
  );
}
