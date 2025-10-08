# Cali Joven - SonarQube con Azure VM y Pipeline CI/CD

Este proyecto implementa una solución completa de análisis de calidad de código utilizando SonarQube desplegado en una máquina virtual de Azure, integrada con un pipeline de CI/CD mediante GitHub Actions.

## 🏗️ Arquitectura

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

## 🚀 Características

- **Infraestructura como Código**: Terraform para Azure
- **Automatización**: Ansible para configuración de SonarQube
- **CI/CD**: GitHub Actions con análisis de código y seguridad
- **Base de Datos**: PostgreSQL gestionado en Azure
- **Proxy Inverso**: Nginx para SonarQube
- **Análisis de Seguridad**: Snyk y CodeQL
- **Cobertura de Código**: Jest con reportes LCOV

## 📁 Estructura del Proyecto

```
.
├── .github/workflows/          # GitHub Actions
│   ├── ci-cd-pipeline.yml     # Pipeline principal
│   └── security-scan.yml      # Análisis de seguridad
├── infrastructure/             # Infraestructura como código
│   ├── azure/                 # Terraform para Azure
│   │   ├── main.tf           # Recursos principales
│   │   ├── variables.tf      # Variables
│   │   ├── outputs.tf        # Outputs
│   │   └── deploy.sh         # Script de despliegue
│   └── ansible/               # Ansible para SonarQube
│       ├── playbooks/        # Playbooks
│       ├── templates/        # Templates
│       ├── group_vars/       # Variables de grupo
│       └── inventory.ini     # Inventario
├── scripts/                   # Scripts de utilidad
│   ├── sonar-local.ps1       # Análisis local (PowerShell)
│   └── deploy-azure.ps1      # Despliegue Azure (PowerShell)
├── src/                       # Código fuente
├── coverage/                  # Reportes de cobertura
├── docs/                      # Documentación
│   └── SONARQUBE_AZURE_SETUP.md
├── sonar-project.properties   # Configuración SonarQube
└── README.md                  # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** 18.x
- **TypeScript** 5.x
- **Express.js** 4.x
- **GraphQL** con Apollo Server
- **MongoDB** con Mongoose
- **JWT** para autenticación

### Infraestructura
- **Azure VM** (Ubuntu 20.04 LTS)
- **Azure PostgreSQL** (Flexible Server)
- **Terraform** (Infraestructura como código)
- **Ansible** (Automatización)
- **Nginx** (Proxy inverso)

### CI/CD y Calidad
- **GitHub Actions** (Pipeline CI/CD)
- **SonarQube** 10.6 (Análisis de calidad)
- **Jest** (Testing y cobertura)
- **ESLint** (Linting)
- **Snyk** (Análisis de seguridad)
- **CodeQL** (Análisis de seguridad)

## 🚀 Inicio Rápido

### Prerrequisitos

1. **Azure CLI** configurado y autenticado
2. **Terraform** instalado
3. **Ansible** instalado
4. **Node.js** 18.x instalado
5. **Git** instalado

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/cali-joven.git
cd cali-joven
```

### 2. Configurar Variables

```bash
# Copiar archivo de variables
cp infrastructure/azure/terraform.tfvars.example infrastructure/azure/terraform.tfvars

# Editar con tus valores
nano infrastructure/azure/terraform.tfvars
```

### 3. Desplegar Infraestructura

#### Opción A: Script Automático (PowerShell)
```powershell
.\scripts\deploy-azure.ps1 -Environment "dev" -Location "East US"
```

#### Opción B: Script Automático (Bash)
```bash
chmod +x infrastructure/azure/deploy.sh
./infrastructure/azure/deploy.sh dev "East US"
```

#### Opción C: Manual
```bash
cd infrastructure/azure
terraform init
terraform plan
terraform apply
```

### 4. Configurar GitHub Secrets

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

### 5. Acceder a SonarQube

- **URL**: `http://TU_VM_IP:9000`
- **Usuario**: `admin`
- **Contraseña**: `admin123` (cambiar inmediatamente)

## 📊 Métricas de Calidad

El proyecto incluye análisis automático de:

- **Cobertura de Código**: Mínimo 80%
- **Duplicación**: Máximo 3%
- **Deuda Técnica**: Monitoreo continuo
- **Vulnerabilidades**: Análisis de seguridad
- **Code Smells**: Detección de problemas de calidad

## 🔧 Scripts de Utilidad

### Análisis Local de SonarQube

```powershell
# PowerShell (Windows)
.\scripts\sonar-local.ps1 -SonarHostUrl "http://localhost:9000" -SonarToken "tu_token"
```

```bash
# Bash (Linux/macOS)
./scripts/sonar-local.sh http://localhost:9000 tu_token
```

### Despliegue en Azure

```powershell
# PowerShell (Windows)
.\scripts\deploy-azure.ps1 -Environment "dev" -Location "East US"
```

```bash
# Bash (Linux/macOS)
./infrastructure/azure/deploy.sh dev "East US"
```

## 🧪 Testing

```bash
# Instalar dependencias
npm install

# Ejecutar pruebas
npm test

# Ejecutar pruebas con cobertura
npm test -- --coverage

# Ejecutar linting
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📚 Documentación

- [Guía Completa de SonarQube con Azure](docs/SONARQUBE_AZURE_SETUP.md)
- [Configuración de GitHub Actions](.github/workflows/)
- [Configuración de Terraform](infrastructure/azure/)
- [Playbooks de Ansible](infrastructure/ansible/)

## 🔒 Seguridad

El proyecto incluye múltiples capas de seguridad:

- **Análisis de Vulnerabilidades**: Snyk y CodeQL
- **Autenticación JWT**: Para APIs
- **Validación de Entrada**: Zod schemas
- **Headers de Seguridad**: Nginx
- **Firewall**: Azure NSG

## 🚀 Pipeline CI/CD

### Triggers
- **Push** a ramas `main` y `develop`
- **Pull Requests** a ramas `main` y `develop`
- **Manual** mediante `workflow_dispatch`
- **Programado** (análisis de seguridad diario)

### Jobs
1. **Code Analysis**: ESLint, TypeScript, Jest, SonarQube
2. **Build**: Compilación y empaquetado
3. **Deploy Infrastructure**: Terraform (solo en main)
4. **Deploy Application**: Ansible (solo en main)
5. **Security Scan**: Snyk, CodeQL, NPM Audit

## 🛠️ Desarrollo

### Estructura del Código

```
src/
├── config/           # Configuración
├── controllers/      # Controladores REST
├── graphql/          # Resolvers GraphQL
├── lib/              # Utilidades
├── middleware/       # Middleware Express
├── models/           # Modelos Mongoose
├── routes/           # Rutas REST
├── schemas/          # Schemas Zod
├── services/         # Lógica de negocio
├── types/            # Tipos TypeScript
└── __test__/         # Pruebas unitarias
```

### Convenciones

- **TypeScript**: Tipado estricto
- **ESLint**: Standard config
- **Jest**: Testing framework
- **GraphQL**: Apollo Server
- **MongoDB**: Mongoose ODM

## 📈 Monitoreo

### Health Checks
- **SonarQube**: `http://TU_VM_IP:9000/api/system/status`
- **Nginx**: `http://TU_VM_IP/health`
- **Aplicación**: `http://TU_VM_IP:3000/health`

### Logs
- **SonarQube**: `/opt/sonarqube/logs/`
- **Nginx**: `/var/log/nginx/`
- **Aplicación**: `console.log` y archivos de log

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Andrewpg** - *Desarrollo inicial* - [GitHub](https://github.com/andrewpg)

## 🙏 Agradecimientos

- [SonarQube](https://www.sonarqube.org/) por la plataforma de análisis de código
- [Azure](https://azure.microsoft.com/) por la infraestructura en la nube
- [Terraform](https://www.terraform.io/) por la infraestructura como código
- [Ansible](https://www.ansible.com/) por la automatización
- [GitHub Actions](https://github.com/features/actions) por el CI/CD

## 📞 Soporte

Para soporte técnico o preguntas:

1. Revisa la [documentación](docs/)
2. Consulta los [issues](https://github.com/tu-usuario/cali-joven/issues)
3. Contacta al equipo de desarrollo

---

**Nota**: Esta implementación está optimizada para entornos de desarrollo y staging. Para producción, considera implementar configuraciones adicionales de seguridad, monitoreo y alta disponibilidad.