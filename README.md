Here's a refactored version of your README with improved organization, clearer instructions, and better Windows-specific guidance:

# Uptime Monitoring System

A self-hosted monitoring solution for Windows to monitor your websites, servers, and services. Get instant alerts when something goes down.

![Dashboard Demo](https://github.com/user-attachments/assets/48b65932-718a-4890-ad89-830fd0eeb9b3)
![Status Page Demo](https://github.com/user-attachments/assets/ed9493b6-1e91-40e6-901d-50aa9ec56368)

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **Windows 10/11** or **Windows Server 2016+**

### Installation & Setup

1. **Download & Extract**
   ```cmd
   # Clone or download this repository, then navigate to the folder in Command Prompt
   cd uptime-monitoring-system
   ```

2. **Install Dependencies**
   ```cmd
   npm install
   ```

3. **Choose Your Run Method**

#### 🧪 Development Mode (Testing)
```cmd
# Auto-restarts when you make code changes
npm run dev
```

#### 🚀 Production Mode (24/7 Monitoring)
```cmd
# Build the application
npm run build

# Install PM2 process manager
npm install -g pm2

# Start as Windows service
pm2 start npm --name "uptime-monitor" -- run start

# Configure to auto-start on system boot
pm2 startup
pm2 save
```

4. **Access Dashboard**
   - Open browser to: `http://localhost:3000`
   - Complete the initial setup wizard

## 📊 What You Can Monitor

| Monitor Type | Purpose | Example |
|-------------|---------|---------|
| **HTTP(s)** | Website availability | `https://yoursite.com` |
| **Ping** | Server reachability | `192.168.1.1` |
| **Port** | Service availability | `yourserver.com:22` (SSH) |
| **Game Server** | Game server status | Minecraft, CS:GO servers |
| **Database** | Database connectivity | MySQL, PostgreSQL |
| **DNS** | DNS record validation | `google.com` |

## 🔔 Notification Channels

Configure alerts through:
- 📧 **Email** (Gmail, Outlook, SMTP)
- 💬 **Discord** Webhooks
- 📱 **Telegram** Bot
- 🔔 **Slack** Integration
- 🌐 **Custom Webhooks**
- 📲 **Push Notifications**

## 🛠️ Daily Operations

### Service Management
```cmd
# Start monitoring service
pm2 start uptime-monitor

# Stop service
pm2 stop uptime-monitor

# Restart service (after updates)
pm2 restart uptime-monitor

# Check service status
pm2 status
```

### Monitoring & Logs
```cmd
# View real-time logs
pm2 logs uptime-monitor

# Monitor resource usage
pm2 monit

# Show detailed information
pm2 show uptime-monitor
```

### Development Commands
```cmd
# Development with hot-reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 🗂️ Data Management

### Backup Your Data
```cmd
# Your all data is stored in the 'data' folder
# To backup:
xcopy data backup-data /E /I /H

# To restore:
pm2 stop uptime-monitor
xcopy backup-data data /E /I /H /Y
pm2 start uptime-monitor
```

## 🆘 Troubleshooting Guide

### Common Issues

**"Port 3000 already in use"**
```cmd
# Use different port
set PORT=3001
npm run dev
```

**"Node.js not recognized"**
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Restart Command Prompt after installation

**"Permission errors"**
- Run Command Prompt as Administrator
- Ensure you have write permissions in the installation directory

**"PM2 not working"**
```cmd
# Reinstall PM2
npm install -g pm2
pm2 update
```

### Diagnostic Commands
```cmd
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify all services are running
pm2 list

# Check application logs
pm2 logs uptime-monitor --lines 100
```

## 🎯 Recommended Setup Path

### For Beginners
1. Start with **Development Mode** to test configuration
2. Add 2-3 critical service monitors
3. Configure email or Telegram notifications
4. Switch to **Production Mode** with PM2
5. Set up regular backups

### For Production Use
1. Use **Production Mode** from start
2. Configure multiple notification channels
3. Set up status pages for external sharing
4. Implement regular backup schedule
5. Monitor system resources

## 📈 Status Pages

Create public status pages to share service health:
- Customizable branding and colors
- Multiple page support
- Public/private access controls
- Incident reporting

## ⚙️ Advanced Configuration

### Environment Variables
```cmd
# Set custom port
set PORT=3001

# Set data directory
set DATA_DIR=./monitoring-data

# Enable debug logging
set DEBUG=1
```

### Reverse Proxy Setup
Use with Nginx or Apache for:
- SSL/TLS encryption
- Custom domain names
- Load balancing (if scaling)

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- ✅ Monitor PM2 process status weekly
- ✅ Verify backups are working
- ✅ Update application periodically
- ✅ Review notification settings

### Getting Help
- Check `pm2 logs` for error details
- Review files in `data/` directory for configuration issues
- Ensure monitored services are accessible from your server

**Your monitoring system is now active!** You'll receive instant notifications when your services experience downtime.
