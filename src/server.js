const path = require('path');
const socket = require('socket.io');
const app = require(path.join(__dirname, 'config/app'));

const server = app.listen(app.get('port'), () => {
    const isModeProduction = app.get('mode') === 'production';
    process.stdout.write(`Express started on ${isModeProduction ? 
        'http://emote.ml' : 
        `http://localhost:${app.get('port')}; `}`
    );
    process.stdout.write(`${isModeProduction ? '' : 'press Ctrl-C to terminate'}\n`);
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log(`Connected - ${socket.id}`);
    
    socket.on('joinChat', cid => {
        socket.join(cid);
    });

    socket.on('leaveChat', cid => {
        socket.leave(cid);
    });
    
    socket.on('createMessage', data => {
        socket.broadcast.to(data.chats_id).emit('receiveMessage', data);
    });

    socket.on('addReaction', data => {
        socket.broadcast.to(data.chats_id).emit('receiveReaction', data);
    });

    socket.on('addUserToChat', data => {
        socket.broadcast.to(data.chats_id).emit('receiveAddedUser', data);
    });

    socket.on('removeUserFromChat', data => {
        socket.emit('removedSelf', data);
        socket.broadcast.to(data.chats_id).emit('receiveRemovedUser', data);
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected - ${socket.id}`);
    });
});