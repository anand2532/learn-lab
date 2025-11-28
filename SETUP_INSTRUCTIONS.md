# Learn Lab - Complete Setup Instructions

## 🎯 Quick Start

### For First-Time Setup:

1. **Run complete setup script:**
   ```bash
   cd backend
   python3 complete_setup.py
   ```

2. **On Raspberry Pi, run backend setup:**
   ```bash
   cd ~/learn-lab/backend
   sudo python3 setup_backend.py
   ```

3. **On laptop, start frontend:**
   ```bash
   cd ~/learn-lab
   npm install
   npm run dev
   ```

## 📋 Detailed Steps

### Part 1: Initial Repository Setup

**On your development machine (laptop):**

```bash
# Navigate to project
cd ~/learn-lab/backend

# Run complete setup to create all files
python3 complete_setup.py
```

This creates:
- All backend directory structure
- Makefile
- Frontend `.env.local` file

### Part 2: Backend Setup (Raspberry Pi 5)

**On Raspberry Pi 5:**

1. **Clone/transfer repository:**
   ```bash
   cd ~
   git clone <your-repo> learn-lab
   # OR transfer files via USB/network
   ```

2. **Run backend setup:**
   ```bash
   cd ~/learn-lab/backend
   sudo python3 setup_backend.py
   ```

3. **Follow prompts:**
   - Database password
   - Raspberry Pi IP (default: 192.168.4.1)
   - Enable hotspot? (y/n)
   - Hotspot SSID and password

4. **Reboot (if hotspot enabled):**
   ```bash
   sudo reboot
   ```

5. **Start services:**
   ```bash
   sudo systemctl start learnlab-*
   sudo systemctl status learnlab-gateway
   ```

### Part 3: Frontend Setup (Laptop)

**On your laptop:**

1. **Connect to Raspberry Pi hotspot:**
   - SSID: (the one you configured)
   - Password: (the one you set)

2. **Configure frontend:**
   ```bash
   cd ~/learn-lab
   
   # Check .env.local exists
   cat .env.local
   
   # Update if Raspberry Pi IP is different
   nano .env.local
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access application:**
   - Open browser: `http://localhost:3000`
   - Frontend will connect to backend at configured IP

## 🔍 Verification

### Check Backend is Running:

**On Raspberry Pi:**
```bash
# Check services
sudo systemctl status learnlab-gateway

# Test API
curl http://localhost:8080/api/v1/auth/me
```

**From laptop (connected to hotspot):**
```bash
# Test API accessibility
curl http://192.168.4.1:8080/api/v1/auth/me

# Register test user
curl -X POST http://192.168.4.1:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'
```

### Check Frontend:

1. Open `http://localhost:3000` in browser
2. Check browser console (F12) for errors
3. Try making an API call from frontend

## 🐛 Common Issues

### Backend files missing?

Run:
```bash
cd backend
python3 complete_setup.py
```

### Frontend can't connect to backend?

1. Check `.env.local` has correct IP:
   ```bash
   cat .env.local
   ```

2. Verify you're connected to hotspot:
   ```bash
   ping 192.168.4.1
   ```

3. Check backend is running:
   ```bash
   # On Raspberry Pi
   sudo systemctl status learnlab-gateway
   ```

### Services won't start?

```bash
# Check logs
sudo journalctl -u learnlab-gateway -n 50

# Rebuild services
cd ~/learn-lab/backend
make build
```

## 📚 File Locations

- **Backend**: `~/learn-lab/backend/`
- **Frontend**: `~/learn-lab/`
- **Backend config**: `~/learn-lab/backend/.env`
- **Frontend config**: `~/learn-lab/.env.local`
- **Service logs**: `sudo journalctl -u learnlab-*`

## ✅ Success Checklist

- [ ] Backend services running on Raspberry Pi
- [ ] Database created and accessible
- [ ] Hotspot working (if enabled)
- [ ] Laptop connected to hotspot
- [ ] Frontend `.env.local` configured
- [ ] API accessible from laptop
- [ ] Frontend running on laptop
- [ ] Frontend can make API calls

## 🎉 You're Ready!

Once all checks pass, your Learn Lab application is fully set up and ready to use!

