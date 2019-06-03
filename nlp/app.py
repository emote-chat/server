from flask import Flask, request, jsonify
from sklearn.externals import joblib
from pathlib import Path

app = Flask(__name__)
clf = None
tf = None


@app.before_first_request
def load():
    global clf
    global tf
    modelFile = Path.cwd() / 'nlp/tweets_model.pkl'
    vectFile = Path.cwd() / 'nlp/tweets_vectorizer.pkl'

    clf = joblib.load(modelFile)
    tf = joblib.load(vectFile)


@app.route('/', methods=['POST'])
def main():
    data = []
    if request.method == 'POST':
        message = request.form['message']
        data.append(message)
        prediction = clf.predict(tf.transform(data))
        pred_proba = clf.predict_proba(tf.transform(data))
        print(pred_proba)

        # Only return data if within certain confidence threshold
        emojis = clf.classes_
        threshold = .25
        probability_arr = pred_proba[0].tolist()
        results = {}
        for idx, emoji in enumerate(emojis):
            prob = probability_arr[idx]
            if (prob > threshold):
                results[emoji] = prob

        print(results)
        print(jsonify(emoji=results))
        return jsonify(emoji=results)

if __name__ == '__main__':
    app.run(debug=False)
