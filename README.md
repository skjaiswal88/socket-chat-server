# 🗨️ Simple Socket Chat Server (Node.js)

A simple **TCP-based chat server** built using only Node.js’s standard library (`net` module).  
It supports multiple clients chatting in real-time via Telnet or Netcat — no frameworks, no databases.

---

## 🚀 Features

✅ Multi-user TCP chat server  
✅ Real-time message broadcasting  
✅ User login with unique usernames  
✅ Clean message format → `MSG <username>: <text>`  
✅ WHO command → lists active users    
✅ Idle timeout → auto-disconnect inactive users (60s)    
✅ Compatible with **Telnet on Windows**  

---

## ⚙️ Setup & Run Instructions

### 1️⃣ Prerequisites
- Node.js installed (v16+)
- Telnet enabled (on Windows):
  1. Press **Win + R** → type `optionalfeatures`
  2. Enable ✅ **Telnet Client**
  3. Click **OK**

### 2️⃣ Clone and Run
```bash
git clone https://github.com/<your-username>/socket-chat-server.git
cd socket-chat-server
node server.js
