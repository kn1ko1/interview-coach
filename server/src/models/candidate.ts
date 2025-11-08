import { Schema, model } from 'mongoose';

// exported interface for in-memory candidate shapes
export interface CandidateData {
  name: string;
  email: string;
  cv: string;
  keywords: string[];
  responses: string[];
  employabilityScore?: number;
}

const candidateSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cv: { type: String, required: true },
  keywords: { type: [String], required: true },
  responses: { type: [String], required: true },
  employabilityScore: { type: Number, default: 0 },
}, { timestamps: true });

const Candidate = model('Candidate', candidateSchema);

export default Candidate;