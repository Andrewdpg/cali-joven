/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node', // Entorno de pruebas para Node.js
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}] // Transforma archivos .ts y .tsx con ts-jest
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1' // Soporte para alias (opcional)
  },
  testMatch: [
    '**/__tests__/**/*.test.ts', // Archivos de prueba en carpetas __tests__
    '**/?(*.)+(spec|test).ts' // Archivos con sufijo .spec.ts o .test.ts
  ],
  collectCoverage: true, // Habilita la cobertura de código
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Archivos para los que se recopilará cobertura
    '!src/**/*.types.ts', // Excluye archivos de definición de tipos
    '!src/**/*.schemas.ts', // Excluye archivos de definición de equemas
    '!src/**/*.config.ts', // Excluye archivos de definición de configuración
    '!src/**/*.model.ts', // Excluye archivos de definición de modelos
    '!src/**/index.ts', // Excluye archivos de barril
    '!src/**/app.ts' // Excluye archivo principal
  ],
  coverageDirectory: 'coverage', // Carpeta donde se guardará la cobertura
  coverageReporters: ['text', 'lcov'] // Formatos de reporte de cobertura
}
