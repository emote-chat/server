import os
import re
import pickle
import signal
from twython import Twython, TwythonStreamer, exceptions
from argparse import ArgumentParser
from pathlib import Path

# used in order to open twitter stream automatically
import urllib
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.chrome.options import Options

import constants

EMOJIS = ['😡']
emoji_dict = dict()  # needs to be able to modified by both classes


def clean_tweet(tweet):
    """Cleans raw tweets and prepares for proper storage"""
    global emoji_dict

    # Don't use tweet if retweet or has URL
    if (
        'RT' not in tweet and
        'http://' not in tweet and
        'https://' not in tweet
    ):

        # Convert emojis to code
        tweet = tweet.encode('unicode-escape').decode('ASCII')

        # Extract emojis
        emojis = re.findall(r'\\U\w+', tweet)

        # Remove emojis, usernames and # in hashtags
        regex = r'\#\S+|\@\S+|\\U\w+'
        tweet = re.sub(regex, '', tweet, flags=re.MULTILINE).strip()

        # Remove duplicates
        try:
            emoji_dict[EMOJIS[0]].append(tweet)
        except KeyError:
            emoji_dict[EMOJIS[0]] = [tweet]


class TwitterDataCollection:
    # Twitter Setup
    TWITTER_KEY = constants.TWITTER_KEY
    TWITTER_SECRET = constants.TWITTER_SECRET


    def __init__(self, use_search):
        """Load pickle file if it exists and open stream or search."""
        global emoji_dict

        self.filename = 'tweets' if 'nlp' in os.getcwd() else 'nlp/tweets'

        signal.signal(signal.SIGINT, self.sig_int_handler)

        if os.path.getsize(self.filename) > 0:
            in_file = open(self.filename, 'rb')
            emoji_dict = pickle.load(in_file)
            in_file.close()

        try:
            if use_search:
                self.connect_twitter_search()
            else:
                self.connect_twitter_stream()

        except (
            exceptions.TwythonAuthError,
            exceptions.TwythonError,
            ValueError
        ) as error:
            print(error)
            print('Missing TWITTER_KEY and TWITTER_SECRET env vars')


    def sig_int_handler(self, sig, frame):
        """Handles SIGINT, writing to pickle with all retrieved data."""
        print(f'Terminated by {signal.SIGINT.name}.')

        self.write_pickle()

        exit(0)

    def connect_twitter_stream(self):
        """Connects to Twitter Stream API."""
        # set up authentication using oauth v1.0
        self.twitter_auth()
        # open stream (tweets in real-time)
        self.open_stream()

    def connect_twitter_search(self):
        """Connects to Twitter Search API.

        Simpler as it doesn't require oauth.
        NOTE: tweets are limited to 100 at a time.
        """
        twitter = Twython(
            self.TWITTER_KEY,
            self.TWITTER_SECRET,
            oauth_version=2
        )
        TWITTER_ACCESS_TOKEN = twitter.obtain_access_token()

        twitter = Twython(self.TWITTER_KEY, access_token=TWITTER_ACCESS_TOKEN)

        for emoji in EMOJIS:
            QUERY = '&'.join(emoji)
            RESULTS = twitter.search(
                q=QUERY,
                count=100,
                result_type='mixed',
                lang='en'
            )

            for tweet in RESULTS['statuses']:
                clean_tweet(tweet['text'])

        self.write_pickle()


    def twitter_auth(self):
        """Authenticate user and get credentials necessary for opening stream."""
        twitter = Twython(self.TWITTER_KEY, self.TWITTER_SECRET)
        auth = twitter.get_authentication_tokens()

        self.OAUTH_TOKEN = auth['oauth_token']
        self.OAUTH_TOKEN_SECRET = auth['oauth_token_secret']

        print(f'OAUTH_TOKEN: {self.OAUTH_TOKEN}')
        print(f'OAUTH_TOKEN_SECRET: {self.OAUTH_TOKEN_SECRET}')

        print(auth.get('auth_url'))


        if (Path('nlp/chromedriver')).is_file():
            exec_loc = 'nlp/chromedriver'
        else:
            exec_loc = 'chromedriver'

        options = Options()
        options.headless = True
        driver = webdriver.Chrome(exec_loc, options=options)

        driver.get(auth['auth_url'])
        form = driver.find_element_by_id('oauth_form')
        input_email = driver.find_element_by_id('username_or_email')
        input_password = driver.find_element_by_id('password')
        input_email.send_keys(constants.TWITTER_USER)
        input_password.send_keys(constants.TWITTER_PASS)

        current_url = driver.current_url

        form.submit()

        # wait for URL to change with 15 seconds timeout
        WebDriverWait(driver, 15).until(ec.url_changes(current_url))

        self.twitter_cred(driver.current_url)


    def twitter_cred(self, url):
        """Get and update authorization tokens given oauth verifier.

        Note: OAUTH_VERIFIER comes from the redirect URL hash.
        """
        # extract oauth verifier from redirect url
        self.OAUTH_VERIFIER = url[
            url.find('oauth_verifier') + 15:url.find('#')
        ]

        twitter = Twython(
            self.TWITTER_KEY,
            self.TWITTER_SECRET,
            self.OAUTH_TOKEN,
            self.OAUTH_TOKEN_SECRET
        )

        final_step = twitter.get_authorized_tokens(self.OAUTH_VERIFIER)

        self.OAUTH_TOKEN = final_step['oauth_token']
        self.OAUTH_TOKEN_SECRET = final_step['oauth_token_secret']

        print(f'OAUTH_VERIFIER: {self.OAUTH_VERIFIER}')
        print(f'OAUTH_TOKEN: {self.OAUTH_TOKEN}')
        print(f'OAUTH_TOKEN_SECRET: {self.OAUTH_TOKEN_SECRET}')


    def open_stream(self):
        """Use credentials to open stream"""
        # I think we can only open one stream at a time
        QUERY = '&'.join(EMOJIS[0])

        self.stream = MyStreamer(
            self.TWITTER_KEY,
            self.TWITTER_SECRET,
            self.OAUTH_TOKEN,
            self.OAUTH_TOKEN_SECRET
        )

        self.stream.statuses.filter(track=QUERY, language='en')

    def write_pickle(self):
        with open(self.filename, 'wb') as f:
            pickle.dump(emoji_dict, f)
        f.close()


class MyStreamer(TwythonStreamer):
        """UPDATE WITH ONE-LINE DESCRIPTION."""

        def on_success(self, data):
            if 'text' in data:
                clean_tweet(data.get('text'))

        def on_error(self, status_code, data):
            print(status_code)
            self.disconnect()

# Execute main method upon running script
if __name__ == '__main__':
    # designate an optional -se or --search flag if twitter search
    # instead of twitter stream desired
    parser = ArgumentParser()
    parser.add_argument(
        '-se', '--search',
        action='store_true',
        help='use twitter search in lieu of twitter stream'
    )

    TwitterDataCollection(parser.parse_args().search)
