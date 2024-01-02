const today = document.getElementById('today')
const date = new Date()
let formattedDate = date.toLocaleDateString('sv-SE', {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'})
Array.from(formattedDate.matchAll(/(?<=\b)[a-z]/g)).forEach(match => {
    const splitString = formattedDate.split('')
    splitString[match.index] = splitString[match.index].toUpperCase()
    formattedDate = splitString.join('')
})
today.innerHTML = formattedDate
today.datetime = date.toDateString()

const namnsdag = document.getElementById('namnsdag')
const url = 'https://sholiday.faboul.se/dagar/v2.1/'
fetch(url)
    .then(res => res.json())
    .then(json => {
        const namn = json.dagar[0].namnsdag
        console.log(namn)
        namnsdag.innerHTML = `Dagens namn: ${namn.join(', ')}`
    })