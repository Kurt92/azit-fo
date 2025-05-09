"use client";
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function StreamingPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
  const streamKey = "test";

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: "auto",
        fluid: true,
        sources: [
          {
            src: `https://azitbase.com/hls/${streamKey}.m3u8`,
            type: "application/x-mpegURL",
          },
        ],
      });

      playerRef.current.ready(() => {
        console.log("Video.js player is ready.");
      });

      playerRef.current.on("error", () => {
        console.error("Player error:", playerRef.current?.error());
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamKey]);

  return (
    <div>
      <h1>스트리밍 시청</h1>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls
        playsInline
      />
    </div>
  );
}
