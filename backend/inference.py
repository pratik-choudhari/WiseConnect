import pickle
import random
from sqlite3 import Connection

from backend.config import SQL_DB_FILE

with open(r"./notebooks/LogisticReg.pkl", "rb") as fp:
    vectorizer, model = pickle.load(fp)


def detect_fraud(msg: str, post_id: str):
    with Connection(SQL_DB_FILE) as conn:
        curr = conn.cursor()

        result = model.predict(vectorizer.transform([msg]))[0]
        curr.execute(f"""UPDATE posts SET fraud_detected={result} WHERE id = {int(post_id)}""")
