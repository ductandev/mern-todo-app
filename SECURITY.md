# Security Policy

## Nguyên tắc quản lý secrets

- Mọi secret (token, password, SSH key) chỉ nằm trong các file **không được commit**: `.env`, `frontend/.env`, `terraform/terraform.tfvars`, `ansible/hosts.ini`, `ansible/ssh-key-digital-ocean`. Các file này đã được khai báo trong `.gitignore`; repo chỉ commit bản `.example` tương ứng.
- `GITHUB_TOKEN` và `DIGITALOCEAN_TOKEN` chỉ dùng trong pipeline chạy trên máy local, không được copy lên VPS. Source code trên VPS được clone qua HTTPS public (repo public, không nhúng token vào remote URL).
- Credential của MongoDB Exporter và Alertmanager được Ansible render từ biến môi trường lúc deploy, không hardcode trong playbook hay file cấu hình commit lên git.
- MongoDB chỉ bind `127.0.0.1` trên host, các exporter không mở port ra ngoài firewall.

## Báo cáo lỗ hổng

Nếu phát hiện lỗ hổng bảo mật, vui lòng tạo private security advisory trên GitHub hoặc liên hệ trực tiếp chủ repo thay vì mở issue công khai.

## Lịch sử

- 2026-07: Xoá SMTP app password từng bị commit trong `prometheus/alert.yml` (đã thu hồi app password đó trên tài khoản Google); chuyển toàn bộ cấu hình alerting sang Ansible template + biến môi trường.
