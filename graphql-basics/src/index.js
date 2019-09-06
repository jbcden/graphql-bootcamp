import myCurrentLocation, { message, name, getGreeting } from './myModule'
import myAdd, { subtract } from './math'

console.log(message, myCurrentLocation)
console.log(getGreeting(name))

console.log(myAdd(1, 99))
console.log(subtract(101, 1))