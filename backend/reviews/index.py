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

def handler(event: dict, context) -> dict:
    """Получение и добавление отзывов"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod')
    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == 'GET':
            cur.execute("""
                SELECT r.id, u.name, r.text, r.rating, r.created_at
                FROM reviews r
                JOIN users u ON u.id = r.user_id
                WHERE r.approved = TRUE
                ORDER BY r.created_at DESC
            """)
            rows = cur.fetchall()
            reviews = [
                {'id': r[0], 'name': r[1], 'text': r[2], 'rating': r[3], 'created_at': str(r[4])}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'reviews': reviews})}

        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            text = body.get('text', '').strip()
            rating = body.get('rating', 5)

            if not user_id or not text:
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполните все поля'})}

            cur.execute(
                "INSERT INTO reviews (user_id, text, rating) VALUES (%s, %s, %s) RETURNING id",
                (user_id, text, rating)
            )
            conn.commit()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'success': True, 'message': 'Отзыв отправлен на модерацию'})}

        return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}

    finally:
        cur.close()
        conn.close()
