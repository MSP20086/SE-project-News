import mongoose from 'mongoose';

const InteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  articleId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ['like', 'dislike', 'bookmark'], required: true },
  createdAt: { type: Date, default: Date.now }
});

InteractionSchema.index({ userId: 1, articleId: 1, type: 1 }, { unique: true });

export default mongoose.models.Interaction || mongoose.model('Interaction', InteractionSchema);
