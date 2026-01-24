"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackgroundMusicProps {
    isPlaying: boolean;
}

export default function BackgroundMusic({ isPlaying }: BackgroundMusicProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch((error) => {
                    console.log("Audio playback failed:", error);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <audio ref={audioRef} loop>
                <source src="/background-music.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {isPlaying && (
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-black/50 backdrop-blur-md border-white/10 hover:bg-black/70 text-white"
                    onClick={toggleMute}
                >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
            )}
        </div>
    );
}
