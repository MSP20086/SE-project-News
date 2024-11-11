import mongoose from 'mongoose';

const newsArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    content: { type: String, required: true },
    image_url: { type: String, required: true },
    published_date: { type: String, required: true },
    summarized_content: { type: String, required: true },
    category: { type: String, required: true },
}, { timestamps: true });


export default mongoose.models.NewsArticle || mongoose.model('NewsArticle', newsArticleSchema);
