import sqlite3
import json
import os
import time

DB_PATH = os.environ.get('REMEMBERENCE_DB_PATH') or os.path.join(os.path.dirname(__file__), 'rememberence.db')


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    if not os.path.exists(DB_PATH):
        conn = get_conn()
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE characters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                data TEXT,
                created_at INTEGER
            )
        ''')
        conn.commit()
        conn.close()


def create_character(name, data):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('INSERT INTO characters (name, data, created_at) VALUES (?, ?, ?)',
                (name, json.dumps(data), int(time.time())))
    conn.commit()
    cid = cur.lastrowid
    conn.close()
    return cid


def get_character(cid):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM characters WHERE id = ?', (cid,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return None
    return {
        'id': row['id'],
        'name': row['name'],
        'data': json.loads(row['data']) if row['data'] else {},
        'created_at': row['created_at']
    }


def list_characters():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('SELECT * FROM characters ORDER BY created_at DESC')
    rows = cur.fetchall()
    conn.close()
    out = []
    for r in rows:
        out.append({'id': r['id'], 'name': r['name'], 'created_at': r['created_at']})
    return out


def delete_character(cid):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('DELETE FROM characters WHERE id = ?', (cid,))
    conn.commit()
    changes = cur.rowcount
    conn.close()
    return changes > 0
