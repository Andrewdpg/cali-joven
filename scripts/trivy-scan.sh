#!/bin/bash

# Script para ejecutar análisis de seguridad con Trivy
# Uso: ./scripts/trivy-scan.sh

set -e

# Variables por defecto
SCAN_TYPE=${1:-"fs"}
SCAN_REF=${2:-"."}
FORMAT=${3:-"table"}
OUTPUT=${4:-"trivy-results.txt"}
SEVERITY=${5:-"CRITICAL,HIGH,MEDIUM"}
VERBOSE=${6:-false}

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Iniciando análisis de seguridad con Trivy"
log "Tipo de escaneo: $SCAN_TYPE"
log "Referencia: $SCAN_REF"
log "Formato: $FORMAT"
log "Severidad: $SEVERITY"

# Verificar si Trivy está instalado
log "Verificando instalación de Trivy..."
if ! command -v trivy &> /dev/null; then
    log "Trivy no está instalado. Instalando..."
    
    # Detectar el sistema operativo
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install trivy
        else
            curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
        fi
    else
        log "Sistema operativo no soportado. Instala Trivy manualmente desde: https://github.com/aquasecurity/trivy/releases"
        exit 1
    fi
    
    log "Trivy instalado exitosamente"
else
    TRIVY_VERSION=$(trivy --version)
    log "Trivy instalado: $TRIVY_VERSION"
fi

# Actualizar la base de datos de vulnerabilidades
log "Actualizando base de datos de vulnerabilidades..."
trivy image --download-db-only

# Ejecutar el escaneo
log "Ejecutando escaneo de vulnerabilidades..."

TRIVY_COMMAND="trivy $SCAN_TYPE $SCAN_REF --format $FORMAT --output $OUTPUT --severity $SEVERITY"

if [ "$VERBOSE" = "true" ]; then
    TRIVY_COMMAND="$TRIVY_COMMAND --debug"
    log "Comando Trivy: $TRIVY_COMMAND"
fi

eval $TRIVY_COMMAND

if [ $? -eq 0 ]; then
    log "✅ Escaneo de Trivy completado exitosamente"
    log "Resultados guardados en: $OUTPUT"
    
    if [ -f "$OUTPUT" ]; then
        log "Contenido del reporte:"
        head -20 "$OUTPUT"
    fi
else
    log "⚠️  El escaneo de Trivy encontró vulnerabilidades o falló"
    if [ -f "$OUTPUT" ]; then
        log "Revisa el reporte en: $OUTPUT"
    fi
fi

log "Análisis de seguridad con Trivy finalizado"

