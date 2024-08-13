import { useRef, useEffect, useState } from "react";
import { renderAbc, synth } from "abcjs";
import { PlayIcon, StopIcon } from "@heroicons/react/20/solid";

function ABCNotation({ content }: { content: string }) {
  const abcContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [midiBuffer, setMidiBuffer] = useState<any>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (abcContainerRef.current) {
      const visualObj = renderAbc(abcContainerRef.current, content)[0];

      if (audioContext && midiBuffer) {
        midiBuffer
          .init({
            visualObj: visualObj,
            audioContext: audioContext,
            millisecondsPerMeasure: visualObj.millisecondsPerMeasure(),
            options: {
              onEnded: () => {
                setIsPlaying(false);
              },
            },
          })
          .then(() => {
            return midiBuffer.prime();
          })
          .catch((error: any) => {
            console.warn("synth error", error);
          });
      }
    }
  }, [content, audioContext, midiBuffer]);

  const handlePlay = () => {
    if (!audioContext) {
      const newAudioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      setAudioContext(newAudioContext);
      const newMidiBuffer = new synth.CreateSynth();
      setMidiBuffer(newMidiBuffer);

      if (abcContainerRef.current) {
        const visualObj = renderAbc(abcContainerRef.current, content)[0];

        newMidiBuffer
          .init({
            visualObj: visualObj,
            audioContext: newAudioContext,
            millisecondsPerMeasure: visualObj.millisecondsPerMeasure(),
            options: {
              onEnded: () => {
                setIsPlaying(false);
              },
            },
          })
          .then(() => {
            return newMidiBuffer.prime();
          })
          .then(() => {
            newMidiBuffer.start();
            setIsPlaying(true);
          })
          .catch((error: any) => {
            console.warn("synth error", error);
          });
      }
    } else if (midiBuffer) {
      midiBuffer.start();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (midiBuffer) {
      midiBuffer.stop();
      setIsPlaying(false);
    }
  };

  return (
    <div className="overflow-x-scroll">
      <div ref={abcContainerRef} className="min-w-[800px]" />
      <button
        type="button"
        onClick={isPlaying ? handleStop : handlePlay}
        className="rounded-full bg-black p-2 text-white shadow-sm hover:bg-gray-600 focus-visible:outline mt-3 flex items-center justify-center w-10 h-10"
      >
        {isPlaying ? (
          <StopIcon aria-hidden="true" className="h-5 w-5" />
        ) : (
          <PlayIcon aria-hidden="true" className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

export default ABCNotation;
