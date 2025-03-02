import { IKVideo } from "imagekitio-next";
import { IVideo } from "../backend/models/Video";
import Link from "next/link";

function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="flex flex-col bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full">
      <figure className="relative p-4 h-4/6">
        <Link href={`/video/${video._id}`} className="block">
          <div className="rounded-xl overflow-hidden">
            <IKVideo
              path={video.videoUrl}
              transformation={[{ quality: "60", height: "300" }]}
              controls={video.controls}
              className="object-contain rounded-xl max-w-full max-h-full"
            />
          </div>
        </Link>
      </figure>

      <div className="p-4 flex flex-col flex-grow justify-between h-2/6">
        <Link
          href={`/video/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="text-lg font-semibold text-white">{video.title}</h2>
        </Link>
        <p className="text-sm text-gray-400 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}

export default VideoComponent;
