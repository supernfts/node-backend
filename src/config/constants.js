module.exports = Object.freeze({
	SOCKET_EVENTS : {
		CONNECT : "connection",
		DISCONNECT : "disconnect",

		SUBSCRIBE_TO_CHANNEL : "subscribe-to-channel",
		UNSUBSCRIBE_TO_CHANNEL : "unsubscribe-to-channel",
		SEND_MESSAGE : "send-message",
		GET_MESSAGE : "get-message",
		EDIT_MESSAGE : "edit-message",
		DELETE_MESSAGE: "delete-message"
	}
});
