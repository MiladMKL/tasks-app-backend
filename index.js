const http = require('http');

let tasks = [
  {
    id: 1,
    name: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    completed: false
  },
  {
    id: 2,
    name: "CSS is easy",
    date: "2022-05-30T18:39:34.091Z",
    completed: false
  },
  {
    id: 3,
    name: "Javascript is difficult",
    date: "2022-05-30T19:20:14.298Z",
    completed: false
  },
]

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(tasks));
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running at http://localhost:${PORT}/`)