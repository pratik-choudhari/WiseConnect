import sqlite3
from sqlite3 import Error

from backend.config import SQL_DB_FILE


def init_db():
    """ create a database connection to a SQLite database """
    conn = sqlite3.connect(SQL_DB_FILE)

    sql_create_users_table = """ CREATE TABLE IF NOT EXISTS user (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            username text NOT NULL,
                                            full_name text,
                                            email text,
                                            password text,
                                            created_date date default CURRENT_TIMESTAMP
                                        ); """
    try:
        c = conn.cursor()
        c.execute(sql_create_users_table)
        conn.commit()
    except Error as e:
        print(e)

    conn.close()
