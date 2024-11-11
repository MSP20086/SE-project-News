import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  articleId: {
    type: String,
    required: true,
  },
  user: {
    type: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String, required: true },
    },
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
