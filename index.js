
import { WebSocketServer } from 'ws';
import { createServer } from 'https';
import { readFileSync } from 'fs';

const options = {
    key: readFileSync('privkey.pem'),
    cert: readFileSync('cert.pem')
}

const server = createServer(options);

const wss = new WebSocketServer({ server});

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

server.listen(8080)