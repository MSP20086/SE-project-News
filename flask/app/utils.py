import requests
import torch
from transformers import AutoTokenizer, AutoModel, pipeline
from sklearn.metrics.pairwise import cosine_similarity
from bs4 import BeautifulSoup

tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/paraphrase-MiniLM-L3-v2')
model = AutoModel.from_pretrained('sentence-transformers/paraphrase-MiniLM-L3-v2')

def get_embeddings(sentences):
    encoded_input = tokenizer(sentences, padding=True, truncation=True, return_tensors='pt')
    with torch.no_grad():
        model_output = model(**encoded_input)
    token_embeddings = model_output[0]
    input_mask_expanded = encoded_input['attention_mask'].unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
}

def get_article_links(url):
    response = requests.get(url, headers=HEADERS)
    urldict = {}

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        element = soup.find('div', id='HP_LATEST_NEWS', class_='lead-stories event-track-class single_latest_news')

        if element:
            left_part = element.find('div', class_='left-part')
            if left_part:
                left_articles = left_part.find_all('div', class_='other-article')
                for article in left_articles:
                    title = article.find('h3').text.strip()
                    link = article.find('a')['href']
                    urldict[title] = link

            right_part = element.find('div', class_='right-part')
            if right_part:
                right_articles = right_part.find_all('div', class_='top-news')
                for article in right_articles:
                    highlights_ul = article.find('ul', attrs={'data-vr-zone': 'Highlights'})
                    if highlights_ul:
                        list_items = highlights_ul.find_all('li', attrs={'data-vr-contentbox': True})
                        for li in list_items:
                            h3 = li.find('h3')
                            if h3:
                                title = h3.text.strip()
                                link = li.find('a')['href']
                                urldict[title] = link
    return urldict

def scrape_article(article_url):
    article_response = requests.get(article_url, headers=HEADERS)
    if article_response.status_code == 200:
        article_soup = BeautifulSoup(article_response.content, 'html.parser')
        title = article_soup.find('h1').text.strip() if article_soup.find('h1') else "No Title"
        content = article_soup.find('div', class_='story_details', id="pcl-full-content")
        article_text = content.text.strip() if content else "No content found"
        return {'title': title, 'url': article_url, 'content': article_text}
    return None

summarizer = pipeline("summarization", model="Falconsai/text_summarization")
def summarize_articles(content):
    content_tokens = content.split()[:256] 
    content = " ".join(content_tokens)
    if len(content.split()) > 30:
        summarized_article = summarizer(content, max_length=130, min_length=30, do_sample=False)
        return summarized_article[0]['summary_text']
    return content

classifier = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")
def categorize_article(title):
    candidate_labels = ["Politics", "Health", "Technology", "Entertainment", "Sports"]
    result = classifier(title, candidate_labels)
    return result['labels'][0]

def get_user_interactions(user_id):
    response = requests.get(f'http://localhost:3000/api/getUserInteraction?userId={user_id}')
    if response.status_code == 200:
        return response.json()  
    else:
        return [] 

def get_all_news():
    response = requests.get('http://localhost:3000/api/getAllNews')
    if response.status_code == 200:
        return response.json()  
    else:
        return []