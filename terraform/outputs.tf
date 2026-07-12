output "vps_ip" {
  description = "Public IPv4 của VPS — dùng cho Ansible inventory và DNS A record"
  value       = digitalocean_droplet.vps.ipv4_address
}

output "droplet_id" {
  description = "ID của Droplet"
  value       = digitalocean_droplet.vps.id
}

output "droplet_name" {
  description = "Tên Droplet"
  value       = digitalocean_droplet.vps.name
}
