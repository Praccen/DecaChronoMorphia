import { createServer } from "http";
import { Server } from "socket.io";
import * as path from "path";
import express from "express";

let _connections = new Map<string, number>();

const app = express();
app.set("port", process.env.PORT || 3000);
const http = createServer(app);
const io = new Server(http, { /* options */ });

app.get("/", (req: any, res: any) => {
	res.sendFile(path.resolve("./src/Engine/Networking/index.html"));
});

io.on('connection', (socket) => {
	console.log('a user connected');
	_connections.set(socket.id, 1)
	io.emit('new connection', _connections.size)
	socket.on('disconnect', () => {
		_connections.delete(socket.id)
		console.log('user disconnected');
	});

	socket.on('create server', (msg) => {
		console.log('Server: ' + msg);
		let newServer = msg + " players 1 / 5"
		io.emit('new server', newServer);
	});
});

const server = http.listen(3000, function () {
	console.log("listening on *:3000");
});
