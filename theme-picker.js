const defaultTheme = 'light'
var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") || defaultTheme
setTheme(storedTheme)

window.addEventListener('load', () => {
    const btn = document.getElementById('toggle-theme')
    btn.addEventListener('click', () => {
        const currentTheme = getTheme()
        if (currentTheme == 'dark') {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    
    })
})

function getTheme() {
    return document.documentElement.getAttribute('data-theme')
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
}
