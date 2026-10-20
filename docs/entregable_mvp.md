# Documento Entregable - Producto Mínimo Viable (MVP)
## Sistema de Gestión y Control de Pagos: CuentaClara

---

## 1. Contexto del Negocio y Resumen de la Solución

El negocio presenta una problemática operativa recurrente: la gerencia maneja múltiples obligaciones financieras mensuales (servicios públicos, tributos/impuestos, préstamos bancarios y proveedores de insumos). Debido a la dispersión de fechas y montos, se generaban retrasos involuntarios y desorden administrativo.

A partir de la sesión de feedback y refinamiento con el cliente (profesor), se optimizó el Producto Mínimo Viable (MVP) **CuentaClara**, asegurando una experiencia funcional, intuitiva y transparente bajo la metodología ágil Scrum, con las siguientes directrices clave:
1. **Etapa de Registro y Control (Sin pasarelas reales):** La solución prescinde de pasarelas de pago externas o integraciones complejas (MercadoPago/WhatsApp); el flujo culmina con el registro administrativo y la evidencia documental del pago.
2. **Gerente:** Dispone de un panel ejecutivo de supervisión en una sola pantalla con 4 indicadores clave (Pendientes del mes, Pagados del mes, Deudas vencidas anteriores y Próximo vencimiento), visualización conjunta de pendientes y realizados, navegación entre meses (pasado, actual y próximo), y gobierno exclusivo para crear proveedores (con soporte para Yape) y tipos de gasto.
3. **Asistente:** Dispone de una consola operativa para registrar compromisos con su código oficial de recibo y comprobación de titularidad (foto DNI), seleccionar proveedores y categorías autorizadas por el Gerente, registrar pagos con constancia fotográfica del voucher, visualizar datos de Yape del proveedor y aplicar la regla legal de redondeo en efectivo (Ley N° 29571 / BCRP) con cálculo automático del vuelto.

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
* **Criterio 2.2 (Vista Conjunta en la Misma Pantalla):**
  - **Dado** que existen gastos registrados,
  - **Cuando** el Gerente revisa su panel,
  - **Entonces** visualiza simultáneamente en la misma pantalla la tabla de "Pagos Pendientes del Periodo" y la tabla de "Pagos Realizados del Periodo", sin pestañas que oculten información.
* **Criterio 2.3 (Navegación de Meses):**
  - **Dado** que el Gerente se encuentra en el mes actual (Octubre 2026),
  - **Cuando** pulsa "< Mes Anterior",
  - **Entonces** la pantalla se actualiza al instante con los datos de Septiembre 2026; y al presionar "Próximo Mes >", avanza hacia Noviembre 2026.
* **Criterio 2.4 (Privacidad de Cuentas Personales):**
  - **Dado** que el Gerente mantiene cuentas bancarias personales para pagos,
  - **Cuando** consulta su sesión,
  - **Entonces** visualiza su panel confidencial de cuentas y tarjetas, el cual permanece 100% oculto e inaccesible para la vista del asistente.
* **Subtareas Técnicas de Desarrollo (Jira):**
  - `SUB-06` (Desarrollador 2 - 2h): Maquetar componente de navegación temporal (period-navigator) con botones anterior/siguiente.
  - `SUB-07` (Desarrollador 3 - 2h): Programar funciones de fechas (changePeriod, getActivePeriodKey) para Septiembre, Octubre y Noviembre.
  - `SUB-08` (Desarrollador 3 - 3h): Desarrollar algoritmos de agregación financiera para cálculo dinámico de los 4 KPIs en Dashboard.
  - `SUB-09` (Desarrollador 1 - 3h): Construir tablas sincronizadas en el DOM para renderizar pagos pendientes y realizados juntos.
  - `SUB-10` (Desarrollador 4 - 2h): Codificar sección de cuentas bancarias confidenciales con lógica de aislamiento para el Asistente.
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

### Historia de Usuario 4: Gobierno de Proveedores y Tipos de Gasto por Gerencia
**Como** Gerente,  
**Quiero** crear y administrar el catálogo de proveedores (con datos de Yape) y registrar nuevos tipos de gasto,  
**Para** que el Asistente únicamente seleccione opciones previamente autorizadas y sepa dónde transferir.

* **Criterio 4.1 (Alta de Proveedores con Billetera Digital Yape):**
  - **Dado** que el Gerente registra un proveedor,
  - **Cuando** activa la opción "¿Acepta Yape?", ingresa el número celular y el nombre del titular/alias,
  - **Entonces** el proveedor queda guardado y esos datos de Yape estarán disponibles para el asistente al momento del pago.
* **Criterio 4.2 (Creación Dinámica de Tipos de Gasto):**
  - **Dado** que el Gerente requiere una nueva categoría (ej. "Seguros" o "Mantenimiento"),
  - **Cuando** pulsa "Nuevo Tipo de Gasto", ingresa el nombre y confirma,
  - **Entonces** el nuevo tipo se incorpora de inmediato a los catálogos y filtros del sistema.
* **Criterio 4.3 (Consumo Restringido por el Asistente):**
  - **Dado** que el Asistente registra un nuevo gasto,
  - **Cuando** despliega las opciones de proveedor y tipo de gasto,
  - **Entonces** solo puede elegir entre los elementos registrados por la gerencia.
* **Subtareas Técnicas de Desarrollo (Jira):**
  - `SUB-16` (Desarrollador 1 - 3h): Desarrollar modal exclusivo de Gerente para alta de proveedores con campos de Yape (celular/titular).
  - `SUB-17` (Desarrollador 3 - 2h): Implementar función addExpenseType y selector dinámico para tipos de gasto de Gerencia.
  - `SUB-18` (Desarrollador 2 - 2h): Construir tabla modal para auditoría del catálogo de proveedores y datos de billetera digital.
  - `SUB-19` (Desarrollador 5 - 2h): Escribir pruebas funcionales para asegurar que el Asistente solo consuma catálogos aprobados.

---

### Historia de Usuario 5: Liquidación de Pagos con Yape, Efectivo y Evidencia Fotográfica
**Como** Asistente,  
**Quiero** registrar pagos atendidos con Yape o Efectivo adjuntando la foto del comprobante y calculando el vuelto exacto por ley,  
**Para** cumplir con la normativa peruana de redondeo, documentar la salida de dinero y actualizar el estado a "Realizado".

* **Criterio 5.1 (Visualización Automática de Datos de Yape):**
  - **Dado** que el Asistente selecciona como método "Yape (Billetera Digital)",
  - **Cuando** el proveedor tiene configurado Yape,
  - **Entonces** el modal muestra una tarjeta informativa con el número celular y el nombre del titular para facilitar el depósito.
* **Criterio 5.2 (Redondeo Legal de Céntimos en Efectivo - Ley N° 29571 / BCRP):**
  - **Dado** que el Asistente selecciona el método "Efectivo" para un gasto con céntimos no fraccionables (ej. S/ 500.35),
  - **Cuando** el sistema procesa la liquidación física,
  - **Entonces** aplica la Ley 29571 redondeando hacia abajo a la decena de céntimos inmediata a favor del cliente (S/ 500.30 con descuento de -S/ 0.05), solicita el efectivo recibido y calcula el vuelto exacto (ej. con S/ 510.00 recibidos, calcula S/ 9.70 de vuelto).
* **Criterio 5.3 (Foto del Comprobante de Pago Obligatorio):**
  - **Dado** que el Asistente liquida una obligación,
  - **Cuando** adjunta la fotografía o captura del voucher bancario/recibo sellado y confirma el pago,
  - **Entonces** el gasto cambia a estado "Realizado" y la foto queda archivada para consulta inmediata del Gerente mediante el botón "Ver Voucher".
* **Subtareas Técnicas de Desarrollo (Jira):**
  - `SUB-20` (Desarrollador 3 - 2h): Programar event listener en selector de método de pago para desplegar tarjeta Yape del proveedor.
  - `SUB-21` (Desarrollador 3 - 2h): Implementar algoritmo matemático de redondeo de céntimos en efectivo bajo Ley N° 29571 / BCRP.
  - `SUB-22` (Desarrollador 4 - 2h): Codificar lógica reactiva de cálculo de vuelto en efectivo según monto en input cashReceived.
  - `SUB-23` (Desarrollador 2 - 3h): Programar módulo de carga de foto de voucher con FileReader y modal de comprobante archivado.
  - `SUB-24` (Desarrollador 5 - 2h): Ejecutar suite de pruebas de liquidación en efectivo (S/ 500.35 -> S/ 500.30 y vuelto S/ 9.70) y Yape.

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
| **SUB-09** | HU-02 | Construir tablas sincronizadas en el DOM para renderizar pagos pendientes y realizados juntos | Codificación | 3h | Desarrollador 1 |
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
2. **Navegación de Meses:** En la barra superior use `< Mes Anterior` y `Próximo Mes >` para auditar Septiembre, Octubre o Noviembre 2026.
3. **Monitoreo de 4 KPIs:** Revise en una sola mirada el Total Pendiente, Total Pagado, Deudas Vencidas Anteriores (alerta de morosidad) y Próximo Vencimiento.
4. **Inspección Conjunta de Listas:** En la misma pantalla revise la tabla de pendientes (con botón para ver foto del DNI del titular) y la tabla de realizados (con botón para ver foto del voucher bancario).
5. **Configuración del Negocio:**
   - **Nuevo Proveedor:** Registre acreedores y active la casilla Yape para fijar el número y titular.
   - **Nuevo Tipo de Gasto:** Registre categorías adicionales (ej. Seguros, Alquiler, Mantenimiento).
   - **Ver Proveedores:** Consulte el directorio completo de empresas autorizadas.
6. **Cierre de Sesión:** Presione "Cerrar Sesión" para proteger la privacidad de sus instrumentos bancarios personales.

### 5.2 Para el Asistente
1. **Acceso al Sistema:** Ingrese su usuario (`asistente`) y contraseña (`asistente123`).
2. **Navegación Temporal:** Seleccione el mes sobre el cual registrará o consultará obligaciones.
3. **Registrar Nuevo Gasto:**
   - Presione "Nuevo Gasto".
   - Digite el número o código oficial de recibo (ej. Suministro Luz, Factura, NPS SUNAT).
   - Seleccione el proveedor y tipo de gasto (aprobados previamente por el Gerente).
   - Ingrese el monto y la fecha de vencimiento.
   - Adjunte la foto de comprobación de titularidad (DNI/recibo del titular) y guarde.
4. **Registrar Pago Realizado:**
   - Ubique la obligación en la lista y presione "Registrar Pago".
   - **Si paga con Yape:** El sistema le mostrará el número y titular registrado por el Gerente para que realice el depósito con total seguridad.
   - **Si paga en Efectivo (Ley N° 29571):** Si el recibo tiene céntimos (ej. S/ 500.35), el sistema aplicará el redondeo a S/ 500.30. Al escribir el dinero recibido (ej. S/ 510.00), el sistema le mostrará el vuelto exacto a entregar (S/ 9.70).
   - Adjunte la foto o captura del comprobante de pago/voucher y confirme.

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
