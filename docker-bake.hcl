group "default" {
  targets = ["frontend", "backend", "bff", "auth-service", "worker-service", "nginx"]
}

# Shared base with all dependencies and builds
target "shared" {
  context = "."
  dockerfile = "Dockerfile.shared"
  tags = [
    "ghcr.io/eugeneazdev/hic/shared:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
  }
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
  # depends_on only for production builds where shared image is pushed to registry
  depends_on = ["shared"]
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
  depends_on = ["shared"]
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
  depends_on = ["shared"]
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
  depends_on = ["shared"]
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
  depends_on = ["shared"]
}

target "nginx" {
  context = "infra/nginx"
  dockerfile = "Dockerfile"
  tags = [
    "ghcr.io/eugeneazdev/hic/nginx:staging-latest"
  ]
}




