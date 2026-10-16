# CuentaClara - Sistema de Gestión de Pagos

Producto Mínimo Viable (MVP) para el control, monitoreo y registro de obligaciones financieras para gerencia y asistencia administrativa.

## Características Principales

- **Autenticación con roles:**
  - **Gerente:** Dashboard ejecutivo mensual con resumen de montos pendientes, montos pagados, próximo vencimiento, listas segmentadas y panel confidencial de medios de pago.
  - **Asistente:** Consola de gestión de pagos con filtros por proveedor, tipo de gasto, estado, ordenamiento dinámico, registro de pagos realizados, creación de nuevos gastos y catálogo de proveedores.
- **Seguimiento de Impuestos:** Registro directo de tributos (ej. SUNAT) con importe asignado manualmente.
- **Diseño Profesional y Sobrio:** Sin emojis, paleta corporativa de 3 colores, retícula de 8px y tipografía limpia.

## Estructura del Proyecto

```
parcial-agile/
├── index.html           # Interfaz de usuario con vistas para Gerente y Asistente
├── estilos.css          # Sistema de diseño sobrio (colores, tipografía, espaciado)
├── app.js               # Lógica de negocio, autenticación, filtros y almacenamiento
├── server.js            # Servidor HTTP local sin dependencias externas
├── package.json         # Metadatos del proyecto y comandos npm
├── docs/
│   └── entregable_mvp.md # Documento técnico: Historias, Criterios Gherkin, Jira, Costos
└── README.md            # Documentación general de instalación y uso
```

## Instrucciones de Ejecución

### Opción 1: Servidor Local Node.js
```bash
npm start
```
Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

### Opción 2: Abrir directamente el archivo HTML
Puede abrir directamente `index.html` en cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge).

## Credenciales de Demostración

- **Gerente:** Usuario: `gerente` | Contraseña: `gerente123`
- **Asistente:** Usuario: `asistente` | Contraseña: `asistente123`
