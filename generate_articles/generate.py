import os
import shutil
import json
import re
from datetime import datetime as dt
from pathlib import Path
from bs4 import BeautifulSoup
from bs4.formatter import HTMLFormatter
import locale

os.chdir(Path(__file__).parent)
locale.setlocale(locale.LC_ALL, 'se')

with open('articles.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

if not os.path.isdir('output'):
    os.mkdir('output')

def formatDt(date):
    s = date.strftime(r'%A %d %b %Y kl %H:%M')
    for i, match in enumerate(re.finditer(r'(?<=\b)[a-z]', s)):
        if i >= 2: break
        s = s[:match.start()] + s[match.start()].upper() + s[match.start()+1:]
    return s

for article_name, data in articles.items():
    print('Generating ' + article_name)
    with open('template.html', 'r', encoding='utf-8') as f:
        template = f.read()

    if 'time_iso' in data:
        data['time'] = formatDt(dt.fromisoformat(data['time_iso']))
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
        shutil.copyfile(f'images/{cover_src}', folder.joinpath(cover_src))

