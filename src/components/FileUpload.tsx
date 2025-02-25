"use client";
import { IKUpload } from "imagekitio-next";
import {
  IKUploadResponse,
  UploadError,
} from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: IKUploadResponse) => void;
  onError: (err: UploadError) => void;
  onUploadStart?: (evt: ChangeEvent<HTMLInputElement>) => void;
  onUploadProgress?: (progress: Number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onUploadStart,
  onUploadProgress,
  onError,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message);
    setUploading(false);
    onError && onError(err);
  };

  const handleSuccess = (response: IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false);
    setError(null);
    onSuccess && onSuccess(response);
  };

  const handleUploadProgress = (
    evt: ProgressEvent<XMLHttpRequestEventTarget>
  ) => {
    if (evt.lengthComputable && onUploadProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onUploadProgress(Math.round(percentComplete));
    }
    setUploading(true);
    setError(null);
  };

  const handleUploadStart = (evt: ChangeEvent<HTMLInputElement>) => {
    console.log("Start", evt);
    setUploading(true);
    setError(null);
    onUploadStart && onUploadStart(evt);
  };

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a video file");
        return false;
      }
      if (file.size > 1024 * 1024 * 100) {
        setError("Video file size should be less than 100MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload an valid image file(jpeg, png, webp)");
        return false;
      }
      if (file.size > 1024 * 1024 * 5) {
        setError("Image file size should be less than 5MB");
        return false;
      }
    }
    return true;
  };

  return (
    <div className="space-y-2">
      <IKUpload
        fileName={fileType === "video" ? "video" : "image"}
        onError={handleError}
        onSuccess={handleSuccess}
        onUploadProgress={handleUploadProgress}
        onUploadStart={handleUploadStart}
        accept={fileType === "video" ? "video/*" : "image/*"}
        className="file-input file-input-bordered w-full"
        validateFile={validateFile}
        useUniqueFileName={true}
        folder={fileType === "video" ? "/vistoria/videos" : "/vistoria/images"}
        extensions={[
          {
            name: "remove-bg",
            options: {
              add_shadow: true,
            },
          },
        ]}
      />
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="animate-spin w-4 h-4" />
          <span>Uploading...</span>
        </div>
      )}
      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
}
