import json
import os
import hashlib
import secrets
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_token(user_id: int) -> str:
    return hashlib.sha256(f"{user_id}{secrets.token_hex(16)}".encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """Регистрация и вход пользователей"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body', '{}'))
    action = body.get('action')

    conn = get_conn()
    cur = conn.cursor()

    try:
        if action == 'register':
            name = body.get('name', '').strip()
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')

            if not name or not email or not password:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}

            if len(password) < 6:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Email уже зарегистрирован'})}

            pwd_hash = hash_password(password)
            cur.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
                (name, email, pwd_hash)
            )
            user_id = cur.fetchone()[0]
            token = make_token(user_id)
            cur.execute("UPDATE users SET password_hash = %s WHERE id = %s", (pwd_hash, user_id))
            conn.commit()

            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'token': token, 'user': {'id': user_id, 'name': name, 'email': email}})
            }

        elif action == 'login':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')

            cur.execute("SELECT id, name, email FROM users WHERE email = %s AND password_hash = %s",
                        (email, hash_password(password)))
            user = cur.fetchone()
            if not user:
                return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный email или пароль'})}

            token = make_token(user[0])
            return {
                'statusCode': 200,
                'headers': CORS,
                'body': json.dumps({'token': token, 'user': {'id': user[0], 'name': user[1], 'email': user[2]}})
            }

        else:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неизвестное действие'})}

    finally:
        cur.close()
        conn.close()
