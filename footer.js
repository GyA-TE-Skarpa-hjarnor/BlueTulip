const form = document.getElementById('news-tip-form')
const submitButton = form.querySelector('button[type="submit"]')

const inputs = Array.from(form.getElementsByTagName('input')).concat(Array.from(form.getElementsByTagName('textarea')))

form.addEventListener('submit', e => {
    e.preventDefault()
    
    inputs.forEach(i => {
        i.value = null
    })

    submitButton.innerHTML = 'Skickat!'
    submitButton.style.backgroundColor = '#65B741'
    setTimeout(() => {
        submitButton.innerHTML = 'Skicka'
        submitButton.style.backgroundColor = null
    }, 2000)
})