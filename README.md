# 🗝️ Sherpa Automation - El Ritual de Entrada

Automatización del **PASO 1: EL RITUAL DE ENTRADA** 
## ✅ **Funcionalidad Implementada**

- **Login automático** en la página de Sherpa
- **Navegador persistente** para próximos pasos
- **API REST** para controlar la automatización
- **Logs temáticos** con narrativa del monje

## 🛠️ **Tecnologías**

- Node.js + Express + TypeScript
- Playwright para automatización

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
curl -X POST http://localhost:3000/api/automation/start
```

## 📡 **API Endpoints**

```bash
POST /api/automation/start          # Iniciar automatización
GET  /api/automation/status         # Estado del proceso
GET  /api/automation/browser-status # Estado del navegador
GET  /health                        # Health check
```

## 🗝️ **El Desafío - PASO 1**

- **URL:** https://pruebatecnica-sherpa-production.up.railway.app/
- **Credenciales:** `monje@sherpa.local` / `cript@123`

### ✅ **Funcionalidades:**
- Navegación automática a la página de login
- Llenado automático de credenciales
- Click automático en botón de login
- Verificación de login exitoso
- Navegador mantenido abierto para próximos pasos

## 🏗️ **Estructura**

```
src/
├── utils/doLogin.ts           # Lógica de login
├── services/playwright/       # Automatización
├── controllers/automation.ts  # API
└── routes/automation.ts       # Endpoints
```

## 🚀 **Próximos Pasos**

El navegador permanece abierto para continuar con:
- **PASO 2:** Descarga de manuscritos
- **PASO 3:** Extracción de códigos de PDFs
- **PASO 4:** Resolución de desafíos de API
- **PASO 5:** Completar la colección

---

**🗝️ El monje ha entrado a la cripta y está listo para continuar su aventura...** 