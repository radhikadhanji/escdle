import { useState } from "react";

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function Modal({ isVisible, onClose }: ModalProps) {
  const [view, setView] = useState<"general" | "updates">("general");

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="w-[600px] outline-2 outline-offset-2 outline-solid bg-black p-4 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="text-white font-bold text-xl mb-2" onClick={onClose}>
          X
        </button>

        <div className="space-y-4 text-white">
          {view == "general" && (
            <>
              <p className="font-bold text-xl text-center">How to Play</p>

              <p>
                Your goal is to guess the title of the Eurovision song within 5
                guesses. Each time you guess incorrectly, more of the song will
                be revealed. Click on the icon at the top right to check your
                statistics. Inspired by Heardle.
              </p>

              <p className="font-bold">
                Titles are not case sensitive unless made up of multiple words,
                e.g. Cha Cha Cha and cha cha cha are both valid guesses, but Cha
                cha Cha is not. Do not include accents in your guesses, e.g.
                guess Roa instead of Róa. Support for accented guesses will be
                added in a later update.
              </p>

              <p>
                More songs will be added regularly; check the update logs to see
                when the song list is updated.
              </p>

              <button
                className="font-bold underline"
                onClick={() => setView("updates")}
              >
                v1.1 - view update logs here
              </button>
            </>
          )}

          {view == "updates" && (
            <>
              <p className="font-bold text-xl text-center">Update Logs</p>
              <p>
                v1.1: Added endless mode: you can now practise forever. Added
                statistics for daily guesses (endless mode does not affect
                statistics). Fixed minor bugs with UI, allowing too many
                incorrect guesses, and added a pause icon. Moved song hosting to
                Soundcloud to scale future song additions easier. Unfortunately,
                using the Soundcloud API has led to the bug where songs only
                properly play after 2-3 clicks, which I am working to fix. 17
                new songs were added.
              </p>
              <p>
                v1: Released with 16 songs. The making of this game will be
                documented on my blog soon.
              </p>

              <button
                className="font-bold underline"
                onClick={() => setView("general")}
              >
                ← Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
