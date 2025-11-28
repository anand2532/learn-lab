# Complete Setup Guide - Learn Lab

This guide will help you set up the entire Learn Lab application (frontend + backend) on Raspberry Pi 5 with your laptop.

## 📋 Overview

- **Frontend**: Next.js application (runs on your laptop)
- **Backend**: Go/gRPC microservices (runs on Raspberry Pi 5)
- **Database**: PostgreSQL (runs on Raspberry Pi 5)
- **Network**: Raspberry Pi creates WiFi hotspot, laptop connects to it

## 🚀 Complete Setup Process

### Step 1: Prepare Repository

```bash
# Clone or navigate to repository
cd ~/learn-lab

# Run complete setup to create all files
cd backend
python3 complete_setup.py
```

This will:
- Create all missing backend directories
- Create Makefile
- Create frontend `.env.local` with API configuration

### Step 2: Setup Backend on Raspberry Pi 5

**On Raspberry Pi 5:**

```bash
# Navigate to backend
cd ~/learn-lab/backend

# Run automated setup
sudo python3 setup_backend.py
```

Follow the prompts:
1. Database password (choose a strong password)
2. Raspberry Pi IP (default: `192.168.4.1`)
3. Enable WiFi hotspot? (type `y`)
4. Hotspot SSID (e.g., "LearnLab")
5. Hotspot password (min 8 characters)

The script will:
- ✅ Install PostgreSQL and configure it
- ✅ Create database and user
- ✅ Setup WiFi hotspot
- ✅ Install Go and build tools
- ✅ Build all backend services
- ✅ Create systemd services
- ✅ Configure firewall

### Step 3: Reboot Raspberry Pi (if hotspot enabled)

```bash
sudo reboot
```

### Step 4: Start Backend Services

**After reboot, on Raspberry Pi:**

```bash
# Start all services
sudo systemctl start learnlab-*

# Check status
sudo systemctl status learnlab-gateway
```

### Step 5: Connect Laptop to Hotspot

**On your laptop:**

1. Open WiFi settings
2. Connect to the hotspot (SSID you configured)
3. Enter the hotspot password
4. Your laptop will get an IP like `192.168.4.2`

### Step 6: Configure Frontend

**On your laptop:**

```bash
# Navigate to project root
cd ~/learn-lab

# Install frontend dependencies (if not done)
npm install

# Check .env.local exists (created by complete_setup.py)
cat .env.local

# Update if needed (if Raspberry Pi IP is different)
nano .env.local
```

The `.env.local` should contain:
```env
NEXT_PUBLIC_API_URL=http://192.168.4.1:8080/api/v1
```

### Step 7: Start Frontend

**On your laptop:**

```bash
# Start Next.js development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🧪 Testing

### Test Backend API

**From laptop (connected to hotspot):**

```bash
# Test API is accessible
curl http://192.168.4.1:8080/api/v1/auth/me

# Register a user
curl -X POST http://192.168.4.1:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://192.168.4.1:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Frontend

1. Open browser: `http://localhost:3000`
2. Frontend should be able to make API calls to backend
3. Check browser console for any errors

## 📁 File Structure

```
learn-lab/
├── app/                    # Next.js frontend
│   ├── layout.tsx
│   ├── page.tsx
│   └── ...
├── components/             # React components
├── lib/                   # Frontend utilities
├── backend/               # Backend services
│   ├── proto/             # Protocol Buffers
│   ├── services/          # Microservices
│   ├── gateway/           # API Gateway
│   ├── migrations/        # Database migrations
│   └── setup_backend.py   # Setup script
├── .env.local             # Frontend environment (created)
├── package.json           # Frontend dependencies
└── next.config.js        # Next.js config
```

## 🔧 Service Management

### Backend Services (on Raspberry Pi)

```bash
# Start all
sudo systemctl start learnlab-*

# Stop all
sudo systemctl stop learnlab-*

# Restart all
sudo systemctl restart learnlab-*

# Check status
sudo systemctl status learnlab-gateway

# View logs
sudo journalctl -u learnlab-gateway -f
```

### Frontend (on Laptop)

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## 🌐 Network Configuration

### Default Setup:
- **Raspberry Pi IP**: `192.168.4.1` (hotspot mode)
- **Gateway Port**: `8080`
- **API URL**: `http://192.168.4.1:8080/api/v1/`
- **Frontend**: `http://localhost:3000` (on laptop)

### If Raspberry Pi is on Different Network:

1. Find Raspberry Pi IP:
   ```bash
   # On Raspberry Pi
   hostname -I
   ```

2. Update frontend `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://<actual-pi-ip>:8080/api/v1
   ```

## 🐛 Troubleshooting

### Backend Not Accessible

1. **Check services are running:**
   ```bash
   sudo systemctl status learnlab-*
   ```

2. **Check firewall:**
   ```bash
   sudo ufw status
   sudo ufw allow 8080/tcp
   ```

3. **Test from Raspberry Pi itself:**
   ```bash
   curl http://localhost:8080/api/v1/auth/me
   ```

### Frontend Can't Connect to Backend

1. **Check `.env.local` exists and has correct IP:**
   ```bash
   cat .env.local
   ```

2. **Verify you're connected to hotspot:**
   ```bash
   # On laptop
   ping 192.168.4.1
   ```

3. **Check CORS settings** (if needed, update backend gateway)

### Hotspot Not Working

```bash
# Check services
sudo systemctl status hostapd
sudo systemctl status dnsmasq

# Restart
sudo systemctl restart hostapd
sudo systemctl restart dnsmasq
```

## ✅ Verification Checklist

- [ ] Backend services running on Raspberry Pi
- [ ] Database created and accessible
- [ ] Hotspot working (if enabled)
- [ ] Laptop connected to hotspot
- [ ] Frontend `.env.local` configured correctly
- [ ] API accessible from laptop (`curl http://192.168.4.1:8080/api/v1/auth/me`)
- [ ] Frontend running on laptop (`npm run dev`)
- [ ] Frontend can make API calls (check browser console)

## 🎉 Success!

Once everything is working:
- Backend runs on Raspberry Pi 5
- Frontend runs on your laptop
- They communicate via WiFi hotspot
- Web application is fully functional!

## 📝 Next Steps

1. Implement API client in frontend (`lib/api.ts`)
2. Create authentication hooks
3. Build UI components
4. Connect frontend to backend APIs
5. Test all features end-to-end

