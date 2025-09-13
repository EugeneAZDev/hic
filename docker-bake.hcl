group "default" {
  targets = ["frontend", "backend", "bff", "auth-service", "worker-service", "nginx"]
}

target "frontend" {
  context = "."
  dockerfile = "apps/frontend/Dockerfile"
  tags = []
  args = {
    NODE_ENV = "production"
  }
}

target "backend" {
  context = "."
  dockerfile = "apps/backend/Dockerfile"
  tags = []
  args = {
    NODE_ENV = "production"
  }
}

target "bff" {
  context = "."
  dockerfile = "apps/bff/Dockerfile"
  tags = []
  args = {
    NODE_ENV = "production"
  }
}

target "auth-service" {
  context = "."
  dockerfile = "apps/auth-service/Dockerfile"
  tags = []
  args = {
    NODE_ENV = "production"
  }
}

target "worker-service" {
  context = "."
  dockerfile = "apps/worker-service/Dockerfile"
  tags = []
  args = {
    NODE_ENV = "production"
  }
}

target "nginx" {
  context = "infra/nginx"
  dockerfile = "Dockerfile"
  tags = []
}




