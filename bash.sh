#!/bin/bash
# Pipeline provision + deploy toàn bộ hệ thống:
#   1. Terraform tạo VPS DigitalOcean
#   2. Ansible cấu hình VPS và deploy app + monitoring + Jenkins + Portainer
# Chạy trong container Ubuntu (xem README).
set -euo pipefail
start=$(date +'%s')

TERRAFORM_VERSION="1.15.5"

# Load biến môi trường từ file .env (DIGITALOCEAN_TOKEN, ALERTMANAGER_*...)
# File .env nằm cùng thư mục với bash.sh, không được commit lên git.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$SCRIPT_DIR/.env"
  set +a
  echo "✅ Đã load .env"
else
  echo "❌ Không tìm thấy file .env tại $SCRIPT_DIR — copy .env.example thành .env rồi chạy lại"
  exit 1
fi

# Terraform đọc token từ TF_VAR_do_token (hoặc terraform.tfvars nếu có)
if [ -n "${DIGITALOCEAN_TOKEN:-}" ]; then
  export TF_VAR_do_token="$DIGITALOCEAN_TOKEN"
fi

# Tắt interactive prompt của apt (tránh bị hỏi timezone, keyboard...)
export DEBIAN_FRONTEND=noninteractive

# Tắt xác nhận SSH fingerprint khi kết nối tới VPS mới.
# Dùng env var thay vì ansible.cfg vì thư mục bị world-writable (do docker mount)
# nên ansible.cfg bị ignore.
export ANSIBLE_HOST_KEY_CHECKING=False

echo "==== 1/3 Cài công cụ ===="
apt update
apt install -y unzip wget openssh-client ansible

echo "==== 2/3 Terraform tạo VPS ===="
cd "$SCRIPT_DIR/terraform"

if ! command -v terraform >/dev/null 2>&1; then
  wget -q "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip"
  unzip -o "terraform_${TERRAFORM_VERSION}_linux_amd64.zip"
  mv terraform /usr/local/bin/
fi

terraform -version
terraform init
terraform apply -auto-approve

# Lấy IP từ terraform output và ghi vào hosts.ini (file này không commit)
VPS_IP=$(terraform output -raw vps_ip)
echo "VPS IP: $VPS_IP"

HOSTS_FILE="$SCRIPT_DIR/ansible/hosts.ini"
cat > "$HOSTS_FILE" <<EOF
[danh_sach_host]
$VPS_IP ansible_user=root ansible_private_key_file=./ssh-key-digital-ocean
EOF
echo "✅ Đã cập nhật $HOSTS_FILE"

echo "==== 3/3 Ansible cấu hình VPS ===="
# Tránh Ansible từ chối đọc ansible.cfg do thư mục world-writable
chmod 755 "$SCRIPT_DIR/ansible" || true
cd "$SCRIPT_DIR/ansible"

# SSH key phải có permission 600
chmod 600 ./ssh-key-digital-ocean || true

# Chờ SSH sẵn sàng thay vì sleep mù
echo "⏳ Chờ VPS mở cổng SSH..."
for i in $(seq 1 30); do
  if ansible all -i hosts.ini -m ping >/dev/null 2>&1; then
    echo "✅ VPS đã sẵn sàng"
    break
  fi
  [ "$i" -eq 30 ] && { echo "❌ Không SSH được vào VPS sau 5 phút"; exit 1; }
  sleep 10
done

ansible-playbook -i hosts.ini install_vps.yml

end=$(date +'%s')
echo "🎉 Hoàn tất! Tổng thời gian: $((end - start)) giây"
echo "Nhớ trỏ DNS A record về IP mới: $VPS_IP"
