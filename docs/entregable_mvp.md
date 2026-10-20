# Documento Entregable - Producto Mínimo Viable (MVP)
## Sistema de Gestión y Control de Pagos: CuentaClara

- **Documento Word Oficial:** [docs/entregable_completo_mvp.docx](file:///d:/parcial-agile/docs/entregable_completo_mvp.docx) (o [docs/informe_evidencias_mvp.docx](file:///d:/parcial-agile/docs/informe_evidencias_mvp.docx))
- **Informe de Evidencias y Pruebas Paso a Paso:** [docs/informe_evidencias_mvp.md](file:///d:/parcial-agile/docs/informe_evidencias_mvp.md)
- **Carpeta de Capturas de Pantalla:** [docs/evidencias/](file:///d:/parcial-agile/docs/evidencias/)

---

## 1. Contexto del Negocio y Resumen de la Solución

El negocio presenta una problemática operativa recurrente: la gerencia maneja múltiples obligaciones financieras mensuales (servicios públicos, tributos/impuestos, préstamos bancarios y proveedores de insumos). Debido a la dispersión de fechas y montos, se generaban retrasos involuntarios y desorden administrativo.

A partir de la sesión de feedback y refinamiento con el cliente (profesor) y el equipo de pruebas, se optimizó el Producto Mínimo Viable (MVP) **CuentaClara**, asegurando una experiencia funcional, intuitiva y transparente bajo la metodología ágil Scrum, con las siguientes directrices clave:
1. **Etapa de Registro y Control (Sin pasarelas reales):** La solución prescinde de pasarelas de pago externas o integraciones complejas (MercadoPago/WhatsApp); el flujo culmina con el registro administrativo y la evidencia documental del pago.
2. **Gerente:** Dispone de un panel ejecutivo de supervisión en una sola pantalla con 4 indicadores clave (Pendientes del mes, Pagados del mes, Deudas vencidas anteriores y Próximo vencimiento), visualización conjunta de pendientes y realizados con su N° de Operación, navegación temporal ágil (botones de mes y salto directo a cualquier mes/año), gestión dinámica de métodos de pago (ej. Plin, Efectivo), administración de cuentas bancarias confidenciales y gobierno para crear o editar proveedores (con validación de 9 dígitos para Perú y soporte Yape) y tipos de gasto.
3. **Asistente:** Dispone de una consola operativa con alerta prominente de deudas arrastradas de meses anteriores, registro de compromisos con código oficial de recibo y comprobación de titularidad (foto DNI), catálogo de proveedores y tipos autorizados por Gerencia con opción de edición/rectificación, visualización simultánea de comprobante de titularidad y voucher de pago, visualización automática de datos de Yape, y aplicación de la regla legal de redondeo en efectivo (Ley N° 29571 / BCRP) con cálculo reactivo del vuelto.

---

## 2. Historias de Usuario y Criterios de Aceptación (Gherkin)

### Historia de Usuario 1: Autenticación y Control de Acceso por Rol
**Como** usuario del sistema (Gerente o Asistente),  
**Quiero** ingresar con mi usuario y contraseña,  
**Para** acceder a las funciones correspondientes a mi rol sin exponer información confidencial a terceros.

* **Criterio 1.1 (Pantalla inicial limpia):**
  - **Dado** que un usuario no autenticado ingresa a la aplicación,
  - **Cuando** se carga la página principal,
  - **Entonces** solo se muestra el formulario de inicio de sesión y no se expone ningún dato sensible ni financiero.
* **Criterio 1.2 (Credenciales incorrectas):**
  - **Dado** que el usuario ingresa credenciales no registradas,
  - **Cuando** hace clic en "Iniciar Sesión",
  - **Entonces** el sistema muestra el mensaje directo "Usuario o contraseña incorrectos." sin permitir el acceso.
* **Criterio 1.3 (Acceso de Gerente):**
  - **Dado** que el usuario ingresa las credenciales válidas de Gerente,
  - **Cuando** presiona "Iniciar Sesión",
  - **Entonces** accede a la consola ejecutiva con métricas, listas y herramientas de configuración del negocio.
* **Criterio 1.4 (Acceso de Asistente):**
  - **Dado** que el usuario ingresa las credenciales de Asistente,
  - **Cuando** presiona "Iniciar Sesión",
  - **Entonces** accede al panel operativo de pagos, sin acceso a las cuentas bancarias personales del gerente.
* **Subtareas Técnicas de Desarrollo (Jira):**
  - `SUB-02` (Desarrollador 1 - 3h): Codificar formulario de autenticación RBAC con captura de evento submit y sessionStorage.
  - `SUB-03` (Desarrollador 2 - 2h): Maquetar layout CSS responsive en estilos.css con paleta corporativa y retícula de 8px.
  - `SUB-04` (Desarrollador 4 - 2h): Implementar controlador DOM para alternar visibilidad entre contenedor de login y vistas de rol.
  - `SUB-05` (Desarrollador 5 - 2h): Escribir y ejecutar suite de pruebas de inyección de credenciales inválidas y control de alertas.

---

### Historia de Usuario 2: Dashboard Ejecutivo del Gerente y Navegación Temporal
**Como** Gerente,  
**Quiero** visualizar en una sola pantalla 4 métricas financieras consolidadas y alternar entre periodos mensuales,  
**Para** auditar de inmediato qué compromisos tengo en el mes, qué deudas antiguas arrastro y qué pagos ya fueron atendidos.

* **Criterio 2.1 (4 KPIs Financieros Obligatorios):**
  - **Dado** que el Gerente ha iniciado sesión en un periodo mensual,
  - **Cuando** visualiza el dashboard principal,
  - **Entonces** observa cuatro tarjetas de indicadores:
    1. *Total Pendiente del Mes:* Importe de las deudas del mes consultado.
    2. *Total Pagado del Mes:* Monto de obligaciones canceladas en dicho mes.
    3. *Deudas Vencidas Anteriores:* Monto acumulado de obligaciones de meses pasados que permanecen en mora.
    4. *Próximo Vencimiento:* Fecha límite más cercana, concepto e importe a liquidar.
* **Criterio 2.2 (Vista Unificada en la Misma Pantalla y N° de Operación):**
  - **Dado** que existen compromisos financieros registrados en el mes,
  - **Cuando** el Gerente revisa su panel,
  - **Entonces** visualiza todas las obligaciones y pagos del periodo consolidados en una sola tabla unificada ('Obligaciones y Pagos del Periodo'), con el estado (Pendiente o Realizado) indicado claramente a la derecha, la columna 'N° Operación' visible con su referencia bancaria, sin dividirlas en tablas separadas ni pestañas intermedias.
* **Criterio 2.3 (Navegación de Meses y Salto Directo a Periodo):**
  - **Dado** que el Gerente o Asistente se encuentra en el sistema,
  - **Cuando** pulsa "< Mes Anterior", la pantalla retrocede un mes; al presionar "Próximo Mes >", avanza un mes; y cuando selecciona directamente un Mes y digita un Año (ej. 2017) pulsando "Ir", el sistema salta de inmediato a dicho periodo sin necesidad de decenas de clics consecutivos.
* **Criterio 2.4 (Privacidad y Gestión Dinámica de Cuentas y Tarjetas Bancarias):**
  - **Dado** que el Gerente mantiene cuentas bancarias personales para pagos,
  - **Cuando** consulta su sesión,
  - **Entonces** visualiza su panel confidencial de cuentas y tarjetas (100% oculto e inaccesible para el Asistente), disponiendo del botón "+ Nueva Cuenta / Tarjeta" para registrar nuevas entidades (BCP, BBVA, Scotiabank, Interbank), monedas y números de cuenta o tarjeta.
* **Subtareas Técnicas de Desarrollo (Jira):**
  - `SUB-06` (Desarrollador 2 - 2h): Maquetar componente de navegación temporal (period-navigator) con botones anterior/siguiente y salto ágil.
  - `SUB-07` (Desarrollador 3 - 2h): Programar funciones de fechas (changePeriod, getActivePeriodKey, salto directo) y persistencia temporal.
  - `SUB-08` (Desarrollador 3 - 3h): Desarrollar algoritmos de agregación financiera para cálculo dinámico de los 4 KPIs en Dashboard.
  - `SUB-09` (Desarrollador 1 - 3h): Construir tabla consolidada en el DOM para renderizar todas las obligaciones y pagos del periodo con N° Operación.
  - `SUB-10` (Desarrollador 4 - 2h): Codificar sección dinámica de cuentas bancarias confidenciales con lógica de aislamiento para el Asistente.
  - `SUB-11` (Desarrollador 5 - 2h): Ejecutar pruebas de recálculo dinámico de métricas y filtrado temporal al cambiar de mes.

---

### Historia de Usuario 3: Identificación del Recibo y Comprobación de Titularidad
**Como** Asistente o Gerente,  
**Quiero** que cada compromiso cuente con su código de comprobante oficial y evidencia de titularidad del local (DNI del titular),  
**Para** tener certeza de que el gasto corresponde a una obligación legítima y propia del negocio.

* **Criterio 3.1 (Identificación del recibo):**
  - **Dado** que se registra una nueva obligación financiera,
  - **Cuando** se ingresa el gasto,
  - **Entonces** es obligatorio registrar el código o número de comprobante (ej. N° de suministro eléctrico, código de recibo o NPS SUNAT), mostrándose visible en la tabla.
* **Criterio 3.2 (Comprobación de deuda propia / DNI):**
  - **Dado** que se registra o consulta un recibo,
  - **Cuando** el usuario hace clic en "Ver Titular / DNI",
  - **Entonces** se despliega una ventana modal con la imagen del documento de identidad o constancia que acredita que la obligación pertenece al titular del negocio.
* **Subtareas Técnicas de Desarrollo (Jira):**
  - `SUB-12` (Desarrollador 4 - 2h): Definir e inicializar esquema en localStorage con atributos receiptId y fotos base64/SVG.
  - `SUB-13` (Desarrollador 2 - 1h): Maquetar etiquetas monoespaciadas para códigos oficiales de recibo/suministro en tablas.
  - `SUB-14` (Desarrollador 2 - 2h): Programar modal y visor de imágenes en DOM para comprobación de titularidad (Foto DNI/RUC).
  - `SUB-15` (Desarrollador 5 - 2h): Validar procesamiento de imágenes con FileReader y manejo de visualización en modal.

---

### Historia de Usuario 4: Gobierno de Proveedores, Tipos de Gasto y Métodos de Pago por Gerencia
**Como** Gerente,  
**Quiero** crear y editar el catálogo de proveedores con validación de teléfono en Perú, registrar nuevos tipos de gasto y parametrizar métodos de pago,  
**Para** que el Asistente únicamente seleccione opciones previamente autorizadas y sepa dónde transferir.

* **Criterio 4.1 (Alta y Edición de Proveedores con Validación de Teléfono Perú):**
  - **Dado** que el Gerente registra o edita un proveedor,
  - **Cuando** ingresa el teléfono o activa la opción "¿Acepta Yape?",
  - **Entonces** el sistema bloquea caracteres alfabéticos, restringe la longitud a exactamente 9 dígitos numéricos (formato peruano iniciando en 9), guarda los datos y permite editarlos en cualquier momento desde el catálogo sin duplicados.
* **Criterio 4.2 (Creación Dinámica de Tipos de Gasto):**
  - **Dado** que el Gerente requiere una nueva categoría (ej. "Seguros" o "Mantenimiento"),
  - **Cuando** pulsa "Nuevo Tipo de Gasto", ingresa el nombre y confirma,
  - **Entonces** el nuevo tipo se incorpora de inmediato a los catálogos y filtros del sistema.
* **Criterio 4.3 (Consumo Restringido por el Asistente):**
  - **Dado** que el Asistente registra un nuevo gasto,
  - **Cuando** despliega las opciones de proveedor y tipo de gasto,
  - **Entonces** solo puede elegir entre los elementos registrados por la gerencia.
* **Criterio 4.4 (Parametrización Dinámica de Métodos de Pago por Gerencia):**
  - **Dado** que el Gerente desea incorporar o retirar métodos de pago (ej. Plin, PagoEfectivo, Tarjeta Corporativa),
  - **Cuando** ingresa al modal "Gestión de Métodos de Pago" y añade uno nuevo,
  - **Entonces** este método se sincroniza automáticamente en el selector de pagos del Asistente.
* **Subtareas Técnicas de Desarrollo (Jira):**
  - `SUB-16` (Desarrollador 1 - 3h): Desarrollar modal de Gerente para alta y edición de proveedores con campos de Yape y validación de 9 dígitos.
  - `SUB-17` (Desarrollador 3 - 2h): Implementar función addExpenseType y selector dinámico para tipos de gasto de Gerencia.
  - `SUB-18` (Desarrollador 2 - 2h): Construir tabla modal para auditoría y edición del catálogo de proveedores y datos de billetera digital.
  - `SUB-19` (Desarrollador 5 - 2h): Escribir pruebas funcionales para asegurar que el Asistente solo consuma catálogos aprobados.

---

### Historia de Usuario 5: Liquidación de Pagos con Yape, Efectivo y Evidencia Fotográfica
**Como** Asistente,  
**Quiero** registrar pagos atendidos con Yape o Efectivo adjuntando la foto del comprobante, calculando el vuelto por ley y disponiendo de auditoría documental conjunta,  
**Para** cumplir con la normativa peruana de redondeo, documentar la salida de dinero y mantener acceso simultáneo a la titularidad y al voucher.

* **Criterio 5.1 (Visualización Automática de Datos de Yape):**
  - **Dado** que el Asistente selecciona como método "Yape (Billetera Digital)",
  - **Cuando** el proveedor tiene configurado Yape,
  - **Entonces** el modal muestra una tarjeta informativa con el número celular y el nombre del titular para facilitar el depósito.
* **Criterio 5.2 (Redondeo Legal de Céntimos en Efectivo - Ley N° 29571 / BCRP):**
  - **Dado** que el Asistente selecciona el método "Efectivo" para un gasto con céntimos no fraccionables (ej. S/ 500.35),
  - **Cuando** el sistema procesa la liquidación física,
  - **Entonces** aplica la Ley 29571 redondeando hacia abajo a la decena de céntimos inmediata a favor del cliente (S/ 500.30 con descuento de -S/ 0.05), solicita el efectivo recibido y calcula el vuelto exacto (ej. con S/ 510.00 recibidos, calcula S/ 9.70 de vuelto).
* **Criterio 5.3 (Foto del Comprobante, N° de Operación y Acceso Documental Simultáneo):**
  - **Dado** que el Asistente liquida una obligación,
  - **Cuando** digita el N° de Operación oficial (ej. OP-9988221), adjunta el voucher bancario y confirma el pago,
  - **Entonces** el gasto cambia a estado "Realizado", se muestra el N° de Operación en la tabla y se mantienen visibles AMBOS botones: "Ver Titular / DNI" y "Ver Voucher", garantizando una auditoría contable íntegra.
* **Criterio 5.4 (Edición y Rectificación de Gastos y Pagos):**
  - **Dado** que el Asistente necesita corregir un error de digitación en un gasto o pago,
  - **Cuando** pulsa el botón "Editar" en la fila correspondiente,
  - **Entonces** puede rectificar el concepto, fecha, importe o número de operación sin perder la trazabilidad.
* **Subtareas Técnicas de Desarrollo (Jira):**
  - `SUB-20` (Desarrollador 3 - 2h): Programar event listener en selector de método de pago para desplegar tarjeta Yape del proveedor.
  - `SUB-21` (Desarrollador 3 - 2h): Implementar algoritmo matemático de redondeo de céntimos en efectivo bajo Ley N° 29571 / BCRP.
  - `SUB-22` (Desarrollador 4 - 2h): Codificar lógica reactiva de cálculo de vuelto en efectivo según monto en input cashReceived.
  - `SUB-23` (Desarrollador 2 - 3h): Programar módulo de carga de foto de voucher con FileReader y visualización simultánea de evidencias.
  - `SUB-24` (Desarrollador 5 - 2h): Ejecutar suite de pruebas de liquidación en efectivo, Yape, N° de operación y rectificación.

---

## 3. Matriz de Subtareas Técnicas (Estructura Jira)

| Código | Historia Relacionada | Título Técnico de la Subtarea (Para Desarrolladores) | Tipo de Tarea | Estimación | Asignado |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **SUB-01** | Transversal | Configurar servidor HTTP nativo en server.js con manejo de MIME types y rutas estáticas | Configuración | 2h | Desarrollador 1 |
| **SUB-02** | HU-01 | Codificar formulario de autenticación RBAC con captura de evento submit y sessionStorage | Codificación | 3h | Desarrollador 1 |
| **SUB-03** | HU-01 | Maquetar layout CSS responsive en estilos.css con paleta corporativa y retícula de 8px | Prototipado | 2h | Desarrollador 2 |
| **SUB-04** | HU-01 | Implementar controlador DOM para alternar visibilidad entre contenedor de login y vistas de rol | Codificación | 2h | Desarrollador 4 |
| **SUB-05** | HU-01 | Escribir y ejecutar suite de pruebas de inyección de credenciales inválidas y control de alertas | Test | 2h | Desarrollador 5 |
| **SUB-06** | HU-02 | Maquetar componente de navegación temporal (period-navigator) con botones anterior/siguiente | Prototipado | 2h | Desarrollador 2 |
| **SUB-07** | HU-02 | Programar funciones de fechas (changePeriod, getActivePeriodKey) para Septiembre, Octubre y Noviembre | Codificación | 2h | Desarrollador 3 |
| **SUB-08** | HU-02 | Desarrollar algoritmos de agregación financiera para cálculo dinámico de los 4 KPIs en Dashboard | Codificación | 3h | Desarrollador 3 |
| **SUB-09** | HU-02 | Construir tabla consolidada en el DOM para renderizar todas las obligaciones y pagos del periodo | Codificación | 3h | Desarrollador 1 |
| **SUB-10** | HU-02 | Codificar sección de cuentas bancarias confidenciales con lógica de aislamiento para el Asistente | Codificación | 2h | Desarrollador 4 |
| **SUB-11** | HU-02 | Ejecutar pruebas de recálculo dinámico de métricas y filtrado temporal al cambiar de mes | Test | 2h | Desarrollador 5 |
| **SUB-12** | HU-03 | Definir e inicializar esquema en localStorage con atributos receiptId y fotos base64/SVG | Análisis y diseño | 2h | Desarrollador 4 |
| **SUB-13** | HU-03 | Maquetar etiquetas monoespaciadas para códigos oficiales de recibo/suministro en tablas | Prototipado | 1h | Desarrollador 2 |
| **SUB-14** | HU-03 | Programar modal y visor de imágenes en DOM para comprobación de titularidad (Foto DNI/RUC) | Codificación | 2h | Desarrollador 2 |
| **SUB-15** | HU-03 | Validar procesamiento de imágenes con FileReader y manejo de visualización en modal | Test | 2h | Desarrollador 5 |
| **SUB-16** | HU-04 | Desarrollar modal exclusivo de Gerente para alta de proveedores con campos de Yape (celular/titular) | Codificación | 3h | Desarrollador 1 |
| **SUB-17** | HU-04 | Implementar función addExpenseType y selector dinámico para tipos de gasto de Gerencia | Codificación | 2h | Desarrollador 3 |
| **SUB-18** | HU-04 | Construir tabla modal para auditoría del catálogo de proveedores y datos de billetera digital | Prototipado | 2h | Desarrollador 2 |
| **SUB-19** | HU-04 | Escribir pruebas funcionales para asegurar que el Asistente solo consuma catálogos aprobados | Test | 2h | Desarrollador 5 |
| **SUB-20** | HU-05 | Programar event listener en selector de método de pago para desplegar tarjeta Yape del proveedor | Codificación | 2h | Desarrollador 3 |
| **SUB-21** | HU-05 | Implementar algoritmo matemático de redondeo de céntimos en efectivo bajo Ley N° 29571 / BCRP | Codificación | 2h | Desarrollador 3 |
| **SUB-22** | HU-05 | Codificar lógica reactiva de cálculo de vuelto en efectivo según monto en input cashReceived | Codificación | 2h | Desarrollador 4 |
| **SUB-23** | HU-05 | Programar módulo de carga de foto de voucher con FileReader y modal de comprobante archivado | Codificación | 3h | Desarrollador 2 |
| **SUB-24** | HU-05 | Ejecutar suite de pruebas de liquidación en efectivo (S/ 500.35 -> S/ 500.30 y vuelto S/ 9.70) y Yape | Test | 2h | Desarrollador 5 |
| **SUB-25** | Transversal | Realizar auditoría de restricciones de diseño UX en frontend (0 emojis, sin viñetas IA, paleta 3 colores) | Test | 2h | Desarrollador 5 |
| **SUB-26** | Transversal | Automatizar captura de evidencias con script Puppeteer y compilar documentos Word/Markdown | Implantación | 2h | Desarrollador 1 |

* **Total de horas técnicas especializadas:** 54 horas de trabajo directo.

---

## 4. Cálculo de Costos y Justificación Presupuestal

### Parámetros de Trabajo
- **Régimen de trabajo:** 4 horas al día por desarrollador, 5 días a la semana (20 horas/semana por desarrollador).
- **Duración del proyecto:** 2 Sprints semanales (2 semanas de calendario = 10 días laborables).
- **Tarifa promedio de mercado:** S/ 40.00 por hora por desarrollador de software.
- **Equipo de Desarrollo:** 5 desarrolladores de software (Desarrollador 1 al 5) cubriendo las responsabilidades técnicas del proyecto.

### Desglose por Desarrollador

| Integrante del Equipo | Horas Subtareas Técnicas | Horas Ceremonias Ágiles / Gestión | Total Horas Asignadas | Tarifa / Hora | Subtotal (S/) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Desarrollador 1** | 12h (Arquitectura, auth, proveedores) | 10h (Dailies, Planning, Review) | 22h | S/ 40.00 | S/ 880.00 |
| **Desarrollador 2** | 12h (CSS, componentes, modales, vistas) | 10h (Dailies, Planning, Review) | 22h | S/ 40.00 | S/ 880.00 |
| **Desarrollador 3** | 11h (Lógica periodos, redondeo, Yape) | 10h (Dailies, Planning, Review) | 21h | S/ 40.00 | S/ 840.00 |
| **Desarrollador 4** | 8h (Persistencia, estado, filtros, vuelto) | 9h (Dailies, Planning, Review) | 17h | S/ 40.00 | S/ 680.00 |
| **Desarrollador 5** | 11h (Testing E2E, QA, restricciones UX) | 9h (Dailies, Planning, Review) | 20h | S/ 40.00 | S/ 800.00 |
| **SUBTOTAL BASE** | **54h** | **48h** | **102h** | - | **S/ 4,080.00** |

### Justificación Formal del Presupuesto

> *"El costo del proyecto se basa en un equipo de 5 desarrolladores con un costo promedio de S/ 40 por hora, trabajando 4 horas al día durante 2 semanas (10 días laborables). El total incluye 54 horas de desarrollo y análisis distribuidas en 26 subtareas técnicas claras y desglosadas, 28 horas de testing y control de calidad sobre las reglas de negocio (redondeo de céntimos, Yape, evidencias fotográficas y navegación temporal), y 20 horas de ceremonias ágiles y gestión de entregables. Con una tarifa de S/ 40.00 por hora, el costo directo base es de S/ 4,080.00. Aplicando un 10% de contingencia técnica y operativa (S/ 408.00), el costo total consolidado para el MVP es de **S/ 4,488.00**."*

---

## 5. Guía Rápida de Uso del Sistema

### 5.1 Para el Gerente
1. **Acceso al Sistema:** Ingrese su usuario (`gerente`) y contraseña (`gerente123`).
2. **Navegación Temporal Ágil:** 
   - Use los botones `< Mes Anterior` y `Próximo Mes >` para recorrer meses adyacentes.
   - Utilice el selector de mes, campo de año y botón `Ir` para saltar de inmediato a cualquier fecha histórica (ej. 2017) o futura en un solo clic, o presione `Mes Actual`.
3. **Monitoreo de 4 KPIs:** Revise en una sola mirada el Total Pendiente, Total Pagado, Deudas Vencidas Anteriores (alerta de morosidad) y Próximo Vencimiento.
4. **Inspección Unificada y Auditoría Documental:**
   - Visualice en una sola tabla todas las obligaciones del periodo con la columna `N° Operación` visible.
   - Acceda simultáneamente a la comprobación de titularidad (`Ver Titular / DNI`) y al comprobante archivado (`Ver Voucher`) una vez pagado el recibo.
5. **Configuración y Gobierno del Negocio:**
   - **Nuevo Proveedor:** Registre acreedores con validación estricta de teléfono para Perú (exactamente 9 dígitos numéricos, sin letras) y active la casilla Yape para fijar número y titular.
   - **Ver / Editar Proveedores:** Consulte el directorio completo y use el botón `Editar` para rectificar datos de contacto o Yape sin duplicar registros.
   - **Nuevo Tipo de Gasto:** Registre categorías adicionales (ej. Seguros Empresariales, Alquiler, Mantenimiento).
   - **Métodos de Pago:** Incorpore nuevas modalidades de liquidación (ej. Plin, PagoEfectivo) para habilitarlas al Asistente.
   - **Cuentas y Tarjetas Bancarias:** Use el botón `+ Nueva Cuenta / Tarjeta` para dar de alta instrumentos confidenciales con banco, tipo, moneda y número.
6. **Cierre de Sesión:** Presione "Cerrar Sesión" para proteger la privacidad de sus instrumentos bancarios personales.

### 5.2 Para el Asistente
1. **Acceso al Sistema:** Ingrese su usuario (`asistente`) y contraseña (`asistente123`).
2. **Alerta de Deudas Anteriores:** En la cabecera visualice de inmediato el banner de advertencia si existen deudas vencidas arrastradas de meses pasados pendientes de pago.
3. **Navegación Temporal:** Seleccione el periodo a trabajar con las flechas o el salto directo a Mes y Año.
4. **Registrar Nuevo Gasto:**
   - Presione "Nuevo Gasto".
   - Digite el número o código oficial de recibo (ej. Suministro Luz, Factura, NPS SUNAT).
   - Seleccione el proveedor y tipo de gasto (aprobados previamente por el Gerente).
   - Ingrese el monto y la fecha de vencimiento.
   - Adjunte la foto de comprobación de titularidad (DNI/recibo del titular) y guarde.
5. **Registrar Pago Realizado:**
   - Ubique la obligación en la lista y presione "Registrar Pago".
   - **Si paga con Yape:** El sistema le mostrará el número y titular registrado por el Gerente para que realice el depósito con total seguridad.
   - **Si paga en Efectivo (Ley N° 29571):** Si el recibo tiene céntimos (ej. S/ 500.35), el sistema aplicará el redondeo a S/ 500.30. Al escribir el dinero recibido (ej. S/ 510.00), el sistema le mostrará el vuelto exacto a entregar (S/ 9.70).
   - Ingrese el N° de Operación oficial (ej. `OP-9988221`), adjunte la foto o captura del comprobante de pago/voucher y confirme.
6. **Edición y Rectificación de Obligaciones:**
   - En caso de error en la digitación del concepto, importe, vencimiento o N° de operación, use el botón `Editar` en la fila correspondiente para subsanar los datos.

---

## 6. Verificación de Cumplimiento de Restricciones de Diseño

| Restricción Evaluada | Estado | Verificación Técnica Realizada |
| :--- | :---: | :--- |
| **Cero Emojis en la UI** | Cumplido | Verificación exhaustiva: 0 emojis en todo el código HTML, CSS, JavaScript y textos informativos. |
| **Sin viñetas con líneas verticales** | Cumplido | Presentación basada en tablas limpias, tarjetas cuadradas y formularios sin decoraciones de IA. |
| **Identidad corporativa sobria** | Cumplido | Nombre del producto limpio (**CuentaClara**), sin referencias a cursos, parciales ni universidades. |
| **Textos directos y funcionales** | Cumplido | Ausencia de saludos artificiales de IA; textos directos ("Usuario o contraseña incorrectos.", "Sin pendientes"). |
| **Paleta de 3 colores corporativos** | Cumplido | Primario azul corporativo (`#1E3A5F`), fondo gris suave (`#F8F9FA`), acento ámbar (`#D97706`) y alerta moratoria (`#842029`). |
| **Retícula de espaciado en 8px** | Cumplido | Variables CSS estructuradas en múltiplos de 8px (8, 16, 24, 32). |
| **Bordes y sombras sutiles** | Cumplido | Radios de bordes de 4px a 6px; sombras suaves `0 1px 3px rgba(0,0,0,0.1)`. |
| **Navegación minimalista** | Cumplido | Pantalla única para el Gerente con vista conjunta de pendientes/realizados y selector de meses central. |
| **Privacidad de medios de pago** | Cumplido | Sección confidencial de medios de pago visible únicamente en la sesión del gerente. |
| **Cumplimiento legal Ley 29571** | Cumplido | Algoritmo de redondeo hacia abajo a favor del cliente con desglose transparente y cálculo de vuelto. |

---

## 7. Resumen de Atención a Observaciones de Feedback del Cliente

1. **Visibilidad de N° Operación:** Columna fija en ambas tablas (Gerente y Asistente).
2. **Métodos de Pago Dinámicos:** Modal del Gerente para crear nuevos métodos (ej. Plin) y consumirlos en el Asistente.
3. **Alerta de Deudas Anteriores en Asistente:** Banner prominente de advertencia para obligaciones vencidas pasadas.
4. **Validación de Teléfono Perú:** Restricción estricta en tiempo real a 9 dígitos numéricos sin letras ni símbolos.
5. **Edición de Proveedores y Gastos:** Botones de edición dedicados para rectificar acreedores y registros de pago.
6. **Doble Botón de Evidencias:** Acceso simultáneo a "Ver Titular / DNI" y "Ver Voucher" tras liquidar la obligación.
7. **Cuentas y Tarjetas Bancarias:** Módulo dinámico del Gerente para dar de alta instrumentos financieros con persistencia.
8. **Salto Rápido a Periodo:** Selector directo de Mes y Año para navegar a cualquier fecha histórica o futura en 1 clic.
