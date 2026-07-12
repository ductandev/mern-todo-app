# --- Stage 1: Build React app ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# REACT_APP_API_URL là biến build-time của CRA — truyền qua build arg
# (docker compose đọc từ .env gốc), không phụ thuộc file frontend/.env.
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

# --- Stage 2: Serve static files bằng nginx ---
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
