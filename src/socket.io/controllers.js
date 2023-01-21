/* eslint-disable no-unused-vars */
module.exports = (io) => {
	const subscribeChannel = async function (payload) {
		const socket = this; // hence the 'function' above, as an arrow function will not work

	};

	const unsubscribeChannel = async function (payload) {
		const socket = this;
	};

	const sendMessage = async function (payload) {
		const socket = this;
	};

	const editMessage = async function (payload) {
		const socket = this;
	};

	const deleteMessage = async function (payload) {
		const socket = this;
	};

	return {
		subscribeChannel,
		unsubscribeChannel,
		sendMessage,
		editMessage,
		deleteMessage
	};
};
