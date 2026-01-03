# Docker 部署指南

## 快速开始

### 使用 Docker Compose（推荐）

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

### 使用 Docker 命令

```bash
# 构建镜像
docker build -t fund-agent:latest .

# 运行容器
docker run -d \
  --name fund-agent \
  -p 8080:8080 \
  -v $(pwd)/data:/app/data \
  fund-agent:latest

# 查看日志
docker logs -f fund-agent

# 停止容器
docker stop fund-agent
docker rm fund-agent
```

## 环境变量

- `PORT`: 服务器端口（默认: 8080）
- `NODE_ENV`: 运行环境（默认: production）

## 数据持久化

数据库文件会保存在 `./data/fund_agent.db`。使用 volume 挂载可以确保数据持久化：

```bash
docker run -v $(pwd)/data:/app/data fund-agent:latest
```

## 健康检查

容器包含健康检查，可以通过以下方式查看：

```bash
docker ps  # 查看健康状态
docker inspect fund-agent | grep Health -A 10
```

## 访问应用

启动后，访问：http://localhost:8080

## 构建优化

Dockerfile 使用多阶段构建：
- **builder 阶段**: 安装所有依赖并构建项目
- **production 阶段**: 只包含运行时依赖和构建产物

这样可以显著减小最终镜像大小。

## 故障排查

### 查看容器日志
```bash
docker logs fund-agent
```

### 进入容器调试
```bash
docker exec -it fund-agent sh
```

### 检查数据库
```bash
docker exec fund-agent npm run check-db
```

### 重新初始化数据库
```bash
docker exec fund-agent npm run init-db
```

