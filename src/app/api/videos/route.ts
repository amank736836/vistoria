import { connectToDatabase } from "@/src/backend/lib/db";
import Video, { IVideo } from "@/src/backend/models/Video";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json(
        {
          error: "No videos found",
          videos: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Videos found successfully",
        videos: videos,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error || "An error occurred while fetching videos",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body: IVideo = await request.json();

    if (!body) {
      return NextResponse.json(
        {
          error: "Invalid request body",
        },
        { status: 400 }
      );
    }

    if (!body.title) {
      return NextResponse.json(
        {
          error: "Title is required",
        },
        { status: 400 }
      );
    }

    if (!body.videoUrl) {
      return NextResponse.json(
        {
          error: "Video URL is required",
        },
        { status: 400 }
      );
    }

    if (!body.thumbnailUrl) {
      return NextResponse.json(
        {
          error: "Thumbnail URL is required",
        },
        { status: 400 }
      );
    }

    if (!body.description) {
      return NextResponse.json(
        {
          error: "Description is required",
        },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: body.transformation?.height ?? 1920,
        width: body.transformation?.width ?? 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);

    return NextResponse.json(
      {
        success: true,
        message: "Video created successfully",
        video: newVideo,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error || "An error occurred while creating video",
      },
      { status: 500 }
    );
  }
}
