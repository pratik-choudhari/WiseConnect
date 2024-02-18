from sqlite3 import Connection
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from backend.config import SQL_DB_FILE
from backend.database import init_db
from backend.inference import detect_fraud


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS = {}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    print(exc)
    err_msg = "; ".join([f'{err["msg"]}: {err["loc"][-1]}' if err["type"] == "missing" else err["msg"]
                         for err in exc.errors()])
    return JSONResponse(status_code=422, content={"message": "error", "detail": err_msg})


@app.exception_handler(HTTPException)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=exc.status_code,
                        content={"message": "error", "details": exc.detail})


@app.exception_handler(SQLAlchemyError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=500,
                        content={"message": "error", "details": exc.orig.args[1]})


@app.get("/")
async def root():
    return {"message": "Ping...pong!"}


@app.post("/user/login")
async def login(data: dict):
    with Connection(SQL_DB_FILE) as conn:
        curr = conn.cursor()
        curr.execute("""SELECT id, username, email, full_name FROM user WHERE email = ? AND password = ?""",
                     (data["email"], data["password"]))
        result = curr.fetchall()
        if not result:
            return {"message": "error", "details": "Incorrect credentials"}

        values = result[0]
        keys = [i[0] for i in curr.description]
        return {"message": "OK", "user_id": values[0], "user": dict(zip(keys, values))}


@app.post("/user/register")
async def register(data: dict):
    with Connection(SQL_DB_FILE) as conn:
        curr = conn.cursor()

        curr.execute("""SELECT COUNT(*) FROM user WHERE email=? OR username=?""",
                     (data["email"], data["username"]))

        if curr.fetchall()[0][0] > 0:
            return {"message": "error", "details": "User already exists"}

        curr.execute("""INSERT INTO user(username, email, password, full_name, birth_date) 
                            VALUES (?, ?, ?, ?, ?)""",
                     (data["username"], data["email"], data["password"], data["full_name"],
                      data["birth_date"]))
        conn.commit()
        if not curr.lastrowid:
            return {"message": "error", "details": "Internal server error"}
        return {"message": "OK", "user_id": curr.lastrowid, "user": {"username": data["username"],
                                                                     "email": data["email"],
                                                                     "full_name": data["full_name"]}}


@app.get("/user/info")
async def info(user_id: int):
    with Connection(SQL_DB_FILE) as conn:
        curr = conn.cursor()
        curr.execute("""SELECT username, email, full_name FROM user WHERE id = ?""", (user_id,))
        result = curr.fetchall()
        if not result:
            return {"message": "error", "details": "Invalid user"}
        values = result[0]
        keys = [i[0] for i in curr.description]
        return {"message": "OK", "user": dict(zip(keys, values))}


@app.post("/user/follow")
async def follow(data: dict):
    with Connection(SQL_DB_FILE) as conn:
        curr = conn.cursor()

        curr.execute("""SELECT COUNT(*) FROM user WHERE id IN (?, ?)""",
                     (data["user_id"], data["to_user_id"]))

        if curr.fetchall()[0][0] != 2:
            return {"message": "error", "details": "User(s) do not exist"}

        curr.execute("""INSERT INTO follow_relations(from_user, to_user) VALUES (?, ?)""",
                     (data["user_id"], data["to_user_id"]))
        conn.commit()
        if not curr.lastrowid:
            return {"message": "error", "details": "Internal server error"}
        return {"message": "OK"}


@app.post("/post/create")
async def pcreate(data: dict, background_tasks: BackgroundTasks):
    with Connection(SQL_DB_FILE) as conn:
        curr = conn.cursor()

        curr.execute("""SELECT COUNT(*) FROM user WHERE id = ?""",
                     (data["user_id"],))

        if curr.fetchall()[0][0] == 0:
            return {"message": "error", "details": "User(s) do not exist"}

        curr.execute("""INSERT INTO posts(user_id, text, img) VALUES (?, ?, ?)""",
                     (data["user_id"], data.get("text"), data.get('img')))
        conn.commit()

        if not curr.lastrowid:
            return {"message": "error", "details": "Internal server error"}
        background_tasks.add_task(detect_fraud, msg=data.get("text", ""), post_id=str(curr.lastrowid))
        return {"message": "OK", "post_id": curr.lastrowid}


@app.get("/post/feed")
async def pfeed(user_id: int, offset: int, tab: int):
    with Connection(SQL_DB_FILE) as conn:
        curr = conn.cursor()

        if tab == 1:
            curr.execute("""SELECT user_id, text, img, username, full_name, fraud_detected
                                FROM posts p INNER JOIN main.user u ON u.id = p.user_id
                                INNER JOIN main.follow_relations fr ON fr.from_user = ? AND u.id = fr.to_user
                                ORDER BY p.created_date LIMIT ?, 10""",
                         (user_id, offset))
        else:
            curr.execute("""SELECT user_id, text, img, username, full_name, fraud_detected
                                FROM posts p INNER JOIN main.user u on u.id = p.user_id AND u.id <> ?
                                ORDER BY p.created_date LIMIT ?, 10""",
                         (user_id, offset))

        result = curr.fetchall()
        if not result:
            return {"message": "OK", "posts": []}

        updated_result = []
        for res in result:
            res = list(res)
            res[5] = bool(res[5])
            updated_result.append(res)
        headers = [i[0] for i in curr.description]
    posts = [dict(zip(headers, obj)) for obj in updated_result]

    return {"message": "OK", "posts": posts}


@app.post("/post/report")
async def preport(data: dict):
    with Connection(SQL_DB_FILE) as conn:
        curr = conn.cursor()

        curr.execute("""INSERT INTO posts_reports(post_id, flagged_by_user, flag_type, details) 
                            VALUES (?, ?, ?, ?)""",
                     (data["post_id"], data["user_id"], data['flag_type'], data.get('details')))
        conn.commit()
        if not curr.lastrowid:
            return {"message": "error", "details": "Internal server error"}
        return {"message": "OK"}


@app.post("/post/link/report")
async def plreport(data: dict):
    with Connection(SQL_DB_FILE) as conn:
        curr = conn.cursor()

        curr.execute("""INSERT INTO flagged_links(post_id, flagged_by_user, flag_type, details, url) 
                            VALUES (?, ?, ?, ?, ?)""",
                     (data["post_id"], data["user_id"], data['flag_type'], data.get('details'),
                      data["url"]))
        conn.commit()
        if not curr.lastrowid:
            return {"message": "error", "details": "Internal server error"}
        return {"message": "OK"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8081)
