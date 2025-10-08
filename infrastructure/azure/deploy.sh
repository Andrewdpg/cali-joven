#!/bin/bash

# Script para desplegar infraestructura de SonarQube en Azure
# Uso: ./deploy.sh [environment] [location]

set -e

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar dependencias
check_dependencies() {
    log_info "Verificando dependencias..."
    
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform no está instalado. Instálalo desde https://terraform.io"
        exit 1
    fi
    
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI no está instalado. Instálalo desde https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    fi
    
    if ! command -v ansible &> /dev/null; then
        log_error "Ansible no está instalado. Instálalo con: pip install ansible"
        exit 1
    fi
    
    log_success "Todas las dependencias están instaladas"
}

# Inicializar Terraform
init_terraform() {
    log_info "Inicializando Terraform..."
    cd infrastructure/azure
    terraform init
    log_success "Terraform inicializado"
}

# Desplegar infraestructura
deploy_infrastructure() {
    local environment=${1:-dev}
    local location=${2:-"East US"}
    
    log_info "Desplegando infraestructura en Azure..."
    log_info "Environment: $environment"
    log_info "Location: $location"
    
    # Crear archivo de variables si no existe
    if [ ! -f "terraform.tfvars" ]; then
        log_warning "terraform.tfvars no encontrado. Creando desde terraform.tfvars.example..."
        cp terraform.tfvars.example terraform.tfvars
        log_warning "Por favor, edita terraform.tfvars con tus valores antes de continuar"
        exit 1
    fi
    
    # Planificar despliegue
    log_info "Planificando despliegue..."
    terraform plan -var="environment=$environment" -var="location=$location" -out=tfplan
    
    # Aplicar despliegue
    log_info "Aplicando despliegue..."
    terraform apply tfplan
    
    log_success "Infraestructura desplegada exitosamente"
}

# Obtener outputs de Terraform
get_terraform_outputs() {
    log_info "Obteniendo outputs de Terraform..."
    
    VM_IP=$(terraform output -raw vm_public_ip)
    VM_USER=$(terraform output -raw admin_username)
    POSTGRESQL_FQDN=$(terraform output -raw postgresql_server_fqdn)
    POSTGRESQL_PASSWORD=$(terraform output -raw postgresql_admin_password)
    
    log_success "Outputs obtenidos:"
    log_info "VM IP: $VM_IP"
    log_info "VM User: $VM_USER"
    log_info "PostgreSQL FQDN: $POSTGRESQL_FQDN"
}

# Configurar Ansible
configure_ansible() {
    log_info "Configurando Ansible..."
    
    cd ../ansible
    
    # Actualizar inventory con los valores de Terraform
    sed -i "s/REPLACE_WITH_VM_IP/$VM_IP/g" inventory.ini
    sed -i "s/REPLACE_WITH_SSH_USER/$VM_USER/g" inventory.ini
    sed -i "s/REPLACE_WITH_POSTGRESQL_FQDN/$POSTGRESQL_FQDN/g" inventory.ini
    sed -i "s/REPLACE_WITH_POSTGRESQL_PASSWORD/$POSTGRESQL_PASSWORD/g" inventory.ini
    
    log_success "Ansible configurado"
}

# Desplegar SonarQube
deploy_sonarqube() {
    log_info "Desplegando SonarQube..."
    
    # Ejecutar playbook de Ansible
    ansible-playbook -i inventory.ini playbooks/install_sonarqube.yml --ask-become-pass
    
    if [ $? -eq 0 ]; then
        log_success "SonarQube desplegado exitosamente"
    else
        log_error "Error al desplegar SonarQube"
        exit 1
    fi
}

# Mostrar información de acceso
show_access_info() {
    log_success "====================================================="
    log_success "  Despliegue de SonarQube completado exitosamente!  "
    log_success "====================================================="
    echo
    log_info "Información de acceso:"
    log_info "SonarQube URL: http://$VM_IP:9000"
    log_info "SonarQube Nginx: http://$VM_IP"
    log_info "SSH Command: ssh $VM_USER@$VM_IP"
    echo
    log_info "Credenciales por defecto:"
    log_info "Usuario: admin"
    log_info "Contraseña: admin123"
    echo
    log_warning "Próximos pasos:"
    log_warning "1. Cambia la contraseña del administrador"
    log_warning "2. Configura los GitHub Secrets:"
    log_warning "   - SONAR_TOKEN: Token de SonarQube"
    log_warning "   - SONAR_HOST_URL: http://$VM_IP:9000"
    log_warning "   - VM_IP: $VM_IP"
    log_warning "   - VM_USER: $VM_USER"
    log_warning "3. Configura las reglas de calidad y quality gates"
}

# Función principal
main() {
    local environment=${1:-dev}
    local location=${2:-"East US"}
    
    echo -e "${GREEN}=====================================================${NC}"
    echo -e "${GREEN}  Despliegue de SonarQube en Azure con Terraform   ${NC}"
    echo -e "${GREEN}=====================================================${NC}"
    echo
    
    check_dependencies
    init_terraform
    deploy_infrastructure "$environment" "$location"
    get_terraform_outputs
    configure_ansible
    deploy_sonarqube
    show_access_info
}

# Ejecutar función principal
main "$@"

