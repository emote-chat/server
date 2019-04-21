import os
import re
from twython import Twython
from twython import TwythonStreamer

outputFile = open('rawtweets.txt', 'a')

# Twitter Setup
TWITTER_KEY = os.environ.get('TWITTER_KEY')
TWITTER_SECRET = os.environ.get('TWITTER_SECRET')

'''
Define emoji unicode here
Examples:
1F602 = happy, 1F62D = sad, 1F621= angry, 2764 = love, 1F61C = playful, 1F631 = confused
'''
EMOJIS = [u'\U0001F602']

class MyStreamer(TwythonStreamer):
    def on_success(self, data):
        if 'text' in data:
            cleanTweet(data['text'])

    def on_error(self, status_code, data):
        print(status_code)
        self.disconnect()

'''
Use this function to connect to Twitter Stream API.
'''
def connectTwitterStream():
    '''
    When first authenticating:
    - Run the script, go to the auth url and verify.
    - Add OAUTH_TOKEN, OAUTH_TOKEN_SECRET, OAUTH_VERIFIER (from redirect url after you authenticate) to the script.
    - Comment out this section/comment in the rest, and re-run the script.
    '''
    twitter = Twython(TWITTER_KEY, TWITTER_SECRET)
    auth = twitter.get_authentication_tokens()

    OAUTH_TOKEN = auth['oauth_token']
    OAUTH_TOKEN_SECRET = auth['oauth_token_secret']

    print(OAUTH_TOKEN)
    print(OAUTH_TOKEN_SECRET)
    print(auth['auth_url'])

    OAUTH_TOKEN = ''
    OAUTH_TOKEN_SECRET = ''
    OAUTH_VERIFIER = ''

    '''
    Comment this section in when you have the keys entered
    '''
    # twitter = Twython(TWITTER_KEY, TWITTER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
    # final_step = twitter.get_authorized_tokens(OAUTH_VERIFIER)

    # OAUTH_TOKEN = final_step['oauth_token']
    # OAUTH_TOKEN_SECRET = final_step['oauth_token_secret']

    # I think we can only open one stream at a time
    # QUERY = '&'.join(EMOJIS[0])

    # stream = MyStreamer(TWITTER_KEY, TWITTER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
    # stream.statuses.filter(track=QUERY, language='en')

'''
Use this function to connect to Twitter Search API.
Simpler as it doesn't require oauth,
but the tweets are limited to 100 at a time.
'''
def connectTwitterSearch():
    twitter = Twython(TWITTER_KEY, TWITTER_SECRET, oauth_version=2)
    TWITTER_ACCESS_TOKEN = twitter.obtain_access_token()

    twitter = Twython(TWITTER_KEY, access_token=TWITTER_ACCESS_TOKEN)

    for emoji in EMOJIS:
        QUERY = '&'.join(emoji)
        RESULTS = twitter.search(q=QUERY, count=100, result_type='mixed', lang='en')
        # print(QUERY)
        # print(RESULTS['search_metadata'])
        for tweet in RESULTS['statuses']:
            cleanTweet(tweet['text'])

'''
Cleans raw tweets and prepares for proper storage
'''
def cleanTweet(tweet):
    # Don't use tweet if retweet or has URL
    if (('RT' not in tweet) and ('http://' not in tweet) and ('https://' not in tweet)):
        # Convert emojis to code
        tweet = tweet.encode('unicode-escape').decode('ASCII')

        # Extract emojis
        emojis = re.findall(r'\\U\w+', tweet)

        # Remove emojis, usernames and # in hashtags
        regex = r'\#\S+|\@\S+|\\U\w+'
        tweet = re.sub(regex, '', tweet, flags=re.MULTILINE).strip()

        # Store in format emoji + tweet
        # Remove duplicates, and write one row per emoji if multiple emojis
        for emoji in set(emojis):
            outputFile.write(emoji + ' @ ' + tweet + '\n')

'''
Choose whether to use the stream or search Twitter API
'''
def main():
    connectTwitterStream()
    # connectTwitterSearch()

main()
outputFile.close()
