from argparse import ArgumentParser
from sklearn.externals import joblib
from pathlib import Path

def main(message):
    """Files for testing predictions"""
    if (Path('nlp/tweets_model.pkl')).is_file():
        modelFile = 'nlp/tweets_model.pkl'
        vectFile = 'nlp/tweets_vectorizer.pkl'
    else:
        modelFile = 'tweets_model.pkl'
        vectFile = 'tweets_vectorizer.pkl'

    # Load stored model and vectorizer
    clf = joblib.load(modelFile)
    tf = joblib.load(vectFile)

    prediction = clf.predict(tf.transform([message]))
    pred_proba = clf.predict_proba(tf.transform([message]))
    print(prediction)
    print(pred_proba)

if __name__ == '__main__':
    parser = ArgumentParser(description='testing emoji predictions')
    parser.add_argument('--message', help='message to test prediction')
    args = parser.parse_args()
    main(args.message)
