import mongoose from 'mongoose';

const PageVisitSchema = new mongoose.Schema({
  path: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastVisited: { 
    type: Date, 
    default: Date.now 
  },
  // Dedicated real-time counter bucket for the active day
  todaysHits: { 
    type: Number, 
    default: 0 
  },
  // The big chronological storage archive list
  hits: [
    {
      date: { type: String, required: true }, // Format: "YYYY-MM-DD"
      count: { type: Number, required: true }
    }
  ]
});

export const PageVisit = mongoose.models.PageVisit || mongoose.model('PageVisit', PageVisitSchema);