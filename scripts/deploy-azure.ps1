# Script para desplegar SonarQube en Azure
# Uso: .\scripts\deploy-azure.ps1 [environment] [location]

param(
    [string]$Environment = "dev",
    [string]$Location = "East US"
)

# Colores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Función para mostrar mensajes
function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] WARNING: $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ERROR: $Message" -ForegroundColor $Red
    exit 1
}

function Write-Info {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Blue
}

Write-Log "Iniciando despliegue de SonarQube en Azure"
Write-Info "Environment: $Environment"
Write-Info "Location: $Location"

# Verificar dependencias
Write-Log "Verificando dependencias..."

if (!(Get-Command terraform -ErrorAction SilentlyContinue)) {
    Write-Error "Terraform no está instalado. Instálalo desde https://terraform.io"
}

if (!(Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI no está instalado. Instálalo desde https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
}

if (!(Get-Command ansible -ErrorAction SilentlyContinue)) {
    Write-Error "Ansible no está instalado. Instálalo con: pip install ansible"
}

Write-Log "Todas las dependencias están instaladas"

# Verificar login de Azure
Write-Log "Verificando login de Azure..."
try {
    $azAccount = az account show --query "name" -o tsv 2>$null
    if ($azAccount) {
        Write-Log "Conectado a Azure como: $azAccount"
    } else {
        Write-Error "No estás conectado a Azure. Ejecuta 'az login' primero"
    }
} catch {
    Write-Error "Error al verificar el login de Azure"
}

# Navegar al directorio de infraestructura
Set-Location "infrastructure/azure"

# Inicializar Terraform
Write-Log "Inicializando Terraform..."
terraform init
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al inicializar Terraform"
}

# Crear archivo de variables si no existe
if (!(Test-Path "terraform.tfvars")) {
    Write-Warning "terraform.tfvars no encontrado. Creando desde terraform.tfvars.example..."
    Copy-Item "terraform.tfvars.example" "terraform.tfvars"
    Write-Warning "Por favor, edita terraform.tfvars con tus valores antes de continuar"
    exit 1
}

# Planificar despliegue
Write-Log "Planificando despliegue..."
terraform plan -var="environment=$Environment" -var="location=$Location" -out=tfplan
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al planificar el despliegue"
}

# Aplicar despliegue
Write-Log "Aplicando despliegue..."
terraform apply tfplan
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al aplicar el despliegue"
}

# Obtener outputs
Write-Log "Obteniendo outputs de Terraform..."
$VM_IP = terraform output -raw vm_public_ip
$VM_USER = terraform output -raw admin_username
$POSTGRESQL_FQDN = terraform output -raw postgresql_server_fqdn
$POSTGRESQL_PASSWORD = terraform output -raw postgresql_admin_password

Write-Log "Outputs obtenidos:"
Write-Info "VM IP: $VM_IP"
Write-Info "VM User: $VM_USER"
Write-Info "PostgreSQL FQDN: $POSTGRESQL_FQDN"

# Configurar Ansible
Write-Log "Configurando Ansible..."
Set-Location "../ansible"

# Actualizar inventory con los valores de Terraform
$inventoryContent = Get-Content "inventory.ini" -Raw
$inventoryContent = $inventoryContent -replace "REPLACE_WITH_VM_IP", $VM_IP
$inventoryContent = $inventoryContent -replace "REPLACE_WITH_SSH_USER", $VM_USER
$inventoryContent = $inventoryContent -replace "REPLACE_WITH_POSTGRESQL_FQDN", $POSTGRESQL_FQDN
$inventoryContent = $inventoryContent -replace "REPLACE_WITH_POSTGRESQL_PASSWORD", $POSTGRESQL_PASSWORD
Set-Content "inventory.ini" $inventoryContent

Write-Log "Ansible configurado"

# Desplegar SonarQube
Write-Log "Desplegando SonarQube..."
ansible-playbook -i inventory.ini playbooks/install_sonarqube.yml --ask-become-pass
if ($LASTEXITCODE -eq 0) {
    Write-Log "SonarQube desplegado exitosamente"
} else {
    Write-Error "Error al desplegar SonarQube"
}

# Mostrar información de acceso
Write-Log "====================================================="
Write-Log "  Despliegue de SonarQube completado exitosamente!  "
Write-Log "====================================================="
Write-Info "Información de acceso:"
Write-Info "SonarQube URL: http://$VM_IP:9000"
Write-Info "SonarQube Nginx: http://$VM_IP"
Write-Info "SSH Command: ssh $VM_USER@$VM_IP"
Write-Info "Credenciales por defecto:"
Write-Info "Usuario: admin"
Write-Info "Contraseña: admin123"
Write-Warning "Próximos pasos:"
Write-Warning "1. Cambia la contraseña del administrador"
Write-Warning "2. Configura los GitHub Secrets:"
Write-Warning "   - SONAR_TOKEN: Token de SonarQube"
Write-Warning "   - SONAR_HOST_URL: http://$VM_IP:9000"
Write-Warning "   - VM_IP: $VM_IP"
Write-Warning "   - VM_USER: $VM_USER"
Write-Warning "3. Configura las reglas de calidad y quality gates"

# Volver al directorio raíz
Set-Location "../.."

