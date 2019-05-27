import nltk
import pickle
import numpy as np

from sklearn.externals import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

def main():
    """File for testing predictions"""
    data = ['i love you']

    # Load stored model and vectorizer
    clf = joblib.load('tweets_model.pkl')
    tf = joblib.load('tweets_vectorizer.pkl')

    prediction = clf.predict(tf.transform(data))
    pred_proba = clf.predict_proba(tf.transform(data))
    print(prediction)
    print(pred_proba)

if __name__ == '__main__':
    main()
