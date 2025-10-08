# Guía de Implementación de SonarQube con Azure VM y Pipeline CI/CD

Este documento detalla la implementación completa de SonarQube en una máquina virtual de Azure, integrada con un pipeline de CI/CD utilizando GitHub Actions. La solución incluye la automatización del despliegue de infraestructura con Terraform, la configuración de SonarQube con Ansible, y la integración con análisis de calidad de código y seguridad.

## 📋 Tabla de Contenidos

1. [Arquitectura General](#1-arquitectura-general)
2. [Prerrequisitos](#2-prerrequisitos)
3. [Configuración de Azure](#3-configuración-de-azure)
4. [Despliegue de Infraestructura](#4-despliegue-de-infraestructura)
5. [Configuración de SonarQube](#5-configuración-de-sonarqube)
6. [Pipeline de CI/CD](#6-pipeline-de-cicd)
7. [Configuración del Proyecto](#7-configuración-del-proyecto)
8. [Scripts de Utilidad](#8-scripts-de-utilidad)
9. [Troubleshooting](#9-troubleshooting)
10. [Mantenimiento](#10-mantenimiento)

## 1. Arquitectura General

La arquitectura propuesta se compone de los siguientes elementos:

- **Azure VM**: Máquina virtual Ubuntu que aloja SonarQube, Nginx y PostgreSQL
- **Azure PostgreSQL**: Base de datos gestionada para SonarQube
- **Terraform**: Infraestructura como código para el despliegue en Azure
- **Ansible**: Automatización de la configuración de SonarQube
- **GitHub Actions**: Pipeline de CI/CD para análisis de código y despliegue
- **Nginx**: Proxy inverso para SonarQube

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  GitHub Actions │───▶│   Azure VM      │
│                 │    │                 │    │   (SonarQube)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Terraform     │    │   PostgreSQL    │
                       │   (Infra)       │    │   (Azure DB)    │
                       └─────────────────┘    └─────────────────┘
```

## 2. Prerrequisitos

### 2.1 Herramientas Requeridas

- **Azure CLI**: Para autenticación y gestión de recursos
- **Terraform**: Para el despliegue de infraestructura
- **Ansible**: Para la configuración de SonarQube
- **Node.js**: Para el desarrollo del proyecto
- **Git**: Para control de versiones

### 2.2 Cuenta de Azure

- Suscripción activa de Azure
- Permisos para crear recursos (Contributor o Owner)
- Azure CLI configurado y autenticado

### 2.3 GitHub Repository

- Repositorio con el código fuente
- GitHub Actions habilitado
- Secrets configurados (ver sección 6.3)

## 3. Configuración de Azure

### 3.1 Autenticación

```bash
# Iniciar sesión en Azure
az login

# Verificar suscripción activa
az account show

# Configurar suscripción por defecto (si es necesario)
az account set --subscription "SUBSCRIPTION_ID"
```

### 3.2 Crear Service Principal (Opcional)

Para GitHub Actions, necesitarás un Service Principal:

```bash
# Crear Service Principal
az ad sp create-for-rbac --name "sonarqube-github-actions" \
  --role Contributor \
  --scopes /subscriptions/SUBSCRIPTION_ID

# Guardar la salida para configurar GitHub Secrets
```

## 4. Despliegue de Infraestructura

### 4.1 Configuración de Variables

1. Copia el archivo de ejemplo:
```bash
cp infrastructure/azure/terraform.tfvars.example infrastructure/azure/terraform.tfvars
```

2. Edita `terraform.tfvars` con tus valores:
```hcl
environment = "dev"
location    = "East US"
vm_size     = "Standard_B2s"  # 2 vCPUs, 4 GB RAM

# SSH Configuration
admin_username        = "azureuser"
ssh_public_key_path   = "~/.ssh/id_rsa.pub"

# Disk Configuration
disk_size = 50

# Database Configuration
db_admin_username = "sonaradmin"
db_admin_password = "TuContraseñaSegura123!"
```

### 4.2 Despliegue Automático

#### Opción 1: Script de PowerShell (Windows)
```powershell
.\scripts\deploy-azure.ps1 -Environment "dev" -Location "East US"
```

#### Opción 2: Script de Bash (Linux/macOS)
```bash
chmod +x infrastructure/azure/deploy.sh
./infrastructure/azure/deploy.sh dev "East US"
```

#### Opción 3: Manual con Terraform
```bash
cd infrastructure/azure
terraform init
terraform plan -var="environment=dev" -var="location=East US"
terraform apply
```

### 4.3 Verificar Despliegue

Después del despliegue, obtendrás:
- **VM IP**: Dirección IP pública de la máquina virtual
- **VM User**: Usuario SSH para conectarse
- **PostgreSQL FQDN**: Nombre completo del servidor de base de datos

## 5. Configuración de SonarQube

### 5.1 Acceso Inicial

1. **URL de SonarQube**: `http://TU_VM_IP:9000`
2. **Credenciales por defecto**:
   - Usuario: `admin`
   - Contraseña: `admin123`

### 5.2 Configuración de Seguridad

1. **Cambiar contraseña de administrador**:
   - Ve a `Administration > Security > Users`
   - Cambia la contraseña del usuario `admin`

2. **Generar token de usuario**:
   - Ve a `My Account > Security`
   - Genera un nuevo token para GitHub Actions

### 5.3 Configuración de Proyecto

1. **Crear proyecto**:
   - Ve a `Projects > Create Project`
   - Key: `cali-joven`
   - Name: `Cali Joven`

2. **Configurar Quality Gates**:
   - Ve a `Quality Gates`
   - Configura las reglas de calidad según tus necesidades

## 6. Pipeline de CI/CD

### 6.1 GitHub Actions Workflows

El proyecto incluye dos workflows principales:

- **`.github/workflows/ci-cd-pipeline.yml`**: Pipeline principal con análisis de código y despliegue
- **`.github/workflows/security-scan.yml`**: Análisis de seguridad con Snyk y CodeQL

### 6.2 Configuración de Secrets

Configura los siguientes secrets en tu repositorio de GitHub:

```
SONAR_TOKEN=tu_token_de_sonarqube
SONAR_HOST_URL=http://TU_VM_IP:9000
SONAR_ORGANIZATION=cali-joven-org
VM_IP=TU_VM_IP
VM_USER=azureuser
AZURE_CREDENTIALS={"clientId":"...","clientSecret":"...","subscriptionId":"...","tenantId":"..."}
SNYK_TOKEN=tu_token_de_snyk
```

### 6.3 Triggers del Pipeline

El pipeline se ejecuta en:
- **Push** a ramas `main` y `develop`
- **Pull Requests** a ramas `main` y `develop`
- **Manual** mediante `workflow_dispatch`
- **Programado** (análisis de seguridad diario)

## 7. Configuración del Proyecto

### 7.1 Archivo `sonar-project.properties`

El archivo está configurado para:
- Análisis de TypeScript/JavaScript
- Cobertura de código con Jest
- Integración con ESLint
- Configuración de exclusiones
- Quality gates

### 7.2 Estructura del Proyecto

```
.
├── .github/workflows/          # GitHub Actions
├── infrastructure/             # Infraestructura como código
│   ├── azure/                 # Terraform para Azure
│   └── ansible/               # Ansible para SonarQube
├── scripts/                   # Scripts de utilidad
├── src/                       # Código fuente
├── coverage/                  # Reportes de cobertura
└── docs/                      # Documentación
```

## 8. Scripts de Utilidad

### 8.1 Análisis Local

#### PowerShell (Windows):
```powershell
.\scripts\sonar-local.ps1 -SonarHostUrl "http://TU_VM_IP:9000" -SonarToken "tu_token"
```

#### Bash (Linux/macOS):
```bash
./scripts/sonar-local.sh http://TU_VM_IP:9000 tu_token
```

### 8.2 Despliegue en Azure

#### PowerShell (Windows):
```powershell
.\scripts\deploy-azure.ps1 -Environment "dev" -Location "East US"
```

#### Bash (Linux/macOS):
```bash
./infrastructure/azure/deploy.sh dev "East US"
```

## 9. Troubleshooting

### 9.1 Problemas Comunes

#### SonarQube no inicia
```bash
# Verificar logs
sudo journalctl -u sonarqube -f

# Verificar configuración
sudo -u sonar /opt/sonarqube/bin/linux-x86-64/sonar.sh console
```

#### Error de conexión a PostgreSQL
```bash
# Verificar conectividad
psql -h POSTGRESQL_FQDN -U sonaradmin -d sonar

# Verificar configuración en sonar.properties
sudo cat /opt/sonarqube/conf/sonar.properties | grep jdbc
```

#### Error de memoria
```bash
# Verificar uso de memoria
free -h
htop

# Ajustar configuración de memoria en sonar.properties
sudo nano /opt/sonarqube/conf/sonar.properties
```

### 9.2 Logs Importantes

- **SonarQube**: `/opt/sonarqube/logs/`
- **Nginx**: `/var/log/nginx/`
- **Systemd**: `journalctl -u sonarqube`

## 10. Mantenimiento

### 10.1 Actualizaciones

#### SonarQube
```bash
# Actualizar versión en group_vars/sonarqube.yml
# Ejecutar playbook de Ansible
ansible-playbook -i inventory.ini playbooks/install_sonarqube.yml
```

#### Dependencias del Proyecto
```bash
# Actualizar dependencias de Node.js
npm update

# Actualizar dependencias de Ansible
pip install --upgrade ansible
```

### 10.2 Backup

#### Base de datos PostgreSQL
```bash
# Backup manual
pg_dump -h POSTGRESQL_FQDN -U sonaradmin sonar > sonar_backup.sql

# Restore
psql -h POSTGRESQL_FQDN -U sonaradmin sonar < sonar_backup.sql
```

#### Configuración de SonarQube
```bash
# Backup de configuración
sudo tar -czf sonarqube_config_backup.tar.gz /opt/sonarqube/conf/
```

### 10.3 Monitoreo

#### Health Checks
- **SonarQube**: `http://TU_VM_IP:9000/api/system/status`
- **Nginx**: `http://TU_VM_IP/health`

#### Métricas de Recursos
```bash
# CPU y memoria
htop

# Disco
df -h

# Red
netstat -tulpn
```

## 🚀 Próximos Pasos

1. **Configurar Quality Gates** personalizados
2. **Integrar con Slack/Teams** para notificaciones
3. **Configurar alertas** de Azure Monitor
4. **Implementar backup automático** de la base de datos
5. **Configurar SSL/TLS** con Let's Encrypt

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la sección de [Troubleshooting](#9-troubleshooting)
2. Consulta los logs del sistema
3. Verifica la configuración de red y firewall
4. Contacta al equipo de DevOps

---

**Nota**: Esta implementación está optimizada para entornos de desarrollo y staging. Para producción, considera implementar configuraciones adicionales de seguridad, monitoreo y alta disponibilidad.

