# Quick Start Guide - Learn Lab Backend

## 🚀 One-Command Setup on Raspberry Pi 5

### Step 1: On Raspberry Pi 5

```bash
# Navigate to backend directory
cd ~/learn-lab/backend

# Run the automated setup script
sudo python3 setup_backend.py
```

The script will:
- ✅ Install PostgreSQL and all dependencies
- ✅ Create database and configure it
- ✅ Setup WiFi hotspot (optional)
- ✅ Configure firewall
- ✅ Install Go and build all services
- ✅ Create systemd services for auto-start
- ✅ Generate all necessary configuration files

### Step 2: Follow the Prompts

The script will ask you:
1. **Database password** - Choose a strong password
2. **Raspberry Pi IP** - Default: `192.168.4.1` (for hotspot mode)
3. **Enable WiFi hotspot?** - Type `y` to enable
4. **Hotspot SSID** - Name for your WiFi network (e.g., "LearnLab")
5. **Hotspot password** - Password for WiFi (min 8 characters)

### Step 3: Reboot (if hotspot enabled)

```bash
sudo reboot
```

### Step 4: Start Services

After reboot, start all services:

```bash
sudo systemctl start learnlab-*
```

Check status:
```bash
sudo systemctl status learnlab-gateway
```

## 💻 On Your Laptop

### Step 1: Connect to Raspberry Pi Hotspot

1. Open WiFi settings on your laptop
2. Look for the SSID you configured (e.g., "LearnLab")
3. Connect using the password you set
4. Your laptop will get an IP like `192.168.4.2` or `192.168.4.3`

### Step 2: Access the Web Application

Open your browser and go to:

```
http://192.168.4.1:8080/api/v1/
```

Or test the API:

```bash
# Test if API is running
curl http://192.168.4.1:8080/api/v1/auth/me

# Register a user
curl -X POST http://192.168.4.1:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

## 📱 Frontend Configuration

Update your frontend `.env` or configuration to point to:

```env
NEXT_PUBLIC_API_URL=http://192.168.4.1:8080/api/v1
```

Or if using a different IP:

```env
NEXT_PUBLIC_API_URL=http://<raspberry-pi-ip>:8080/api/v1
```

## 🔧 Service Management

### Start All Services:
```bash
sudo systemctl start learnlab-*
```

### Stop All Services:
```bash
sudo systemctl stop learnlab-*
```

### Restart All Services:
```bash
sudo systemctl restart learnlab-*
```

### Check Service Status:
```bash
sudo systemctl status learnlab-gateway
sudo systemctl status learnlab-auth-service
```

### View Logs:
```bash
# Gateway logs
sudo journalctl -u learnlab-gateway -f

# Auth service logs
sudo journalctl -u learnlab-auth-service -f

# All services logs
sudo journalctl -u learnlab-* -f
```

## 🌐 Network Configuration

### Default Setup:
- **Raspberry Pi IP**: `192.168.4.1`
- **Gateway Port**: `8080`
- **API Base URL**: `http://192.168.4.1:8080/api/v1/`

### If Using Different Network:

If your Raspberry Pi is on a different network (not hotspot), find its IP:

```bash
# On Raspberry Pi
hostname -I
```

Then update your laptop's frontend configuration to use that IP.

## 🧪 Testing the Setup

### 1. Test Database Connection:
```bash
# On Raspberry Pi
psql -h localhost -U learnlab_user -d learnlab
```

### 2. Test API Endpoints:

```bash
# Health check
curl http://192.168.4.1:8080/api/v1/auth/me

# Register
curl -X POST http://192.168.4.1:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'

# Login
curl -X POST http://192.168.4.1:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

## 🐛 Troubleshooting

### Services Not Starting:

```bash
# Check logs
sudo journalctl -u learnlab-gateway -n 50

# Check if ports are available
sudo lsof -i :8080
sudo lsof -i :50051
```

### Can't Connect from Laptop:

1. **Check firewall:**
   ```bash
   sudo ufw status
   sudo ufw allow 8080/tcp
   ```

2. **Check if services are running:**
   ```bash
   sudo systemctl status learnlab-*
   ```

3. **Check Raspberry Pi IP:**
   ```bash
   hostname -I
   ```

4. **Test from Raspberry Pi itself:**
   ```bash
   curl http://localhost:8080/api/v1/auth/me
   ```

### Hotspot Not Working:

```bash
# Check hostapd
sudo systemctl status hostapd

# Restart hotspot services
sudo systemctl restart hostapd
sudo systemctl restart dnsmasq

# Check WiFi interface
iwconfig
```

### Database Connection Issues:

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U learnlab_user -d learnlab

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

## 📝 Manual Setup (Alternative)

If the automated script doesn't work, see `SETUP_GUIDE.md` for manual setup instructions.

## ✅ Verification Checklist

- [ ] PostgreSQL is running
- [ ] Database `learnlab` exists
- [ ] All services are running (`sudo systemctl status learnlab-*`)
- [ ] Gateway is accessible on port 8080
- [ ] Hotspot is working (if enabled)
- [ ] Can connect from laptop
- [ ] API endpoints respond correctly

## 🎉 Success!

Once everything is working:
- Your backend is running on Raspberry Pi
- Accessible from laptop at `http://192.168.4.1:8080/api/v1/`
- Frontend can connect and make API calls
- All services auto-start on boot

