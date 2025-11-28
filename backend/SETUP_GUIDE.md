# Complete Backend Setup Guide

## Quick Setup (Automated)

### On Raspberry Pi 5:

1. **Clone the repository:**
   ```bash
   cd ~
   git clone <your-repo-url>
   cd learn-lab/backend
   ```

2. **Run the setup script:**
   ```bash
   sudo python3 setup_backend.py
   ```

3. **Follow the prompts:**
   - Enter database password
   - Enter Raspberry Pi IP (default: 192.168.4.1 for hotspot)
   - Choose to enable WiFi hotspot
   - Enter hotspot SSID and password

4. **Reboot if hotspot was enabled:**
   ```bash
   sudo reboot
   ```

5. **After reboot, start services:**
   ```bash
   sudo systemctl start learnlab-*
   ```

6. **Check status:**
   ```bash
   sudo systemctl status learnlab-gateway
   ```

### On Your Laptop:

1. **Connect to Raspberry Pi hotspot:**
   - SSID: (the one you configured)
   - Password: (the one you set)

2. **Access the web application:**
   - Open browser: `http://192.168.4.1:8080/api/v1/`
   - Or use the IP you configured

## Manual Setup (Alternative)

If you prefer manual setup, follow these steps:

### 1. Install PostgreSQL

```bash
sudo apt update
sudo apt install -y postgresql-15 postgresql-contrib-15
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 2. Create Database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE learnlab;
CREATE USER learnlab_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE learnlab TO learnlab_user;
\c learnlab
GRANT ALL ON SCHEMA public TO learnlab_user;
\q
```

### 3. Configure PostgreSQL

Edit `/etc/postgresql/15/main/postgresql.conf`:
```conf
shared_buffers = 2GB
effective_cache_size = 6GB
max_connections = 100
listen_addresses = '*'
```

Edit `/etc/postgresql/15/main/pg_hba.conf`:
```conf
host    learnlab    learnlab_user    0.0.0.0/0    md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### 4. Setup WiFi Hotspot (Optional)

```bash
sudo apt install -y hostapd dnsmasq
```

Configure hostapd (`/etc/hostapd/hostapd.conf`):
```
interface=wlan0
driver=nl80211
ssid=LearnLab
hw_mode=g
channel=7
wpa=2
wpa_passphrase=your_password
wpa_key_mgmt=WPA-PSK
```

Configure dnsmasq (`/etc/dnsmasq.conf`):
```
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
```

Configure static IP (`/etc/dhcpcd.conf`):
```
interface wlan0
static ip_address=192.168.4.1/24
nohook wpa_supplicant
```

Enable services:
```bash
sudo systemctl enable hostapd
sudo systemctl enable dnsmasq
sudo reboot
```

### 5. Setup Backend

```bash
cd ~/learn-lab/backend

# Install dependencies
make install

# Configure environment
cp .env.example .env
nano .env  # Edit with your database credentials

# Run migrations
source .env
make migrate

# Build services
make build

# Start services
make run
```

## Network Configuration

### Default Configuration:
- **Raspberry Pi IP (Hotspot)**: 192.168.4.1
- **Gateway Port**: 8080
- **API URL**: http://192.168.4.1:8080/api/v1/

### Access from Laptop:

1. Connect laptop to Raspberry Pi hotspot
2. Laptop will get IP: 192.168.4.x (DHCP)
3. Access API: `http://192.168.4.1:8080/api/v1/`

## Service Management

### Start Services:
```bash
sudo systemctl start learnlab-auth-service
sudo systemctl start learnlab-course-service
sudo systemctl start learnlab-ai-service
sudo systemctl start learnlab-executor-service
sudo systemctl start learnlab-progress-service
sudo systemctl start learnlab-gateway
```

Or start all at once:
```bash
sudo systemctl start learnlab-*
```

### Stop Services:
```bash
sudo systemctl stop learnlab-*
```

### Check Status:
```bash
sudo systemctl status learnlab-gateway
```

### View Logs:
```bash
sudo journalctl -u learnlab-gateway -f
```

## Testing the API

### Register a User:
```bash
curl -X POST http://192.168.4.1:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login:
```bash
curl -X POST http://192.168.4.1:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Services won't start:
```bash
# Check logs
sudo journalctl -u learnlab-gateway -n 50

# Check if ports are in use
sudo lsof -i :8080
sudo lsof -i :50051
```

### Database connection issues:
```bash
# Test connection
psql -h localhost -U learnlab_user -d learnlab

# Check PostgreSQL status
sudo systemctl status postgresql
```

### Hotspot not working:
```bash
# Check hostapd status
sudo systemctl status hostapd

# Check dnsmasq status
sudo systemctl status dnsmasq

# Restart services
sudo systemctl restart hostapd
sudo systemctl restart dnsmasq
```

### Firewall blocking:
```bash
# Check firewall status
sudo ufw status

# Allow ports
sudo ufw allow 8080/tcp
sudo ufw allow 5432/tcp
```

## Security Notes

1. **Change default passwords** in production
2. **Use strong JWT secret** (32+ characters)
3. **Enable SSL/TLS** for production
4. **Configure firewall** properly
5. **Regular backups** of database

## Next Steps

1. Configure your frontend to point to: `http://192.168.4.1:8080/api/v1/`
2. Test all API endpoints
3. Set up monitoring and logging
4. Configure automatic backups

