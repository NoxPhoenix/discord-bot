const line = 'welcome hello my name is frank.';

const splitUp = line.split(/(welcome)\s?(?:message)?/gi).slice(2);
const args = splitUp.shift().split(/ +/g).slice(1);

console.log(args);
console.log(...args);

