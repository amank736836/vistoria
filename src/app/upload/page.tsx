"use client";

import VideoUploadForm from "@/src/components/VideoUploadForm";

function VideoUploadPage() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-8rem)] text-white">
      <div className="w-full max-w-2xl bg-white bg-gradient-to-br from-green-500 to-purple-600 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Upload New Video
        </h1>
        <VideoUploadForm />
      </div>
    </div>
  );
}

export default VideoUploadPage;
