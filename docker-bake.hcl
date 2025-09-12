group "default" {
  targets = ["frontend", "backend", "bff", "auth-service", "worker-service", "nginx"]
}

target "frontend" {
  context = "."
  dockerfile = "apps/frontend/Dockerfile"
  tags = [
    "ghcr.io/eugeneazdev/hic/frontend:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
}

target "backend" {
  context = "."
  dockerfile = "apps/backend/Dockerfile"
  tags = [
    "ghcr.io/eugeneazdev/hic/backend:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
}

target "bff" {
  context = "."
  dockerfile = "apps/bff/Dockerfile"
  tags = [
    "ghcr.io/eugeneazdev/hic/bff:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
}

target "auth-service" {
  context = "."
  dockerfile = "apps/auth-service/Dockerfile"
  tags = [
    "ghcr.io/eugeneazdev/hic/auth-service:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
}

target "worker-service" {
  context = "."
  dockerfile = "apps/worker-service/Dockerfile"
  tags = [
    "ghcr.io/eugeneazdev/hic/worker-service:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
}

target "nginx" {
  context = "infra/nginx"
  dockerfile = "Dockerfile"
  tags = [
    "ghcr.io/eugeneazdev/hic/nginx:staging-latest"
  ]
}




