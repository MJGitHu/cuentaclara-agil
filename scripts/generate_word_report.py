# -*- coding: utf-8 -*-
"""
Generador del Informe de Validación de Historias de Usuario en formato Word (.docx)
Sistema CuentaClara - MVP de Gestión de Pagos
"""

import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

DOCS_DIR = os.path.join(os.path.dirname(__file__), '..', 'docs')
EVIDENCIAS_DIR = os.path.join(DOCS_DIR, 'evidencias')
OUTPUT_DOCX = os.path.join(DOCS_DIR, 'informe_evidencias_mvp.docx')

def set_cell_background(cell, color_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def add_callout(doc, title, text, bg_hex="F1F5F9", border_color="1E3A5F"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

    # Borde izquierdo grueso
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/>'
        f'<w:top w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    run_t = p.add_run(title + "\n")
    run_t.bold = True
    run_t.font.name = "Arial"
    run_t.font.size = Pt(10.5)
    run_t.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    run_body = p.add_run(text)
    run_body.font.name = "Arial"
    run_body.font.size = Pt(9.5)
    run_body.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def build_document():
    doc = Document()

    # Configuración de márgenes
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # -------------------------------------------------------------
    # PORTADA / ENCABEZADO PRINCIPAL
    # -------------------------------------------------------------
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("CUENTACLARA")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    p_subtitle = doc.add_paragraph()
    p_subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subtitle.paragraph_format.space_after = Pt(8)
    run_sub = p_subtitle.add_run("Sistema de Gestión, Control y Registro de Obligaciones Financieras")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    p_doc_type = doc.add_paragraph()
    p_doc_type.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_doc_type.paragraph_format.space_after = Pt(24)
    run_doc_type = p_doc_type.add_run("INFORME DE VALIDACIÓN DE HISTORIAS DE USUARIO Y EVIDENCIAS DE EJECUCIÓN (MVP)")
    run_doc_type.font.name = "Arial"
    run_doc_type.font.size = Pt(11)
    run_doc_type.font.bold = True
    run_doc_type.font.color.rgb = RGBColor(0xD9, 0x77, 0x06)

    # Metadata de entrega
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    meta_data = [
        ("Proyecto / Producto:", "CuentaClara - Producto Mínimo Viable (MVP)"),
        ("Metodología:", "Scrum / Desarrollo Ágil (Iteración de Refinamiento con Feedback)"),
        ("Alcance Operativo:", "Registro y monitoreo administrativo (Sin pasarelas reales de pago)"),
        ("Fecha de Validación:", "Octubre 2026")
    ]
    for idx, (label, val) in enumerate(meta_data):
        row = meta_table.rows[idx]
        cell_lbl = row.cells[0]
        cell_val = row.cells[1]
        cell_lbl.width = Inches(2.2)
        cell_val.width = Inches(4.3)
        set_cell_background(cell_lbl, "F8F9FA")
        set_cell_background(cell_val, "FFFFFF")
        set_cell_margins(cell_lbl, top=60, bottom=60, left=100, right=100)
        set_cell_margins(cell_val, top=60, bottom=60, left=100, right=100)

        p0 = cell_lbl.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        r0.font.name = "Arial"
        r0.font.size = Pt(9.5)
        r0.font.bold = True
        r0.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

        p1 = cell_val.paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        r1.font.name = "Arial"
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    doc.add_paragraph().paragraph_format.space_after = Pt(16)

    # -------------------------------------------------------------
    # 1. INTRODUCCIÓN Y CONTEXTO DEL PROBLEMA
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    r_h1 = h1.add_run("1. Introducción y Contexto del Negocio")
    r_h1.font.name = "Arial"
    r_h1.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.space_after = Pt(8)
    p_intro.paragraph_format.line_spacing = 1.15
    p_intro.add_run(
        "El presente informe documenta y demuestra de forma verificable la solución desarrollada para la problemática "
        "financiera y operativa de la empresa. El Gerente del negocio administra múltiples obligaciones mensuales "
        "(servicios de luz, agua, tributos e impuestos SUNAT, préstamos bancarios y proveedores de mercadería). "
        "Debido a la dispersión de fechas y la falta de un consolidado unificado, se producían atrasos involuntarios, "
        "cobro de moras e incertidumbre sobre el dinero pendiente de desembolso.\n\n"
        "Para solucionar este problema, el Gerente contrató a un Asistente administrativo. Sin embargo, se requería una "
        "herramienta tecnológica absurdamente fácil y funcional que resolviera exactamente las necesidades de ambos roles:\n"
    )

    bullets = [
        ("Rol Gerente: ", "Necesita conocer en una sola mirada qué gastos tiene que hacer en el mes, qué deudas vencidas anteriores arrastra, si ya se pagó o no cada obligación, y mantener protegidas sus cuentas bancarias personales."),
        ("Rol Asistente: ", "Necesita una consola para monitorear vencimientos, filtrar por proveedor o tipo, saber a qué número de Yape pagar, registrar pagos en efectivo aplicando el redondeo por ley y archivar la foto del comprobante de pago.")
    ]
    for b_title, b_desc in bullets:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_bt = bp.add_run(b_title)
        r_bt.bold = True
        r_bt.font.name = "Arial"
        r_bt.font.size = Pt(10)
        r_bd = bp.add_run(b_desc)
        r_bd.font.name = "Arial"
        r_bd.font.size = Pt(10)

    add_callout(
        doc,
        "Principio Clave del Cliente:",
        "Para esta etapa de prueba no se efectúan pagos reales ni pasarelas externas (Stripe, MercadoPago o WhatsApp). "
        "El sistema culmina con el registro administrativo, el cálculo del vuelto/redondeo y el archivo documental del voucher.",
        bg_hex="EFF6FF",
        border_color="2563EB"
    )

    # -------------------------------------------------------------
    # 2. MATRIZ DE TRAZABILIDAD DE HISTORIAS DE USUARIO
    # -------------------------------------------------------------
    h2 = doc.add_heading(level=1)
    r_h2 = h2.add_run("2. Matriz de Trazabilidad: Requerimientos vs. Evidencias")
    r_h2.font.name = "Arial"
    r_h2.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    p_mat = doc.add_paragraph()
    p_mat.paragraph_format.space_after = Pt(8)
    p_mat.add_run(
        "A continuación se detalla la matriz que relaciona cada Historia de Usuario del entregable con su criterio "
        "de aceptación en formato Gherkin y el paso de evidencia gráfica correspondiente:"
    )

    matrix_table = doc.add_table(rows=7, cols=4)
    matrix_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    matrix_table.autofit = False

    headers = ["Historia de Usuario", "Criterios Clave Validados", "Acción Ejecutada en la App", "Evidencias"]
    widths = [Inches(1.5), Inches(2.2), Inches(1.8), Inches(1.0)]

    hdr_row = matrix_table.rows[0]
    for i, title in enumerate(headers):
        cell = hdr_row.cells[i]
        cell.width = widths[i]
        set_cell_background(cell, "1E3A5F")
        set_cell_margins(cell, top=80, bottom=80, left=80, right=80)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(title)
        r.font.name = "Arial"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    rows_data = [
        ("HU-01: Autenticación por Rol", "Criterio 1.1 (Pantalla limpia)\nCriterio 1.2 (Error credenciales)\nCriterio 1.3 (Gerente) / 1.4 (Asistente)", "Validación de login limpio, detección de credenciales inválidas y acceso diferenciado.", "Pasos 1, 2"),
        ("HU-02: Dashboard y Navegación", "Criterio 2.1 (4 KPIs de resumen)\nCriterio 2.2 (Pantalla unificada)\nCriterio 2.3 (Navegación temporal)\nCriterio 2.4 (Cuentas confidenciales)", "Supervisión de métricas, listas conjuntas, alternancia de 3 meses y cuentas privadas.", "Pasos 3, 4, 5, 7"),
        ("HU-03: Identificación y Titularidad", "Criterio 3.1 (Identificador de recibo)\nCriterio 3.2 (Comprobación deuda propia)", "Visualización de código de comprobante oficial y modal con foto de DNI del titular.", "Pasos 3, 6"),
        ("HU-04: Gobierno por Gerencia", "Criterio 4.1 (Proveedores con Yape)\nCriterio 4.2 (Tipos de gasto dinámicos)\nCriterio 4.3 (Consumo restringido)", "Creación exclusiva de proveedores con Yape y tipos de gasto que el asistente consume.", "Pasos 8, 9, 10, 12"),
        ("HU-05: Liquidación y Evidencias", "Criterio 5.1 (Datos Yape al pagar)\nCriterio 5.2 (Redondeo Ley 29571)\nCriterio 5.3 (Foto voucher comprobante)", "Despliegue de Yape, redondeo en efectivo (S/ 500.35 -> S/ 500.30 con vuelto) y foto voucher.", "Pasos 13, 14, 15, 16"),
        ("HU-06: Seguimiento Tributario", "Criterio 6.1 (Ingreso manual impuestos)", "Registro de impuestos SUNAT con montos exactos manuales sin fórmulas arbitrarias.", "Paso 3, 11")
    ]

    for row_idx, r_data in enumerate(rows_data, start=1):
        row = matrix_table.rows[row_idx]
        bg = "F8F9FA" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(r_data):
            cell = row.cells[col_idx]
            cell.width = widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.name = "Arial"
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    doc.add_paragraph().paragraph_format.space_after = Pt(16)

    # -------------------------------------------------------------
    # 3. VALIDACIÓN PASO A PASO CON EVIDENCIAS FOTOGRÁFICAS
    # -------------------------------------------------------------
    h3 = doc.add_heading(level=1)
    r_h3 = h3.add_run("3. Evidencias Gráficas y Validación Paso a Paso")
    r_h3.font.name = "Arial"
    r_h3.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    steps = [
        {
            "num": "Paso 1",
            "title": "Pantalla de Inicio de Sesión Limpia (HU-01, Criterio 1.1)",
            "hu": "HU-01: Autenticación y Control de Acceso por Rol",
            "desc": "Al acceder a la aplicación, la interfaz se presenta completamente vacía y neutral. No se expone ningún dato sensible, financiero ni nombres de proveedores antes de que el usuario ingrese sus credenciales autorizadas. Cuenta con accesos rápidos de prueba para facilitar la demostración al cliente.",
            "img": "01_login_inicial.png",
            "val": "Cumple Criterio 1.1: Pantalla inicial limpia sin datos visibles."
        },
        {
            "num": "Paso 2",
            "title": "Control de Seguridad y Validación de Credenciales (HU-01, Criterio 1.2)",
            "hu": "HU-01: Autenticación y Control de Acceso por Rol",
            "desc": "Al ingresar intencionalmente un usuario o contraseña no registrados, el sistema bloquea el acceso de inmediato y muestra el mensaje directo y sobrio: 'Usuario o contraseña incorrectos.', sin emojis ni decoraciones innecesarias.",
            "img": "02_login_error_credenciales.png",
            "val": "Cumple Criterio 1.2: Control de acceso estricto y manejo de errores formal."
        },
        {
            "num": "Paso 3",
            "title": "Dashboard del Gerente con 4 KPIs y Pantalla Unificada (HU-01, HU-02, Criterios 1.3, 2.1, 2.2)",
            "hu": "HU-02: Dashboard Ejecutivo del Gerente y Navegación Temporal",
            "desc": "El Gerente accede a su consola ejecutiva en el periodo actual (Octubre 2026). En la parte superior visualiza los 4 indicadores clave exigidos por el profesor:\n"
                    "1) Total Pendiente del Mes: S/ 6,370.35 (4 pagos pendientes).\n"
                    "2) Total Pagado del Mes: S/ 3,550.00 (2 pagos realizados).\n"
                    "3) Deudas Vencidas Anteriores: S/ 195.00 (1 deuda vencida que se arrastra de meses pasados).\n"
                    "4) Próximo Vencimiento: 18/10/2026 (Recibo de Energía Eléctrica).\n"
                    "Debajo, en la MISMA pantalla, se despliegan juntas la tabla de Pagos Pendientes del Periodo y la tabla de Pagos Realizados del Periodo, permitiendo una supervisión integral sin pestañas.",
            "img": "03_gerente_dashboard_octubre.png",
            "val": "Cumple Criterios 2.1 y 2.2: 4 KPIs consolidados y visualización conjunta de listas en la misma pantalla."
        },
        {
            "num": "Paso 4",
            "title": "Navegación Temporal: Auditoría del Mes Anterior - Septiembre 2026 (HU-02, Criterio 2.3)",
            "hu": "HU-02: Dashboard Ejecutivo del Gerente y Navegación Temporal",
            "desc": "Al hacer clic en el botón '< Mes Anterior', el sistema viaja instantáneamente al periodo Septiembre 2026. Se observa el recibo de Sedapal N° REC-SEDAPAL-0922 vencido el 22/09/2026 por S/ 195.00 que no fue cancelado, demostrando exactamente de dónde proviene el indicador de 'Deudas Vencidas Anteriores'.",
            "img": "04_gerente_mes_anterior_septiembre.png",
            "val": "Cumple Criterio 2.3: Navegación histórica hacia el mes anterior con recálculo dinámico."
        },
        {
            "num": "Paso 5",
            "title": "Navegación Temporal: Proyección del Próximo Mes - Noviembre 2026 (HU-02, Criterio 2.3)",
            "hu": "HU-02: Dashboard Ejecutivo del Gerente y Navegación Temporal",
            "desc": "Al pulsar 'Próximo Mes >', el sistema avanza al periodo futuro Noviembre 2026. El Gerente puede proyectar sus gastos futuros: Total Pendiente de S/ 5,320.00 correspondiente al Impuesto SUNAT Estimado (S/ 1,920.00) y la Cuota 09/24 del Préstamo BCP (S/ 3,400.00).",
            "img": "05_gerente_proximo_mes_noviembre.png",
            "val": "Cumple Criterio 2.3: Navegación proyectiva hacia el próximo mes para planeamiento de liquidez."
        },
        {
            "num": "Paso 6",
            "title": "Comprobación de Titularidad y Deuda Propia con Foto de DNI (HU-03, Criterio 3.2)",
            "hu": "HU-03: Identificación del Recibo y Comprobación de Titularidad",
            "desc": "Para evitar confusiones y corroborar que una obligación o recibo corresponde legítimamente al negocio del Gerente, cada fila cuenta con el botón 'Ver Titular / DNI'. Al pulsarlo, se abre una ventana modal con el documento de identidad o acreditación fiscal registrada, protegiendo al negocio contra pagos de cuentas ajenas.",
            "img": "06_modal_ver_titular_dni.png",
            "val": "Cumple Criterio 3.2: Evidencia visual de titularidad para validar deudas propias."
        },
        {
            "num": "Paso 7",
            "title": "Privacidad de Medios de Pago Exclusivos de Gerencia (HU-02, Criterio 2.4)",
            "hu": "HU-02: Dashboard Ejecutivo del Gerente y Navegación Temporal",
            "desc": "En la parte inferior de la vista del Gerente se ubica la sección 'Cuentas y Tarjetas de Pago (Uso Exclusivo de Gerencia)'. Contiene las cuentas corrientes bancarias y tarjetas empresariales registradas. Este bloque es estrictamente confidencial y se encuentra 100% bloqueado e inaccesible para la vista del Asistente.",
            "img": "07_cuentas_confidenciales_gerente.png",
            "val": "Cumple Criterio 2.4: Privacidad y aislamiento de las credenciales de pago personales del gerente."
        },
        {
            "num": "Paso 8",
            "title": "Gobierno por Gerencia: Registro de Proveedor con Billetera Digital Yape (HU-04, Criterio 4.1)",
            "hu": "HU-04: Gobierno de Proveedores y Tipos de Gasto por Gerencia",
            "desc": "El Gerente dispone del control para dar de alta nuevos proveedores. Al abrir el formulario, puede ingresar los datos tributarios y activar la casilla 'El proveedor acepta pagos mediante Yape', especificando el número de celular y el nombre del titular/alias. El Asistente no podrá crear proveedores arbitrariamente, garantizando el control del negocio.",
            "img": "08_modal_nuevo_proveedor_yape.png",
            "val": "Cumple Criterio 4.1: Registro centralizado de acreedores y configuración de billeteras digitales."
        },
        {
            "num": "Paso 9",
            "title": "Gobierno por Gerencia: Creación de Nuevos Tipos de Gasto (HU-04, Criterio 4.2)",
            "hu": "HU-04: Gobierno de Proveedores y Tipos de Gasto por Gerencia",
            "desc": "El Gerente puede dar de alta nuevas categorías de gasto según el rubro de la empresa. En el modal se muestra la lista actual y permite agregar nuevos tipos como 'Seguros Empresariales', 'Alquiler', 'Mantenimiento' o 'Viáticos'.",
            "img": "09_modal_nuevo_tipo_gasto.png",
            "val": "Cumple Criterio 4.2: Categorización dinámica y estandarizada de gastos definida por gerencia."
        },
        {
            "num": "Paso 10",
            "title": "Catálogo Consolidado de Proveedores Registrados (HU-04, Criterio 4.3)",
            "hu": "HU-04: Gobierno de Proveedores y Tipos de Gasto por Gerencia",
            "desc": "Tanto el Gerente como el Asistente pueden consultar el catálogo autorizado de proveedores donde se detalla el RUC, razón social, rubro, contacto telefónico y si cuenta con Yape habilitado con su respectivo titular.",
            "img": "10_catalogo_proveedores.png",
            "val": "Cumple Criterio 4.3: Directorio autorizado y transparente para el equipo administrativo."
        },
        {
            "num": "Paso 11",
            "title": "Consola Operativa del Asistente con Filtros Dinámicos (HU-01, Criterio 1.4)",
            "hu": "HU-01: Autenticación y Control de Acceso por Rol",
            "desc": "El Asistente inicia sesión y accede a su consola de pagos del mes. Cuenta con filtros por Proveedor, Tipo de Gasto, Estado (Pendiente / Realizado / Todos) y Orden cronológico o por monto. Cada fila contiene la identificación del recibo, monto, fecha límite, estado y botones de acción rápida.",
            "img": "11_asistente_consola_octubre.png",
            "val": "Cumple Criterio 1.4: Espacio de trabajo enfocado y sin distracciones para el asistente."
        },
        {
            "num": "Paso 12",
            "title": "Registro de Nuevo Gasto con Identificador Oficial de Recibo (HU-03, HU-04, Criterios 3.1, 4.3)",
            "hu": "HU-03 / HU-04: Gestión Operativa de Obligaciones",
            "desc": "Al hacer clic en 'Nuevo Gasto', el Asistente registra una obligación ingresando su número de comprobante oficial (código de suministro, recibo o NPS SUNAT). Los selectores de 'Proveedor' y 'Tipo de Gasto' consumen exclusivamente los datos aprobados por el Gerente. Además, permite adjuntar la foto del DNI o constancia de titularidad.",
            "img": "12_modal_asistente_nuevo_gasto.png",
            "val": "Cumple Criterios 3.1 y 4.3: Código de recibo obligatorio y selección controlada de catálogos."
        },
        {
            "num": "Paso 13",
            "title": "Liquidación con Yape: Visualización Automática de Datos de Pago (HU-05, Criterio 5.1)",
            "hu": "HU-05: Liquidación de Pagos con Yape, Efectivo y Evidencia Fotográfica",
            "desc": "Al presionar 'Registrar Pago' sobre la Factura F004-9842 y seleccionar 'Yape (Billetera Digital)', el sistema despliega automáticamente una tarjeta informativa en color lila con los datos registrados por el Gerente: 'Número Celular: 987654321' y 'Titular / Alias: Juan Pérez Ramos / Logística Norte'. El Asistente no tiene que preguntar a quién transferir ni equivocarse de número.",
            "img": "13_modal_pago_yape_datos.png",
            "val": "Cumple Criterio 5.1: Seguridad y automatización de datos de billeteras digitales."
        },
        {
            "num": "Paso 14",
            "title": "Liquidación en Efectivo: Ley de Redondeo de Céntimos en Perú (Ley N° 29571 / BCRP) (HU-05, Criterio 5.2)",
            "hu": "HU-05: Liquidación de Pagos con Yape, Efectivo y Evidencia Fotográfica",
            "desc": "Demostración exacta de la observación del profesor para recibos con céntimos (ej. Factura por S/ 500.35 pagada en efectivo):\n"
                    "- Importe Original del Recibo: S/ 500.35.\n"
                    "- Redondeo Legal (Ley 29571 / BCRP): -S/ 0.05 (redondeo obligatorio hacia abajo a favor del consumidor/pagador ante la inexistencia de monedas de 1 y 5 céntimos).\n"
                    "- Total a Pagar en Efectivo: S/ 500.30.\n"
                    "- Efectivo Entregado: Al ingresar S/ 510.00, el sistema calcula reactivamente el 'Vuelto a Recibir: S/ 9.70'.",
            "img": "14_modal_pago_efectivo_redondeo_ley29571.png",
            "val": "Cumple Criterio 5.2: Riguroso cumplimiento legal de la Ley N° 29571 y cálculo de vuelto en efectivo."
        },
        {
            "num": "Paso 15",
            "title": "Actualización Inmediata a Estado 'Realizado' (HU-05, Criterio 5.3)",
            "hu": "HU-05: Liquidación de Pagos con Yape, Efectivo y Evidencia Fotográfica",
            "desc": "Al confirmar el pago indicando el método y número de constancia, la obligación pasa al estado 'Realizado' y muestra la fecha y el método empleado. El registro se traslada a la lista de completados del Asistente y actualiza en tiempo real los totales en el Dashboard del Gerente.",
            "img": "15_asistente_pago_completado.png",
            "val": "Cumple Criterio 5.3: Actualización reactiva de estado y sincronización de balance."
        },
        {
            "num": "Paso 16",
            "title": "Evidencia Documental: Foto del Comprobante de Pago / Voucher (HU-05, Criterio 5.3)",
            "hu": "HU-05: Liquidación de Pagos con Yape, Efectivo y Evidencia Fotográfica",
            "desc": "Cada pago realizado cuenta con su botón 'Ver Voucher'. Al pulsarlo, tanto el Asistente como el Gerente pueden previsualizar a tamaño completo la captura de la constancia bancaria, voucher sellado o comprobante digital archivado, garantizando una auditoría contable transparente.",
            "img": "16_modal_comprobante_voucher.png",
            "val": "Cumple Criterio 5.3: Auditoría documental completa con archivo fotográfico de vouchers."
        }
    ]

    for step in steps:
        p_step_hdr = doc.add_paragraph()
        p_step_hdr.paragraph_format.space_before = Pt(14)
        p_step_hdr.paragraph_format.space_after = Pt(2)
        r_num = p_step_hdr.add_run(f"[{step['num']}] ")
        r_num.bold = True
        r_num.font.name = "Arial"
        r_num.font.size = Pt(12)
        r_num.font.color.rgb = RGBColor(0xD9, 0x77, 0x06)

        r_stitle = p_step_hdr.add_run(step['title'])
        r_stitle.bold = True
        r_stitle.font.name = "Arial"
        r_stitle.font.size = Pt(12)
        r_stitle.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

        p_hu = doc.add_paragraph()
        p_hu.paragraph_format.space_after = Pt(4)
        r_hu_lbl = p_hu.add_run("Historia Relacionada: ")
        r_hu_lbl.bold = True
        r_hu_lbl.font.size = Pt(9.5)
        r_hu_lbl.font.name = "Arial"
        r_hu_lbl.font.color.rgb = RGBColor(0x47, 0x55, 0x69)
        r_hu_val = p_hu.add_run(step['hu'])
        r_hu_val.font.size = Pt(9.5)
        r_hu_val.font.name = "Arial"
        r_hu_val.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

        p_desc = doc.add_paragraph()
        p_desc.paragraph_format.space_after = Pt(8)
        p_desc.paragraph_format.line_spacing = 1.15
        r_desc = p_desc.add_run(step['desc'])
        r_desc.font.name = "Arial"
        r_desc.font.size = Pt(9.5)
        r_desc.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

        # Insertar imagen si existe
        img_path = os.path.join(EVIDENCIAS_DIR, step['img'])
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(4)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.add_run().add_picture(img_path, width=Inches(5.8))

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(8)
            r_cap = p_cap.add_run(f"Figura: Captura real del sistema para {step['num']} ({step['img']})")
            r_cap.font.name = "Arial"
            r_cap.font.size = Pt(8)
            r_cap.font.italic = True
            r_cap.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

        # Conclusión de validación
        p_val = doc.add_paragraph()
        p_val.paragraph_format.space_after = Pt(12)
        r_vlbl = p_val.add_run("Resultado de Validación: ")
        r_vlbl.bold = True
        r_vlbl.font.size = Pt(9)
        r_vlbl.font.name = "Arial"
        r_vlbl.font.color.rgb = RGBColor(0x0F, 0x51, 0x32)
        r_vval = p_val.add_run(step['val'])
        r_vval.font.size = Pt(9)
        r_vval.font.name = "Arial"
        r_vval.font.color.rgb = RGBColor(0x0F, 0x51, 0x32)

        # Separador tenue
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # 4. CONCLUSIONES Y VALOR DE NEGOCIO
    # -------------------------------------------------------------
    h4 = doc.add_heading(level=1)
    r_h4 = h4.add_run("4. Conclusiones y Demostración del Problema Resuelto")
    r_h4.font.name = "Arial"
    r_h4.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    p_concl = doc.add_paragraph()
    p_concl.paragraph_format.space_after = Pt(8)
    p_concl.paragraph_format.line_spacing = 1.15
    p_concl.add_run(
        "Las evidencias gráficas presentadas demuestran que el MVP CuentaClara resuelve de manera integral el problema "
        "planteado por el cliente, habiendo superado con éxito las 11 observaciones específicas brindadas en la sesión de feedback:\n"
    )

    concl_points = [
        ("Simplicidad Operativa Absoluta: ", "Sin integraciones técnicas complejas ni pasarelas de pago reales. El flujo de trabajo responde al modelo operativo real del negocio."),
        ("Supervisión Gerencial en Una Sola Pantalla: ", "El Gerente conoce de inmediato su deuda del mes, sus pagos ejecutados y sus moras antiguas mediante 4 KPIs visuales y listas unificadas."),
        ("Cumplimiento Legal y Redondeo en Efectivo: ", "Se abordó rigurosamente la Ley N° 29571 del Código del Consumidor y las directivas del BCRP para redondeo hacia abajo a favor del cliente en efectivo (S/ 500.35 -> S/ 500.30 con S/ 9.70 de vuelto)."),
        ("Seguridad y Respaldo Documental: ", "Acreditación de titularidad con foto de DNI y respaldo de cada egreso con captura de voucher bancario."),
        ("Gobierno Claro: ", "El Gerente controla los catálogos y números de Yape; el Asistente opera sin margen de error.")
    ]
    for c_title, c_desc in concl_points:
        cp = doc.add_paragraph(style='List Bullet')
        cp.paragraph_format.space_after = Pt(4)
        r_ct = cp.add_run(c_title)
        r_ct.bold = True
        r_ct.font.name = "Arial"
        r_ct.font.size = Pt(10)
        r_cd = cp.add_run(c_desc)
        r_cd.font.name = "Arial"
        r_cd.font.size = Pt(10)

    p_end = doc.add_paragraph()
    p_end.paragraph_format.space_before = Pt(16)
    p_end.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_end = p_end.add_run("--- FIN DEL INFORME DE EVIDENCIAS TÉCNICAS (MVP CUENTACLARA) ---")
    r_end.font.name = "Arial"
    r_end.font.size = Pt(9)
    r_end.font.bold = True
    r_end.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

    doc.save(OUTPUT_DOCX)
    print(f"Documento Word generado exitosamente en: {OUTPUT_DOCX}")

if __name__ == '__main__':
    build_document()
