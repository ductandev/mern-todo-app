variable "do_token" {
  description = "đây là token cho phép terraform truy cập vào tài khoản DigitalOcean"
  sensitive = true    # ẩn giá trị nhạy cảm khi hiển thị ra màn hình
}

variable "ssh_key_fingerprint" {
  description = "đây là fingerprint của khóa SSH được sử dụng để truy cập vào VPS"
  sensitive = true    # ẩn giá trị nhạy cảm khi hiển thị ra màn hình
}


terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.87.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "vps" {
  image  = "ubuntu-24-04-x64"
  name   = "terraform-vps"
  region = "sgp1"
  size   = "s-2vcpu-4gb-120gb-intel"

  ssh_keys = [
    var.ssh_key_fingerprint
  ]
}

output "vps_ip" {
  value = digitalocean_droplet.vps.ipv4_address
}


