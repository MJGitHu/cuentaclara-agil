# CuentaClara - Sistema de Gestión de Pagos

Aplicación para el control, monitoreo y registro de obligaciones financieras para gerencia y asistencia administrativa. Los datos compartidos se guardan en el equipo que ejecuta el servidor, en `data/database.json`.

## Características Principales

- **Autenticación con roles:**
  - **Gerente:** Dashboard ejecutivo mensual con resumen de montos pendientes, montos pagados, próximo vencimiento, listas segmentadas y panel confidencial de medios de pago.
  - **Asistente:** Consola de gestión de pagos con filtros por proveedor, tipo de gasto, estado, ordenamiento dinámico, registro de pagos realizados, creación de nuevos gastos y catálogo de proveedores.
- **Seguimiento de Impuestos:** Registro directo de tributos (ej. SUNAT) con importe asignado manualmente.
- **Diseño Profesional y Sobrio:** Sin emojis, paleta corporativa de 3 colores, retícula de 8px y tipografía limpia.

## Compartir la aplicación entre dispositivos

El navegador ya no es la fuente principal de datos: los registros se sincronizan con el servidor host y otros dispositivos que abran la misma URL consultan y actualizan esa información automáticamente (cada 3 segundos).

1. En el equipo que será el host, instala Node.js y ejecuta `npm start` desde la carpeta del proyecto.
2. En otra terminal de ese mismo equipo ejecuta `npm run tunnel`. La primera vez puede tardar mientras `npx` descarga Localtunnel.
3. Comparte la URL HTTPS que Localtunnel muestra en esa terminal. Mantén abiertas ambas terminales y el equipo encendido mientras se use el sistema.
4. Entra desde cada dispositivo con la URL compartida. Los datos no se comparten si alguien abre el `index.html` directamente o inicia otro servidor en un equipo diferente.

Los datos persisten en `data/database.json` incluso si se cierra el servidor. Para respaldarlos, copia ese archivo con el servidor detenido. Esta solución es para una entrega académica y requiere que el equipo host permanezca conectado a internet; Localtunnel puede cambiar la URL al reiniciar y no está pensado como alojamiento permanente. El acceso no cuenta con autenticación protegida por servidor: comparte el enlace solo con personas de confianza y no guardes datos bancarios, personales o reales.

## Estructura del Proyecto

```
parcial-agile/
├── index.html           # Interfaz de usuario con vistas para Gerente y Asistente
├── estilos.css          # Sistema de diseño sobrio (colores, tipografía, espaciado)
├── app.js               # Lógica de negocio, autenticación, filtros y almacenamiento
├── server.js            # Servidor web, API de sincronización y persistencia
├── data/
│   └── database.json    # Se crea automáticamente al guardar datos
├── package.json         # Metadatos del proyecto y comandos npm
├── docs/
│   └── entregable_mvp.md # Documento técnico: Historias, Criterios Gherkin, Jira, Costos
└── README.md            # Documentación general de instalación y uso
```

## Instrucciones de Ejecución

### Iniciar el servidor local
```bash
npm start
```
Abrir en el navegador: [http://localhost:3000](http://localhost:3000). Para compartirlo fuera del equipo, sigue los pasos de Localtunnel anteriores; no abras `index.html` directamente.

## Credenciales de Demostración

- **Gerente:** Usuario: `gerente` | Contraseña: `gerente123`
- **Asistente:** Usuario: `asistente` | Contraseña: `asistente123`

Las credenciales son solo de demostración universitaria y no deben usarse para información real o sensible.
