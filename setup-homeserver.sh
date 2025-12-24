#!/bin/bash

echo "🚀 Setting up Home Server Docker Environment..."

# Create Docker network
echo "📡 Creating Docker network..."
docker network create web 2>/dev/null || echo "Network 'web' already exists"

# Create Traefik directories
echo "📁 Creating Traefik directories..."
mkdir -p traefik

# Create acme.json for SSL certificates
echo "🔐 Creating acme.json..."
touch traefik/acme.json
chmod 600 traefik/acme.json

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install it first."
    exit 1
fi

# Start services
echo "🐳 Starting Docker services..."
docker-compose -f docker-compose.homeserver.yml up -d

echo ""
echo "✅ Setup complete!"
echo ""
echo "📍 Access your services:"
echo "   - Simpleverse:      http://simpleverse.localhost"
echo "   - Portainer:        http://portainer.localhost"
echo "   - Traefik Dashboard: http://traefik.localhost:8080"
echo ""
echo "⏳ Wait a few seconds for services to start..."
echo ""
echo "📖 Read HOMESERVER.md for detailed documentation"
