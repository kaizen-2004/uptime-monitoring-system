# Uptime Kuma

A self-hosted monitoring tool like "Uptime Robot" for monitoring your websites and services.

## Quick Start

### Using Docker (Recommended)

```bash
# Build custom Docker image
docker build -f Dockerfile.custom -t my-uptime-kuma:latest .

# Run the container
docker run -d \
  --name uptime-kuma \
  --restart=unless-stopped \
  -p 3001:3001 \
  -v uptime-kuma-data:/app/data \
  my-uptime-kuma:latest
```

### Using Docker Compose

```bash
# Create docker-compose.yml and run
docker-compose up -d
```

### Direct Node.js Installation

```bash
# Install dependencies
npm install --production

# Build frontend
npm run build

# Start server
npm start
```

## Access

Open your browser and navigate to `http://localhost:3001`

## Features

- 🖥️ **Multi-platform**: Monitor websites, ports, ping, databases, Docker containers, and more
- 🔔 **Notifications**: Get notified via Discord, Slack, Telegram, email, and 90+ other notification services
- 📊 **Status Pages**: Create beautiful status pages for your customers
- 🎨 **Dark/Light Mode**: Modern UI with dark/light mode
- 📱 **Mobile App**: Progressive Web App (PWA) support
- 🔐 **Security**: 2FA, reverse proxy support, and more

## Documentation

For detailed documentation, visit: https://uptime-kuma.readthedocs.io/

## License

MIT License - see the original project for details. 