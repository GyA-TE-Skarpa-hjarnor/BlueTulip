const searchBar = document.getElementById('search-bar')
const searchResults = document.getElementById('search-results')
searchResults.ariaHidden = 'true'

fetch('/generate_articles/articles.json')
.then(res => res.json())
.then(json => {
        const list = []
        Object.entries(json).map(e => {
            const [k, v] = e
            list.push({
                "key": k,
                "title": v.title,
                "author": v.author,
                "content": v.body.join(' '),
                "cover_src": v.cover_src,
                "cover_alt": v.cover_alt,
            })
        })
        registerFuse(list)
    })

function registerFuse(list) {
    const fuse = new Fuse(list, {
        keys: [
            'title',
            'author',
            'content',
        ]
    })

    searchBar?.addEventListener('keydown', e => {
        if (e.key == 'Enter') {
            goToSearch()
            return
        }
    })
    searchBar?.addEventListener('input', e => {
        search(fuse)
    })
    searchBar?.addEventListener('click', e => {
        search(fuse)
    })
    document.body.addEventListener('click', e => {
        if (e.target != searchBar) {
            hideSearchResults()
        }
    })
}

function renderResults(results) {
    searchResults.innerHTML = ''
    searchResults.ariaHidden = (results.length == 0).toString()
    results.forEach(article => {
        const container = document.createElement('li')
        container.className = 'result-item'

        const a = document.createElement('a')
        a.href = '/nyhet/' + article.item.key

        const cover = document.createElement('img')
        cover.className = 'result-cover'
        cover.src = '/nyhet/' + article.item.key + '/' + article.item.cover_src
        cover.alt = article.item.cover_alt

        const title = document.createElement('span')
        title.className = 'result-title'
        title.innerHTML = article.item.title

        container.appendChild(a)
        a.appendChild(cover)
        a.appendChild(title)
        searchResults?.appendChild(container)
    })
}

function search(fuse) {
    let query = searchBar.value
    const results = fuse.search(query)
    const maxResults = 5
    renderResults(results.slice(0, maxResults))
}

function goToSearch() {
    const href = searchResults?.querySelector('a').href
    window.location.href = href
}

function hideSearchResults() {
    searchResults.ariaHidden = 'true'
    searchResults.innerHTML = ''
}