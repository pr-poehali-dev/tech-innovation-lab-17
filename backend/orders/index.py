import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

STATUS_LABELS = {
    'new': 'Новая',
    'in_progress': 'В работе',
    'done': 'Завершена',
}

def handler(event: dict, context) -> dict:
    """Заявки пользователя (история заказов)"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod')
    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            user_id = params.get('user_id')
            if not user_id:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'user_id обязателен'})}

            cur.execute("""
                SELECT id, title, description, status, created_at
                FROM orders WHERE user_id = %s ORDER BY created_at DESC
            """, (user_id,))
            rows = cur.fetchall()
            orders = [
                {
                    'id': r[0], 'title': r[1], 'description': r[2],
                    'status': r[3], 'status_label': STATUS_LABELS.get(r[3], r[3]),
                    'created_at': str(r[4])
                }
                for r in rows
            ]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'orders': orders})}

        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            title = body.get('title', '').strip()
            description = body.get('description', '').strip()

            if not user_id or not title:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}

            cur.execute(
                "INSERT INTO orders (user_id, title, description) VALUES (%s, %s, %s) RETURNING id",
                (user_id, title, description)
            )
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True})}

        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}

    finally:
        cur.close()
        conn.close()
