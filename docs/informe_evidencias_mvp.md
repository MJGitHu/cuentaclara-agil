# CuentaClara - Informe de Validación de Historias de Usuario (MVP)
## Evidencias de Ejecución y Demostración de Solución al Negocio

**Archivo Word generado:** [docs/informe_evidencias_mvp.docx](file:///d:/parcial-agile/docs/informe_evidencias_mvp.docx)  
**Carpeta de Capturas:** [docs/evidencias/](file:///d:/parcial-agile/docs/evidencias/)

---

## 1. Introducción y Contexto del Problema

El Gerente de la empresa administra múltiples obligaciones mensuales (servicios públicos de luz y agua, tributos de SUNAT, cuotas de préstamos bancarios y proveedores de insumos). Debido a la dispersión de fechas y montos, se producían atrasos involuntarios y cobro de moras.

Para solucionar esto, contrató a un Asistente administrativo. Sin embargo, ambos requerían una herramienta ágil, sin pasarelas de pago reales ni complejidades innecesarias, que garantizara:
- **Para el Gerente:** Supervisión en una sola pantalla con 4 métricas financieras consolidadas (Total Pendiente, Total Pagado, Deudas Vencidas Anteriores y Próximo Vencimiento), navegación temporal entre meses y control estricto de sus cuentas personales.
- **Para el Asistente:** Consola para organizar vencimientos, consultar datos de Yape del proveedor, registrar pagos en efectivo aplicando la ley de redondeo (Ley N° 29571 / BCRP) con cálculo del vuelto y adjuntar la foto del comprobante (voucher).

---

## 2. Matriz de Trazabilidad: Historias de Usuario vs. Evidencias

| Historia de Usuario | Criterios Clave Validados | Acción Ejecutada en la App | Evidencia Gráfica |
| :--- | :--- | :--- | :---: |
| **HU-01: Autenticación por Rol** | Criterio 1.1 (Pantalla limpia)<br>Criterio 1.2 (Error credenciales)<br>Criterio 1.3 (Gerente) / 1.4 (Asistente) | Validación de login limpio, detección de credenciales inválidas y acceso diferenciado. | **Paso 1, 2** |
| **HU-02: Dashboard y Periodos** | Criterio 2.1 (4 KPIs de resumen)<br>Criterio 2.2 (Pantalla unificada)<br>Criterio 2.3 (Navegación temporal)<br>Criterio 2.4 (Cuentas confidenciales) | Supervisión de métricas, listas conjuntas, alternancia de 3 meses y cuentas privadas. | **Paso 3, 4, 5, 7** |
| **HU-03: Identificación y Titularidad** | Criterio 3.1 (Identificador de recibo)<br>Criterio 3.2 (Comprobación deuda propia) | Visualización de código de comprobante oficial y modal con foto de DNI del titular. | **Paso 3, 6** |
| **HU-04: Gobierno por Gerencia** | Criterio 4.1 (Proveedores con Yape)<br>Criterio 4.2 (Tipos de gasto dinámicos)<br>Criterio 4.3 (Consumo restringido) | Creación exclusiva de proveedores con Yape y tipos de gasto que el asistente consume. | **Paso 8, 9, 10, 12** |
| **HU-05: Liquidación y Evidencias** | Criterio 5.1 (Datos Yape al pagar)<br>Criterio 5.2 (Redondeo Ley 29571)<br>Criterio 5.3 (Foto voucher comprobante) | Despliegue de Yape, redondeo en efectivo (S/ 500.35 -> S/ 500.30 con vuelto) y foto voucher. | **Paso 13, 14, 15, 16** |
| **HU-06: Seguimiento Tributario** | Criterio 6.1 (Ingreso manual impuestos) | Registro de impuestos SUNAT con montos exactos manuales sin fórmulas arbitrarias. | **Paso 3, 11** |

---

## 3. Evidencias Gráficas y Validación Paso a Paso

### Paso 1: Pantalla de Inicio de Sesión Limpia (HU-01, Criterio 1.1)
- **Descripción:** La pantalla inicial no muestra ningún dato financiero ni nombres de proveedores antes de autenticarse.
- **Captura:** ![Paso 1](evidencias/01_login_inicial.png)
- **Resultado:** *Cumplido (Criterio 1.1).*

---

### Paso 2: Control de Seguridad y Manejo de Errores (HU-01, Criterio 1.2)
- **Descripción:** Al ingresar credenciales inválidas, el sistema muestra el mensaje directo `"Usuario o contraseña incorrectos."`.
- **Captura:** ![Paso 2](evidencias/02_login_error_credenciales.png)
- **Resultado:** *Cumplido (Criterio 1.2).*

---

### Paso 3: Dashboard del Gerente con 4 KPIs y Pantalla Unificada (HU-01, HU-02, Criterios 1.3, 2.1, 2.2)
- **Descripción:** Visualización de los 4 indicadores clave (Total Pendiente: S/ 6,370.35, Total Pagado: S/ 3,550.00, Deudas Vencidas Anteriores: S/ 195.00 y Próximo Vencimiento: 18/10/2026). Debajo, en la misma pantalla, se despliegan juntas las tablas de pendientes y realizados.
- **Captura:** ![Paso 3](evidencias/03_gerente_dashboard_octubre.png)
- **Resultado:** *Cumplido (Criterios 2.1 y 2.2).*

---

### Paso 4: Navegación Temporal: Mes Anterior - Septiembre 2026 (HU-02, Criterio 2.3)
- **Descripción:** Al pulsar `< Mes Anterior`, se consulta Septiembre 2026, evidenciando el recibo de Sedapal N° `REC-SEDAPAL-0922` (S/ 195.00) que quedó impago y genera la alerta de deuda vencida anterior.
- **Captura:** ![Paso 4](evidencias/04_gerente_mes_anterior_septiembre.png)
- **Resultado:** *Cumplido (Criterio 2.3).*

---

### Paso 5: Navegación Temporal: Próximo Mes - Noviembre 2026 (HU-02, Criterio 2.3)
- **Descripción:** Al pulsar `Próximo Mes >`, el Gerente audita las obligaciones proyectadas de Noviembre 2026 (S/ 5,320.00 en SUNAT y cuota bancaria BCP).
- **Captura:** ![Paso 5](evidencias/05_gerente_proximo_mes_noviembre.png)
- **Resultado:** *Cumplido (Criterio 2.3).*

---

### Paso 6: Comprobación de Titularidad y Deuda Propia (HU-03, Criterio 3.2)
- **Descripción:** Cada fila cuenta con el botón `Ver Titular / DNI`, el cual abre la ventana modal con la foto del DNI y acreditación del titular del negocio.
- **Captura:** ![Paso 6](evidencias/06_modal_ver_titular_dni.png)
- **Resultado:** *Cumplido (Criterio 3.2).*

---

### Paso 7: Privacidad de Cuentas Financieras del Gerente (HU-02, Criterio 2.4)
- **Descripción:** Sección confidencial de cuentas bancarias y tarjetas empresariales visible únicamente en la sesión de gerencia.
- **Captura:** ![Paso 7](evidencias/07_cuentas_confidenciales_gerente.png)
- **Resultado:** *Cumplido (Criterio 2.4).*

---

### Paso 8: Gobierno por Gerencia: Proveedor con Billetera Digital Yape (HU-04, Criterio 4.1)
- **Descripción:** Formulario donde el Gerente registra proveedores indicando número de celular y titular/alias de Yape.
- **Captura:** ![Paso 8](evidencias/08_modal_nuevo_proveedor_yape.png)
- **Resultado:** *Cumplido (Criterio 4.1).*

---

### Paso 9: Creación de Nuevos Tipos de Gasto por Gerencia (HU-04, Criterio 4.2)
- **Descripción:** Modal para que el Gerente cree nuevas categorías personalizadas (ej. `Seguros Empresariales`).
- **Captura:** ![Paso 9](evidencias/09_modal_nuevo_tipo_gasto.png)
- **Resultado:** *Cumplido (Criterio 4.2).*

---

### Paso 10: Catálogo Consolidado de Proveedores (HU-04, Criterio 4.3)
- **Descripción:** Consulta del directorio autorizado de acreedores y sus datos de contacto y Yape.
- **Captura:** ![Paso 10](evidencias/10_catalogo_proveedores.png)
- **Resultado:** *Cumplido (Criterio 4.3).*

---

### Paso 11: Consola Operativa del Asistente (HU-01, Criterio 1.4)
- **Descripción:** Vista operativa del asistente con filtros por proveedor, tipo, estado y orden de vencimiento.
- **Captura:** ![Paso 11](evidencias/11_asistente_consola_octubre.png)
- **Resultado:** *Cumplido (Criterio 1.4).*

---

### Paso 12: Registro de Nuevo Gasto con Identificador Oficial de Recibo (HU-03, HU-04)
- **Descripción:** Formulario para registrar un gasto con su código de recibo oficial, consumiendo únicamente proveedores y tipos aprobados por Gerencia.
- **Captura:** ![Paso 12](evidencias/12_modal_asistente_nuevo_gasto.png)
- **Resultado:** *Cumplido (Criterios 3.1 y 4.3).*

---

### Paso 13: Liquidación con Yape: Visualización Automática de Datos (HU-05, Criterio 5.1)
- **Descripción:** Al elegir Yape, el sistema muestra automáticamente el celular `987654321` y titular `Juan Pérez Ramos / Logística Norte` registrados por Gerencia.
- **Captura:** ![Paso 13](evidencias/13_modal_pago_yape_datos.png)
- **Resultado:** *Cumplido (Criterio 5.1).*

---

### Paso 14: Liquidación en Efectivo: Redondeo Ley N° 29571 / BCRP (HU-05, Criterio 5.2)
- **Descripción:** Demostración exacta para recibos con céntimos (Factura por S/ 500.35). El sistema aplica el redondeo obligatorio hacia abajo a S/ 500.30 (-S/ 0.05). Con S/ 510.00 recibidos, calcula reactivamente el `Vuelto a Recibir: S/ 9.70`.
- **Captura:** ![Paso 14](evidencias/14_modal_pago_efectivo_redondeo_ley29571.png)
- **Resultado:** *Cumplido (Criterio 5.2).*

---

### Paso 15: Actualización Inmediata a Estado 'Realizado' (HU-05, Criterio 5.3)
- **Descripción:** Al confirmar el pago, la obligación cambia a estado `Realizado` y se sincroniza en el balance mensual.
- **Captura:** ![Paso 15](evidencias/15_asistente_pago_completado.png)
- **Resultado:** *Cumplido (Criterio 5.3).*

---

### Paso 16: Evidencia Documental: Foto del Comprobante / Voucher (HU-05, Criterio 5.3)
- **Descripción:** Modal que previsualiza a tamaño completo la captura del voucher bancario archivado mediante el botón `Ver Voucher`.
- **Captura:** ![Paso 16](evidencias/16_modal_comprobante_voucher.png)
- **Resultado:** *Cumplido (Criterio 5.3).*

---

## 4. Conclusiones

El sistema **CuentaClara (MVP)** cumple rigurosamente con los principios de desarrollo ágil y resuelve el problema del negocio sin pasarelas de pago reales:
1. El Gerente sabe en todo momento qué debe pagar, qué moras anteriores tiene y qué ya fue atendido.
2. El Asistente cuenta con un flujo seguro para pagar con Yape o Efectivo aplicando el redondeo legal de céntimos (Ley 29571) y archivando el comprobante correspondiente.
3. Se protegen las cuentas personales del gerente y se garantiza la titularidad de los recibos mediante evidencia fotográfica de DNI.
