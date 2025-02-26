import { Schema, model, Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  user: Types.ObjectId;
  completed: boolean;
  createdAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<ITask>("Task", taskSchema);
