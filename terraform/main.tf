resource "digitalocean_droplet" "vps" {
  image  = var.droplet_image
  name   = var.droplet_name
  region = var.droplet_region
  size   = var.droplet_size

  ssh_keys = [
    var.ssh_key_fingerprint
  ]

  tags = [
    "mern-todo",
    "devops-final-project",
    "managed-by-terraform",
  ]
}
