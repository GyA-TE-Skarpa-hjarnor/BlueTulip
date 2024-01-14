const today = document.getElementById('today')
const date = new Date()
let formattedDate = date.toLocaleDateString('sv-SE', {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'})
function toTitleCase(s) {
    const splitString = s.split('')
    Array.from(s.matchAll(/(?<=^|(?<= ))[a-zåäö]/g)).forEach(match => {
        splitString[match.index] = splitString[match.index].toUpperCase()
    })
    return splitString.join('')
}
today.innerHTML = toTitleCase(formattedDate)
today.datetime = date.toDateString()

const namnsdag = document.getElementById('namnsdag')
const url = 'https://sholiday.faboul.se/dagar/v2.1/'
fetch(url)
    .then(res => res.json())
    .then(json => {
        const names = json.dagar[0].namnsdag
        let nameString = names.join(', ')
        if (nameString.length > 12) {
            nameString = names[0]
        }
        namnsdag.innerHTML = `Dagens namn: ${nameString}`
    })
    .catch(() => {
        namnsdag.remove()
    })

Array.from(Array.from(document.getElementsByClassName('forecast-date')).entries()).forEach(([i, element]) => {
    const date = new Date()
    date.setDate(date.getDate() + i)

    const dateNow = new Date().getDate()
    if (date.getDate() == dateNow) {
        element.innerHTML = 'Idag'
    } else if (date.getDate() == dateNow + 1) {
        element.innerHTML = 'Imorgon'
    } else {
        element.innerHTML = toTitleCase(date.toLocaleDateString('sv-SE', {weekday: 'long', day: 'numeric', month: 'short'}).replace('.', ''))
    }
})