import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat endpoint using Qwen
    Args: event with httpMethod, body containing user message
    Returns: Bot response from Qwen
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
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
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        user_message: str = body_data.get('message', '')
        
        if not user_message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Message is required'})
            }
        
        import requests
        
        qwen_response = requests.post(
            'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-40da65daac2f489a9bb52e4a60949ee7'
            },
            json={
                'model': 'qwen-plus',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'Ты дружелюбный AI чат-бот. Отвечай коротко и по делу, используй эмодзи. Будь полезным и позитивным.'
                    },
                    {
                        'role': 'user',
                        'content': user_message
                    }
                ]
            },
            timeout=30
        )
        
        if qwen_response.status_code != 200:
            bot_response = f'⚠️ Ошибка API: {qwen_response.status_code}'
        else:
            qwen_data = qwen_response.json()
            
            if 'output' in qwen_data and 'text' in qwen_data['output']:
                bot_response = qwen_data['output']['text']
            elif 'choices' in qwen_data and len(qwen_data['choices']) > 0:
                bot_response = qwen_data['choices'][0]['message']['content']
            else:
                bot_response = f'🤔 Необычный ответ: {json.dumps(qwen_data)[:100]}'
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'response': bot_response})
        }
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Server error: {str(e)}', 'details': error_details})
        }