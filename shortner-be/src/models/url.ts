import mongoose, { Model } from "mongoose";
const urlSchema = new mongoose.Schema(
  {
    slug: { type: String, index: true, unique: true },
    fullUrl: String,
  },
  { timestamps: true, versionKey: false }
);

interface IUrl extends mongoose.Document {
  slug: string;
  fullUrl: string;
}

const Url: Model<IUrl> = mongoose.model<IUrl>("Url", urlSchema);
export { Url, IUrl };
