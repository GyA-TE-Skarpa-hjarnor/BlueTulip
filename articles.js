const locale = 'sv-SE'
const newsitems = document.querySelectorAll('article.newsitem[data-article]')

Array.from(newsitems).forEach(item => {
    const article = item.getAttribute('data-article')
    const url = '/nyhet/' + article
    console.log('Loading article @ ' + url)
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.text()
            }
            console.warn('Invalid response, code ' + res.status)
        })
        .then(text => {
            return new Promise(resolve => {
                const doc = new DOMParser().parseFromString(text, 'text/html')
    
                const titleEl = doc.getElementById('title')
                const title = titleEl?.innerHTML
                const cover = doc.getElementById('cover-image')
                const coverSrc = url + '/' + cover?.getAttribute('src')
                const coverAlt = cover?.getAttribute('alt')
                const paragraph = titleEl?.nextElementSibling?.innerHTML.trim()

                const timeEl = doc.querySelector('time.published-time')
                const date = new Date(timeEl.dateTime)

                resolve({
                    title: title,
                    coverSrc: coverSrc,
                    coverAlt: coverAlt,
                    paragraph: paragraph,
                    date: date
                })
            })
        })
        .then(sourceData => {
            const cover = document.createElement('img')
            cover.src = sourceData.coverSrc
            cover.alt = sourceData.coverAlt
            cover.className = 'newsitem-cover'
            
            const title = document.createElement('h3')
            title.innerHTML = sourceData.title
            title.className = 'newsitem-title'
            
            const paragraph = document.createElement('p')
            paragraph.innerHTML = sourceData.paragraph.substr(0, sourceData.paragraph.search(/(?<=\.)/))
            paragraph.className = 'newsitem-paragraph'
            
            const time = document.createElement('time')
            time.innerHTML = formatDate(sourceData.date)
            time.dateTime = sourceData.date.toLocaleString(locale)
            time.className = 'newsitem-date'
            
            const a = document.createElement('a')
            a.href = url
            a.appendChild(cover)
            a.appendChild(title)
            a.appendChild(paragraph)
            a.appendChild(time)
            item.appendChild(a)
        })
})

String.prototype.capitalize = function() {
    if (this.length == 0) return this
    return this.charAt(0).toUpperCase() + this.substring(1)
}

Number.prototype.padZeros = function(length = 2) {
    return this.toString().padStart(length, '0')
}

function formatDate(date) {
    console.log(date)
    if (date == 'Invalid Date') return 'Invalid Date'
    
    if (date.getFullYear() === new Date().getFullYear()) {
        return `${date.toLocaleDateString(locale, {weekday: 'long'}).capitalize()} ${date.getDate()} ${date.toLocaleDateString(locale, {month: 'short'}).capitalize()} kl ${date.getHours().padZeros()}:${date.getMinutes().padZeros()}`
    } else {
        return `${date.toLocaleDateString(locale, {weekday: 'long'}).capitalize()} ${date.getDate()} ${date.toLocaleDateString(locale, {month: 'short'}).capitalize()} ${date.getFullYear()} kl ${date.getHours().padZeros()}:${date.getMinutes().padZeros()}`
    }
}
