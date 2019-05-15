from os import environ
from dotenv import load_dotenv
load_dotenv(verbose=True)

TWITTER_USER = environ.get('TWITTER_USER')
TWITTER_PASS = environ.get('TWITTER_PASS')
TWITTER_KEY = environ.get('TWITTER_KEY')
TWITTER_SECRET = environ.get('TWITTER_SECRET')
