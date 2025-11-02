import { Schema, model } from 'mongoose';

const candidateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    cv: {
        type: String,
        required: true,
    },
    keywords: {
        type: [String],
        required: true,
    },
    responses: {
        type: Map,
        of: String,
        required: true,
    },
    employabilityScore: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Candidate = model('Candidate', candidateSchema);

export default Candidate;