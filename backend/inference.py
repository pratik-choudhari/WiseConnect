import pickle
import random

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.pipeline import Pipeline

with open(r"C:\Users\prati\Downloads\MultinomialNB.pkl", "rb") as fp:
    model = pickle.load(fp)

clf = Pipeline([
    ('vectorizer', CountVectorizer()),
    ('nb', model)
])

emails = [
    'there a virus in you computer, install this software now',
]

def detect_fraud(msg: str):
    print(msg)
    return random.choice([True, False])
# clf.fit(emails, [1])
# print(clf.predict(emails))
