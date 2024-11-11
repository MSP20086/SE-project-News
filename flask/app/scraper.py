from flask import Blueprint, jsonify
from .utils import get_article_links, scrape_article, summarize_articles, categorize_article

scraper_bp = Blueprint('scraper', __name__)

@scraper_bp.route('/scrape', methods=['GET'])
def scrape_articles():
    url = 'https://indianexpress.com/'
    article_links = get_article_links(url)
    
    all_articles_data = []
    for title, link in article_links.items():
        article_data = scrape_article(link)
        if article_data:
            summarized_content = summarize_articles(article_data['content'])
            article_data['summarized_content'] = summarized_content
            article_data['category'] = categorize_article(article_data['title'])
            all_articles_data.append(article_data)

    return jsonify(all_articles_data)
