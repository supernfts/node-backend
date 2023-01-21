const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const http = require("http");
const createSocket = require("./socket.io");
let server = http.createServer(app);

async function connect(){
	await mongoose.connect(config.mongoose.url, config.mongoose.options);
	logger.info("Connected to MongoDB");
	server.listen(config.port, () => {
		logger.info(`Listening to port ${config.port}`);
	});
	await createSocket(server);
}

connect().then(
	()=>logger.info("connection established")
).catch((err)=>console.log(err));

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	logger.info("SIGTERM received");
	if (server) {
		server.close();
	}
});
