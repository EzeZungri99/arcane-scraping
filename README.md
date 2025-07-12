# 🔑 Sherpa Automation

API de automatización para la prueba técnica de Sherpa usando Node.js + Express + TypeScript.

## 🚀 Uso

```bash
# Instalar dependencias
npm install

# Instalar Playwright
npm run install-playwright

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── routes/
│   └── automation.ts         # Rutas de la API
├── controllers/
│   └── automation.ts         # Controladores
├── services/
│   ├── automation.ts         # Servicio principal
│   └── playwright/
│       └── playwrightService.ts  # Servicio de Playwright
├── utils/
│   ├── findElement.ts        # Buscar elementos
│   ├── navigateToPage.ts     # Navegación
│   ├── doLogin.ts            # Login
│   ├── screenshot.ts         # Screenshots
│   └── selectors.ts          # Selectores
├── types/
│   ├── index.ts              # Tipos principales
│   ├── automation.ts         # Tipos de automatización
│   └── login.ts              # Tipos de login
├── config/
│   ├── config.ts             # Configuración principal
│   └── constants.ts          # Constantes
├── middleware/               # Middleware de Express
└── index.ts                  # Punto de entrada
```

## 🔧 Características

- ✅ **Node.js + Express** - API REST
- ✅ **TypeScript** - Type safety
- ✅ **Playwright** - Automatización de navegador
- ✅ **Arquitectura modular** - Separación de responsabilidades
- ✅ **API REST** - Endpoints para controlar automatización

## 🎯 Endpoints

- `POST /api/automation/start` - Iniciar automatización
- `GET /api/automation/status` - Obtener estado
- `POST /api/automation/stop` - Detener automatización
- `GET /api/automation/screenshots` - Obtener screenshots

## 🔑 Credenciales

- **Email**: `monje@sherpa.local`
- **Password**: `cript@123`

¡Listo para automatizar! 🎉 