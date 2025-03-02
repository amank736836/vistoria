"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../backend/lib/api-client";
import { IVideo } from "../backend/models/Video";
import VideoFeed from "../components/VideoFeed";
import { useNotification } from "../components/Notification";

export type GetRespnonse = {
  success: boolean;
  message: string;
  videos: IVideo[];
};

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  const { show } = useNotification();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();

        if (!data || !data.videos || data.videos.length === 0) {
          show("No videos found. Please upload some videos.", "error");
          return;
        }

        setVideos(data.videos);
      } catch (error) {
        console.log(error + "Error Fetching Videos");
      }
    };
    fetchVideos();
  }, []);

  return (
    <main className="w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 text-white px-6 md:px-12 h-[calc(100vh-8rem)] pt-20">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 drop-shadow-lg">
        Welcome to Vistoria
      </h1>

      <div className="w-full  text-black p-6 md:p-8 rounded-lg shadow-lg h-full">
        <VideoFeed videos={videos} />
      </div>
    </main>
  );
}
