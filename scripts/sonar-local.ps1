# Script para ejecutar análisis de SonarQube localmente en PowerShell
# Uso: .\scripts\sonar-local.ps1 [HOST_URL] [TOKEN]

param(
    [string]$SonarHostUrl = "http://localhost:9000",
    [string]$SonarToken = ""
)

# Colores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

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

Write-Log "Iniciando análisis de SonarQube local"
Write-Log "Host URL: $SonarHostUrl"

# Verificar que SonarQube esté disponible
Write-Log "Verificando conectividad con SonarQube..."
try {
    $response = Invoke-WebRequest -Uri "$SonarHostUrl/api/system/status" -Method GET -TimeoutSec 10
    if ($response.StatusCode -ne 200) {
        Write-Error "No se puede conectar a SonarQube en $SonarHostUrl"
    }
} catch {
    Write-Warning "No se puede conectar a SonarQube en $SonarHostUrl"
    Write-Warning "Esto es normal si no tienes SonarQube ejecutándose localmente"
    Write-Warning "El script continuará con las pruebas locales..."
}

# Verificar que el token esté configurado
if ([string]::IsNullOrEmpty($SonarToken)) {
    Write-Warning "No se proporcionó token de SonarQube"
    Write-Warning "Puedes obtenerlo en: $SonarHostUrl/account/security/"
    $SonarToken = Read-Host "Ingresa tu token de SonarQube (o presiona Enter para continuar sin token)"
}

# Verificar que las dependencias estén instaladas
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm no está instalado"
}

# Instalar dependencias si es necesario
if (!(Test-Path "node_modules")) {
    Write-Log "Instalando dependencias..."
    npm install
}

# Ejecutar pruebas con cobertura
Write-Log "Ejecutando pruebas con cobertura..."
npm test -- --coverage

# Verificar que el reporte de cobertura existe
if (!(Test-Path "coverage/lcov.info")) {
    Write-Error "No se encontró el reporte de cobertura. Asegúrate de que las pruebas se ejecuten correctamente."
}

# Ejecutar ESLint si está disponible
if (Get-Command npm -ErrorAction SilentlyContinue | Where-Object { npm list standard 2>$null }) {
    Write-Log "Ejecutando ESLint..."
    try {
        npm run lint
    } catch {
        Write-Warning "ESLint no está configurado o falló"
    }
}

# Si tenemos token, ejecutar SonarQube Scanner
if (![string]::IsNullOrEmpty($SonarToken)) {
    Write-Log "Ejecutando análisis de SonarQube..."
    try {
        npx sonar-scanner `
            -D"sonar.host.url=$SonarHostUrl" `
            -D"sonar.login=$SonarToken" `
            -D"sonar.projectKey=cali-joven" `
            -D"sonar.projectName=Cali Joven" `
            -D"sonar.projectVersion=1.0.0" `
            -D"sonar.sources=src" `
            -D"sonar.tests=src/__test__" `
            -D"sonar.test.inclusions=**/*.test.ts,**/*.spec.ts,**/__test__/**/*.ts" `
            -D"sonar.exclusions=node_modules/**,dist/**,coverage/**,**/*.d.ts" `
            -D"sonar.typescript.lcov.reportPaths=coverage/lcov.info" `
            -D"sonar.javascript.lcov.reportPaths=coverage/lcov.info" `
            -D"sonar.qualitygate.wait=true"

        if ($LASTEXITCODE -eq 0) {
            Write-Log "✅ Análisis de SonarQube completado exitosamente!"
            Write-Log "Puedes ver los resultados en: $SonarHostUrl/dashboard?id=cali-joven"
        } else {
            Write-Error "❌ El análisis de SonarQube falló"
        }
    } catch {
        Write-Warning "SonarQube Scanner no está disponible o falló"
        Write-Warning "Instala con: npm install -g sonar-scanner"
    }
} else {
    Write-Log "✅ Pruebas locales completadas exitosamente!"
    Write-Log "Reporte de cobertura generado en: coverage/lcov.info"
    Write-Log "Para análisis completo con SonarQube, proporciona un token válido"
}

