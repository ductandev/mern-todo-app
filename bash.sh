#!/bin/bash
start=$(date +'%s')
echo "Begin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "Begin install systems"

apt update
sleep 1

apt install -y unzip
sleep 1

apt install -y wget
sleep 1

wget https://releases.hashicorp.com/terraform/1.15.5/terraform_1.15.5_linux_amd64.zip
sleep 1

unzip -o terraform_1.15.5_linux_amd64.zip
sleep 1

rm -rf /usr/local/bin/terraform
mv terraform /usr/local/bin/terraform
chmod +x /usr/local/bin/terraform
sleep 1

# xóa cac file thua sau khi cai xong
rm -f terraform_1.15.5_linux_amd64.zip LICENSE.txt .wget-hsts

# Kiem tra
terraform -version

apt install ansible -y
sleep 1
ansible --version

end=$(date +'%s')
echo "ket thuc thoi gian:$end"
echo "Tong thoi gian chay:✅ $((end - start)) giay"
