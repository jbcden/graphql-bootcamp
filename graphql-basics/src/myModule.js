const message = 'Some message from myModule.js'

const name = 'Jacob'

const location = 'Yokohama'

const getGreeting = (name) => {
    return `Welcome to the course ${name}`
}

export { message, name, getGreeting, location as default }