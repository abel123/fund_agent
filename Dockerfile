# 多阶段构建 Dockerfile
# 阶段1: 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装所有依赖（包括开发依赖，用于构建）
RUN npm ci

# 复制源代码和配置文件
COPY . .

# 构建项目（前端构建，后端使用 tsx 运行时执行）
RUN npm run build

# 阶段2: 生产阶段
FROM node:20-alpine AS production

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装生产依赖和 tsx（用于运行 TypeScript）
RUN npm ci --only=production && \
    npm install -g tsx

# 从构建阶段复制构建产物和源代码
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/vite.config.ts ./

# 切换到非 root 用户
USER node

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=8080

# 暴露端口
EXPOSE 8080

# 初始化数据库并启动服务器
CMD ["sh", "-c", "tsx src/server/index.ts"]
