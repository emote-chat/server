import os
from twython import Twython

# Twitter Setup
TWITTER_KEY = os.environ.get('TWITTER_KEY')
TWITTER_SECRET = os.environ.get('TWITTER_SECRET')

twitter = Twython(TWITTER_KEY, TWITTER_SECRET, oauth_version=2)
TWITTER_ACCESS_TOKEN = twitter.obtain_access_token()

twitter = Twython(TWITTER_KEY, access_token=TWITTER_ACCESS_TOKEN)

# Query to search for tweets using emoticons values
# 1F602 = happy, 1F62D = sad, 1F621= angry, 2764 = love, 1F61C = playful, 1F631 = confused
EMOJIS = [u'\U0001F602', u'\U0001F62D', u'\U00002764']

for emoji in EMOJIS:
    QUERY = "&".join(emoji)

    print(QUERY)

    RESULTS = twitter.search(q=QUERY, result_type='popular', lang='en', count='100')

    for tweet in RESULTS['statuses']:
        print(tweet['text'])
