import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Maximize, Minimize, CheckCircle } from 'lucide-react';
import { Button } from '@/komponen/ui/button';
import { Slider } from '@/komponen/ui/slider';
import { cn } from '@/pustaka/utils';

interface VideoPlayerProps {
    url: string;
    poster?: string;
    initialProgress?: number;
    onProgress?: (progress: number, currentTime: number) => void;
    onComplete?: () => void;
    autoPlay?: boolean;
}

export function VideoPlayer({
    url,
    poster,
    initialProgress = 0,
    onProgress,
    onComplete,
    autoPlay = false,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [progress, setProgress] = useState(initialProgress);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    // Initialize
    useEffect(() => {
        if (videoRef.current) {
            if (initialProgress > 0) {
                // Set initial time based on percentage if duration is unknown, 
                // will be corrected when metadata loaded
            }
        }
    }, [initialProgress]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;

            setCurrentTime(current);
            if (total > 0) {
                const percent = (current / total) * 100;
                setProgress(percent);
                onProgress?.(percent, current);

                if (percent >= 90 && !isCompleted) {
                    setIsCompleted(true);
                    onComplete?.();
                }
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const total = videoRef.current.duration;
            setDuration(total);

            // Restore previous progress if any
            // const startTime = (initialProgress / 100) * total;
            // if (startTime > 0) {
            //   videoRef.current.currentTime = startTime;
            // }
        }
    };

    const handleSeek = (value: number[]) => {
        if (videoRef.current) {
            const newTime = (value[0] / 100) * duration;
            videoRef.current.currentTime = newTime;
            setProgress(value[0]);
        }
    };

    const toggleFullscreen = () => {
        const container = document.getElementById('video-container');
        if (container) {
            if (!document.fullscreenElement) {
                container.requestFullscreen();
                setIsFullscreen(true);
            } else {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            id="video-container"
            className="relative group bg-black rounded-sm overflow-hidden aspect-video shadow-sm"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={url}
                poster={poster}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
            />

            {/* Overlay Play Button */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="h-8 w-8 text-white fill-white ml-1" />
                    </div>
                </div>
            )}

            {/* Controls */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
                    !showControls && isPlaying ? "opacity-0" : "opacity-100"
                )}
            >
                <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="mb-4 cursor-pointer"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={togglePlay}
                        >
                            {isPlaying ? (
                                <Pause className="h-5 w-5" />
                            ) : (
                                <Play className="h-5 w-5" />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={() => {
                                if (videoRef.current) videoRef.current.currentTime = 0;
                            }}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>

                        <span className="text-white text-sm font-medium">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isCompleted && (
                            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-sm text-xs font-medium border border-emerald-500/30">
                                <CheckCircle className="h-3 w-3" />
                                Selesai
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={toggleFullscreen}
                        >
                            {isFullscreen ? (
                                <Minimize className="h-5 w-5" />
                            ) : (
                                <Maximize className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
