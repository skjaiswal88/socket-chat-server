// server.js
const net = require('net');

const PORT = process.env.PORT || 4000;
const IDLE_TIMEOUT = 60000; // 60 seconds
const clients = new Map(); // username -> { socket, buffer, lastActive, timeout }

// Helper to send proper CRLF line endings for Telnet
function sendLine(socket, message) {
  socket.write(message + '\r\n');
}

// Broadcast a message to all connected users (except optionally one)
function broadcast(message, exceptSocket = null) {
  for (const { socket } of clients.values()) {
    if (socket !== exceptSocket) {
      sendLine(socket, message);
    }
  }
}

// Clean Telnet negotiation bytes (IAC sequences)
function stripTelnetNegotiation(buf) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(String(buf), 'utf8');
  const out = [];
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];
    if (b === 0xFF) {
      i += 2; // skip IAC command and option bytes
      continue;
    }
    out.push(b);
  }
  return Buffer.from(out).toString('utf8');
}

// Reset the idle timer for a user
function resetIdleTimer(username) {
  const client = clients.get(username);
  if (!client) return;

  clearTimeout(client.timeout);
  client.lastActive = Date.now();

  client.timeout = setTimeout(() => {
    try {
      sendLine(client.socket, 'INFO Disconnected due to inactivity.');
      client.socket.end();
    } catch (e) {}
    clients.delete(username);
    broadcast(`INFO ${username} disconnected (idle timeout)`);
  }, IDLE_TIMEOUT);
}

// TCP Server
const server = net.createServer((socket) => {
  socket.setEncoding('utf8');
  let username = null;
  const clientObj = { socket, buffer: '', lastActive: Date.now(), timeout: null };

  sendLine(socket, 'Welcome! Please login using: LOGIN <username>');

  socket.on('data', (rawData) => {
    const cleanChunk = stripTelnetNegotiation(rawData);

    // Handle backspace characters
    let chunk = cleanChunk;
    if (chunk.includes('\b')) {
      let arr = [];
      for (const ch of chunk) {
        if (ch === '\b') {
          if (arr.length) arr.pop();
        } else {
          arr.push(ch);
        }
      }
      chunk = arr.join('');
    }

    clientObj.buffer += chunk;
    const parts = clientObj.buffer.split('\n');
    clientObj.buffer = parts.pop(); // keep incomplete line

    for (let line of parts) {
      line = line.replace(/\r/g, '').trim();
      if (!line) continue;

      if (username) resetIdleTimer(username);

      // LOGIN
      if (!username && line.toUpperCase().startsWith('LOGIN ')) {
        const requestedName = line.split(' ')[1];
        if (!requestedName) {
          sendLine(socket, 'ERR invalid-username');
          continue;
        }
        if (clients.has(requestedName)) {
          sendLine(socket, 'ERR username-taken');
          continue;
        }

        username = requestedName;
        clients.set(username, clientObj);
        sendLine(socket, 'OK');
        broadcast(`INFO ${username} joined`, socket);
        resetIdleTimer(username);
        continue;
      }

      if (!username) {
        sendLine(socket, 'ERR not-logged-in');
        continue;
      }

      // MSG
      if (line.toUpperCase().startsWith('MSG ')) {
        const text = line.slice(4).trim();
        if (text) {
          broadcast(`MSG ${username}: ${text}`);
        }
        continue;
      }

      // WHO
      if (line.toUpperCase().startsWith('WHO')) {
        sendLine(socket, 'INFO Active users:');
        for (const key of clients.keys()) {
          sendLine(socket, `USER ${key}`);
        }
        continue;
      }

      // DM
      if (line.toUpperCase().startsWith('DM ')) {
        const parts = line.split(' ');
        const target = parts[1];
        const text = parts.slice(2).join(' ').trim();
        if (!target || !text) {
          sendLine(socket, 'ERR invalid-dm-format');
          continue;
        }
        const targetObj = clients.get(target);
        if (targetObj && targetObj.socket) {
          sendLine(targetObj.socket, `DM ${username}: ${text}`);
        } else {
          sendLine(socket, 'ERR user-not-found');
        }
        continue;
      }

      // PING
      if (line.toUpperCase() === 'PING') {
        sendLine(socket, 'PONG');
        continue;
      }

      sendLine(socket, 'ERR unknown-command');
    }
  });

  socket.on('close', () => {
    if (username && clients.has(username)) {
      clearTimeout(clientObj.timeout);
      clients.delete(username);
      broadcast(`INFO ${username} disconnected`);
    }
  });

  socket.on('error', (err) => {
    console.error(`Socket error from ${username || 'unknown'}:`, err.message);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Chat server running on port ${PORT}`);
});
