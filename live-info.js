const today = document.getElementById('today')
const date = new Date().toLocaleDateString('se')
today.innerHTML = date
today.datetime = date

const namnsdag = document.getElementById('namnsdag')
const url = 'https://sholiday.faboul.se/dagar/v2.1/'
fetch(url)
    .then(res => res.json())
    .then(json => {
        const namn = json.dagar[0].namnsdag
        console.log(namn)
        namnsdag.innerHTML = `Namnsdag: ${namn.join(', ')}`
    })