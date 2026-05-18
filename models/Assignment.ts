import mongoose, { Document, Schema } from 'mongoose';

interface IAttachment {
  url: string;
  publicId?: string;
  name: string;
  type: string;
  size?: number;
}

export interface IAssignment extends Document {
  title: string;
  description: string;
  classroom: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  dueDate: Date;
  totalMarks: number;
  attachments: IAttachment[];
  createdAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    classroom: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, required: true },
    totalMarks: { type: Number, required: true, min: 1, max: 1000 },
    attachments: [AttachmentSchema],
  },
  { timestamps: true }
);

AssignmentSchema.index({ classroom: 1, dueDate: 1 });

export const Assignment =
  mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
