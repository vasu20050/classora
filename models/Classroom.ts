import mongoose, { Document, Schema } from 'mongoose';

export interface IClassroom extends Document {
  name: string;
  description?: string;
  subject: string;
  section?: string;
  code: string;
  teacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
  coverColor: string;
  createdAt: Date;
}

const ClassroomSchema = new Schema<IClassroom>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, maxlength: 500 },
    subject: { type: String, required: true, trim: true, maxlength: 40 },
    section: { type: String, maxlength: 20 },
    // 6-character unique join code
    code: { type: String, required: true, unique: true, uppercase: true, length: 6 },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // Tailwind gradient class stored for consistent card colors
    coverColor: {
      type: String,
      default: 'from-violet-600 to-indigo-600',
    },
  },
  { timestamps: true }
);

// Index for fast code lookups (join by code)
ClassroomSchema.index({ code: 1 });
ClassroomSchema.index({ teacher: 1 });

export const Classroom =
  mongoose.models.Classroom || mongoose.model<IClassroom>('Classroom', ClassroomSchema);
