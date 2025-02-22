import mongoose, { model, models, Schema, Types } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  _id: Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls: boolean;
  transformation: {
    height: number;
    width: number;
    quality: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    transformation: {
      height: {
        type: Number,
        required: true,
        default: VIDEO_DIMENSIONS.height,
      },
      width: {
        type: Number,
        required: true,
        default: VIDEO_DIMENSIONS.width,
      },
      quality: {
        type: Number,
        min: 1,
        max: 100,
        default: 100,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Video =
  (models.Video as mongoose.Model<IVideo>) ||
  model<IVideo>("Video", videoSchema, "videos");

export default Video;
