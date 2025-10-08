# Variables for Azure Infrastructure

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "vm_size" {
  description = "Size of the virtual machine"
  type        = string
  default     = "Standard_B2s" # 2 vCPUs, 4 GB RAM
}

variable "admin_username" {
  description = "Admin username for the virtual machine"
  type        = string
  default     = "azureuser"
}

variable "ssh_public_key_path" {
  description = "Path to the SSH public key"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "disk_size" {
  description = "Size of the OS disk in GB"
  type        = number
  default     = 50
}

variable "db_admin_username" {
  description = "PostgreSQL admin username"
  type        = string
  default     = "sonaradmin"
}

variable "db_admin_password" {
  description = "PostgreSQL admin password"
  type        = string
  sensitive   = true
  default     = "SonarQube2024!"
}

# Tags
variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Environment = "dev"
    Project     = "SonarQube"
    ManagedBy   = "Terraform"
  }
}

