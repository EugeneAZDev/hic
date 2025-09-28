group "default" {
  targets = ["frontend", "backend", "bff", "auth-service", "worker-service", "nginx"]
}

# Shared base with all dependencies and builds
target "shared" {
  context = "."
  dockerfile = "Dockerfile.shared"
  tags = [
    "ghcr.io/eugeneazdev/hic/shared:local-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
}

target "frontend" {
  context = "."
  dockerfile = "apps/frontend/Dockerfile.local"
  tags = [
    "ghcr.io/eugeneazdev/hic/frontend:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
  # No depends_on for local testing
}

target "backend" {
  context = "."
  dockerfile = "apps/backend/Dockerfile.local"
  tags = [
    "ghcr.io/eugeneazdev/hic/backend:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
  # No depends_on for local testing
}

target "bff" {
  context = "."
  dockerfile = "apps/bff/Dockerfile.local"
  tags = [
    "ghcr.io/eugeneazdev/hic/bff:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
  # No depends_on for local testing
}

target "auth-service" {
  context = "."
  dockerfile = "apps/auth-service/Dockerfile.local"
  tags = [
    "ghcr.io/eugeneazdev/hic/auth-service:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
  # No depends_on for local testing
}

target "worker-service" {
  context = "."
  dockerfile = "apps/worker-service/Dockerfile.local"
  tags = [
    "ghcr.io/eugeneazdev/hic/worker-service:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
  # No depends_on for local testing
}

target "nginx" {
  context = "infra/nginx"
  dockerfile = "Dockerfile"
  tags = [
    "ghcr.io/eugeneazdev/hic/nginx:staging-latest"
  ]
}
