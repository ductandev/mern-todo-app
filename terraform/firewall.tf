# Cloud firewall của DigitalOcean — chặn mọi inbound trừ các port khai báo.
# Các exporter (9100, 9216) và MongoDB (27017) KHÔNG mở ra ngoài:
# Prometheus scrape qua Docker network nội bộ, Mongo chỉ bind 127.0.0.1.
resource "digitalocean_firewall" "vps" {
  name        = "${var.droplet_name}-fw"
  droplet_ids = [digitalocean_droplet.vps.id]

  # SSH
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = var.allowed_ssh_cidrs
  }

  # Web ingress qua Nginx Proxy Manager
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Truy cập trực tiếp app khi chưa cấu hình proxy (frontend / backend)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "5173"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "8300"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Nginx Proxy Manager admin UI
  inbound_rule {
    protocol         = "tcp"
    port_range       = "81"
    source_addresses = var.admin_ui_cidrs
  }

  # Jenkins (GitHub Actions gọi vào để trigger deploy)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "8080"
    source_addresses = var.admin_ui_cidrs
  }

  # Grafana
  inbound_rule {
    protocol         = "tcp"
    port_range       = "3000"
    source_addresses = var.admin_ui_cidrs
  }

  # Prometheus UI
  inbound_rule {
    protocol         = "tcp"
    port_range       = "9090"
    source_addresses = var.admin_ui_cidrs
  }

  # Alertmanager UI
  inbound_rule {
    protocol         = "tcp"
    port_range       = "9093"
    source_addresses = var.admin_ui_cidrs
  }

  # Portainer
  inbound_rule {
    protocol         = "tcp"
    port_range       = "9000"
    source_addresses = var.admin_ui_cidrs
  }

  # ICMP (ping)
  inbound_rule {
    protocol         = "icmp"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Outbound: cho phép tất cả
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
