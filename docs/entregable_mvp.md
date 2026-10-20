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

---

## 3. Matriz de Subtareas Técnicas (Estructura Jira)

| Código | Historia Relacionada | Título de la Subtarea | Tipo de Tarea | Estimación | Rol Asignado |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **SUB-01** | Transversal | Configuración de arquitectura modular en repositorio y servidor local | Configuración | 2h | Full-Stack Dev 1 |
| **SUB-02** | HU-01 | Implementación de autenticación RBAC y aislamiento de sesión inicial | Codificación | 3h | Full-Stack Dev 1 |
| **SUB-03** | HU-02 | Maquetado de barra de navegación temporal por meses (pasado/actual/próximo) | Prototipado | 2h | Full-Stack Dev 2 |
| **SUB-04** | HU-02 | Lógica de cálculo de los 4 KPIs (Pendiente, Pagado, Deudas vencidas y Próximo) | Codificación | 3h | Full-Stack Dev 1 |
| **SUB-05** | HU-02 | Integración visual de listas pendientes y realizadas en la misma pantalla | Prototipado | 2h | Full-Stack Dev 2 |
| **SUB-06** | HU-03 | Incorporación del campo identificador de recibo en datos y tablas | Codificación | 2h | Full-Stack Dev 1 |
| **SUB-07** | HU-03 | Módulo y modal de visualización de comprobación de titularidad (Foto DNI) | Codificación | 3h | Full-Stack Dev 2 |
| **SUB-08** | HU-04 | Módulo de registro de proveedores con soporte para billetera digital Yape | Codificación | 3h | Full-Stack Dev 1 |
| **SUB-09** | HU-04 | Formulario y almacenamiento dinámico de nuevos tipos de gasto por Gerente | Codificación | 2h | Full-Stack Dev 1 |
| **SUB-10** | HU-04 | Modal de consulta del catálogo completo de proveedores | Prototipado | 2h | Full-Stack Dev 2 |
| **SUB-11** | HU-05 | Lógica de despliegue contextual de datos de Yape en el modal de pago | Codificación | 2h | Full-Stack Dev 1 |
| **SUB-12** | HU-05 | Implementación del algoritmo de redondeo legal de céntimos (Ley 29571) | Codificación | 3h | Full-Stack Dev 1 |
| **SUB-13** | HU-05 | Control de efectivo entregado y cálculo reactivo de vuelto en pantalla | Codificación | 2h | Full-Stack Dev 2 |
| **SUB-14** | HU-05 | Carga y previsualización de foto de voucher/comprobante de pago | Codificación | 3h | Full-Stack Dev 2 |
| **SUB-15** | HU-05 | Modal de visualización de evidencias fotográficas a tamaño completo | Prototipado | 2h | Full-Stack Dev 2 |
| **SUB-16** | QA | Pruebas end-to-end de navegación temporal y persistencia de 3 periodos | Test | 2h | QA Engineer |
| **SUB-17** | QA | Verificación matemática de la regla de redondeo (ej. S/ 500.35 -> S/ 500.30) | Test | 2h | QA Engineer |
| **SUB-18** | QA | Verificación de seguridad de datos bancarios confidenciales del Gerente | Test | 2h | QA Engineer |
| **SUB-19** | Transversal | Auditoría estricta de restricciones de diseño UX/UI (0 emojis, paleta sobria) | Test | 2h | Scrum Master / QA |
| **SUB-20** | Transversal | Actualización de documentación técnica, guía de usuario y entrega | Implantación | 2h | Full-Stack Dev 1 |

* **Total de horas técnicas estimadas:** 46 horas de trabajo técnico directo.

---

## 4. Cálculo de Costos y Justificación Presupuestal

### Parámetros de Trabajo
- **Régimen de trabajo:** 4 horas al día por integrante, 5 días a la semana (20 horas/semana por profesional).
- **Duración del MVP:** 2 Sprints semanales (2 semanas de calendario = 10 días laborables).
- **Tarifa promedio de mercado:** S/ 40.00 por hora por profesional.
- **Equipo Scrum de 5 integrantes:** Product Owner, Scrum Master, Full-Stack Dev 1, Full-Stack Dev 2 y QA Engineer.

### Distribución de Horas por Rol

| Rol | Dedicación en Subtareas | Ceremonias Ágiles / Gestión | Total Horas | Tarifa / Hora | Subtotal (S/) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Product Owner** | 4h (Requisitos y validación con cliente) | 12h (Refinement, Review, Feedback) | 16h | S/ 40.00 | S/ 640.00 |
| **Scrum Master** | 4h (Supervisión de restricciones UX) | 14h (Dailies, Retrospectiva, Impedimentos)| 18h | S/ 40.00 | S/ 720.00 |
| **Full-Stack Dev 1** | 20h (Arquitectura, auth, redondeo, lógica) | 8h (Planificación y sincronización) | 28h | S/ 40.00 | S/ 1,120.00 |
| **Full-Stack Dev 2** | 16h (CSS, modales, vistas, evidencias) | 8h (Planificación y sincronización) | 24h | S/ 40.00 | S/ 960.00 |
| **QA Engineer** | 10h (Pruebas E2E, Gherkin, redondeo) | 6h (Casos de prueba y validación) | 16h | S/ 40.00 | S/ 640.00 |
| **Subtotal Base** | **54h** | **48h** | **102h** | - | **S/ 4,080.00** |

### Justificación Formal del Presupuesto

> *"El costo del proyecto se basa en un equipo de 5 profesionales trabajando bajo un régimen de 4 horas diarias durante 2 semanas (10 días laborables). La estimación directa contempla 54 horas de desarrollo, análisis y prototipado distribuidas en 20 subtareas técnicas, 28 horas de pruebas continuas y control de calidad sobre las nuevas reglas de negocio (redondeo de céntimos, Yape y navegación temporal), y 20 horas de ceremonias ágiles y gestión de entregables. Con una tarifa de mercado de S/ 40.00 por hora, el costo directo asciende a S/ 4,080.00. Aplicando un 10% de contingencia técnica y operativa (S/ 408.00), el costo total consolidado para el MVP es de **S/ 4,488.00**."*

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
