from pathlib import Path
import nltk
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
# download nlt punkt package for use of word_tokenize method
nltk.download('punkt')


def main():
    """Calculate word frequencies (minus stop words)."""
    if (Path('nlp/tweets')).is_file():
        filename = 'nlp/tweets'
    else:
        filename = 'tweets'

    with open(filename, 'rb') as f:
        tweets = pickle.load(f)

        for key, value in tweets.items():
            text = []

            # Tokenize text - separate by word
            print(key)
            strings = ' '.join(value)
            tokens = nltk.word_tokenize(strings)
            print(strings)
            text.append(strings)

            # Remove stopwords like 'the', 'is', 'are'
            vectorizer = TfidfVectorizer(stop_words='english')
            # Calculate word frequencies using TfidfVectorizer
            vectorizedText = vectorizer.fit_transform(text)

            print(vectorizedText)
            print(vectorizer.get_feature_names())

    f.close()


# Execute main method upon running script
if __name__ == '__main__':
    main()
