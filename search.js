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
            'content',
            'author',
        ],
        findAllMatches: true,
        threshold: 0.5,
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

// Disable scroll when hovering over results
searchResults.addEventListener('mouseenter', disableScroll)
searchResults.addEventListener('mouseleave', enableScroll)

// Code from https://stackoverflow.com/a/4770179
// left: 37, up: 38, right: 39, down: 40,
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}