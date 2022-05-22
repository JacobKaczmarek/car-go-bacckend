import { Server } from "socket.io";
import { createServer } from 'https';
import { readFileSync } from 'fs';

const options = {
    key: readFileSync('privkey.pem'),
    cert: readFileSync('cert.pem')
}

const https = createServer(options);

const io = new Server(https, {
    cors: { origin: '*' }
});

let queue = []
let users = []

io.on('connection', socket => {
    socket.emit('init', { queue, users });

    socket.on('skip', () => {
        queue.shift()
        io.emit('skip', queue)
    })

    socket.on('register', (name) => {
        users.push({
            name,
            socket: socket.id
        })

        io.emit('users', users)
    })

    socket.on('users', () => {
        socket.emit('users', users)
    })
            
    socket.on('add', (data) => {
        queue.push(data)
        io.emit('update', queue)
    })

    socket.on('disconnect', () => {
        console.log(users)
        console.log(socket.id)
        console.log(users.find(user => user.socket === socket.id))
        users = users.filter(user => user.socket !== socket.id)
        console.log(users)
    
        io.emit('users', users)
    })
})


https.listen(8080)