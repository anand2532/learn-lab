# Raspberry Pi 5 Setup - Quick Reference

## 🚀 Quick Start on Raspberry Pi

```bash
# 1. Clone repository
cd ~
git clone git@github.com:anand2532/learn-lab.git
cd learn-lab/backend

# 2. Run automated setup
sudo python3 setup_backend.py

# 3. Follow prompts:
#    - Database password
#    - Raspberry Pi IP (default: 192.168.4.1)
#    - Enable hotspot? (y/n)
#    - Hotspot SSID and password

# 4. Reboot (if hotspot enabled)
sudo reboot

# 5. After reboot, start services
sudo systemctl start learnlab-*

# 6. Verify
sudo systemctl status learnlab-gateway
curl http://localhost:8080/api/v1/auth/me
```

## 📋 Prerequisites

- Raspberry Pi 5 with Raspberry Pi OS (64-bit) Trixie or Bookworm
- Internet connection (for initial setup)
- At least 2GB free disk space
- 8GB RAM recommended

## 🔧 Service Management

```bash
# Start all services
sudo systemctl start learnlab-*

# Stop all services
sudo systemctl stop learnlab-*

# Restart all services
sudo systemctl restart learnlab-*

# Check status
sudo systemctl status learnlab-gateway

# View logs
sudo journalctl -u learnlab-gateway -f
```

## 🌐 Network Access

- **Backend API**: `http://192.168.4.1:8080/api/v1/` (hotspot mode)
- **From laptop**: Connect to hotspot, then access API at above URL

## 📚 Documentation

- `backend/QUICK_START.md` - Detailed quick start
- `backend/SETUP_GUIDE.md` - Manual setup guide
- `DEPLOYMENT.md` - Full deployment guide
- `SETUP_INSTRUCTIONS.md` - Step-by-step instructions

## ✅ Verification Checklist

After setup, verify:
- [ ] PostgreSQL is running: `sudo systemctl status postgresql`
- [ ] Database exists: `psql -U learnlab_user -d learnlab`
- [ ] All services running: `sudo systemctl status learnlab-*`
- [ ] API accessible: `curl http://localhost:8080/api/v1/auth/me`
- [ ] Hotspot working (if enabled): Check WiFi networks

## 🐛 Troubleshooting

### Services won't start
```bash
# Check logs
sudo journalctl -u learnlab-gateway -n 50

# Rebuild if needed
cd ~/learn-lab/backend
make build
```

### Can't connect from laptop
```bash
# Check firewall
sudo ufw status
sudo ufw allow 8080/tcp

# Check services
sudo systemctl status learnlab-gateway
```

### Hotspot not working
```bash
# Restart hotspot services
sudo systemctl restart hostapd
sudo systemctl restart dnsmasq
```

## 🎉 Ready!

Once verified, your backend is ready. Connect your laptop to the hotspot and start the frontend!

