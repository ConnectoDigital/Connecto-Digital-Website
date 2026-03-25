"use client";

import { useState, useRef, useEffect } from "react";

const YOUTUBE_VIDEO_ID = "NrJbFA4KsaA";

export default function BackgroundMusic() {
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setLoaded(true);

    const timer = setTimeout(() => {
      const iframe = iframeRef.current;
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo" }),
          "*"
        );
        setPlaying(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggle = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    if (playing) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo" }),
        "*"
      );
    } else {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "playVideo" }),
        "*"
      );
    }
    setPlaying(!playing);
  };

  return (
    <>
      {loaded && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`}
          className="hidden"
          allow="autoplay"
          title="Background music"
        />
      )}

      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 border border-white/10 bg-black/80 backdrop-blur-md text-white flex items-center justify-center hover:border-primary/50 hover:scale-105 transition-all"
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? (
          <div className="flex items-end gap-[3px] h-4">
            {[0, 0.2, 0.1].map((d, i) => (
              <div
                key={i}
                className="w-[3px] bg-primary rounded-full"
                style={{
                  animation: "equalizer 0.8s ease-in-out infinite alternate",
                  animationDelay: `${d}s`,
                  height: "60%",
                }}
              />
            ))}
          </div>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        )}
      </button>
    </>
  );
}
