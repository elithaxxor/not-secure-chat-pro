const io = require('socket.io')(3001); 

const user_name_log = {}; 
const user_avatar_log = {};
const chat_log = {}; 

io.on('connection', socket => {
    console.log(""); 
    socket.emit("god says: ", "Hi, peanut");

    // stores the username and socket id in an object
    socket.on("new-user", ({ name, avatar }) => {
        user_name_log[socket.id] = name; 
        user_avatar_log[socket.id] = avatar;
        socket.broadcast.emit('user-connected', { name, avatar });
        console.log('ID: ', user_name_log[socket.id] , 'user: ' , name); 
    })
    socket.on("chat-message", msgObj => {
        msgObj.sender = user_name_log[socket.id];
        msgObj.avatar = user_avatar_log[socket.id];
        chat_log[msgObj.id] = msgObj;
        // creates an object with the user's name and the message that is depackaged on clients side 
        io.emit('chat-message', msgObj); 
        console.log('ID: ', chat_log[msgObj.id].id , 'MSG:: ' ,msgObj.text); 

    })

    socket.on('edit-message', ({ id, text }) => {
        if (chat_log[id] && user_name_log[socket.id] === chat_log[id].sender) {
            chat_log[id].text = text;
            io.emit('edit-message', { id, text });
        }
    });

    socket.on('delete-message', ({ id }) => {
        if (chat_log[id] && user_name_log[socket.id] === chat_log[id].sender) {
            delete chat_log[id];
            io.emit('delete-message', { id });
        }
    });

    socket.on("user-disconnected", () => {
        socket.broadcast.emit('user-disconnected', { name: user_name_log[socket.id], avatar: user_avatar_log[socket.id] });
        console.log('ID: ', user_name_log[socket.id] , 'user: ' , user_name_log[socket.id]);
        delete user_name_log[socket.id];
        delete user_avatar_log[socket.id];
    })
});