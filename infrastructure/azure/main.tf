# Azure Infrastructure for SonarQube
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "sonarqube" {
  name     = "rg-sonarqube-${var.environment}"
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "SonarQube"
    ManagedBy   = "Terraform"
  }
}

# Virtual Network
resource "azurerm_virtual_network" "sonarqube" {
  name                = "vnet-sonarqube-${var.environment}"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.sonarqube.location
  resource_group_name = azurerm_resource_group.sonarqube.name

  tags = {
    Environment = var.environment
    Project     = "SonarQube"
  }
}

# Subnet
resource "azurerm_subnet" "sonarqube" {
  name                 = "subnet-sonarqube-${var.environment}"
  resource_group_name  = azurerm_resource_group.sonarqube.name
  virtual_network_name = azurerm_virtual_network.sonarqube.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Network Security Group
resource "azurerm_network_security_group" "sonarqube" {
  name                = "nsg-sonarqube-${var.environment}"
  location            = azurerm_resource_group.sonarqube.location
  resource_group_name = azurerm_resource_group.sonarqube.name

  # SSH
  security_rule {
    name                       = "SSH"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  # HTTP
  security_rule {
    name                       = "HTTP"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  # HTTPS
  security_rule {
    name                       = "HTTPS"
    priority                   = 1003
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  # SonarQube
  security_rule {
    name                       = "SonarQube"
    priority                   = 1004
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "9000"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = {
    Environment = var.environment
    Project     = "SonarQube"
  }
}

# Associate NSG with Subnet
resource "azurerm_subnet_network_security_group_association" "sonarqube" {
  subnet_id                 = azurerm_subnet.sonarqube.id
  network_security_group_id = azurerm_network_security_group.sonarqube.id
}

# Public IP
resource "azurerm_public_ip" "sonarqube" {
  name                = "pip-sonarqube-${var.environment}"
  resource_group_name = azurerm_resource_group.sonarqube.name
  location            = azurerm_resource_group.sonarqube.location
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = {
    Environment = var.environment
    Project     = "SonarQube"
  }
}

# Network Interface
resource "azurerm_network_interface" "sonarqube" {
  name                = "nic-sonarqube-${var.environment}"
  location            = azurerm_resource_group.sonarqube.location
  resource_group_name = azurerm_resource_group.sonarqube.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.sonarqube.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.sonarqube.id
  }

  tags = {
    Environment = var.environment
    Project     = "SonarQube"
  }
}

# Virtual Machine
resource "azurerm_linux_virtual_machine" "sonarqube" {
  name                = "vm-sonarqube-${var.environment}"
  resource_group_name = azurerm_resource_group.sonarqube.name
  location            = azurerm_resource_group.sonarqube.location
  size                = var.vm_size
  admin_username      = var.admin_username

  disable_password_authentication = true

  network_interface_ids = [
    azurerm_network_interface.sonarqube.id,
  ]

  admin_ssh_key {
    username   = var.admin_username
    public_key = file(var.ssh_public_key_path)
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
    disk_size_gb         = var.disk_size
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts-gen2"
    version   = "latest"
  }

  boot_diagnostics {
    storage_account_uri = azurerm_storage_account.sonarqube.primary_blob_endpoint
  }

  tags = {
    Environment = var.environment
    Project     = "SonarQube"
  }
}

# Storage Account for Boot Diagnostics
resource "azurerm_storage_account" "sonarqube" {
  name                     = "stsonarqube${var.environment}${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.sonarqube.name
  location                 = azurerm_resource_group.sonarqube.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    Environment = var.environment
    Project     = "SonarQube"
  }
}

# Random string for storage account name
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# PostgreSQL Database
resource "azurerm_postgresql_flexible_server" "sonarqube" {
  name                   = "psql-sonarqube-${var.environment}"
  resource_group_name    = azurerm_resource_group.sonarqube.name
  location               = azurerm_resource_group.sonarqube.location
  version                = "13"
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password
  zone                   = "1"

  storage_mb = 32768
  sku_name   = "GP_Standard_D2s_v3"

  backup_retention_days        = 7
  geo_redundant_backup_enabled = false

  tags = {
    Environment = var.environment
    Project     = "SonarQube"
  }
}

# PostgreSQL Database
resource "azurerm_postgresql_flexible_server_database" "sonarqube" {
  name      = "sonar"
  server_id = azurerm_postgresql_flexible_server.sonarqube.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# PostgreSQL Firewall Rule
resource "azurerm_postgresql_flexible_server_firewall_rule" "sonarqube" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.sonarqube.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

