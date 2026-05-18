import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  content: string;
  classroom: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
    size?: number;
  }>;
  createdAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    content: { type: String, required: true, maxlength: 2000 },
    classroom: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attachments: [
      {
        url: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        size: { type: Number },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

AnnouncementSchema.index({ classroom: 1, createdAt: -1 });

export const Announcement =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
