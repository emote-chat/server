// hard-coded user for testing
exports.user = {
    display_name: 'manos',
    email: 'user@gmail.com',
    password: 'gmail'
}

exports.anotherUser = {
    display_name: 'bob',
    first_name: 'Bob',
    last_name: 'Bob',
    email: 'bob@gmail.com',
    password: 'bob'
}

// hard-coded invalid user for testing
exports.invalidUser = {
    email: 'user@yahoo.com',
    password: 'yahoo'
}

exports.chatData = { name: 'my chat' };

exports.messageData = {
    "id": 1,
    "users_id": 1,
    "created": "2019-05-04T00:31:35.880Z",
    "text": "here's a message"
}

exports.reactionData = {
    messages_id: 1,
    users_id: 1,
    emoji: '😄'
}