# -*- coding: utf-8 -*-
"""
Generador del Expediente Completo de Entrega del MVP en Word (.docx)
Sistema CuentaClara - Incluye Contexto, Historias de Usuario (Gherkin Dado/Cuando/Entonces),
Matriz Jira de Subtareas, Costos y Presupuesto, Guía de Usuario, Validación Paso a Paso con
16 Capturas Reales y Verificación de Restricciones.
"""

import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

DOCS_DIR = os.path.join(os.path.dirname(__file__), '..', 'docs')
EVIDENCIAS_DIR = os.path.join(DOCS_DIR, 'evidencias')
OUTPUT_DOCX = os.path.join(DOCS_DIR, 'informe_evidencias_mvp.docx')

def set_cell_background(cell, color_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=80, bottom=80, left=100, right=100):
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

def add_callout(doc, title, text, bg_hex="F8FAFC", border_color="1E3A5F"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)

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
    run_t.font.size = Pt(10)
    run_t.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    run_body = p.add_run(text)
    run_body.font.name = "Arial"
    run_body.font.size = Pt(9.5)
    run_body.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def format_table(tbl, widths, headers, data, align_right_cols=None):
    if align_right_cols is None:
        align_right_cols = []
    
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False

    # Header
    hdr = tbl.rows[0]
    for i, title in enumerate(headers):
        cell = hdr.cells[i]
        cell.width = widths[i]
        set_cell_background(cell, "1E3A5F")
        set_cell_margins(cell, top=80, bottom=80, left=80, right=80)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        if i in align_right_cols:
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r = p.add_run(title)
        r.font.name = "Arial"
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    # Rows
    for r_idx, row_values in enumerate(data, start=1):
        row = tbl.rows[r_idx]
        bg = "F8F9FA" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_values):
            cell = row.cells[c_idx]
            cell.width = widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            if c_idx in align_right_cols:
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            r = p.add_run(str(val))
            r.font.name = "Arial"
            r.font.size = Pt(8)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

def build_document():
    doc = Document()

    for s in doc.sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)

    # -------------------------------------------------------------
    # PORTADA
    # -------------------------------------------------------------
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run("CUENTACLARA")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(26)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    p_subtitle = doc.add_paragraph()
    p_subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subtitle.paragraph_format.space_after = Pt(6)
    run_sub = p_subtitle.add_run("Sistema de Gestión, Control y Registro de Obligaciones Financieras")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    p_doc_type = doc.add_paragraph()
    p_doc_type.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_doc_type.paragraph_format.space_after = Pt(20)
    run_doc_type = p_doc_type.add_run("EXPEDIENTE TÉCNICO Y VALIDACIÓN INTEGRAL DEL MVP")
    run_doc_type.font.name = "Arial"
    run_doc_type.font.size = Pt(11)
    run_doc_type.font.bold = True
    run_doc_type.font.color.rgb = RGBColor(0xD9, 0x77, 0x06)

    # Tabla de metadata
    meta_table = doc.add_table(rows=5, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    meta_data = [
        ("Producto de Software:", "CuentaClara (Producto Mínimo Viable - MVP)"),
        ("Metodología Ágil:", "Scrum (2 Sprints semanales, equipo de 5 profesionales)"),
        ("Alcance Operativo:", "Registro administrativo y liquidación documentada (Sin pasarelas reales)"),
        ("Roles de Usuario:", "Gerente (Supervisión y Gobierno) / Asistente (Operación y Registro)"),
        ("Marco Normativo Evaluado:", "Ley N° 29571 (Código del Consumidor, Art. 44) y Circulares BCRP")
    ]
    for idx, (label, val) in enumerate(meta_data):
        row = meta_table.rows[idx]
        cell_lbl, cell_val = row.cells[0], row.cells[1]
        cell_lbl.width, cell_val.width = Inches(2.2), Inches(4.3)
        set_cell_background(cell_lbl, "F8F9FA")
        set_cell_background(cell_val, "FFFFFF")
        set_cell_margins(cell_lbl, top=50, bottom=50, left=80, right=80)
        set_cell_margins(cell_val, top=50, bottom=50, left=80, right=80)
        p0, p1 = cell_lbl.paragraphs[0], cell_val.paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        r0.font.name = "Arial"; r0.font.size = Pt(9); r0.font.bold = True; r0.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)
        r1 = p1.add_run(val)
        r1.font.name = "Arial"; r1.font.size = Pt(9); r1.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # -------------------------------------------------------------
    # 1. CONTEXTO DEL NEGOCIO Y PROBLEMÁTICA
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    r = h1.add_run("1. Contexto del Negocio y Problemática Resuelta")
    r.font.name = "Arial"; r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "El negocio administrado por el Gerente enfrenta un desafío financiero crítico: mantiene diversas obligaciones "
        "mensuales de distinta índole (servicios básicos de energía eléctrica y agua, tributos declarados ante SUNAT, "
        "cuotas de préstamos bancarios de capital de trabajo y facturas de proveedores de mercadería). "
        "Al no contar con una plataforma centralizada, los pagos se dispersaban, generando confusiones en las fechas de "
        "corte, cobro involuntario de moras e incertidumbre sobre la liquidez disponible.\n\n"
        "Para solucionar este problema, el Gerente contrató a un Asistente administrativo. Sin embargo, ambos requerían "
        "una herramienta de software que fuera 'absurdamente fácil' y funcional para su dinámica real de trabajo:\n"
    )

    bullets = [
        ("Necesidad del Gerente: ", "Saber en todo momento qué gastos tiene que hacer en el mes, qué deudas vencidas anteriores arrastra, si cada obligación ya fue pagada o no, y mantener sus credenciales bancarias personales protegidas."),
        ("Necesidad del Asistente: ", "Una consola para organizar compromisos por vencimiento, saber a qué número de Yape transferir sin consultar, aplicar la regla de redondeo en efectivo por ley y archivar la foto del comprobante de pago.")
    ]
    for b_title, b_desc in bullets:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(3)
        r_bt = bp.add_run(b_title)
        r_bt.bold = True; r_bt.font.name = "Arial"; r_bt.font.size = Pt(9.5)
        r_bd = bp.add_run(b_desc)
        r_bd.font.name = "Arial"; r_bd.font.size = Pt(9.5)

    add_callout(
        doc,
        "Principio de Alcance del Cliente (Sin Pasarelas Reales):",
        "Por estricta instrucción del cliente (profesor), para esta entrega no se integran pasarelas de pago reales "
        "(Stripe o MercadoPago) ni envíos de WhatsApp. El flujo concluye en el registro administrativo, el cálculo del "
        "vuelto en efectivo y el archivo documental del comprobante de pago para auditoría.",
        bg_hex="EFF6FF", border_color="2563EB"
    )

    # -------------------------------------------------------------
    # 2. HISTORIAS DE USUARIO Y CRITERIOS GHERKIN
    # -------------------------------------------------------------
    h2 = doc.add_heading(level=1)
    r = h2.add_run("2. Historias de Usuario con Criterios de Aceptación (Gherkin)")
    r.font.name = "Arial"; r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run("A continuación se detallan las Historias de Usuario formales con sus Criterios de Aceptación estructurados bajo la sintaxis Gherkin (Dado / Cuando / Entonces):")

    hu_list = [
        {
            "code": "Historia de Usuario 1: Autenticación y Control de Acceso por Rol",
            "narrative": "Como usuario del sistema (Gerente o Asistente),\nQuiero ingresar con mi usuario y contraseña,\nPara acceder a las funciones correspondientes a mi rol sin exponer información confidencial a terceros.",
            "criteria": [
                ("Criterio 1.1 (Pantalla inicial limpia):", "Dado que un usuario no autenticado ingresa a la aplicación,\nCuando se carga la página principal,\nEntonces solo se muestra el formulario de inicio de sesión y no se expone ningún dato sensible ni financiero."),
                ("Criterio 1.2 (Credenciales incorrectas):", "Dado que el usuario ingresa credenciales no registradas,\nCuando hace clic en 'Iniciar Sesión',\nEntonces el sistema muestra el mensaje directo 'Usuario o contraseña incorrectos.' sin permitir el acceso."),
                ("Criterio 1.3 (Acceso de Gerente):", "Dado que el usuario ingresa las credenciales válidas de Gerente,\nCuando presiona 'Iniciar Sesión',\nEntonces accede a la consola ejecutiva con métricas, listas y herramientas de configuración del negocio."),
                ("Criterio 1.4 (Acceso de Asistente):", "Dado que el usuario ingresa las credenciales de Asistente,\nCuando presiona 'Iniciar Sesión',\nEntonces accede al panel operativo de pagos, sin acceso a las cuentas bancarias personales del gerente.")
            ]
        },
        {
            "code": "Historia de Usuario 2: Dashboard Ejecutivo del Gerente y Navegación Temporal",
            "narrative": "Como Gerente,\nQuiero visualizar en una sola pantalla 4 métricas financieras consolidadas y alternar entre periodos mensuales,\nPara auditar de inmediato qué compromisos tengo en el mes, qué deudas antiguas arrastro y qué pagos ya fueron atendidos.",
            "criteria": [
                ("Criterio 2.1 (4 KPIs Financieros Obligatorios):", "Dado que el Gerente ha iniciado sesión en un periodo mensual,\nCuando visualiza el dashboard principal,\nEntonces observa cuatro tarjetas de indicadores: Total Pendiente del Mes, Total Pagado del Mes, Deudas Vencidas Anteriores (alerta moratoria) y Próximo Vencimiento con descripción e importe."),
                ("Criterio 2.2 (Vista Conjunta en la Misma Pantalla):", "Dado que existen gastos registrados,\nCuando el Gerente revisa su panel,\nEntonces visualiza simultáneamente en la misma pantalla la tabla de 'Pagos Pendientes del Periodo' y la tabla de 'Pagos Realizados del Periodo', sin pestañas intermedias."),
                ("Criterio 2.3 (Navegación de Meses):", "Dado que el Gerente se encuentra en el mes actual (Octubre 2026),\nCuando pulsa '< Mes Anterior', la pantalla se actualiza con los datos de Septiembre 2026; y al presionar 'Próximo Mes >', avanza hacia Noviembre 2026 recalculando los 4 KPIs al instante."),
                ("Criterio 2.4 (Privacidad de Cuentas Personales):", "Dado que el Gerente mantiene cuentas bancarias personales,\nCuando consulta su sesión,\nEntonces visualiza su panel confidencial de cuentas y tarjetas, el cual permanece 100% oculto e inaccesible para la vista del asistente.")
            ]
        },
        {
            "code": "Historia de Usuario 3: Identificación del Recibo y Comprobación de Titularidad",
            "narrative": "Como Asistente o Gerente,\nQuiero que cada compromiso cuente con su código de comprobante oficial y evidencia de titularidad del local (DNI del titular),\nPara tener certeza de que el gasto corresponde a una obligación legítima y propia del negocio.",
            "criteria": [
                ("Criterio 3.1 (Identificación del recibo):", "Dado que se registra una nueva obligación financiera,\nCuando se ingresa el gasto,\nEntonces es obligatorio registrar el código o número de comprobante (ej. N° de suministro eléctrico, código de recibo o NPS SUNAT), mostrándose visible en la tabla."),
                ("Criterio 3.2 (Comprobación de deuda propia / DNI):", "Dado que se registra o consulta un recibo,\nCuando el usuario hace clic en 'Ver Titular / DNI',\nEntonces se despliega una ventana modal con la imagen del documento de identidad o constancia que acredita que la obligación pertenece al titular del negocio.")
            ]
        },
        {
            "code": "Historia de Usuario 4: Gobierno de Proveedores y Tipos de Gasto por Gerencia",
            "narrative": "Como Gerente,\nQuiero crear y administrar el catálogo de proveedores (con datos de Yape) y registrar nuevos tipos de gasto,\nPara que el Asistente únicamente seleccione opciones previamente autorizadas y sepa dónde transferir.",
            "criteria": [
                ("Criterio 4.1 (Alta de Proveedores con Billetera Digital Yape):", "Dado que el Gerente registra un proveedor,\nCuando activa la opción '¿Acepta Yape?', ingresa el número celular y el nombre del titular/alias,\nEntonces el proveedor queda guardado y esos datos de Yape estarán disponibles para el asistente al momento del pago."),
                ("Criterio 4.2 (Creación Dinámica de Tipos de Gasto):", "Dado que el Gerente requiere una nueva categoría (ej. 'Seguros' o 'Mantenimiento'),\nCuando pulsa 'Nuevo Tipo de Gasto', ingresa el nombre y confirma,\nEntonces el nuevo tipo se incorpora de inmediato a los catálogos y filtros del sistema."),
                ("Criterio 4.3 (Consumo Restringido por el Asistente):", "Dado que el Asistente registra un nuevo gasto,\nCuando despliega las opciones de proveedor y tipo de gasto,\nEntonces solo puede elegir entre los elementos registrados previamente por la gerencia.")
            ]
        },
        {
            "code": "Historia de Usuario 5: Liquidación de Pagos con Yape, Efectivo y Evidencia Fotográfica",
            "narrative": "Como Asistente,\nQuiero registrar pagos atendidos con Yape o Efectivo adjuntando la foto del comprobante y calculando el vuelto exacto por ley,\nPara cumplir con la normativa peruana de redondeo, documentar la salida de dinero y actualizar el estado a 'Realizado'.",
            "criteria": [
                ("Criterio 5.1 (Visualización Automática de Datos de Yape):", "Dado que el Asistente selecciona como método 'Yape (Billetera Digital)',\nCuando el proveedor tiene configurado Yape,\nEntonces el modal muestra una tarjeta informativa con el número celular y el nombre del titular para facilitar el depósito."),
                ("Criterio 5.2 (Redondeo Legal de Céntimos en Efectivo - Ley N° 29571 / BCRP):", "Dado que el Asistente selecciona el método 'Efectivo' para un gasto con céntimos no fraccionables (ej. S/ 500.35),\nCuando el sistema procesa la liquidación física,\nEntonces aplica la Ley 29571 redondeando hacia abajo a la decena de céntimos inmediata a favor del cliente (S/ 500.30 con descuento de -S/ 0.05), solicita el efectivo recibido y calcula el vuelto exacto (ej. con S/ 510.00 recibidos, calcula S/ 9.70 de vuelto)."),
                ("Criterio 5.3 (Foto del Comprobante de Pago Obligatorio):", "Dado que el Asistente liquida una obligación,\nCuando adjunta la fotografía o captura del voucher bancario/recibo sellado y confirma el pago,\nEntonces el gasto cambia a estado 'Realizado' y la foto queda archivada para consulta inmediata del Gerente mediante el botón 'Ver Voucher'.")
            ]
        }
    ]

    for hu in hu_list:
        p_hu = doc.add_paragraph()
        p_hu.paragraph_format.space_before = Pt(8)
        p_hu.paragraph_format.space_after = Pt(2)
        r_c = p_hu.add_run(hu["code"] + "\n")
        r_c.bold = True; r_c.font.name = "Arial"; r_c.font.size = Pt(11); r_c.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

        p_n = doc.add_paragraph()
        p_n.paragraph_format.space_after = Pt(4)
        p_n.paragraph_format.left_indent = Inches(0.2)
        r_n = p_n.add_run(hu["narrative"])
        r_n.italic = True; r_n.font.name = "Arial"; r_n.font.size = Pt(9.5); r_n.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

        for crit_title, crit_body in hu["criteria"]:
            p_cr = doc.add_paragraph(style='List Bullet')
            p_cr.paragraph_format.space_after = Pt(3)
            r_ct = p_cr.add_run(crit_title + " ")
            r_ct.bold = True; r_ct.font.name = "Arial"; r_ct.font.size = Pt(9); r_ct.font.color.rgb = RGBColor(0xD9, 0x77, 0x06)
            r_cb = p_cr.add_run(crit_body)
            r_cb.font.name = "Arial"; r_cb.font.size = Pt(9); r_cb.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # 3. MATRIZ DE SUBTAREAS TÉCNICAS (JIRA)
    # -------------------------------------------------------------
    h3 = doc.add_heading(level=1)
    r = h3.add_run("3. Matriz de Subtareas Técnicas (Estructura Jira)")
    r.font.name = "Arial"; r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "A continuación se presenta el desglose técnico de 20 subtareas estimadas (entre 1h y 3h cada una), "
        "clasificadas por tipo de tarea según el estándar ágil de Jira:"
    )

    jira_headers = ["Código", "Historia", "Título de la Subtarea", "Tipo de Tarea", "Horas", "Rol Asignado"]
    jira_widths = [Inches(0.8), Inches(1.0), Inches(2.2), Inches(1.1), Inches(0.5), Inches(0.9)]
    jira_data = [
        ["SUB-01", "Transversal", "Configuración de arquitectura modular y servidor local", "Configuración", "2h", "Full-Stack Dev 1"],
        ["SUB-02", "HU-01", "Implementación de autenticación RBAC y pantalla inicial", "Codificación", "3h", "Full-Stack Dev 1"],
        ["SUB-03", "HU-02", "Maquetado de barra de navegación temporal por meses", "Prototipado", "2h", "Full-Stack Dev 2"],
        ["SUB-04", "HU-02", "Lógica de cálculo de los 4 KPIs consolidados del Gerente", "Codificación", "3h", "Full-Stack Dev 1"],
        ["SUB-05", "HU-02", "Integración visual de listas pendientes y realizadas unificadas", "Prototipado", "2h", "Full-Stack Dev 2"],
        ["SUB-06", "HU-03", "Incorporación de código oficial de recibo en datos y tablas", "Codificación", "2h", "Full-Stack Dev 1"],
        ["SUB-07", "HU-03", "Módulo de comprobación de titularidad (Foto DNI / Titular)", "Codificación", "3h", "Full-Stack Dev 2"],
        ["SUB-08", "HU-04", "Módulo de registro de proveedores con billetera Yape", "Codificación", "3h", "Full-Stack Dev 1"],
        ["SUB-09", "HU-04", "Almacenamiento dinámico de nuevos tipos de gasto por Gerencia", "Codificación", "2h", "Full-Stack Dev 1"],
        ["SUB-10", "HU-04", "Modal de consulta del catálogo de proveedores aprobados", "Prototipado", "2h", "Full-Stack Dev 2"],
        ["SUB-11", "HU-05", "Despliegue contextual de número y titular de Yape al pagar", "Codificación", "2h", "Full-Stack Dev 1"],
        ["SUB-12", "HU-05", "Algoritmo de redondeo legal de céntimos en efectivo (Ley 29571)", "Codificación", "3h", "Full-Stack Dev 1"],
        ["SUB-13", "HU-05", "Control de efectivo recibido y cálculo de vuelto en pantalla", "Codificación", "2h", "Full-Stack Dev 2"],
        ["SUB-14", "HU-05", "Carga y previsualización de foto de voucher/comprobante", "Codificación", "3h", "Full-Stack Dev 2"],
        ["SUB-15", "HU-05", "Modal de visualización de comprobante de pago a tamaño completo", "Prototipado", "2h", "Full-Stack Dev 2"],
        ["SUB-16", "QA", "Pruebas E2E de navegación temporal en 3 periodos", "Test", "2h", "QA Engineer"],
        ["SUB-17", "QA", "Verificación matemática de regla de redondeo (S/ 500.35 -> S/ 500.30)", "Test", "2h", "QA Engineer"],
        ["SUB-18", "QA", "Validación de aislamiento de cuentas confidenciales del Gerente", "Test", "2h", "QA Engineer"],
        ["SUB-19", "Transversal", "Auditoría estricta de restricciones UX/UI (0 emojis, paleta sobria)", "Test", "2h", "Scrum Master/QA"],
        ["SUB-20", "Transversal", "Generación de expediente técnico, guía de uso y Word de evidencias", "Implantación", "2h", "Full-Stack Dev 1"]
    ]

    jira_tbl = doc.add_table(rows=len(jira_data) + 1, cols=len(jira_headers))
    format_table(jira_tbl, jira_widths, jira_headers, jira_data, align_right_cols=[4])

    p_tot = doc.add_paragraph()
    p_tot.paragraph_format.space_before = Pt(4)
    p_tot.paragraph_format.space_after = Pt(12)
    r_tot = p_tot.add_run("Total de horas técnicas especializadas: 46 horas.")
    r_tot.bold = True; r_tot.font.name = "Arial"; r_tot.font.size = Pt(9.5); r_tot.font.color.rgb = RGBColor(0x0F, 0x51, 0x32)

    # -------------------------------------------------------------
    # 4. CÁLCULO DE COSTOS Y JUSTIFICACIÓN PRESUPUESTAL
    # -------------------------------------------------------------
    h4 = doc.add_heading(level=1)
    r = h4.add_run("4. Cálculo de Costos y Justificación Presupuestal")
    r.font.name = "Arial"; r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    p.add_run(
        "El dimensionamiento económico se calculó para un equipo de 5 profesionales bajo un régimen ágil de 4 horas diarias, "
        "5 días a la semana (20 horas/semana por integrante), durante 2 Sprints semanales (2 semanas de calendario = 10 días laborables). "
        "El costo promedio de mercado se estableció en S/ 40.00 por hora por especialista."
    )

    cost_headers = ["Rol en el Equipo", "Horas Subtareas", "Ceremonias y Gestión", "Total Horas", "Tarifa / Hora", "Subtotal (S/)"]
    cost_widths = [Inches(1.5), Inches(1.0), Inches(1.3), Inches(0.8), Inches(0.9), Inches(1.0)]
    cost_data = [
        ["Product Owner", "4h (Requisitos y validación)", "12h (Refinement, Review)", "16h", "S/ 40.00", "S/ 640.00"],
        ["Scrum Master", "4h (Supervisión restricciones)", "14h (Dailies, Retrospectiva)", "18h", "S/ 40.00", "S/ 720.00"],
        ["Full-Stack Dev 1", "20h (Arquitectura, auth, lógica)", "8h (Planificación técnica)", "28h", "S/ 40.00", "S/ 1,120.00"],
        ["Full-Stack Dev 2", "16h (CSS, modales, evidencias)", "8h (Planificación técnica)", "24h", "S/ 40.00", "S/ 960.00"],
        ["QA Engineer", "10h (Pruebas E2E, Gherkin)", "6h (Casos y reportes)", "16h", "S/ 40.00", "S/ 640.00"],
        ["SUBTOTAL BASE", "54h", "48h", "102h", "-", "S/ 4,080.00"]
    ]

    cost_tbl = doc.add_table(rows=len(cost_data) + 1, cols=len(cost_headers))
    format_table(cost_tbl, cost_widths, cost_headers, cost_data, align_right_cols=[3, 4, 5])

    add_callout(
        doc,
        "Justificación Formal del Presupuesto:",
        "El costo del proyecto se basa en un equipo de 5 desarrolladores/especialistas con un costo promedio de S/ 40 por hora, "
        "trabajando 4 horas al día durante 2 semanas (10 días laborables). El total incluye 54 horas de desarrollo y análisis, "
        "28 horas de testing y control de calidad, y 20 horas de ceremonias ágiles y gestión. El costo directo base es de S/ 4,080.00. "
        "Aplicando un 10% de contingencia técnica y operativa (S/ 408.00), el costo total consolidado del MVP es de S/ 4,488.00.",
        bg_hex="FEF3C7", border_color="D97706"
    )

    # -------------------------------------------------------------
    # 5. GUÍA RÁPIDA DE USO DEL SISTEMA
    # -------------------------------------------------------------
    h5 = doc.add_heading(level=1)
    r = h5.add_run("5. Guía Rápida de Uso para el Cliente")
    r.font.name = "Arial"; r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    # Para el Gerente
    p_g = doc.add_paragraph()
    r = p_g.add_run("5.1 Instrucciones para el Gerente")
    r.bold = True; r.font.name = "Arial"; r.font.size = Pt(10.5); r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    g_steps = [
        "Ingreso: Inicie sesión con usuario 'gerente' y clave 'gerente123' (o clic en el botón de acceso rápido).",
        "Navegación de Meses: Use los controles '< Mes Anterior' y 'Próximo Mes >' para alternar entre Septiembre, Octubre y Noviembre 2026.",
        "Monitoreo de 4 KPIs: Revise Total Pendiente del mes, Total Pagado del mes, Deudas Vencidas Anteriores (alerta de moras) y Próximo Vencimiento.",
        "Auditoría Unificada: Revise en la misma pantalla las tablas de pendientes (botón 'Ver Titular / DNI') y realizados (botón 'Ver Voucher').",
        "Gobierno del Negocio: Dé de alta proveedores activando la casilla de Yape (celular y titular) y registre nuevos tipos de gasto.",
        "Cierre de Sesión: Pulse 'Cerrar Sesión' para proteger la privacidad de sus instrumentos bancarios personales."
    ]
    for s_txt in g_steps:
        sp = doc.add_paragraph(style='List Bullet')
        sp.paragraph_format.space_after = Pt(2)
        r = sp.add_run(s_txt)
        r.font.name = "Arial"; r.font.size = Pt(9)

    # Para el Asistente
    p_a = doc.add_paragraph()
    p_a.paragraph_format.space_before = Pt(6)
    r = p_a.add_run("5.2 Instrucciones para el Asistente")
    r.bold = True; r.font.name = "Arial"; r.font.size = Pt(10.5); r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    a_steps = [
        "Ingreso: Inicie sesión con usuario 'asistente' y clave 'asistente123'.",
        "Registrar Nuevo Gasto: Pulse 'Nuevo Gasto', digite el código oficial de recibo, seleccione proveedor y tipo (aprobados por Gerencia), ingrese monto y adjunte foto de titularidad.",
        "Registrar Pago con Yape: En el modal elija 'Yape'; el sistema le mostrará el número y titular autorizados para transferir.",
        "Registrar Pago en Efectivo (Ley 29571): Si el recibo tiene céntimos (ej. S/ 500.35), el sistema aplica el redondeo a S/ 500.30. Al escribir el efectivo recibido (ej. S/ 510.00), verá el vuelto exacto a entregar (S/ 9.70).",
        "Adjuntar Comprobante: Cargue la foto del voucher o constancia bancaria y confirme. El pago pasará a 'Realizado'."
    ]
    for s_txt in a_steps:
        sp = doc.add_paragraph(style='List Bullet')
        sp.paragraph_format.space_after = Pt(2)
        r = sp.add_run(s_txt)
        r.font.name = "Arial"; r.font.size = Pt(9)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # 6. EVIDENCIAS GRÁFICAS PASO A PASO (16 CAPTURAS REALES)
    # -------------------------------------------------------------
    h6 = doc.add_heading(level=1)
    r = h6.add_run("6. Validación Paso a Paso con Evidencias Gráficas (16 Capturas)")
    r.font.name = "Arial"; r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.add_run(
        "A continuación se presenta la validación fotográfica paso a paso del sistema ejecutándose en tiempo real, "
        "demostrando el cumplimiento de cada Historia de Usuario, Criterio Gherkin y observación del cliente:"
    )

    steps = [
        {
            "num": "Paso 1",
            "title": "Pantalla Inicial de Login Limpia (HU-01, Criterio 1.1)",
            "hu": "HU-01: Autenticación y Control de Acceso por Rol",
            "desc": "Al cargar la aplicación, la pantalla se presenta limpia y desprovista de cualquier información financiera o nombres de proveedores antes de autenticarse. Dispone de botones discretos de acceso rápido para demostración.",
            "img": "01_login_inicial.png",
            "val": "Cumple Criterio 1.1: Pantalla inicial limpia sin datos visibles."
        },
        {
            "num": "Paso 2",
            "title": "Validación de Seguridad y Error de Credenciales (HU-01, Criterio 1.2)",
            "hu": "HU-01: Autenticación y Control de Acceso por Rol",
            "desc": "Al introducir credenciales erróneas, el sistema bloquea el acceso de inmediato y despliega el mensaje directo: 'Usuario o contraseña incorrectos.', sin emojis ni decoraciones superfluas.",
            "img": "02_login_error_credenciales.png",
            "val": "Cumple Criterio 1.2: Control de seguridad y manejo de errores formal."
        },
        {
            "num": "Paso 3",
            "title": "Dashboard del Gerente con 4 KPIs y Pantalla Unificada (HU-01, HU-02, Criterios 1.3, 2.1, 2.2)",
            "hu": "HU-02: Dashboard Ejecutivo del Gerente y Navegación Temporal",
            "desc": "El Gerente ingresa y visualiza en la parte superior los 4 KPIs solicitados por el cliente:\n"
                    "1) Total Pendiente del Mes: S/ 6,370.35 (4 pagos pendientes).\n"
                    "2) Total Pagado del Mes: S/ 3,550.00 (2 pagos realizados).\n"
                    "3) Deudas Vencidas Anteriores: S/ 195.00 (1 deuda vencida que se arrastra de meses pasados).\n"
                    "4) Próximo Vencimiento: 18/10/2026 (Recibo de Energía Eléctrica).\n"
                    "Debajo, en la misma pantalla, se despliegan juntas las tablas de pendientes y realizados.",
            "img": "03_gerente_dashboard_octubre.png",
            "val": "Cumple Criterios 2.1 y 2.2: 4 KPIs consolidados y visualización conjunta de listas en la misma pantalla."
        },
        {
            "num": "Paso 4",
            "title": "Navegación Temporal: Auditoría del Mes Anterior - Septiembre 2026 (HU-02, Criterio 2.3)",
            "hu": "HU-02: Dashboard Ejecutivo del Gerente y Navegación Temporal",
            "desc": "Al pulsar '< Mes Anterior', el sistema viaja a Septiembre 2026. Se visualiza el recibo de Sedapal N° REC-SEDAPAL-0922 vencido el 22/09/2026 por S/ 195.00 que quedó pendiente, evidenciando el origen exacto del indicador de deudas vencidas.",
            "img": "04_gerente_mes_anterior_septiembre.png",
            "val": "Cumple Criterio 2.3: Navegación histórica hacia el mes anterior con recálculo dinámico."
        },
        {
            "num": "Paso 5",
            "title": "Navegación Temporal: Proyección del Próximo Mes - Noviembre 2026 (HU-02, Criterio 2.3)",
            "hu": "HU-02: Dashboard Ejecutivo del Gerente y Navegación Temporal",
            "desc": "Al pulsar 'Próximo Mes >', el sistema proyecta Noviembre 2026 con un Total Pendiente de S/ 5,320.00 correspondiente al Impuesto SUNAT Estimado (S/ 1,920.00) y la Cuota 09/24 del Préstamo BCP (S/ 3,400.00).",
            "img": "05_gerente_proximo_mes_noviembre.png",
            "val": "Cumple Criterio 2.3: Navegación proyectiva hacia el próximo mes para planeamiento de liquidez."
        },
        {
            "num": "Paso 6",
            "title": "Comprobación de Titularidad y Deuda Propia con Foto de DNI (HU-03, Criterio 3.2)",
            "hu": "HU-03: Identificación del Recibo y Comprobación de Titularidad",
            "desc": "Cada fila cuenta con el botón 'Ver Titular / DNI'. Al pulsarlo, se abre una ventana modal con el documento de identidad o constancia fiscal registrada, protegiendo al negocio contra pagos de deudas de terceros.",
            "img": "06_modal_ver_titular_dni.png",
            "val": "Cumple Criterio 3.2: Evidencia visual de titularidad para validar deudas propias."
        },
        {
            "num": "Paso 7",
            "title": "Privacidad de Medios de Pago Exclusivos de Gerencia (HU-02, Criterio 2.4)",
            "hu": "HU-02: Dashboard Ejecutivo del Gerente y Navegación Temporal",
            "desc": "Sección confidencial de cuentas bancarias y tarjetas empresariales del Gerente. Permanece 100% aislada e inaccesible para la vista del Asistente.",
            "img": "07_cuentas_confidenciales_gerente.png",
            "val": "Cumple Criterio 2.4: Privacidad y aislamiento de credenciales bancarias personales del gerente."
        },
        {
            "num": "Paso 8",
            "title": "Gobierno por Gerencia: Registro de Proveedor con Billetera Digital Yape (HU-04, Criterio 4.1)",
            "hu": "HU-04: Gobierno de Proveedores y Tipos de Gasto por Gerencia",
            "desc": "Formulario exclusivo de Gerencia para dar de alta acreedores. Permite activar la casilla Yape, ingresando el número celular y el nombre del titular/alias para que el asistente cuente con la información oficial.",
            "img": "08_modal_nuevo_proveedor_yape.png",
            "val": "Cumple Criterio 4.1: Registro centralizado de acreedores y configuración de billeteras digitales."
        },
        {
            "num": "Paso 9",
            "title": "Gobierno por Gerencia: Creación de Nuevos Tipos de Gasto (HU-04, Criterio 4.2)",
            "hu": "HU-04: Gobierno de Proveedores y Tipos de Gasto por Gerencia",
            "desc": "El Gerente puede dar de alta nuevas categorías de gasto según el rubro de la empresa. En el modal se muestra la lista actual y permite agregar nuevos tipos como 'Seguros Empresariales'.",
            "img": "09_modal_nuevo_tipo_gasto.png",
            "val": "Cumple Criterio 4.2: Categorización dinámica y estandarizada de gastos definida por gerencia."
        },
        {
            "num": "Paso 10",
            "title": "Catálogo Consolidado de Proveedores Registrados (HU-04, Criterio 4.3)",
            "hu": "HU-04: Gobierno de Proveedores y Tipos de Gasto por Gerencia",
            "desc": "Directorio autorizado donde se detalla el RUC, razón social, rubro, contacto telefónico y si cuenta con Yape habilitado con su respectivo titular.",
            "img": "10_catalogo_proveedores.png",
            "val": "Cumple Criterio 4.3: Directorio autorizado y transparente para el equipo administrativo."
        },
        {
            "num": "Paso 11",
            "title": "Consola Operativa del Asistente con Filtros Dinámicos (HU-01, Criterio 1.4)",
            "hu": "HU-01: Autenticación y Control de Acceso por Rol",
            "desc": "El Asistente inicia sesión y accede a su consola de pagos del mes. Cuenta con filtros por Proveedor, Tipo de Gasto, Estado (Pendiente / Realizado / Todos) y Orden cronológico o por monto.",
            "img": "11_asistente_consola_octubre.png",
            "val": "Cumple Criterio 1.4: Espacio de trabajo enfocado y sin distracciones para el asistente."
        },
        {
            "num": "Paso 12",
            "title": "Registro de Nuevo Gasto con Identificador Oficial de Recibo (HU-03, HU-04, Criterios 3.1, 4.3)",
            "hu": "HU-03 / HU-04: Gestión Operativa de Obligaciones",
            "desc": "Al hacer clic en 'Nuevo Gasto', el Asistente registra una obligación ingresando su número de comprobante oficial. Los selectores de Proveedor y Tipo consumen exclusivamente los datos aprobados por el Gerente.",
            "img": "12_modal_asistente_nuevo_gasto.png",
            "val": "Cumple Criterios 3.1 y 4.3: Código de recibo obligatorio y selección controlada de catálogos."
        },
        {
            "num": "Paso 13",
            "title": "Liquidación con Yape: Visualización Automática de Datos de Pago (HU-05, Criterio 5.1)",
            "hu": "HU-05: Liquidación de Pagos con Yape, Efectivo y Evidencia Fotográfica",
            "desc": "Al presionar 'Registrar Pago' sobre la Factura F004-9842 y seleccionar 'Yape (Billetera Digital)', el sistema despliega automáticamente una tarjeta informativa en color lila con los datos registrados por el Gerente: 'Número Celular: 987654321' y 'Titular / Alias: Juan Pérez Ramos / Logística Norte'.",
            "img": "13_modal_pago_yape_datos.png",
            "val": "Cumple Criterio 5.1: Seguridad y automatización de datos de billeteras digitales."
        },
        {
            "num": "Paso 14",
            "title": "Liquidación en Efectivo: Ley de Redondeo de Céntimos en Perú (Ley N° 29571 / BCRP) (HU-05, Criterio 5.2)",
            "hu": "HU-05: Liquidación de Pagos con Yape, Efectivo y Evidencia Fotográfica",
            "desc": "Demostración exacta para recibos con céntimos (Factura por S/ 500.35 pagada en efectivo):\n"
                    "- Importe Original del Recibo: S/ 500.35.\n"
                    "- Redondeo Legal (Ley 29571 / BCRP): -S/ 0.05 (redondeo obligatorio hacia abajo a favor del consumidor/pagador).\n"
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
            "desc": "Cada pago realizado cuenta con su botón 'Ver Voucher'. Al pulsarlo, se previsualiza a tamaño completo la captura de la constancia bancaria, voucher sellado o comprobante digital archivado, garantizando una auditoría contable transparente.",
            "img": "16_modal_comprobante_voucher.png",
            "val": "Cumple Criterio 5.3: Auditoría documental completa con archivo fotográfico de vouchers."
        }
    ]

    for step in steps:
        p_step_hdr = doc.add_paragraph()
        p_step_hdr.paragraph_format.space_before = Pt(12)
        p_step_hdr.paragraph_format.space_after = Pt(2)
        r_num = p_step_hdr.add_run(f"[{step['num']}] ")
        r_num.bold = True; r_num.font.name = "Arial"; r_num.font.size = Pt(11.5); r_num.font.color.rgb = RGBColor(0xD9, 0x77, 0x06)
        r_stitle = p_step_hdr.add_run(step['title'])
        r_stitle.bold = True; r_stitle.font.name = "Arial"; r_stitle.font.size = Pt(11.5); r_stitle.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

        p_hu = doc.add_paragraph()
        p_hu.paragraph_format.space_after = Pt(3)
        r_hu_lbl = p_hu.add_run("Historia Relacionada: ")
        r_hu_lbl.bold = True; r_hu_lbl.font.size = Pt(9); r_hu_lbl.font.name = "Arial"; r_hu_lbl.font.color.rgb = RGBColor(0x47, 0x55, 0x69)
        r_hu_val = p_hu.add_run(step['hu'])
        r_hu_val.font.size = Pt(9); r_hu_val.font.name = "Arial"; r_hu_val.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

        p_desc = doc.add_paragraph()
        p_desc.paragraph_format.space_after = Pt(6)
        p_desc.paragraph_format.line_spacing = 1.15
        r_desc = p_desc.add_run(step['desc'])
        r_desc.font.name = "Arial"; r_desc.font.size = Pt(9); r_desc.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

        img_path = os.path.join(EVIDENCIAS_DIR, step['img'])
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(4)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.add_run().add_picture(img_path, width=Inches(5.7))

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(6)
            r_cap = p_cap.add_run(f"Figura: Captura de pantalla del sistema ({step['img']})")
            r_cap.font.name = "Arial"; r_cap.font.size = Pt(8); r_cap.font.italic = True; r_cap.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

        p_val = doc.add_paragraph()
        p_val.paragraph_format.space_after = Pt(10)
        r_vlbl = p_val.add_run("Resultado de Validación: ")
        r_vlbl.bold = True; r_vlbl.font.size = Pt(8.5); r_vlbl.font.name = "Arial"; r_vlbl.font.color.rgb = RGBColor(0x0F, 0x51, 0x32)
        r_vval = p_val.add_run(step['val'])
        r_vval.font.size = Pt(8.5); r_vval.font.name = "Arial"; r_vval.font.color.rgb = RGBColor(0x0F, 0x51, 0x32)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # 7. MATRIZ DE RESTRICCIONES DE DISEÑO CUMPLIDAS
    # -------------------------------------------------------------
    h7 = doc.add_heading(level=1)
    r = h7.add_run("7. Verificación de Restricciones de Diseño Cumplidas")
    r.font.name = "Arial"; r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x5F)

    rest_headers = ["Restricción de Diseño Evaluada", "Estado", "Verificación Técnica Realizada"]
    rest_widths = [Inches(2.2), Inches(0.9), Inches(3.4)]
    rest_data = [
        ["Cero Emojis en la UI", "Cumplido", "Verificación exhaustiva en HTML, CSS, JavaScript y textos informativos: 0 emojis."],
        ["Sin viñetas con líneas verticales", "Cumplido", "No se emplearon listas con barras verticales estilo IA; diseño basado en tablas limpias."],
        ["Identidad corporativa sobria", "Cumplido", "Nombre limpio (CuentaClara), sin referencias académicas, cursos ni universidades en UI."],
        ["Textos directos y funcionales", "Cumplido", "Sin saludos artificiales de IA ('Bienvenido...'). Textos directos ('Usuario o contraseña incorrectos.')."],
        ["Paleta de 3 colores corporativos", "Cumplido", "Azul oscuro corporativo (#1E3A5F), fondo gris (#F8F9FA) y acento ámbar/naranja (#D97706)."],
        ["Retícula de espaciado en 8px", "Cumplido", "Sistema ordenado en variables CSS en múltiplos de 8px (8, 16, 24, 32)."],
        ["Bordes y sombras sutiles", "Cumplido", "Radio de bordes de 4px a 6px; sombras suaves '0 1px 3px rgba(0,0,0,0.1)'."],
        ["Navegación minimalista", "Cumplido", "Pantalla única para el Gerente con vista conjunta de listas y selector de meses central."],
        ["Privacidad de medios de pago", "Cumplido", "Cuentas bancarias personales visibles únicamente en la sesión de gerencia."],
        ["Cumplimiento legal Ley 29571", "Cumplido", "Algoritmo de redondeo hacia abajo a favor del cliente con cálculo de vuelto en efectivo."]
    ]

    rest_tbl = doc.add_table(rows=len(rest_data) + 1, cols=len(rest_headers))
    format_table(rest_tbl, rest_widths, rest_headers, rest_data)

    p_end = doc.add_paragraph()
    p_end.paragraph_format.space_before = Pt(20)
    p_end.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_end = p_end.add_run("--- FIN DEL EXPEDIENTE DE ENTREGA DEL MVP (CUENTACLARA) ---")
    r_end.font.name = "Arial"; r_end.font.size = Pt(9); r_end.font.bold = True; r_end.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

    OUTPUT_DOCX_ALT = os.path.join(DOCS_DIR, 'entregable_completo_mvp.docx')
    doc.save(OUTPUT_DOCX_ALT)
    print(f"Documento Word completo generado exitosamente en: {OUTPUT_DOCX_ALT}")

    try:
        doc.save(OUTPUT_DOCX)
        print(f"Documento Word actualizado exitosamente en: {OUTPUT_DOCX}")
    except PermissionError:
        print(f"Nota: {OUTPUT_DOCX} está abierto en Microsoft Word. Se guardó copia actualizada en {OUTPUT_DOCX_ALT}.")

if __name__ == '__main__':
    build_document()
