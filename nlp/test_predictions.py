from argparse import ArgumentParser
from sklearn.externals import joblib
from pathlib import Path


def main(message):
    """Testing predictions"""
    if (Path('nlp/tweets_model.pkl')).is_file():
        path = 'nlp/'
    else:
        path = ''

    # Load stored model and vectorizer
    clf = joblib.load(f'{path}tweets_model.pkl')
    tf = joblib.load(f'{path}tweets_vectorizer.pkl')

    prediction = clf.predict(tf.transform([message]))
    pred_proba = clf.predict_proba(tf.transform([message]))
    print(f'Top Prediction: {prediction}')

    emojis = clf.classes_
    threshold = .25
    probability_arr = pred_proba[0].tolist()
    for idx, emoji in enumerate(emojis):
        print(emoji)
        print(probability_arr[idx])

if __name__ == '__main__':
    parser = ArgumentParser(description='testing emoji predictions')
    parser.add_argument('message', help='message to test prediction')
    args = parser.parse_args()
    main(args.message)
