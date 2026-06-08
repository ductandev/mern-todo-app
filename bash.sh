#!/bin/bash
start=$(date +'%s')

# Load biến môi trường từ file .env (GITHUB_TOKEN, DIGITALOCEAN_TOKEN...)
# File .env nằm cùng thư mục với bash.sh, không được commit lên git
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
  echo "✅ Đã load .env"
else
  echo "⚠️  Không tìm thấy file .env tại $SCRIPT_DIR"
fi

# Kiểm tra GITHUB_TOKEN bắt buộc phải có
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN chưa được set! Thêm vào file .env rồi chạy lại"
  exit 1
fi

# Tắt interactive prompt của apt (tránh bị hỏi timezone, keyboard... khi cài package)
export DEBIAN_FRONTEND=noninteractive

# Tắt xác nhận SSH fingerprint khi kết nối tới VPS mới.
# Dùng env var thay vì ansible.cfg vì thư mục bị world-writable (do docker mount) nên ansible.cfg bị ignore.
export ANSIBLE_HOST_KEY_CHECKING=False

echo "Begin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "Begin install systems"

apt update
sleep 1

apt install -y unzip
sleep 1

apt install -y wget
sleep 1

cd terraform

# =================1️⃣ Download Terraform binary=============
wget https://releases.hashicorp.com/terraform/1.15.5/terraform_1.15.5_linux_amd64.zip
sleep 1

unzip -o terraform_1.15.5_linux_amd64.zip
sleep 1

mv terraform /usr/local/bin/
sleep 1

terraform -version
terraform init
terraform apply -auto-approve

# Lấy IP từ terraform output và ghi vào hosts.ini
VPS_IP=$(terraform output -raw vps_ip)
echo "VPS IP: $VPS_IP"

HOSTS_FILE="../ansible/hosts.ini"
cat > "$HOSTS_FILE" <<EOF
[danh_sach_host]
$VPS_IP ansible_user=root ansible_private_key_file=./ssh-key-digital-ocean
EOF
echo "✅  Đã cập nhật $HOSTS_FILE với IP: $VPS_IP"

# ====================2️⃣ Install Ansible ====================
# Chờ VPS khởi động xong trước khi chạy ansible
echo "✅  VPS đã sẵn sàng..."
sleep 5

cd ../
# tránh Ansible phát hiện world-writable 777 từ chối đọc ansible.cfg
chmod 755 /root/ansible
echo "✅  Cài đặt Ansible..."
apt install ansible -y
sleep 1
ansible --version

cd ./ansible
pwd

# Đảm bảo SSH key đúng permission (600), nếu không SSH sẽ bị từ chối
# chmod 600 ~/.ssh/ssh-key-digital-ocean

echo "✅  Bắt đầu chạy lệnh Ansible..."
ansible all -i hosts.ini -m ping
ansible-playbook -i hosts.ini install_vps.yml --extra-vars "github_token=$GITHUB_TOKEN"

end=$(date +'%s')
echo "Tong thoi gian chay: $((end - start)) giay"
