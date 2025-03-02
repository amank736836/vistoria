import { IVideo } from "../backend/models/Video";
import VideoComponent from "./VideoComponent";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  return (
    <div className="container mx-auto px-4 py-6 h-full">
      <h1 className="text-2xl font-bold text-white mb-4 text-center">
        All Videos
      </h1>

      {videos.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-400">
            No videos found. Please upload some videos.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 h-full overflow-auto">
          {videos.map((video) => (
            <VideoComponent key={video._id?.toString()} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
