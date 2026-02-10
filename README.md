# MONETA-ICT - Plataforma de Inversiones

Sistema de inversión web para Colombia y Perú con gestión manual de aprobaciones vía Telegram.

## 🚀 Stack Tecnológico

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Notificaciones**: React Hot Toast
- **Gestión de Estado**: Context API + localStorage

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de producción
npm run preview
```

## 🌍 Características Principales

### Soporte Multipaís
- **Colombia**: Moneda COP (Peso Colombiano)
- **Perú**: Moneda PEN (Nuevo Sol)

### Funcionalidades
- ✅ Registro y Login
- ✅ Dashboard con resumen de cuenta
- ✅ 12 Planes de inversión
- ✅ Depósitos con comprobante
- ✅ Retiros bancarios
- ✅ Historial de transacciones
- ✅ Sistema de referidos
- ✅ Panel administrativo

## 📁 Estructura del Proyecto

```
moneta-ict/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MobileNav.jsx
│   │   │   └── Layout.jsx
│   │   ├── shared/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── AppContext.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── pages/
│   │   └── index.jsx (todas las páginas)
│   ├── utils/
│   │   ├── constants.js
│   │   ├── currency.js
│   │   ├── validators.js
│   │   └── cn.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🔐 Límites por País

### Colombia (COP)
- Depósito mínimo: $40.000 COP
- Retiro mínimo: $25.000 COP
- Bono de bienvenida: $12.000 COP
- Inversión mínima: $50.000 COP

### Perú (PEN)
- Depósito mínimo: S/35 PEN
- Retiro mínimo: S/22 PEN
- Bono de bienvenida: S/10 PEN
- Inversión mínima: S/45 PEN

## 🎯 Estado del Proyecto

### ✅ FASE 1 COMPLETADA: Configuración Base
- [x] Configuración de Vite + React
- [x] Tailwind CSS instalado
- [x] Routing con rutas protegidas
- [x] AuthContext (esqueleto)
- [x] AppContext (gestión de datos)
- [x] Layout components (Navbar, MobileNav)
- [x] Componentes compartidos
- [x] Utilidades (currency, validators, constants)
- [x] Estructura de carpetas completa

### 🔄 Próximas Fases
- Fase 2: Autenticación (Login/Register)
- Fase 3: Layout & Navegación
- Fase 4: Dashboard
- Fase 5: Planes de Inversión
- Fase 6: Depósitos
- Fase 7: Retiros
- Fase 8: Historial
- Fase 9: Referidos
- Fase 10: Admin Panel
- Fase 11: Testing & Polish
- Fase 12: Documentación

## 🔒 Seguridad

### Importante
- **NO se acredita balance automáticamente**
- **NO se simulan aprobaciones**
- **Todas las aprobaciones son manuales vía Telegram**
- Las contraseñas se almacenan en texto plano SOLO para desarrollo
- En producción se debe implementar bcrypt y JWT

## 🌐 Integración Backend (Futuro)

El frontend está diseñado para ser fácilmente integrable con un backend:

```javascript
// Ejemplo de llamada API (futuro)
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ email, password })
});
```

### Endpoints Necesarios
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/deposits`
- POST `/api/withdrawals`
- POST `/api/investments`
- GET `/api/transactions`
- PATCH `/api/admin/deposits/:id/approve`
- PATCH `/api/admin/withdrawals/:id/approve`

## 📱 Responsive Design

- **Mobile**: < 768px (Bottom Navigation)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (Sidebar + Top Navigation)

## 🎨 Colores del Tema

```css
Primary: #0284c7 (Blue)
Success: #22c55e (Green)
Warning: #f59e0b (Yellow)
Danger: #ef4444 (Red)
```

## 📄 Licencia

Propiedad de MONETA-ICT. Todos los derechos reservados.

## 👥 Contacto

Para soporte o consultas sobre el proyecto, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para MONETA-ICT**
