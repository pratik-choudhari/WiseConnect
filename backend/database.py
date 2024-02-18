import sqlite3
from sqlite3 import Error

from backend.config import SQL_DB_FILE


def init_db():
    """ create a database connection to a SQLite database """
    conn = sqlite3.connect(SQL_DB_FILE)
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.commit()

    sql_create_users_table = """ CREATE TABLE IF NOT EXISTS user (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                username text NOT NULL,
                                full_name text NOT NULL,
                                email text NOT NULL,
                                password text NOT NULL,
                                birth_date date NOT NULL,
                                created_date date default CURRENT_TIMESTAMP
                            ); """

    follow_relations_table = """ CREATE TABLE IF NOT EXISTS follow_relations (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                from_user INTEGER,
                                to_user INTEGER,
                                FOREIGN KEY(from_user) REFERENCES user(id),
                                FOREIGN KEY(to_user) REFERENCES user(id)
                            ); """

    posts_table = """ CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    text text,
                    img text,
                    likes INTEGER DEFAULT 0,
                    comments INTEGER DEFAULT 0,
                    created_date date DEFAULT CURRENT_TIMESTAMP,
                    fraud_detected BOOLEAN,
                    fraud_type TINYINT,
                    FOREIGN KEY(user_id) REFERENCES user(id)
                ); """

    reports_table = """ CREATE TABLE IF NOT EXISTS posts_reports (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        post_id INTEGER,
                        flagged_by_user INTEGER,
                        flag_type TINYINT,
                        details TEXT,
                        FOREIGN KEY(post_id) REFERENCES posts(id),
                        FOREIGN KEY(flagged_by_user) REFERENCES user(id)
                    ); """

    links_table = """ CREATE TABLE IF NOT EXISTS flagged_links (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            post_id INTEGER,
                            flagged_by_user INTEGER,
                            flag_type TINYINT,
                            details TEXT,
                            url TEXT,
                            FOREIGN KEY(post_id) REFERENCES posts(id),
                            FOREIGN KEY(flagged_by_user) REFERENCES user(id)
                        ); """


    try:
        c = conn.cursor()
        c.execute(sql_create_users_table)
        c.execute(posts_table)
        c.execute(follow_relations_table)
        c.execute(reports_table)
        c.execute(links_table)
        conn.commit()
    except Error as e:
        print(e)

    conn.close()
