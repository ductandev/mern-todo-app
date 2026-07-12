variable "do_token" {
  description = "DigitalOcean API token cho Terraform"
  type        = string
  sensitive   = true
}

variable "ssh_key_fingerprint" {
  description = "Fingerprint của SSH key đã upload lên DigitalOcean, dùng để truy cập VPS"
  type        = string
  sensitive   = true
}

variable "droplet_name" {
  description = "Tên của Droplet"
  type        = string
  default     = "mern-todo-vps"
}

variable "droplet_image" {
  description = "OS image cho Droplet"
  type        = string
  default     = "ubuntu-24-04-x64"
}

variable "droplet_region" {
  description = "Region của Droplet"
  type        = string
  default     = "sgp1"
}

variable "droplet_size" {
  description = "Kích thước Droplet"
  type        = string
  default     = "s-2vcpu-4gb-120gb-intel"
}

variable "allowed_ssh_cidrs" {
  description = "Dải IP được phép SSH vào VPS (nên giới hạn về IP của bạn thay vì 0.0.0.0/0)"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "admin_ui_cidrs" {
  description = "Dải IP được phép truy cập các UI quản trị (Jenkins, Grafana, Prometheus, Portainer, NPM admin)"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
