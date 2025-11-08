"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const candidateSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cv: { type: String, required: true },
    keywords: { type: [String], required: true },
    responses: { type: [String], required: true },
    employabilityScore: { type: Number, default: 0 },
}, { timestamps: true });
const Candidate = (0, mongoose_1.model)('Candidate', candidateSchema);
exports.default = Candidate;
