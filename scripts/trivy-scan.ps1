# Script para ejecutar análisis de seguridad con Trivy
# Uso: .\scripts\trivy-scan.ps1

param(
    [string]$ScanType = "fs",
    [string]$ScanRef = ".",
    [string]$Format = "table",
    [string]$Output = "trivy-results.txt",
    [string]$Severity = "CRITICAL,HIGH,MEDIUM",
    [switch]$Verbose
)

Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Iniciando análisis de seguridad con Trivy"
Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Tipo de escaneo: $ScanType"
Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Referencia: $ScanRef"
Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Formato: $Format"
Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Severidad: $Severity"

# Verificar si Trivy está instalado
Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Verificando instalación de Trivy..."
try {
    $trivyVersion = trivy --version
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Trivy instalado: $trivyVersion"
} catch {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Trivy no está instalado. Instalando..."
    
    # Instalar Trivy usando winget (Windows Package Manager)
    try {
        winget install AquaSecurity.Trivy
        Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Trivy instalado exitosamente"
    } catch {
        Write-Error "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Error al instalar Trivy. Instala manualmente desde: https://github.com/aquasecurity/trivy/releases"
        exit 1
    }
}

# Actualizar la base de datos de vulnerabilidades
Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Actualizando base de datos de vulnerabilidades..."
trivy image --download-db-only

# Ejecutar el escaneo
Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Ejecutando escaneo de vulnerabilidades..."

$trivyCommand = "trivy $ScanType $ScanRef --format $Format --output $Output --severity $Severity"

if ($Verbose) {
    $trivyCommand += " --debug"
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Comando Trivy: $trivyCommand"
}

Invoke-Expression $trivyCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ✅ Escaneo de Trivy completado exitosamente"
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Resultados guardados en: $Output"
    
    if (Test-Path $Output) {
        Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Contenido del reporte:"
        Get-Content $Output | Select-Object -First 20
    }
} else {
    Write-Warning "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] El escaneo de Trivy encontró vulnerabilidades o falló"
    if (Test-Path $Output) {
        Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Revisa el reporte en: $Output"
    }
}

Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Análisis de seguridad con Trivy finalizado"

