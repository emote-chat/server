from argparse import ArgumentParser
from sklearn.externals import joblib
from pathlib import Path

def main(message):
    """File for testing predictions"""
    modelFile = Path.cwd() / 'nlp/tweets_model.pkl'
    vectFile = Path.cwd() / 'nlp/tweets_vectorizer.pkl'

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
