import mongoose, { Document, Schema } from 'mongoose';

interface IAttachment {
  url: string;
  publicId?: string;
  name: string;
  type: string;
  size?: number;
}

export interface ISubmission extends Document {
  assignment: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  classroom: mongoose.Types.ObjectId;
  attachments: IAttachment[];
  status: 'submitted' | 'graded' | 'late' | 'missing';
  marks?: number;
  feedback?: string;
  submittedAt: Date;
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

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    classroom: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
    attachments: [AttachmentSchema],
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late', 'missing'],
      default: 'submitted',
    },
    marks: { type: Number, min: 0 },
    feedback: { type: String, maxlength: 1000 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate submissions per student per assignment
SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });
SubmissionSchema.index({ classroom: 1, student: 1 });

export const Submission =
  mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
