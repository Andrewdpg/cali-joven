# Outputs for Azure Infrastructure

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.sonarqube.name
}

output "vm_public_ip" {
  description = "Public IP address of the virtual machine"
  value       = azurerm_public_ip.sonarqube.ip_address
}

output "vm_private_ip" {
  description = "Private IP address of the virtual machine"
  value       = azurerm_network_interface.sonarqube.private_ip_address
}

output "vm_ssh_command" {
  description = "SSH command to connect to the virtual machine"
  value       = "ssh ${var.admin_username}@${azurerm_public_ip.sonarqube.ip_address}"
}

output "sonarqube_url" {
  description = "URL to access SonarQube"
  value       = "http://${azurerm_public_ip.sonarqube.ip_address}:9000"
}

output "sonarqube_nginx_url" {
  description = "URL to access SonarQube through Nginx"
  value       = "http://${azurerm_public_ip.sonarqube.ip_address}"
}

output "postgresql_server_name" {
  description = "Name of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.sonarqube.name
}

output "postgresql_server_fqdn" {
  description = "FQDN of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.sonarqube.fqdn
}

output "postgresql_database_name" {
  description = "Name of the SonarQube database"
  value       = azurerm_postgresql_flexible_server_database.sonarqube.name
}

