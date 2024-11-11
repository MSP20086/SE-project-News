from flask import Blueprint, request, jsonify
import pandas as pd
import torch
from sklearn.metrics.pairwise import cosine_similarity
from .utils import get_embeddings, get_user_interactions, get_all_news

recommendation_bp = Blueprint('recommendation', __name__)

@recommendation_bp.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id')

    interactions = get_user_interactions(user_id)
    liked_articles = [interaction['articleId'] for interaction in interactions if interaction['type'] == 'like']
    disliked_articles = [interaction['articleId'] for interaction in interactions if interaction['type'] == 'dislike']

    articles = get_all_news()
    article_df = pd.DataFrame(articles["articles"])
    if '_id' not in article_df.columns:
        return jsonify({"error": "No articles found."}), 404

    filtered_articles = article_df[~article_df['_id'].isin(disliked_articles)]
    filtered_articles['description'] = filtered_articles['title'] + ' ' + filtered_articles['content']
    article_embeddings = get_embeddings(filtered_articles['description'].tolist())

    if liked_articles:
        liked_articles_data = article_df[article_df['_id'].isin(liked_articles)]
        liked_articles_data['description'] = liked_articles_data['title'] + ' ' + liked_articles_data['content']

        liked_article_embeddings = get_embeddings(liked_articles_data['description'].tolist())
        similarities = cosine_similarity(liked_article_embeddings, article_embeddings)
        scores = similarities.mean(axis=0)
        top_indices = scores.argsort()[-15:][::-1]
        recommended_articles = filtered_articles.iloc[top_indices]
    else:
        recommended_articles = filtered_articles.head(15)

    return jsonify(recommended_articles.to_dict(orient='records'))
