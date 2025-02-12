const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);

// read all filenames from sounds folder and store in sounds array
const fs = require('fs')
const sounds = fs.readdirSync('./public/sounds').map(sound => sound.split('.')[0])

console.log(sounds)

const title = 'Buffer Buzzer'

let data = {
  users: new Set(),
  buzzes: new Set(),
}


const getData = () => ({
  users: [...data.users],
  buzzes: [...data.buzzes],
  sounds
})


app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index', { title, sounds } ))
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())))

io.on('connection', (socket) => {
  socket.on('join', (user) => {
    data.users.add(user.id)
    io.emit('active', [...data.users].length)
    console.log(`${user.name} joined!`)
  })

  socket.on('buzz', (user) => {
    data.buzzes.add({ name: user.name, sound: user.sound })
    io.emit('buzzes', [...data.buzzes])
    console.log(`${user.name} buzzed in!`)
  })

  socket.on('clear', () => {
    data.buzzes = new Set()
    io.emit('buzzes', [...data.buzzes])
    console.log(`Clear buzzes`)
  })
})

server.listen(8090, () => console.log('Listening on 8090'))
