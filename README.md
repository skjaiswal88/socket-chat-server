# 🗨️ Socket Chat Server (Node.js)

## 🎯 Goal
A simple **TCP chat server** built using **Node.js (standard `net` module)**.  
It allows multiple users to connect, log in, and chat with each other in real time.  
No frameworks, no HTTP, and no databases — just raw sockets.

---

## ⚙️ How to Run the Server

### 🧩 Prerequisites
- **Node.js** (v16 or higher)
- **Telnet client** enabled (Windows users must enable it manually)

### ✅ Enable Telnet on Windows
1. Press **Win + R**, type `optionalfeatures`, and hit Enter.  
2. Scroll down and enable ✅ **Telnet Client**.  
3. Click OK and wait for installation.

---

### ▶️ Run the Server

1. Clone this repository:
   ```bash
   git clone https://github.com/skjaiswal88/socket-chat-server.git
   cd socket-chat-server

2. Start the chat server:
    ```bash
    node server.js

3. You should see:
    ```pgsql
    ✅ Chat server running on port 4000

4. Open two Command Prompt or PowerShell windows:
Terminal 1:
    ```bash
    telnet localhost 4000

Terminal 2:
    ```bash
    telnet localhost 4000


When connected, you’ll see:
    ```pgsql
    Welcome! Please login using: LOGIN <username>

Output from Terminal 1: 
    Welcome! Please login using: LOGIN <username>
    LOGIN Naman
    OK
    INFO Yudi joined
    MSG Hi everyone!
    MSG Naman: Hi everyone!
    MSG Yudi: Hello Naman!

Output from Terminal 2: 
    Welcome! Please login using: LOGIN <username>
    LOGIN Yudi
    OK
    MSG Naman: Hi everyone!
    MSG Hello Naman!
    MSG Yudi: Hello Namana!
    WHO
    INFO Active users:
    USER Naman
    USER Yudi
    INFO Naman disconnected (idle timeout)






Demo Link: https://www.loom.com/share/25c5c70b8e864561aeb4fa5344c1a4ee



