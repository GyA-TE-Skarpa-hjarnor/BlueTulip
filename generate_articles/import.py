import os
import shutil
import json
import re
from datetime import datetime as dt
from bs4 import BeautifulSoup
from pathlib import Path
os.chdir(Path(__file__).parent)

root = "../nyhet/"

with open('articles.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

for article_name in os.listdir(root):
    print('importing ' + article_name)

    path = Path(root).joinpath(article_name)
    if not path.is_dir(): continue
    index = path.joinpath('index.html')
    with open(index, 'r') as f:
        data = dict()

        document = BeautifulSoup(f.read(), 'html.parser')
        article = document.find('article')
        # Title
        data['title'] = document.title.text
        # Cover
        cover = article.find(id='cover-image')
        cover_src = cover.get('src')
        data['cover_src'] = cover_src
        data['cover_alt'] = cover.get('alt')
        shutil.copyfile(path.joinpath(cover_src), Path('images/').joinpath(cover_src))
        # Author
        data['author'] = article.find('p', class_='author').text
        # Published time
        time = dt.fromisoformat(article.find('time').get('datetime'))
        data['time_iso'] = time.isoformat()
        # Body
        def stringify_p(p):
            return re.sub(r' +', ' ', p.text.strip().replace('\n', ''))
        data['body'] = [stringify_p(p) for p in article.find_all('p')[:-2]]

    articles[article_name] = data

with open('articles.json', 'w', encoding='utf-8') as f:
    json.dump(articles, f, ensure_ascii=False, indent=2)