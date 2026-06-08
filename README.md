# MERN Todo App — DevOps Pipeline trên DigitalOcean

Triển khai end-to-end một ứng dụng MERN Todo lên VPS DigitalOcean thông qua pipeline tự động hoàn toàn: Terraform tạo VPS, Ansible cấu hình server và deploy ứng dụng, Docker Compose chạy các service, Jenkins xử lý CD khi có code mới.

## Tổng quan dự án

| Hạng mục | Công nghệ |
|---|---|
| Ứng dụng | React frontend, Express REST API, MongoDB, JWT authentication |
| Cloud | DigitalOcean Droplet — Ubuntu 24.04, Singapore (sgp1), 2vCPU/4GB RAM |
| Infrastructure as Code | Terraform + DigitalOcean provider |
| Configuration Management | Ansible |
| Runtime | Docker Engine + Docker Compose |
| CI/CD | Jenkins Pipeline + GitHub Actions |
| Monitoring | Prometheus, Grafana, Node Exporter, MongoDB Exporter |
| Container Management | Portainer |
| Domain | api.ductandev.io.vn (DNS quản lý tại 123host.vn) |

## Kiến trúc

```
Developer
    │
    ▼
GitHub (push code)
    │
    ├──▶ GitHub Actions ──▶ Trigger Jenkins
    │                            │
    │                            ▼
    │                    Jenkins trên VPS
    │                    git pull + docker-compose up --build
    │
    ▼
bash.sh (chạy trên Docker local)
    │
    ├──▶ 1. Terraform ──▶ Tạo VPS DigitalOcean ──▶ Lấy IP
    │
    └──▶ 2. Ansible  ──▶ SSH vào VPS
                          ├── Cài Docker, docker-compose
                          ├── Clone source từ GitHub
                          ├── Copy file .env
                          ├── docker-compose up -d (app)
                          ├── Chạy Jenkins
                          ├── Chạy Grafana
                          ├── Chạy Prometheus
                          ├── Chạy Node Exporter
                          ├── Chạy MongoDB Exporter
                          └── Chạy Portainer
```

## Cấu trúc thư mục

```
mern-todo-app/
├── terraform/
│   ├── main.tf                  # Tạo Droplet DigitalOcean
│   └── terraform.tfvars         # Biến bí mật (không commit)
├── ansible/
│   ├── install_vps.yml          # Playbook cấu hình VPS
│   ├── hosts.ini                # Inventory (IP VPS, SSH key)
│   └── ansible.cfg              # Cấu hình Ansible
├── backend/                     # Express.js API
│   ├── Dockerfile
│   └── ...
├── frontend/                    # React App
│   ├── Dockerfile
│   ├── .env                     # REACT_APP_API_URL
│   └── ...
├── prometheus/
│   └── prometheus.yml           # Cấu hình scrape targets
├── docker-compose.yml           # Định nghĩa các service app
├── bash.sh                      # Script chạy toàn bộ pipeline
├── Jenkinsfile                  # Jenkins CD pipeline
├── .env                         # Biến môi trường app (không commit)
└── .gitignore
```

## Các service và Port

| Service | Port | Mô tả |
|---|---|---|
| React Frontend | 3111 | Giao diện người dùng |
| Express Backend | 8386 | REST API |
| MongoDB | 27017 | Database (chỉ nội bộ) |
| Jenkins | 8080, 50000 | CI/CD pipeline |
| Grafana | 3000 | Dashboard monitoring |
| Prometheus | 9090 | Thu thập metrics |
| Node Exporter | 9100 | Metrics hệ thống VPS |
| MongoDB Exporter | 9216 | Metrics MongoDB |
| Portainer | 8000, 9000 | Quản lý container |

## Hướng dẫn chạy pipeline

### Yêu cầu

- Docker Desktop đang chạy
- File `.env` ở thư mục gốc với nội dung:

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxx
DIGITALOCEAN_TOKEN=dop_v1_xxxxxx
MONGO_USERNAME=admin
MONGO_PASSWORD=your_password
MONGO_URI=mongodb://admin:password@mongo:27017/todo?authSource=admin
PORT_BE=8386
JWT_SECRET=your_secret
URL=https://api.ductandev.io.vn
PUBLIC_URL=https://api.ductandev.io.vn
```

- File `frontend/.env`:

```env
REACT_APP_API_URL=https://api.ductandev.io.vn/api
```

- SSH key DigitalOcean tại `C:\Users\<user>\.ssh\ssh-key-digital-ocean`

### Chạy pipeline tự động

**Bước 1**: Khởi động Docker container Ubuntu:

```powershell
docker run -d -it --name ubuntu-ansible `
  -v C:\Users\tan\.ssh\ssh-key-digital-ocean:/root/.ssh/ssh-key-digital-ocean `
  -v C:\Users\tan\Desktop\Cybersoft\DevOps_02\mern-todo-app:/root `
  -e GITHUB_TOKEN=ghp_xxxxxxxxxxxxxx `
  ubuntu:24.04
```

**Bước 2**: Vào container và chạy script:

```bash
bash bash.sh
```

Script sẽ tự động:
1. Tạo VPS trên DigitalOcean qua Terraform
2. Cập nhật IP mới vào `ansible/hosts.ini`
3. Cài Ansible
4. Chạy playbook để cấu hình toàn bộ VPS

### Chạy Ansible riêng (khi VPS đã có)

```bash
cd ansible
export ANSIBLE_HOST_KEY_CHECKING=False
ansible-playbook -i hosts.ini install_vps.yml --extra-vars "github_token=$GITHUB_TOKEN"
```

## Jenkinsfile — CD Pipeline

Khi có code mới push lên GitHub, Jenkins tự động SSH vào VPS và deploy:

```
GitHub push → GitHub Actions → Trigger Jenkins
                                    │
                                    ▼
                              SSH vào VPS
                              git pull
                              docker-compose up -d --build backend-express
```

Jenkins cần cấu hình 2 Credentials:
- `SSH_KEY` — SSH private key để vào VPS
- `VPS_IP` — địa chỉ IP của VPS

## Monitoring

Prometheus thu thập metrics từ:

| Target | Exporter | Metrics |
|---|---|---|
| VPS host | Node Exporter `:9100` | CPU, RAM, Disk, Network |
| MongoDB | MongoDB Exporter `:9216` | Connections, Operations |

Grafana dashboard hiển thị tất cả metrics tại port `3000`.

## Lưu ý bảo mật

- Không commit file `.env`, `terraform.tfvars`, SSH key lên GitHub
- `GITHUB_TOKEN` và `DIGITALOCEAN_TOKEN` chỉ dùng trong pipeline, không copy lên VPS
- Cập nhật DNS A record tại 123host.vn trỏ về IP VPS mới sau mỗi lần tạo lại
