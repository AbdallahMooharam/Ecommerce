// src/MessageParser.js
class MessageParser {
  constructor(actionProvider, createClientMessage) {
    this.actionProvider = actionProvider;
    this.createClientMessage = createClientMessage;
  }

  parse = (message) => {
    if (message.toLowerCase().includes("hello")) {
      this.actionProvider.handleDefault();
    } else {
      this.actionProvider.handleDefault();
    }
  };
}

export default MessageParser;
