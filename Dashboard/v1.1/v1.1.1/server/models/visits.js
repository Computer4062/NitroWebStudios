import mongoose from 'mongoose';

const PageVisitSchema = new mongoose.Schema({
  path: { type: String, required: true, unique: true },
  hits: { type: Number, default: 0 },
  lastVisited: { type: Date, default: Date.now }
});

export const PageVisit = mongoose.models.PageVisit || mongoose.model('PageVisit', PageVisitSchema);