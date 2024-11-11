from flask import Flask
from .recommendation import recommendation_bp
from .scraper import scraper_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(recommendation_bp)
    app.register_blueprint(scraper_bp)

    return app
