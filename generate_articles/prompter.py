import re
from datetime import timedelta, datetime as dt
import json
import random

def keyify(s: str):
    s = re.sub(r'[\s_]+', '-', s.strip().lower())
    s = s.replace('å', 'a').replace('ä', 'a').replace('ö', 'o')
    return re.sub('[^a-z0-9-]', '', s)

def generate_date(start_date: dt = dt.now()-timedelta(days=3*365), end_date: dt = dt.now()-timedelta(days=1)):
    random_days = random.randint(0, (end_date - start_date).days)
    random_date = start_date + timedelta(days = random_days)
    return random_date

while True:
    title = input('\n\nTitle: ')

    key = keyify(title)
    with open('articles.json', 'r') as f:
        articles = json.load(f)
    if key in articles:
        print(f'Key "{key}" is already in use')
        continue

    cover_src = input('Cover src: ')
    cover_alt = input('Cover alt: ')

    published = generate_date()

    authors = ['Carina Johansson', 'Henrik Eklund', 'Adam Svensson', 'Tim Backelund', 'Gunnar Holm', 'Petra Sjöberg', 'Tina Fredriksson']
    author = random.choice(authors)

    i = ''
    body = []
    print('Body: ', end='')
    while True:
        i = input()
        if i == 'x' or i == 'q':
            break
        if i.strip() != '':
            body.append(i.strip())

    article = {
        'title': title,
        'cover_src': cover_src,
        'cover_alt': cover_alt,
        'author': author,
        'time_iso': published.isoformat(),
        'body': body
    }
    articles[key] = article
    with open('articles.json', 'w') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
        print(f'Saved as "{key}"')
