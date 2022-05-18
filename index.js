
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080});

let queue = []

wss.on('connection', ws => {
    ws.send(JSON.stringify(queue));

    ws.on('message', data => {
        if (data.toString() === 'skip') {
            queue.shift()
        } else {
            queue.push(JSON.parse(data.toString()))
        }

        wss.clients.forEach(c => c.send(JSON.stringify(queue)))
    })
})