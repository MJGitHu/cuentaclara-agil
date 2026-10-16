# Documento Entregable - Producto Mínimo Viable (MVP)
## Sistema de Gestión y Control de Pagos: CuentaClara

---

## 1. Contexto del Negocio y Resumen de la Solución

El negocio presenta una problemática operativa recurrente: la gerencia maneja múltiples obligaciones financieras mensuales (servicios públicos, tributos/impuestos, préstamos bancarios y proveedores de insumos). Debido a la dispersión de fechas y montos, se generaban retrasos involuntarios y desorden administrativo.

Para solucionar este problema se diseñó e implementó **CuentaClara**, un Producto Mínimo Viable (MVP) construido bajo el marco de trabajo ágil Scrum. La solución desacopla las responsabilidades en dos roles principales:
1. **Gerente:** Dispone de un panel ejecutivo de solo lectura para conocer de inmediato el estado del mes (monto total pendiente, monto pagado, próximo vencimiento) y sus listas detalladas, manteniendo protegidos sus medios de pago personales.
2. **Asistente:** Dispone de una consola operativa para registrar proveedores, agregar gastos e impuestos (con montos manuales), filtrar pendientes y registrar la ejecución de pagos con fecha y método bancario.

---

## 2. Historias de Usuario y Criterios de Aceptación (Gherkin)

### Historia de Usuario 1: Autenticación y Control de Acceso por Rol
**Como** usuario del sistema (Gerente o Asistente),  
**Quiero** ingresar con mi usuario y contraseña,  
**Para** acceder a las funciones correspondientes a mi rol sin exponer información confidencial a terceros.

* **Criterio de Aceptación 1.1 (Pantalla inicial limpia):**
  - **Dado** que un usuario no autenticado ingresa a la aplicación,
  - **Cuando** se carga la página principal,
  - **Entonces** solo se muestra el formulario de inicio de sesión y no se expone ningún dato sensible ni financiero.

* **Criterio de Aceptación 1.2 (Credenciales incorrectas):**
  - **Dado** que el usuario ingresa un usuario o contraseña no registrados,
  - **Cuando** hace clic en "Iniciar Sesión",
  - **Entonces** el sistema muestra el mensaje directo "Usuario o contraseña incorrectos." sin permitir el acceso.

* **Criterio de Aceptación 1.3 (Acceso de Gerente):**
  - **Dado** que el usuario ingresa las credenciales válidas de Gerente,
  - **Cuando** presiona "Iniciar Sesión",
  - **Entonces** el sistema inicializa la sesión ejecutiva, mostrando el resumen mensual y ocultando las herramientas de edición operativa.

* **Criterio de Aceptación 1.4 (Acceso de Asistente):**
  - **Dado** que el usuario ingresa las credenciales válidas de Asistente,
  - **Cuando** presiona "Iniciar Sesión",
  - **Entonces** el sistema abre la consola operativa con acceso a pagos y proveedores, sin mostrar las cuentas bancarias personales del gerente.

---

### Historia de Usuario 2: Dashboard Ejecutivo del Gerente
**Como** Gerente,  
**Quiero** visualizar un consolidado mensual de mis obligaciones financieras,  
**Para** saber de un vistazo cuánto dinero debo desembolsar este mes y qué pagos ya fueron atendidos.

* **Criterio de Aceptación 2.1 (Resumen cuantitativo de KPIs):**
  - **Dado** que el Gerente ha iniciado sesión,
  - **Cuando** visualiza el dashboard principal,
  - **Entonces** se muestran tres indicadores claros: Total Pendiente del Mes, Total Pagado del Mes y Próximo Vencimiento con el nombre del gasto y monto.

* **Criterio de Aceptación 2.2 (Listados mensuales segmentados):**
  - **Dado** que existen gastos registrados para el periodo en curso,
  - **Cuando** el Gerente revisa el panel,
  - **Entonces** visualiza dos tablas independientes: "Pagos Pendientes del Mes" ordenados por fecha límite y "Pagos Realizados del Mes" con indicación del método de pago.

* **Criterio de Aceptación 2.3 (Modo de solo lectura):**
  - **Dado** que el Gerente consulta sus tablas,
  - **Cuando** interactúa con la pantalla,
  - **Entonces** no visualiza botones de modificación, eliminación ni edición de registros, evitando alteraciones accidentales.

* **Criterio de Aceptación 2.4 (Privacidad de credenciales financieras):**
  - **Dado** que el Gerente mantiene cuentas corrientes y tarjetas asociadas,
  - **Cuando** se encuentra en su sesión,
  - **Entonces** visualiza su panel confidencial de medios de pago, el cual queda totalmente bloqueado e inaccesible para la vista del asistente.

---

### Historia de Usuario 3: Consulta y Filtrado de Obligaciones (Asistente)
**Como** Asistente,  
**Quiero** consultar y ordenar todos los pagos pendientes con filtros dinámicos,  
**Para** organizar las prioridades diarias de desembolso según proveedor y categoría.

* **Criterio de Aceptación 3.1 (Orden cronológico por defecto):**
  - **Dado** que el Asistente entra a la sección "Pagos",
  - **Cuando** se despliega la tabla principal,
  - **Entonces** las obligaciones se muestran ordenadas cronológicamente con la fecha de vencimiento más próxima primero.

* **Criterio de Aceptación 3.2 (Filtrado por proveedor y tipo de gasto):**
  - **Dado** que el Asistente selecciona un proveedor específico y el tipo "Servicio",
  - **Cuando** cambia los selectores del panel de filtros,
  - **Entonces** la tabla se actualiza inmediatamente mostrando únicamente los registros que coinciden con ambos criterios.

* **Criterio de Aceptación 3.3 (Filtro por estado y restablecimiento):**
  - **Dado** que se aplican múltiples filtros,
  - **Cuando** el usuario pulsa "Restablecer",
  - **Entonces** los campos vuelven a sus valores predeterminados (Estado: Pendientes, Orden: Vencimiento próximo primero).

---

### Historia de Usuario 4: Registro de Pago Ejecutado (Asistente)
**Como** Asistente,  
**Quiero** registrar un pago como realizado ingresando la fecha y el método empleado,  
**Para** actualizar el estado de la deuda y mantener el balance al día para la gerencia.

* **Criterio de Aceptación 4.1 (Apertura del formulario de confirmación):**
  - **Dado** que el Asistente identifica un gasto en estado "Pendiente",
  - **Cuando** hace clic en el botón "Registrar Pago",
  - **Entonces** se abre una ventana modal que resume la descripción, proveedor y monto exacto a liquidar.

* **Criterio de Aceptación 4.2 (Confirmación con datos obligatorios):**
  - **Dado** que el Asistente ingresa la fecha efectiva del pago y selecciona el método (ej. "Transferencia Bancaria"),
  - **Cuando** pulsa "Confirmar Pago",
  - **Entonces** el sistema actualiza el registro a estado "Realizado", almacena la fecha/método y traslada el registro a la lista de completados.

---

### Historia de Usuario 5: Registro de Proveedores y Nuevos Gastos
**Como** Asistente,  
**Quiero** dar de alta a nuevos proveedores y asociarles compromisos de pago con fecha y monto,  
**Para** mantener actualizada la cartera de acreedores y servicios del negocio.

* **Criterio de Aceptación 5.1 (Creación de proveedor):**
  - **Dado** que el Asistente se encuentra en la pestaña "Proveedores",
  - **Cuando** hace clic en "Nuevo Proveedor", completa RUC, razón social, rubro, contacto y guarda,
  - **Entonces** el proveedor se agrega al catálogo y queda disponible de inmediato para vincularle gastos.

* **Criterio de Aceptación 5.2 (Creación de gasto asociado):**
  - **Dado** que existe al menos un proveedor en el catálogo,
  - **Cuando** el Asistente hace clic en "Nuevo Gasto", selecciona el proveedor, especifica la descripción, categoría, monto y fecha límite,
  - **Entonces** el nuevo compromiso queda registrado con estado "Pendiente" y se refleja tanto en la consola del asistente como en el dashboard del gerente.

---

### Historia de Usuario 6: Registro y Seguimiento de Impuestos
**Como** Asistente,  
**Quiero** ingresar tributos e impuestos mensuales asignando el monto manualmente,  
**Para** recordar el pago a la entidad recaudadora (SUNAT) sin depender de cálculos automáticos.

* **Criterio de Aceptación 6.1 (Ingreso manual de impuestos):**
  - **Dado** que se genera una obligación fiscal (ej. "Impuesto SUNAT - Octubre 2026"),
  - **Cuando** el Asistente registra el gasto seleccionando el tipo "Impuesto" e introduce el importe liquidado por el contador,
  - **Entonces** el sistema almacena el monto exacto ingresado sin aplicar fórmulas tributarias automáticas.

---

## 3. Matriz de Subtareas Técnicas (Estructura Jira)

| Código | Historia Relacionada | Título de la Subtarea | Tipo de Tarea | Estimación | Rol Asignado |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **SUB-01** | Transversal | Configuración de repositorio Git y estructura base del proyecto | Configuración | 2h | Full-Stack Dev 1 |
| **SUB-02** | Transversal | Configuración del servidor local de desarrollo y script de arranque | Configuración | 1h | Full-Stack Dev 2 |
| **SUB-03** | Transversal | Definición del modelo de datos de sesión, proveedores y gastos | Análisis y diseño | 3h | Full-Stack Dev 1 |
| **SUB-04** | Transversal | Especificación de paleta de colores y componentes sobrios (CSS) | Análisis y diseño | 2h | Full-Stack Dev 2 |
| **SUB-05** | HU-01 | Prototipado y maqueta de formulario de inicio de sesión | Prototipado | 2h | Full-Stack Dev 2 |
| **SUB-06** | HU-01 | Implementación de autenticación de dos roles (Gerente/Asistente) | Codificación | 3h | Full-Stack Dev 1 |
| **SUB-07** | HU-01 | Pruebas de control de acceso y validación de credenciales erróneas | Test | 2h | QA Engineer |
| **SUB-08** | HU-02 | Maquetación del dashboard ejecutivo y tarjetas de métricas | Prototipado | 3h | Full-Stack Dev 2 |
| **SUB-09** | HU-02 | Lógica de cálculo de totales del mes y próximo vencimiento | Codificación | 3h | Full-Stack Dev 1 |
| **SUB-10** | HU-02 | Implementación de tabla confidencial de cuentas del gerente | Codificación | 2h | Full-Stack Dev 1 |
| **SUB-11** | HU-02 | Validación de modo solo lectura en la vista del gerente | Test | 2h | QA Engineer |
| **SUB-12** | HU-03 | Maquetado de vista operativa y barra de filtros para el asistente | Prototipado | 2h | Full-Stack Dev 2 |
| **SUB-13** | HU-03 | Lógica de filtros combinados (proveedor, tipo, estado y orden) | Codificación | 3h | Full-Stack Dev 1 |
| **SUB-14** | HU-04 | Construcción de modal para registro de pago realizado | Prototipado | 2h | Full-Stack Dev 2 |
| **SUB-15** | HU-04 | Lógica de actualización de estado de gasto a "Realizado" | Codificación | 3h | Full-Stack Dev 1 |
| **SUB-16** | HU-04 | Pruebas de flujo de registro de pagos y reflejo en métricas | Test | 2h | QA Engineer |
| **SUB-17** | HU-05 | Maquetado e implementación de formulario de nuevo gasto | Codificación | 3h | Full-Stack Dev 2 |
| **SUB-18** | HU-05 | Implementación del módulo y tabla de directorio de proveedores | Codificación | 3h | Full-Stack Dev 1 |
| **SUB-19** | HU-06 | Pruebas funcionales del registro de tributos y verificación manual | Test | 2h | QA Engineer |
| **SUB-20** | Transversal | Verificación de restricciones de diseño UX/UI y auditoría visual | Test | 2h | Scrum Master / QA |
| **SUB-21** | Transversal | Preparación del paquete de despliegue y documentación técnica | Implantación | 2h | Full-Stack Dev 1 |

* **Total de horas técnicas estimadas:** 49 horas de trabajo especializado.

---

## 4. Cálculo de Costos y Justificación Presupuestal

### Parámetros de Trabajo
- **Régimen de trabajo:** 4 horas al día por integrante, de lunes a viernes (20 horas/semana por persona).
- **Duración del MVP:** 2 Sprints semanales (2 semanas de calendario = 10 días hábiles).
- **Tarifa promedio de mercado:** S/ 40.00 por hora por profesional de desarrollo de software.
- **Equipo de trabajo:** 5 especialistas con roles dedicados:
  1. Product Owner (PO)
  2. Scrum Master (SM)
  3. Desarrollador Full-Stack 1 (Tech Lead / Core Logic)
  4. Desarrollador Full-Stack 2 (UI / Frontend Components)
  5. QA Engineer (Pruebas de Aceptación y Calidad)

### Distribución de Horas por Rol en el MVP

| Rol | Dedicación en Subtareas | Ceremonias Ágiles / Gestión | Total Horas | Tarifa / Hora | Subtotal (S/) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Product Owner** | 4h (Requisitos y validación) | 12h (Backlog refinement, review) | 16h | S/ 40.00 | S/ 640.00 |
| **Scrum Master** | 4h (Auditoría de procesos) | 14h (Daily, retrospectiva, bloqueos) | 18h | S/ 40.00 | S/ 720.00 |
| **Full-Stack Dev 1** | 22h (Arquitectura, auth, filtros, core) | 8h (Planificación y sincronización) | 30h | S/ 40.00 | S/ 1,200.00 |
| **Full-Stack Dev 2** | 15h (Estilos CSS, modales, vistas) | 8h (Planificación y sincronización) | 23h | S/ 40.00 | S/ 920.00 |
| **QA Engineer** | 10h (Pruebas E2E, Gherkin, verificación) | 6h (Planificación y reportes de bug) | 16h | S/ 40.00 | S/ 640.00 |
| **Subtotal Base** | **55h** | **48h** | **103h** | - | **S/ 4,120.00** |

### Justificación Formal del Presupuesto

> *"El costo del proyecto se basa en un equipo de 5 profesionales trabajando bajo un régimen de 4 horas diarias durante 2 semanas (10 días laborables). La estimación técnica directa contempla 55 horas de desarrollo y análisis distribuidas en 21 subtareas clave, 30 horas de pruebas continuas y control de calidad, y 18 horas de ceremonias ágiles y gestión de entregables. Con una tarifa promedio de mercado de S/ 40.00 por hora, el costo directo asciende a S/ 4,120.00. Aplicando un 10% de contingencia técnica y operativa (S/ 412.00), el costo total consolidado para el MVP es de **S/ 4,532.00**."*

---

## 5. Guía Rápida de Uso del Sistema

### 5.1 Para el Gerente
1. **Acceso al Sistema:**
   - Ingrese su usuario (`gerente`) y contraseña (`gerente123`) o haga clic en el recuadro de acceso rápido.
2. **Revisión de Métricas del Mes:**
   - En la parte superior observará tres tarjetas: el total pendiente de pago, el monto ya abonado en el mes, y la fecha del vencimiento más próximo.
3. **Control de Pagos:**
   - Revise la tabla "Pagos Pendientes del Mes" para conocer a qué entidades debe pagar en los próximos días.
   - Revise la tabla "Pagos Realizados del Mes" para auditar los comprobantes y métodos aplicados por su asistente.
4. **Cierre de Sesión:**
   - Al concluir, presione "Cerrar Sesión" en la esquina superior derecha para bloquear el acceso a su información privada.

### 5.2 Para el Asistente
1. **Acceso al Sistema:**
   - Ingrese su usuario (`asistente`) y contraseña (`asistente123`).
2. **Filtrar y Ordenar Pagos:**
   - Use la barra superior para filtrar por proveedor, categoría (Servicio, Impuesto, Proveedor, Préstamo) o estado (Pendientes / Realizados).
3. **Registrar un Pago Realizado:**
   - Ubique el gasto pendiente en la lista y presione el botón "Registrar Pago".
   - Indique la fecha en que se efectuó el pago y seleccione el método (Transferencia Bancaria, Efectivo, Cheque o Tarjeta de Débito).
   - Opcionalmente ingrese el número de operación bancaria y haga clic en "Confirmar Pago".
4. **Registrar un Nuevo Gasto o Impuesto:**
   - Presione el botón "Nuevo Gasto".
   - Escriba la descripción (ej. "Impuesto SUNAT - Noviembre 2026").
   - Seleccione el proveedor y la categoría ("Impuesto").
   - Digite el monto exacto y la fecha de vencimiento. Pulse "Guardar Gasto".
5. **Registrar un Nuevo Proveedor:**
   - Haga clic en la pestaña "Proveedores" en la barra de navegación.
   - Presione "Nuevo Proveedor", complete los datos de contacto y guarde.

---

## 6. Verificación de Cumplimiento de Restricciones de Diseño

| Restricción Evaluada | Estado | Detalle de Implementación |
| :--- | :---: | :--- |
| **Cero Emojis en la UI** | Cumplido | No se utilizó ningún emoji en botones, mensajes, títulos ni placeholders. |
| **Sin viñetas con líneas verticales** | Cumplido | La presentación se basa en tablas limpias y formularios directos. |
| **Sin menciones académicas en la UI** | Cumplido | El producto se llama limpiamente **CuentaClara**, sin referencias a proyectos, parciales ni cursos. |
| **Textos directos y funcionales** | Cumplido | Se eliminaron frases conversacionales de IA ("Bienvenido", "Aquí puedes ver..."). Textos sobrios y claros. |
| **Paleta de 3 colores corporativos** | Cumplido | Azul corporativo (`#1E3A5F`), fondo gris (`#F8F9FA`) y acento ámbar/naranja (`#D97706`). |
| **Tipografía y jerarquía** | Cumplido | Tipografía de sistema con jerarquía precisa (24px títulos, 16px cuerpo, 14px secundario). |
| **Espaciado en retícula de 8px** | Cumplido | Variables CSS estructuradas en 8px, 16px, 24px y 32px. |
| **Bordes y sombras sutiles** | Cumplido | Bordes con radio máximo de 4px a 6px; sombra mínima `0 1px 3px rgba(0,0,0,0.1)`. |
| **Botones sobrios** | Cumplido | Estilo primario azul marino plano y estilo secundario blanco con borde gris; sin gradientes llamativos. |
| **Mensajes y estados vacíos** | Cumplido | "Usuario o contraseña incorrectos.", "No hay pagos pendientes para este mes.", sin íconos decorativos. |
| **Navegación minimalista** | Cumplido | Máximo 2 pestañas ("Pagos" y "Proveedores") exclusivas para el rol de asistente; Gerente en una sola pantalla. |
| **Privacidad de credenciales del gerente** | Cumplido | Medios bancarios confidenciales visibles únicamente para la sesión de gerencia. |
