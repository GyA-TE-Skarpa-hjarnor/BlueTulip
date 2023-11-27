import os
import shutil
import json
import re
from datetime import datetime as dt
from pathlib import Path
from bs4 import BeautifulSoup
from bs4.formatter import HTMLFormatter

with open('generate_articles/articles.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

if not os.path.isdir('output'):
    os.mkdir('output')

for article_name, data in articles.items():
    print('Generating ' + article_name)
    with open('generate_articles/template.html', 'r', encoding='utf-8') as f:
        template = f.read()

    if 'time_iso' in data:
        data['time'] = dt.fromisoformat(data['time_iso']).strftime(r'%d/%m/%Y %H:%M')
    if 'body' in data:
        data['body'] = '\n'.join([f'<p>{text}</p>' for text in data['body']])

    for placeholder in reversed(list(re.finditer(r'\$(\w+)', template))):
        key = placeholder.group(1)
        template = template[:placeholder.start()] + (data[key] if key in data else '') + template[placeholder.end():]
    
    article = BeautifulSoup(template, 'html.parser')
    folder = Path(f'output/{article_name}')
    if not folder.exists():
        os.mkdir(folder)
    with open(folder.joinpath('index.html'), 'w', encoding='utf-8') as f:
        f.write(str(article.prettify(encoding='utf-8', formatter=HTMLFormatter(indent=4)), encoding='utf-8'))
    if 'cover_src' in data:
        cover_src = data['cover_src']
        shutil.copyfile(f'generate_articles/images/{cover_src}', folder.joinpath(cover_src))

