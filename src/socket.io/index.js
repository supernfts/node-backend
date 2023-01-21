const { Server }=require("socket.io");
const { setupWorker }=require("@socket.io/sticky");
const { createAdapter }=require("@socket.io/redis-adapter");
const { createClient }=require("redis");
const { instrument } = require("@socket.io/admin-ui");

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
const auth = require("../middlewares/auth");
const {SOCKET_EVENTS} = require("../config/constants");

module.exports = async (httpServer) => {
	const io = new Server(httpServer);
	const controllers = require("./controllers")(io);

	const pubClient = createClient({ url: "redis://localhost:6379" });
	await pubClient.connect();

	const subClient = pubClient.duplicate();
	io.adapter(createAdapter(pubClient, subClient));
	setupWorker(io);

	instrument(io, {
		namespaceName: "/message",
		auth: false,
	});

	io.of("/message").use(wrap(auth()));
	io.of("/message").on(SOCKET_EVENTS.CONNECT,
		(socket)=> {
			socket.on(SOCKET_EVENTS.SUBSCRIBE_TO_CHANNEL, controllers.subscribeChannel);
			socket.on(SOCKET_EVENTS.UNSUBSCRIBE_TO_CHANNEL,controllers.unsubscribeChannel);
			socket.on(SOCKET_EVENTS.SEND_MESSAGE,controllers.sendMessage);
			socket.on(SOCKET_EVENTS.EDIT_MESSAGE,controllers.editMessage);
			socket.on(SOCKET_EVENTS.DELETE_MESSAGE,controllers.deleteMessage);
		}
	);

};


