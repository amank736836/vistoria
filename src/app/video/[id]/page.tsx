"use client";

import { apiClient } from "@/src/backend/lib/api-client";
import { IVideo } from "@/src/backend/models/Video";
import { IKVideo } from "imagekitio-next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Video() {
  const params = useParams<{ id: string }>();
  const [video, setVideo] = useState<IVideo | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await apiClient.getVideo(params.id);

        console.log(res);

        // setVideo(res.video);
      } catch (error) {
        console.log(error + "Error Fetching Video");
      }
    };
    fetchVideo();
  }, [params.id]);

  if (!video) return null;

  return (
    <IKVideo
      path={video.videoUrl}
      transformation={[{ quality: "60", height: "300" }]}
      controls={video.controls}
      className="object-contain rounded-xl max-w-full max-h-full"
    />
  );
}

export default Video;
