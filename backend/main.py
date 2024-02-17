from sqlite3 import Connection
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from backend.config import SQL_DB_FILE
from backend.database import init_db


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
        curr.execute("""SELECT id FROM user WHERE email = ? AND password = ?""",
                     (data["email"], data["password"]))
        result = curr.fetchall()
        if not result:
            return {"message": "error", "details": "Incorrect credentials"}
        return {"message": "OK", "user_id": result[0][0]}


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
        return {"message": "OK", "user_id": curr.lastrowid}


@app.post("/user/follow")
async def register(data: dict):
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
async def register(data: dict):
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
        return {"message": "OK", "post_id": curr.lastrowid}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8081)
