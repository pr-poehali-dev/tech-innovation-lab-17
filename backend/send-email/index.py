import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта на почту владельца агентства"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    message = body.get('message', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и телефон обязательны'})
        }

    api_key = os.environ.get('RESEND_API_KEY', '')

    email_data = {
        'from': 'Сайт агентства <onboarding@resend.dev>',
        'to': ['matvei.suhorukov@gmail.com'],
        'subject': f'Новая заявка с сайта — {name}',
        'html': f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #f97316; padding-bottom: 12px;">
                Новая заявка с сайта
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; color: #666; width: 120px;">Имя:</td>
                    <td style="padding: 10px 0; font-weight: bold; color: #1a1a1a;">{name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: #666;">Телефон:</td>
                    <td style="padding: 10px 0; font-weight: bold; color: #1a1a1a;">
                        <a href="tel:{phone}" style="color: #f97316;">{phone}</a>
                    </td>
                </tr>
                {"<tr><td style='padding: 10px 0; color: #666; vertical-align: top;'>Сообщение:</td><td style='padding: 10px 0; color: #1a1a1a;'>" + message + "</td></tr>" if message else ""}
            </table>
            <p style="margin-top: 24px; color: #999; font-size: 13px;">
                Заявка отправлена с сайта дизайн-агентства
            </p>
        </div>
        """
    }

    req = urllib.request.Request(
        'https://api.resend.com/emails',
        data=json.dumps(email_data).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        method='POST'
    )

    try:
        with urllib.request.urlopen(req) as response:
            return {
                'statusCode': 200,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Ошибка отправки', 'detail': error_body})
        }
