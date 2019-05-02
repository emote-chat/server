import nltk
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer

infile = open('tweets', 'rb')
tweets = pickle.load(infile)

for key, value in tweets.items():
    text = []
    # Tokenize text - separate by word
    print(key)
    strings = ' '.join(value)
    tokens = nltk.word_tokenize(strings)
    print(strings)
    text.append(strings)

    # Calculate word frequencies using TfidfVectorizer
    vectorizer = TfidfVectorizer(stop_words='english') # Remove stopwords
    vectorizedText = vectorizer.fit_transform(text)
    print(vectorizedText)
    print(vectorizer.get_feature_names())
infile.close()
