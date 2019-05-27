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
    global clf
    global tf

    data = []
    if request.method == 'POST':
        message = request.form['message']
        data.append(message)
        prediction = clf.predict(tf.transform(data))
        pred_proba = clf.predict_proba(tf.transform(data))

        # TODO only return data if within certain confidence?
        return jsonify(emoji=prediction[0])

if __name__ == '__main__':
    app.run(debug=True) # Set to false for production
