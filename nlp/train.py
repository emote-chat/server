from pathlib import Path
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.externals import joblib


def main():
    """Train model using tweet data"""
    if (Path('nlp/tweets')).is_file():
        path = 'nlp/'
    else:
        path = ''

    with open(f'{path}tweets', 'rb') as f:
        tweets = pickle.load(f)

        x = []  # data (tweets)
        y = []  # category (emojis)

        # Prep data
        for key, value in tweets.items():
            count = 0
            print(key)
            print(len(value))

            for tweet in value:
                count = count + 1
                # Ensure the training data is the same number of entries so
                # it's not biased
                if (count < 7200):
                    x.append(tweet)
                    y.append(key)

        # Calculate word frequencies using TfidfVectorizer
        # Also removes stopwords like 'the', 'is', 'are'
        tf = TfidfVectorizer(stop_words='english')
        txt_fitted = tf.fit(x)
        txt_transformed = txt_fitted.transform(x)
        x = txt_transformed.toarray()

        # Split into training and testing data
        X_train, X_test, y_train, y_test = train_test_split(
            x, y, test_size=0.2, random_state=13)

        # Create classifier and fit data
        clf = MultinomialNB()
        clf.fit(X_train, y_train)
        clf.score(X_test, y_test)
        y_pred = clf.predict(X_test)

        # Print report of testing data
        print(classification_report(y_test, y_pred))

        # Save model and vectorizer
        joblib.dump(clf, f'{path}tweets_model.pkl')
        joblib.dump(tf, f'{path}tweets_vectorizer.pkl')

    f.close()

# Execute main method upon running script
if __name__ == '__main__':
    main()
