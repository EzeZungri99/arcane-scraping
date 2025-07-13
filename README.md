# 🗝️ Sherpa Automation - El Ritual de Entrada

Automatización completa del sistema Sherpa para descarga y procesamiento de manuscritos sagrados.

## ✅ **Funcionalidad Implementada**

- **Login automático** en la página de Sherpa
- **Descarga automática** de PDFs por siglos (XIV, XV, XVI, XVII, XVIII)
- **Extracción de códigos** de acceso de PDFs
- **Desbloqueo automático** de siglos con códigos extraídos
- **Procesamiento especial** para siglos XVII y XVIII con modales y APIs externas
- **Navegador persistente** para flujos complejos
- **API REST completa** para controlar toda la automatización
- **Logs temáticos** con narrativa del monje

## 🛠️ **Tecnologías**

- Node.js + Express + TypeScript
- Playwright para automatización web
- PDF-parse para extracción de códigos
- Fetch para APIs externas

## 📦 **Instalación Rápida**

```bash
git clone <tu-repositorio>
cd sherpa
npm install
npx playwright install
```

**Configurar `.env`:**
```env
SHERPA_EMAIL=monje@sherpa.local
SHERPA_PASSWORD=cript@123
PORT=3000
```

## 🚀 **Uso**

```bash
npm run dev
```

## 📡 **API Endpoints**

### 🔐 **Autenticación**
```bash
POST /api/automation/login                    # Login inicial
GET  /api/automation/status                   # Estado del proceso
GET  /api/automation/browser-status           # Estado del navegador
```

### 📜 **Flujos Completos**
```bash
POST /api/automation/page1-complete-flow      # Primeros 3 tomos (XIV, XV, XVI)
POST /api/automation/page2-complete-flow      # Últimos 2 tomos (XVII, XVIII)
POST /api/automation/run-complete-flow        # Flujo completo (5 tomos)
```

### 🎯 **Operaciones Específicas**
```bash
POST /api/automation/process-century/:century # Procesar siglo específico
POST /api/automation/process-special-century  # Procesar siglo especial (XVII/XVIII)
POST /api/automation/filter/:century          # Filtrar por siglo
POST /api/automation/download/:century        # Descargar PDF de siglo
POST /api/automation/extract/:century         # Extraer código de PDF
POST /api/automation/unlock                   # Desbloquear siglo con código
POST /api/automation/navigate/:pageNumber     # Navegar a página específica
```

### 🏥 **Health Check**
```bash
GET  /health                                  # Health check
```

## 🗝️ **El Desafío - Flujo Completo**

- **URL:** https://pruebatecnica-sherpa-production.up.railway.app/
- **Credenciales:** `monje@sherpa.local` / `cript@123`

### ✅ **Funcionalidades Implementadas:**

#### **Página 1 - Primeros 3 Tomos:**
- Login automático
- Descarga de PDF del siglo XIV
- Extracción de código de acceso
- Desbloqueo del siglo XV con código del XIV
- Descarga de PDF del siglo XV
- Extracción de código de acceso
- Desbloqueo del siglo XVI con código del XV
- Descarga de PDF del siglo XVI

#### **Página 2 - Últimos 2 Tomos:**
- Navegación automática a página 2
- Procesamiento especial para siglo XVII:
  - Apertura de modal "Ver Documentación"
  - Extracción de nombre del libro
  - Petición a API externa
  - Resolución de desafío algorítmico
  - Desbloqueo con contraseña obtenida
  - Descarga de PDF
- Procesamiento similar para siglo XVIII

### 🔧 **Características Técnicas:**
- **Manejo de errores** robusto con fallbacks
- **Delays inteligentes** para evitar rate limiting
- **Verificación de archivos** antes de procesar
- **Logs detallados** para debugging
- **Sesión persistente** entre requests

## 🏗️ **Estructura del Proyecto**

```
src/
├── config/
│   └── config.ts              # Configuración de la aplicación
├── controllers/
│   └── automation.ts          # Controladores de la API
├── middleware/
│   └── errorHandler.ts        # Manejo de errores
├── routes/
│   └── automation.ts          # Definición de endpoints
├── services/
│   ├── automation.ts          # Orquestación de flujos
│   └── playwright/
│       └── playwrightService.ts # Automatización web
├── types/
│   ├── automation.ts          # Tipos de automatización
│   └── login.ts              # Tipos de login
├── utils/
│   └── doLogin.ts            # Lógica de login
└── index.ts                  # Punto de entrada
```

## 📊 **Ejemplos de Uso**

### **Procesar siglo específico:**
```bash
curl -X POST http://localhost:3000/api/automation/process-century/XV
```

### **Ejecutar flujo completo:**
```bash
curl -X POST http://localhost:3000/api/automation/run-complete-flow
```

### **Solo primeros 3 tomos:**
```bash
curl -X POST http://localhost:3000/api/automation/page1-complete-flow
```

### **Solo últimos 2 tomos:**
```bash
curl -X POST http://localhost:3000/api/automation/page2-complete-flow
```

## 🔍 **Debugging y Logs**

El sistema proporciona logs detallados con emojis para facilitar el debugging:

- 🚀 Inicio de procesos
- ✅ Operaciones exitosas
- ❌ Errores y fallos
- 🔍 Búsquedas y filtros
- 📥 Descargas de archivos
- 🔓 Desbloqueos
- 🌐 Peticiones a APIs externas
- 🧮 Resolución de desafíos

## 🚀 **Próximos Pasos**

- **Optimización de performance** con paralelización
- **Interfaz web** para control visual
- **Métricas y analytics** del proceso
- **Notificaciones** por email/Slack
- **Tests automatizados** para validar flujos

---

**🗝️ El monje ha completado su ritual y la cripta está completamente explorada...** 🏛️ 