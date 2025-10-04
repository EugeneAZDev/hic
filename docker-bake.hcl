group "default" {
  targets = ["frontend", "backend", "bff", "auth-service", "worker-service", "nginx"]
}

# Shared base with all dependencies and builds
target "shared" {
  context = "."
  dockerfile = "Dockerfile.shared"
  platforms = ["linux/amd64"]
  tags = [
    "ghcr.io/eugeneazdev/hic/shared:staging-latest"
  ]
  args = {
    NODE_ENV = "production"
    NEXT_PUBLIC_BFF_URL = ""
    NEXT_PUBLIC_AUTH_SERVICE_URL = ""
    FRONTEND_URL = ""
  }
}

target "frontend" {
  context = "."
  dockerfile = "apps/frontend/Dockerfile"
  platforms = ["linux/amd64"]
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
  platforms = ["linux/amd64"]
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
  platforms = ["linux/amd64"]
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
  platforms = ["linux/amd64"]
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
  platforms = ["linux/amd64"]
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
  platforms = ["linux/amd64"]
  tags = [
    "ghcr.io/eugeneazdev/hic/nginx:staging-latest"
  ]
}




