"use client";

import { ImageKitProvider } from "imagekitio-next";
import {
    IKUploadResponse,
    UploadError,
} from "imagekitio-next/dist/types/components/IKUpload/props";
import { SessionProvider } from "next-auth/react";
import { ChangeEvent, ReactNode } from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

export default function Providers({ children }: { children: ReactNode }) {
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      const authError = error as Error;
      throw new Error(
        `Imagekit Authentication request failed: ${authError.message}`
      );
    }
  };

  const onError = (err: UploadError) => {
    console.log("Error", err);
  };

  const onSuccess = (res: IKUploadResponse) => {
    console.log("Success", res);
  };

  const onUploadProgress = (progress: Number) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt: ChangeEvent<HTMLInputElement>) => {
    console.log("Start", evt);
  };

  return (
    <SessionProvider>
      <ImageKitProvider
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        {children}
      </ImageKitProvider>
    </SessionProvider>
  );
}
