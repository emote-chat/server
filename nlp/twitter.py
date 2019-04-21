import os
import re
from twython import Twython

outputFile = open('rawtweets.txt', 'w')

# Twitter Setup
TWITTER_KEY = os.environ.get('TWITTER_KEY')
TWITTER_SECRET = os.environ.get('TWITTER_SECRET')

twitter = Twython(TWITTER_KEY, TWITTER_SECRET, oauth_version=2)
TWITTER_ACCESS_TOKEN = twitter.obtain_access_token()

twitter = Twython(TWITTER_KEY, access_token=TWITTER_ACCESS_TOKEN)

def cleanTweet(tweet):
    # Don't use tweet if retweet or has URL
    if (('RT' not in tweet) and ('http://' not in tweet) and ('https://' not in tweet)):
        # Convert emojis to code
        tweet = tweet.encode('unicode-escape').decode('ASCII')

        # Extract emojis
        emojis = re.findall(r'\\U\w+', tweet)

        # Remove emojis, usernames and # in hashtags
        regex = r"\#\S+|\@\S+|\\U\w+"
        tweet = re.sub(regex, '', tweet, flags=re.MULTILINE).strip()

        # Store in format emoji + tweet
        # Remove duplicates, and write one row per emoji if multiple emojis
        for emoji in set(emojis):
            outputFile.write(emoji + " @ " + tweet + "\n")

# Query to search for tweets using emoticons values
# 1F602 = happy, 1F62D = sad, 1F621= angry, 2764 = love, 1F61C = playful, 1F631 = confused
# EMOJIS = [u'\U0001F602', u'\U0001F62D', u'\U00002764']
EMOJIS = [u'\U0001F602']

for emoji in EMOJIS:
    QUERY = "&".join(emoji)

    print(QUERY)

    RESULTS = twitter.search(q=QUERY, count=100, result_type='mixed', lang='en')

    print(RESULTS['search_metadata'])

    for tweet in RESULTS['statuses']:
        cleanTweet(tweet['text'])

outputFile.close()
