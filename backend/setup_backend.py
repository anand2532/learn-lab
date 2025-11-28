#!/usr/bin/env python3
"""
Learn Lab Backend Setup Script
Automates complete backend setup on Raspberry Pi 5
"""

import os
import sys
import subprocess
import json
import getpass
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_step(msg):
    print(f"\n{Colors.BOLD}{Colors.BLUE}▶ {msg}{Colors.RESET}")

def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.RESET}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"{Colors.RED}✗ {msg}{Colors.RESET}")

def run_command(cmd, check=True, shell=False):
    """Run a shell command"""
    if isinstance(cmd, str):
        cmd = cmd.split()
    try:
        result = subprocess.run(cmd, check=check, shell=shell, 
                              capture_output=True, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print_error(f"Command failed: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
        print_error(f"Error: {e.stderr}")
        if check:
            sys.exit(1)
        return None

def check_root():
    """Check if running as root"""
    if os.geteuid() != 0:
        print_error("This script needs to be run with sudo")
        print("Please run: sudo python3 setup_backend.py")
        sys.exit(1)

def detect_os():
    """Detect if running on Raspberry Pi"""
    try:
        with open('/proc/cpuinfo', 'r') as f:
            if 'Raspberry Pi' in f.read():
                return True
    except:
        pass
    return False

def get_config():
    """Get configuration from user"""
    config = {}
    
    print(f"\n{Colors.BOLD}{Colors.BLUE}=== Learn Lab Backend Setup ==={Colors.RESET}\n")
    
    # Database configuration
    print(f"{Colors.YELLOW}Database Configuration:{Colors.RESET}")
    config['db_name'] = input("Database name [learnlab]: ").strip() or "learnlab"
    config['db_user'] = input("Database user [learnlab_user]: ").strip() or "learnlab_user"
    config['db_password'] = getpass.getpass("Database password: ").strip()
    if not config['db_password']:
        print_error("Database password is required")
        sys.exit(1)
    
    # Network configuration
    print(f"\n{Colors.YELLOW}Network Configuration:{Colors.RESET}")
    config['pi_ip'] = input("Raspberry Pi IP address [192.168.4.1]: ").strip() or "192.168.4.1"
    config['gateway_port'] = input("Gateway port [8080]: ").strip() or "8080"
    
    # Hotspot configuration
    print(f"\n{Colors.YELLOW}Hotspot Configuration:{Colors.RESET}")
    config['enable_hotspot'] = input("Enable WiFi hotspot? (y/n) [y]: ").strip().lower() or "y"
    if config['enable_hotspot'] == 'y':
        config['hotspot_ssid'] = input("Hotspot SSID [LearnLab]: ").strip() or "LearnLab"
        config['hotspot_password'] = getpass.getpass("Hotspot password (min 8 chars): ").strip()
        if len(config['hotspot_password']) < 8:
            print_error("Hotspot password must be at least 8 characters")
            sys.exit(1)
    
    # JWT Secret
    import secrets
    config['jwt_secret'] = secrets.token_urlsafe(32)
    
    return config

def install_dependencies():
    """Install system dependencies"""
    print_step("Installing system dependencies...")
    
    packages = [
        'postgresql-15',
        'postgresql-contrib-15',
        'python3-pip',
        'protobuf-compiler',
        'ufw',
        'hostapd',
        'dnsmasq',
    ]
    
    run_command(['apt-get', 'update'])
    run_command(['apt-get', 'install', '-y'] + packages)
    print_success("System dependencies installed")

def setup_postgresql(config):
    """Setup PostgreSQL database"""
    print_step("Setting up PostgreSQL...")
    
    # Start PostgreSQL
    run_command(['systemctl', 'enable', 'postgresql'])
    run_command(['systemctl', 'start', 'postgresql'])
    
    # Create database and user
    sql_commands = f"""
CREATE DATABASE {config['db_name']};
CREATE USER {config['db_user']} WITH PASSWORD '{config['db_password']}';
GRANT ALL PRIVILEGES ON DATABASE {config['db_name']} TO {config['db_user']};
\\c {config['db_name']}
GRANT ALL ON SCHEMA public TO {config['db_user']};
"""
    
    # Run as postgres user
    psql_cmd = f"sudo -u postgres psql -c \"CREATE DATABASE {config['db_name']};\""
    run_command(psql_cmd, shell=True)
    
    psql_cmd = f"sudo -u postgres psql -c \"CREATE USER {config['db_user']} WITH PASSWORD '{config['db_password']}';\""
    run_command(psql_cmd, shell=True)
    
    psql_cmd = f"sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE {config['db_name']} TO {config['db_user']};\""
    run_command(psql_cmd, shell=True)
    
    psql_cmd = f"sudo -u postgres psql -d {config['db_name']} -c \"GRANT ALL ON SCHEMA public TO {config['db_user']};\""
    run_command(psql_cmd, shell=True)
    
    # Configure PostgreSQL
    pg_conf = '/etc/postgresql/15/main/postgresql.conf'
    if os.path.exists(pg_conf):
        with open(pg_conf, 'r') as f:
            content = f.read()
        
        # Update configuration
        updates = {
            'shared_buffers = 2GB': 'shared_buffers = 2GB',
            'effective_cache_size = 6GB': 'effective_cache_size = 6GB',
            'max_connections = 100': 'max_connections = 100',
            "listen_addresses = '*'": "listen_addresses = '*'",
        }
        
        for key, value in updates.items():
            if key not in content:
                content += f"\n{value}\n"
        
        with open(pg_conf, 'w') as f:
            f.write(content)
    
    # Configure pg_hba.conf
    pg_hba = '/etc/postgresql/15/main/pg_hba.conf'
    if os.path.exists(pg_hba):
        with open(pg_hba, 'a') as f:
            f.write(f"\nhost    {config['db_name']}    {config['db_user']}    0.0.0.0/0    md5\n")
    
    run_command(['systemctl', 'restart', 'postgresql'])
    print_success("PostgreSQL configured")

def setup_hotspot(config):
    """Setup WiFi hotspot"""
    if config['enable_hotspot'] != 'y':
        return
    
    print_step("Setting up WiFi hotspot...")
    
    # Configure hostapd
    hostapd_conf = f"""
interface=wlan0
driver=nl80211
ssid={config['hotspot_ssid']}
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase={config['hotspot_password']}
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
"""
    
    with open('/etc/hostapd/hostapd.conf', 'w') as f:
        f.write(hostapd_conf)
    
    # Configure dnsmasq
    dnsmasq_conf = f"""
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
"""
    
    with open('/etc/dnsmasq.conf', 'w') as f:
        f.write(dnsmasq_conf)
    
    # Configure static IP for wlan0
    dhcpcd_conf = """
interface wlan0
static ip_address=192.168.4.1/24
nohook wpa_supplicant
"""
    
    with open('/etc/dhcpcd.conf', 'a') as f:
        f.write(dhcpcd_conf)
    
    # Enable services
    run_command(['systemctl', 'enable', 'hostapd'])
    run_command(['systemctl', 'enable', 'dnsmasq'])
    
    print_success("Hotspot configured")
    print_warning("Reboot required for hotspot to start")

def setup_firewall(config):
    """Configure firewall"""
    print_step("Configuring firewall...")
    
    run_command(['ufw', '--force', 'enable'])
    run_command(['ufw', 'allow', '22/tcp'])  # SSH
    run_command(['ufw', 'allow', '5432/tcp'])  # PostgreSQL
    run_command(['ufw', 'allow', f"{config['gateway_port']}/tcp"])  # Gateway
    run_command(['ufw', 'allow', '80/tcp'])   # HTTP
    run_command(['ufw', 'allow', '443/tcp'])  # HTTPS
    
    if config['enable_hotspot'] == 'y':
        run_command(['ufw', 'allow', '53/udp'])  # DNS
        run_command(['ufw', 'allow', '67/udp'])  # DHCP
    
    print_success("Firewall configured")

def setup_backend_services(config):
    """Setup backend services"""
    print_step("Setting up backend services...")
    
    backend_dir = Path(__file__).parent.absolute()
    os.chdir(backend_dir)
    
    # Create .env file
    env_content = f"""# Database Configuration
DATABASE_URL=postgres://{config['db_user']}:{config['db_password']}@localhost:5432/{config['db_name']}?sslmode=disable

# JWT Configuration
JWT_SECRET={config['jwt_secret']}
JWT_EXPIRY=24h

# Service Ports
AUTH_SERVICE_GRPC_PORT=50051
AUTH_SERVICE_HTTP_PORT=8001
COURSE_SERVICE_GRPC_PORT=50052
COURSE_SERVICE_HTTP_PORT=8002
AI_SERVICE_GRPC_PORT=50053
AI_SERVICE_HTTP_PORT=8003
EXECUTOR_SERVICE_GRPC_PORT=50054
EXECUTOR_SERVICE_HTTP_PORT=8004
PROGRESS_SERVICE_GRPC_PORT=50055
PROGRESS_SERVICE_HTTP_PORT=8005
GATEWAY_PORT={config['gateway_port']}

# Logging
LOG_LEVEL=info

# Service URLs (for gateway)
AUTH_SERVICE_URL=localhost:50051
COURSE_SERVICE_URL=localhost:50052
AI_SERVICE_URL=localhost:50053
EXECUTOR_SERVICE_URL=localhost:50054
PROGRESS_SERVICE_URL=localhost:50055
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print_success(".env file created")
    
    # Install Go if not present
    if not run_command(['which', 'go'], check=False):
        print_step("Installing Go...")
        go_version = "1.21.5"
        run_command(f"wget -q https://go.dev/dl/go{go_version}.linux-arm64.tar.gz", shell=True)
        run_command(f"tar -C /usr/local -xzf go{go_version}.linux-arm64.tar.gz", shell=True)
        run_command(f"rm go{go_version}.linux-arm64.tar.gz", shell=True)
        # Add to PATH
        with open('/etc/profile.d/go.sh', 'w') as f:
            f.write('export PATH=$PATH:/usr/local/go/bin\n')
        os.environ['PATH'] = '/usr/local/go/bin:' + os.environ.get('PATH', '')
        print_success("Go installed")
    
    # Install Go protobuf plugins
    print_step("Installing Go protobuf plugins...")
    go_bin = run_command(['which', 'go']).strip()
    go_path = run_command([go_bin, 'env', 'GOPATH']).strip()
    os.environ['PATH'] = f"{go_path}/bin:" + os.environ.get('PATH', '')
    
    run_command([go_bin, 'install', 'google.golang.org/protobuf/cmd/protoc-gen-go@latest'])
    run_command([go_bin, 'install', 'google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest'])
    run_command([go_bin, 'install', 'github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest'])
    
    print_success("Go plugins installed")
    
    # Generate protobuf code
    print_step("Generating Protocol Buffer code...")
    run_command(['make', 'generate'])
    
    # Install Go dependencies
    print_step("Installing Go dependencies...")
    run_command(['make', 'deps'])
    
    # Run database migrations
    print_step("Running database migrations...")
    os.environ['DATABASE_URL'] = f"postgres://{config['db_user']}:{config['db_password']}@localhost:5432/{config['db_name']}?sslmode=disable"
    run_command(['make', 'migrate'])
    
    # Build services
    print_step("Building services...")
    run_command(['make', 'build'])
    
    print_success("Backend services ready")

def create_systemd_services(config):
    """Create systemd service files"""
    print_step("Creating systemd services...")
    
    backend_dir = Path(__file__).parent.absolute()
    user = os.environ.get('SUDO_USER', 'pi')
    
    services = [
        ('auth-service', '50051', '8001'),
        ('course-service', '50052', '8002'),
        ('ai-service', '50053', '8003'),
        ('executor-service', '50054', '8004'),
        ('progress-service', '50055', '8005'),
        ('gateway', config['gateway_port'], None),
    ]
    
    for service_name, grpc_port, http_port in services:
        service_file = f"""[Unit]
Description=Learn Lab {service_name}
After=network.target postgresql.service

[Service]
Type=simple
User={user}
WorkingDirectory={backend_dir}
EnvironmentFile={backend_dir}/.env
ExecStart={backend_dir}/bin/{service_name}
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
"""
        
        with open(f'/etc/systemd/system/learnlab-{service_name}.service', 'w') as f:
            f.write(service_file)
        
        run_command(['systemctl', 'enable', f'learnlab-{service_name}'])
    
    run_command(['systemctl', 'daemon-reload'])
    print_success("Systemd services created")

def print_summary(config):
    """Print setup summary"""
    print(f"\n{Colors.BOLD}{Colors.GREEN}=== Setup Complete! ==={Colors.RESET}\n")
    
    print(f"{Colors.BOLD}Configuration Summary:{Colors.RESET}")
    print(f"  Database: {config['db_name']}")
    print(f"  Database User: {config['db_user']}")
    print(f"  Raspberry Pi IP: {config['pi_ip']}")
    print(f"  Gateway Port: {config['gateway_port']}")
    
    if config['enable_hotspot'] == 'y':
        print(f"  Hotspot SSID: {config['hotspot_ssid']}")
        print(f"  Hotspot IP: 192.168.4.1")
    
    print(f"\n{Colors.BOLD}Access URLs:{Colors.RESET}")
    print(f"  REST API: http://{config['pi_ip']}:{config['gateway_port']}/api/v1/")
    print(f"  Health Check: http://{config['pi_ip']}:{config['gateway_port']}/api/v1/auth/me")
    
    print(f"\n{Colors.BOLD}Next Steps:{Colors.RESET}")
    print("  1. If hotspot was enabled, reboot: sudo reboot")
    print("  2. Connect your laptop to the hotspot")
    print("  3. Start services: sudo systemctl start learnlab-*")
    print("  4. Check status: sudo systemctl status learnlab-gateway")
    print("  5. Access web app from laptop at the IP above")
    
    print(f"\n{Colors.BOLD}Useful Commands:{Colors.RESET}")
    print("  Start all services: sudo systemctl start learnlab-*")
    print("  Stop all services: sudo systemctl stop learnlab-*")
    print("  View logs: sudo journalctl -u learnlab-gateway -f")
    print("  Restart services: sudo systemctl restart learnlab-*")

def main():
    """Main setup function"""
    check_root()
    
    config = get_config()
    
    try:
        install_dependencies()
        setup_postgresql(config)
        
        if config['enable_hotspot'] == 'y':
            setup_hotspot(config)
        
        setup_firewall(config)
        setup_backend_services(config)
        create_systemd_services(config)
        
        print_summary(config)
        
    except KeyboardInterrupt:
        print_error("\nSetup cancelled by user")
        sys.exit(1)
    except Exception as e:
        print_error(f"Setup failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()

