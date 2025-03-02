"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNotification } from "./Notification";
import { apiClient } from "../backend/lib/api-client";
import FileUpload from "./FileUpload";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useRouter } from "next/navigation";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });
  const { show } = useNotification();

  const router = useRouter();

  const handleSuccess = (response: IKUploadResponse) => {
    setValue("videoUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    show("Video uploaded successfully", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      show("Please upload a video first", "error");
      return;
    }

    setLoading(true);

    try {
      await apiClient.createVideo(data);
      show("Video published successfully", "success");

      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
      router.push("/");
    } catch (error) {
      const VideoUploadFormError = error as Error;
      const message = VideoUploadFormError.message || "Something went wrong";
      show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-gray-900 p-8 rounded-lg shadow-xl"
    >
      <div className="flex flex-col">
        <label className="font-medium text-white">Title</label>
        <input
          type="text"
          className={`w-full h-12 px-4 py-3 mt-1 border rounded-lg bg-gray-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${
            errors.title
              ? "border-red-400 focus:ring-red-500"
              : "border-gray-600 focus:ring-blue-500"
          }`}
          placeholder="Enter video title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <span className="text-red-400 text-sm mt-1">
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="font-medium text-white">Description</label>
        <textarea
          className={`w-full h-32 px-4 py-3 mt-1 border rounded-lg bg-gray-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${
            errors.description
              ? "border-red-400 focus:ring-red-500"
              : "border-gray-600 focus:ring-blue-500"
          } resize-none`}
          placeholder="Enter video description"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-red-400 text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="font-medium text-white">Video</label>
        <FileUpload
          fileType="video"
          onUploadProgress={handleUploadProgress}
          onSuccess={handleSuccess}
          onError={(error) => show(error.message, "error")}
          onUploadStart={(evt) => console.log("Start", evt)}
        />

        {uploadProgress > 0 && (
          <div className="w-full bg-gray-700 rounded-full mt-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className={`w-full flex justify-center items-center py-4 text-lg rounded-lg font-medium transition duration-200 ${
          loading || !uploadProgress
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
        disabled={loading || !uploadProgress}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            Publishing Video...
          </>
        ) : (
          "Publish Video"
        )}
      </button>
    </form>
  );
}
