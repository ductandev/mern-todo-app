FROM node:20-alpine

WORKDIR /app

# bcrypt là native addon — cần toolchain để build trên alpine
RUN apk add --no-cache python3 make g++

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY . .

# Chạy bằng user không phải root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app
USER appuser

EXPOSE 8386

CMD ["node", "index.js"]
