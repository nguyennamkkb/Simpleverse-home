# Docker Build & Deploy Guide

## Quick Start

### 1. Build Docker Image
```bash
docker build -t simpleverse:latest .
```

### 2. Run with Docker
```bash
docker run -d -p 8080:80 --name simpleverse simpleverse:latest
```

### 3. Run with Docker Compose (Recommended)
```bash
docker-compose up -d
```

## Access

- Web: http://localhost:8080
- Health Check: http://localhost:8080/health

## Docker Commands

### Build
```bash
# Build image
docker build -t simpleverse:latest .

# Build with no cache
docker build --no-cache -t simpleverse:latest .
```

### Run
```bash
# Run container
docker run -d -p 8080:80 --name simpleverse simpleverse:latest

# Run with custom port
docker run -d -p 3000:80 --name simpleverse simpleverse:latest
```

### Manage
```bash
# Stop container
docker stop simpleverse

# Start container
docker start simpleverse

# Restart container
docker restart simpleverse

# Remove container
docker rm simpleverse

# View logs
docker logs simpleverse

# Follow logs
docker logs -f simpleverse
```

### Docker Compose
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build
```

## Image Size Optimization

This setup uses:
- **Multi-stage build**: Separates build and runtime
- **Alpine Linux**: Smallest base image (~5MB)
- **nginx:alpine**: Lightweight web server (~40MB)
- **Production dependencies only**: No dev dependencies in final image

Expected final image size: **~50-60MB**

## Production Deployment

### Environment Variables
```bash
# .env file
NODE_ENV=production
PORT=80
```

### With Custom Domain
Update nginx.conf:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

### Behind Reverse Proxy (Traefik/Nginx)
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.simpleverse.rule=Host(`yourdomain.com`)"
  - "traefik.http.services.simpleverse.loadbalancer.server.port=80"
```

## Health Check

The container includes a health check endpoint at `/health`

```bash
# Check health
curl http://localhost:8080/health
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs simpleverse

# Check if port is in use
lsof -i :8080
```

### Build fails
```bash
# Clean build
docker system prune -a
docker build --no-cache -t simpleverse:latest .
```

### Permission issues
```bash
# Run with user
docker run -d -p 8080:80 --user $(id -u):$(id -g) simpleverse:latest
```

## Performance Tips

1. **Enable gzip**: Already configured in nginx.conf
2. **Cache static assets**: Configured for 1 year
3. **Use CDN**: For production, consider CloudFlare or similar
4. **Monitor**: Use `docker stats simpleverse` to monitor resources

## Security

- No root user in container
- Security headers configured
- Only port 80 exposed
- Health check for monitoring
- Minimal attack surface (Alpine + nginx only)
