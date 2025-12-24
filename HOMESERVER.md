# Home Server Docker Management Guide

## Tổng quan

Setup này bao gồm:
- **Traefik**: Reverse proxy tự động, quản lý routing
- **Portainer**: UI quản lý Docker containers
- **Watchtower**: Tự động update containers
- **Simpleverse**: Ứng dụng của bạn

## Cài đặt ban đầu

### 1. Tạo Docker network
```bash
docker network create web
```

### 2. Tạo file acme.json cho SSL (nếu dùng)
```bash
mkdir -p traefik
touch traefik/acme.json
chmod 600 traefik/acme.json
```

### 3. Khởi động services
```bash
docker-compose -f docker-compose.homeserver.yml up -d
```

## Truy cập các services

### Local (development)
- **Simpleverse**: http://simpleverse.localhost
- **Portainer**: http://portainer.localhost
- **Traefik Dashboard**: http://traefik.localhost:8080

### Production (với domain thật)
Sửa trong `docker-compose.homeserver.yml`:
```yaml
- "traefik.http.routers.simpleverse.rule=Host(`yourdomain.com`)"
- "traefik.http.routers.portainer.rule=Host(`portainer.yourdomain.com`)"
```

## Portainer - Quản lý Docker

### Lần đầu truy cập
1. Mở http://portainer.localhost
2. Tạo admin account
3. Chọn "Docker" environment

### Chức năng chính
- **Containers**: Xem, start/stop, logs, stats
- **Images**: Quản lý Docker images
- **Networks**: Quản lý networks
- **Volumes**: Quản lý data volumes
- **Stacks**: Deploy docker-compose files qua UI

## Thêm ứng dụng mới

### Cách 1: Qua Portainer UI
1. Vào Portainer → Stacks → Add stack
2. Paste docker-compose content
3. Deploy

### Cách 2: Thêm vào docker-compose.homeserver.yml
```yaml
  your-new-app:
    image: your-image:latest
    container_name: your-app
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.yourapp.rule=Host(`yourapp.localhost`)"
      - "traefik.http.routers.yourapp.entrypoints=web"
      - "traefik.http.services.yourapp.loadbalancer.server.port=80"
    networks:
      - web
```

Sau đó:
```bash
docker-compose -f docker-compose.homeserver.yml up -d
```

## Quản lý Containers

### Xem tất cả containers
```bash
docker ps -a
```

### Xem logs
```bash
docker logs -f container-name
```

### Restart container
```bash
docker restart container-name
```

### Stop/Start container
```bash
docker stop container-name
docker start container-name
```

### Xóa container
```bash
docker rm -f container-name
```

## Monitoring & Maintenance

### Xem resource usage
```bash
docker stats
```

### Dọn dẹp
```bash
# Xóa unused images
docker image prune -a

# Xóa unused volumes
docker volume prune

# Xóa tất cả unused resources
docker system prune -a --volumes
```

### Backup volumes
```bash
# Backup Portainer data
docker run --rm -v portainer_data:/data -v $(pwd):/backup alpine tar czf /backup/portainer-backup.tar.gz -C /data .

# Restore
docker run --rm -v portainer_data:/data -v $(pwd):/backup alpine tar xzf /backup/portainer-backup.tar.gz -C /data
```

## Watchtower - Auto Update

Watchtower tự động kiểm tra và update containers mỗi ngày.

### Tắt auto-update cho container cụ thể
```yaml
labels:
  - "com.centurylinklabs.watchtower.enable=false"
```

### Update ngay lập tức
```bash
docker exec watchtower watchtower --run-once
```

## Traefik - Reverse Proxy

### Xem routes
Truy cập: http://traefik.localhost:8080

### Thêm SSL (Let's Encrypt)
Sửa `traefik/traefik.yml`:
```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com
      storage: acme.json
      httpChallenge:
        entryPoint: web
```

Và trong labels:
```yaml
- "traefik.http.routers.yourapp.tls.certresolver=letsencrypt"
```

## Troubleshooting

### Container không start
```bash
# Xem logs
docker logs container-name

# Xem chi tiết
docker inspect container-name
```

### Không truy cập được qua domain
```bash
# Kiểm tra Traefik logs
docker logs traefik

# Kiểm tra network
docker network inspect web
```

### Port conflict
```bash
# Xem port đang dùng
sudo lsof -i :80
sudo lsof -i :443

# Đổi port trong docker-compose
ports:
  - "8080:80"  # Thay vì 80:80
```

## Security Best Practices

1. **Đổi default ports** cho Traefik dashboard
2. **Bật authentication** cho Portainer và Traefik
3. **Sử dụng SSL** cho production
4. **Giới hạn network access** với firewall
5. **Regular backups** của volumes
6. **Update containers** thường xuyên (Watchtower làm tự động)

## Useful Commands

```bash
# Xem tất cả services
docker-compose -f docker-compose.homeserver.yml ps

# Stop tất cả
docker-compose -f docker-compose.homeserver.yml down

# Restart tất cả
docker-compose -f docker-compose.homeserver.yml restart

# Xem logs tất cả services
docker-compose -f docker-compose.homeserver.yml logs -f

# Update và restart
docker-compose -f docker-compose.homeserver.yml up -d --build
```

## Recommended Tools

### Thêm monitoring (optional)
- **Grafana + Prometheus**: Monitoring & metrics
- **Uptime Kuma**: Uptime monitoring
- **Dozzle**: Real-time log viewer

### Thêm vào docker-compose:
```yaml
  dozzle:
    image: amir20/dozzle:latest
    container_name: dozzle
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dozzle.rule=Host(`logs.localhost`)"
    networks:
      - web
```

## Support

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker logs container-name`
2. Kiểm tra Portainer UI
3. Kiểm tra Traefik dashboard
4. Google error message
5. Check Docker documentation
