# 🔧 Troubleshooting Guide - Backend Connection Issues

## 🚨 **Error: "Ntibyashoboye kubona imidugudu - Check if backend is running"**

This error means the frontend cannot connect to the backend API. Here's how to fix it:

## 🔍 **Step 1: Check What's Running**

### **Check if MongoDB is running:**
```bash
# On Windows, check if MongoDB service is running
# On Mac/Linux, check if mongod process is running
ps aux | grep mongod
```

### **Check if backend is running:**
```bash
# Look for a process on port 5000
netstat -an | grep 5000
# or
lsof -i :5000
```

### **Check if port 5000 is free:**
```bash
# Try to start backend and see what error you get
cd backend
npm run dev
```

## 🚀 **Step 2: Start Everything in Order**

### **Terminal 1: Start MongoDB**
```bash
mongod
```
**Expected output:** `waiting for connections on port 27017`

### **Terminal 2: Start Backend**
```bash
cd backend
npm install
npm run seed
npm run dev
```
**Expected output:** `Server running on port 5000`

### **Terminal 3: Start Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🧪 **Step 3: Test Backend Connection**

### **Test 1: Simple Backend Test**
```bash
node test_simple.js
```

### **Test 2: Database Connection Test**
```bash
node test_database.js
```

### **Test 3: Backend API Test**
```bash
node test_backend_connection.js
```

## 🌐 **Step 4: Manual API Testing**

### **Test Health Endpoint:**
Open browser and go to: `http://localhost:5000/api/health`

**Expected response:**
```json
{
  "status": "OK",
  "timestamp": "2024-...",
  "mongodb": "Connected"
}
```

### **Test Villages Endpoint:**
Go to: `http://localhost:5000/api/villages`

**Expected response:** Array of villages

### **Test Voters Endpoint:**
Go to: `http://localhost:5000/api/voters`

**Expected response:** Array of voters

## ❌ **Common Issues & Solutions**

### **Issue 1: "MongoDB connection error"**
**Solution:**
```bash
# Start MongoDB first
mongod
```

### **Issue 2: "Port 5000 already in use"**
**Solution:**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9
# or restart your computer
```

### **Issue 3: "Module not found" errors**
**Solution:**
```bash
cd backend
npm install
```

### **Issue 4: "Permission denied"**
**Solution:**
```bash
# On Windows: Run as Administrator
# On Mac/Linux: Use sudo if needed
sudo npm run dev
```

## 🔄 **Step 5: Reset Everything**

If nothing works, try a complete reset:

```bash
# 1. Stop all processes (Ctrl+C)
# 2. Clear MongoDB data
rm -rf /data/db/*  # Be careful with this!

# 3. Restart MongoDB
mongod

# 4. Restart backend
cd backend
npm run seed
npm run dev

# 5. Test connection
node test_simple.js
```

## ✅ **Success Indicators**

When everything is working, you should see:

1. **MongoDB:** `waiting for connections on port 27017`
2. **Backend:** `Server running on port 5000` + `Connected to MongoDB`
3. **Frontend:** No more "Check if backend is running" errors
4. **Admin Panel:** Shows 10 villages in dropdown
5. **Voter Registration:** Works without errors

## 📞 **Still Having Issues?**

If you're still getting errors after following these steps:

1. **Check the exact error message** in browser console
2. **Check backend terminal** for error messages
3. **Check MongoDB terminal** for connection issues
4. **Try a different port** by changing `PORT=5001` in backend/server.js

## 🎯 **Quick Fix Commands**

```bash
# Complete reset and restart
pkill -f "mongod"
pkill -f "node"
mongod &
cd backend && npm run seed && npm run dev &
cd frontend && npm run dev &
```
