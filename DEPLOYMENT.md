# Deployment Guide - Learn Lab

## 🚀 Quick Deployment on Raspberry Pi 5

### Step 1: Pull Repository on Raspberry Pi

```bash
cd ~
git clone <your-repo-url> learn-lab
cd learn-lab/backend
```

### Step 2: Run Automated Setup

```bash
sudo python3 setup_backend.py
```

Follow the prompts:
- Database password
- Raspberry Pi IP (default: 192.168.4.1)
- Enable WiFi hotspot? (y/n)
- Hotspot SSID and password

### Step 3: Reboot (if hotspot enabled)

```bash
sudo reboot
```

### Step 4: Start Services

```bash
sudo systemctl start learnlab-*
sudo systemctl status learnlab-gateway
```

### Step 5: Connect Laptop and Start Frontend

**On laptop:**
1. Connect to Raspberry Pi hotspot
2. Navigate to project: `cd ~/learn-lab`
3. Install dependencies: `npm install`
4. Configure `.env.local` with Raspberry Pi IP
5. Start frontend: `npm run dev`

## 📋 Pre-Deployment Checklist

- [ ] Repository cloned on Raspberry Pi
- [ ] Python 3 installed on Raspberry Pi
- [ ] Network connectivity confirmed
- [ ] Sufficient disk space (2GB+ recommended)
- [ ] Raspberry Pi 5 with 8GB RAM recommended

## 🔧 Post-Deployment

### Verify Services

```bash
# Check all services are running
sudo systemctl status learnlab-*

# Test API
curl http://localhost:8080/api/v1/auth/me
```

### Access Points

- **Backend API**: `http://<raspberry-pi-ip>:8080/api/v1/`
- **Frontend**: `http://localhost:3000` (on laptop)

## 📝 Notes

- All services auto-start on boot via systemd
- Logs available via: `sudo journalctl -u learnlab-*`
- Database backups recommended (see backend/SETUP_GUIDE.md)

