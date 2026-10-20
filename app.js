/**
 * CuentaClara - Logica de Aplicacion (MVP Actualizado)
 * Modulos de navegacion temporal, 4 KPIs, Yape, Redondeo en Efectivo (Ley 29571),
 * identificacion de comprobantes y verificacion de titularidad.
 */

(function () {
  'use strict';

  // ==========================================================================
  // Evidencias Fotográficas Muestra (SVGs en Data URI para visualización inmediata)
  // ==========================================================================

  const SAMPLE_DNI_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">' +
    '<rect width="600" height="380" rx="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>' +
    '<rect x="24" y="24" width="552" height="60" rx="6" fill="#1E3A5F"/>' +
    '<text x="44" y="52" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold">REPÚBLICA DEL PERÚ - DOCUMENTO NACIONAL DE IDENTIDAD</text>' +
    '<text x="44" y="72" fill="#93C5FD" font-family="sans-serif" font-size="12">TITULARIDAD DE OBLIGACIONES Y REGISTRO FISCAL</text>' +
    '<rect x="44" y="105" width="120" height="150" rx="6" fill="#CBD5E1" stroke="#94A3B8"/>' +
    '<circle cx="104" cy="155" r="35" fill="#94A3B8"/>' +
    '<path d="M64 240 C 64 200, 144 200, 144 240 Z" fill="#94A3B8"/>' +
    '<text x="190" y="130" fill="#64748B" font-family="sans-serif" font-size="12">PRIMER APELLIDO:</text>' +
    '<text x="190" y="152" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="bold">MENDOZA</text>' +
    '<text x="190" y="185" fill="#64748B" font-family="sans-serif" font-size="12">PRENOMBRES:</text>' +
    '<text x="190" y="207" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="bold">CARLOS ENRIQUE</text>' +
    '<text x="190" y="240" fill="#64748B" font-family="sans-serif" font-size="12">N° DNI / RUC EMPRESARIAL:</text>' +
    '<text x="190" y="262" fill="#1E3A5F" font-family="monospace" font-size="20" font-weight="bold">43920184 / 10439201841</text>' +
    '<rect x="24" y="295" width="552" height="60" rx="6" fill="#F1F5F9" stroke="#CBD5E1"/>' +
    '<text x="44" y="322" fill="#475569" font-family="sans-serif" font-size="12">VALIDACIÓN: Documento verificado que acredita titularidad de suministros y obligaciones del local.</text>' +
    '<text x="44" y="342" fill="#059669" font-family="sans-serif" font-size="12" font-weight="bold">ESTADO: TITULAR REGISTRADO - CUENTACLARA</text>' +
    '</svg>'
  );

  const SAMPLE_VOUCHER_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="520" viewBox="0 0 500 520">' +
    '<rect width="500" height="520" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>' +
    '<rect x="20" y="20" width="460" height="70" rx="6" fill="#0F5132"/>' +
    '<text x="40" y="50" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="bold">CONSTANCIA DE PAGO REALIZADO</text>' +
    '<text x="40" y="72" fill="#D1E7DD" font-family="sans-serif" font-size="12">OPERACIÓN BANCARIA CONCLUIDA CON ÉXITO</text>' +
    '<line x1="20" y1="110" x2="480" y2="110" stroke="#E2E8F0" stroke-width="2"/>' +
    '<text x="40" y="140" fill="#64748B" font-family="sans-serif" font-size="12">CANAL DE PAGO:</text>' +
    '<text x="40" y="162" fill="#0F172A" font-family="sans-serif" font-size="15" font-weight="bold">Banca Móvil / Billetera Digital</text>' +
    '<text x="40" y="200" fill="#64748B" font-family="sans-serif" font-size="12">NÚMERO DE OPERACIÓN (OP):</text>' +
    '<text x="40" y="222" fill="#1E3A5F" font-family="monospace" font-size="16" font-weight="bold">OP-948201948</text>' +
    '<text x="40" y="260" fill="#64748B" font-family="sans-serif" font-size="12">FECHA Y HORA:</text>' +
    '<text x="40" y="282" fill="#0F172A" font-family="sans-serif" font-size="14">Periodo Operativo Vigente - 10:14 hrs</text>' +
    '<text x="40" y="320" fill="#64748B" font-family="sans-serif" font-size="12">BENEFICIARIO:</text>' +
    '<text x="40" y="342" fill="#0F172A" font-family="sans-serif" font-size="15" font-weight="bold">Entidad / Proveedor Autorizado</text>' +
    '<rect x="30" y="375" width="440" height="60" rx="6" fill="#F8F9FA" stroke="#DEE2E6"/>' +
    '<text x="50" y="400" fill="#64748B" font-family="sans-serif" font-size="12">IMPORTE ABONADO:</text>' +
    '<text x="50" y="424" fill="#0F5132" font-family="sans-serif" font-size="20" font-weight="bold">CONFORME A RECIBO LIQUIDADO</text>' +
    '<text x="40" y="475" fill="#475569" font-family="sans-serif" font-size="11">Este documento certifica el descargo administrativo y el pago en fecha.</text>' +
    '<text x="40" y="495" fill="#0F5132" font-family="sans-serif" font-size="12" font-weight="bold">COMPROBANTE ARCHIVADO EN CUENTACLARA</text>' +
    '</svg>'
  );

  // ==========================================================================
  // Datos Semilla Iniciales
  // ==========================================================================

  const DEFAULT_EXPENSE_TYPES = [
    'Servicio',
    'Impuesto',
    'Proveedor',
    'Préstamo',
    'Alquiler',
    'Mantenimiento',
    'Seguros',
    'Telecomunicaciones'
  ];

  const DEFAULT_SUPPLIERS = [
    {
      id: 'sup-1',
      ruc: '20100128218',
      name: 'Enel Distribución Perú S.A.A.',
      category: 'Servicio',
      contact: 'Atención Corporativa',
      phone: '01-517-1717',
      email: 'corporativo@enel.pe',
      hasYape: false,
      yapePhone: '',
      yapeHolder: ''
    },
    {
      id: 'sup-2',
      ruc: '20100152356',
      name: 'Sedapal S.A.',
      category: 'Servicio',
      contact: 'Mesa de Empresas',
      phone: '01-317-8000',
      email: 'empresas@sedapal.com.pe',
      hasYape: false,
      yapePhone: '',
      yapeHolder: ''
    },
    {
      id: 'sup-3',
      ruc: '20131312955',
      name: 'SUNAT',
      category: 'Impuesto',
      contact: 'Orientación Tributaria',
      phone: '01-315-0730',
      email: 'consultas@sunat.gob.pe',
      hasYape: false,
      yapePhone: '',
      yapeHolder: ''
    },
    {
      id: 'sup-4',
      ruc: '20456789123',
      name: 'Distribuidora Logística Norte S.A.C.',
      category: 'Proveedor',
      contact: 'Juan Pérez Ramos',
      phone: '987-654-321',
      email: 'ventas@logisticanorte.pe',
      hasYape: true,
      yapePhone: '987654321',
      yapeHolder: 'Juan Pérez Ramos / Logística Norte'
    },
    {
      id: 'sup-5',
      ruc: '20334455667',
      name: 'Inmobiliaria Central Lima S.A.',
      category: 'Alquiler',
      contact: 'Rosa Vargas Castro',
      phone: '998-112-233',
      email: 'administracion@inmolicentral.pe',
      hasYape: false,
      yapePhone: '',
      yapeHolder: ''
    },
    {
      id: 'sup-6',
      ruc: '20100047218',
      name: 'Banco de Crédito del Perú (BCP)',
      category: 'Préstamo',
      contact: 'Ejecutivo de Negocios Pyme',
      phone: '01-311-9898',
      email: 'pyme@bcp.com.pe',
      hasYape: false,
      yapePhone: '',
      yapeHolder: ''
    },
    {
      id: 'sup-7',
      ruc: '20556677889',
      name: 'Servicios Integrales & Mantenimiento S.A.C.',
      category: 'Mantenimiento',
      contact: 'Carlos Vega Miranda',
      phone: '912-345-678',
      email: 'operaciones@mantenimientovega.pe',
      hasYape: true,
      yapePhone: '912345678',
      yapeHolder: 'Carlos Vega - Mantenimiento'
    },
    {
      id: 'sup-8',
      ruc: '20100017491',
      name: 'Telefónica del Perú S.A.A. (Movistar)',
      category: 'Telecomunicaciones',
      contact: 'Atención Clientes Corporativos',
      phone: '01-210-1000',
      email: 'empresas@movistar.com.pe',
      hasYape: false,
      yapePhone: '',
      yapeHolder: ''
    },
    {
      id: 'sup-9',
      ruc: '20100041953',
      name: 'Rimac Seguros y Reaseguros',
      category: 'Seguros',
      contact: 'Pólizas Comerciales y Riesgos',
      phone: '01-411-1000',
      email: 'atencion@rimac.com.pe',
      hasYape: false,
      yapePhone: '',
      yapeHolder: ''
    },
    {
      id: 'sup-10',
      ruc: '20601234567',
      name: 'Comercializadora Papelera Sur E.I.R.L.',
      category: 'Proveedor',
      contact: 'Jorge Luis Quispe',
      phone: '976-543-210',
      email: 'ventas@papelerasur.pe',
      hasYape: true,
      yapePhone: '976543210',
      yapeHolder: 'Jorge Quispe / Papelera Sur'
    },
    {
      id: 'sup-11',
      ruc: '20498765432',
      name: 'Seguridad & Vigilancia Protec S.A.C.',
      category: 'Servicio',
      contact: 'Central de Operaciones Lima',
      phone: '01-619-3300',
      email: 'contratos@seguridadprotec.pe',
      hasYape: false,
      yapePhone: '',
      yapeHolder: ''
    }
  ];

  // Gastos distribuidos en 3 meses: Septiembre 2026, Octubre 2026 y Noviembre 2026
  const DEFAULT_EXPENSES = [
    // --- Septiembre 2026 (Mes Pasado) ---
    // NOTA CLAVE: Este gasto quedó pendiente de Septiembre. Representa una "Deuda Vencida Anterior"!
    {
      id: 'exp-sep-1',
      receiptId: 'REC-SEDAPAL-0922',
      description: 'Servicio de Agua Potable - Almacén Secundario (Septiembre)',
      supplierId: 'sup-2',
      amount: 195.00,
      dueDate: '2026-09-22',
      type: 'Servicio',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-sep-2',
      receiptId: 'REC-ENEL-0918',
      description: 'Recibo de Energía Eléctrica Sede Principal (Septiembre)',
      supplierId: 'sup-1',
      amount: 580.00,
      dueDate: '2026-09-18',
      type: 'Servicio',
      status: 'realizado',
      paymentDate: '2026-09-17',
      paymentMethod: 'Transferencia Bancaria',
      ref: 'TR-778819',
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: SAMPLE_VOUCHER_SVG
    },
    {
      id: 'exp-sep-3',
      receiptId: 'FAC-F002-3104',
      description: 'Suministros y Papelería de Oficina - Stock Inicial',
      supplierId: 'sup-10',
      amount: 320.00,
      dueDate: '2026-09-12',
      type: 'Proveedor',
      status: 'realizado',
      paymentDate: '2026-09-12',
      paymentMethod: 'Yape (Billetera Digital)',
      ref: 'YAPE-881230',
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: SAMPLE_VOUCHER_SVG
    },
    {
      id: 'exp-sep-4',
      receiptId: 'REC-ARRIENDO-0905',
      description: 'Alquiler Mensual de Inmueble Comercial (Septiembre)',
      supplierId: 'sup-5',
      amount: 2800.00,
      dueDate: '2026-09-05',
      type: 'Alquiler',
      status: 'realizado',
      paymentDate: '2026-09-05',
      paymentMethod: 'Transferencia Bancaria',
      ref: 'TR-651029',
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: SAMPLE_VOUCHER_SVG
    },
    {
      id: 'exp-sep-5',
      receiptId: 'NPS-SUNAT-0920',
      description: 'Impuesto SUNAT - IGV y Renta (Septiembre 2026)',
      supplierId: 'sup-3',
      amount: 1780.00,
      dueDate: '2026-09-20',
      type: 'Impuesto',
      status: 'realizado',
      paymentDate: '2026-09-19',
      paymentMethod: 'Transferencia Bancaria',
      ref: 'TR-691024',
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: SAMPLE_VOUCHER_SVG
    },
    {
      id: 'exp-sep-6',
      receiptId: 'CUOTA-BCP-0724',
      description: 'Cuota Préstamo de Capital de Trabajo #07',
      supplierId: 'sup-6',
      amount: 3400.00,
      dueDate: '2026-09-25',
      type: 'Préstamo',
      status: 'realizado',
      paymentDate: '2026-09-24',
      paymentMethod: 'Transferencia Bancaria',
      ref: 'TR-662910',
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: SAMPLE_VOUCHER_SVG
    },

    // --- Octubre 2026 (Mes Actual) ---
    {
      id: 'exp-oct-1',
      receiptId: 'REC-ENEL-1018',
      description: 'Recibo de Energía Eléctrica - Local Principal',
      supplierId: 'sup-1',
      amount: 620.00,
      dueDate: '2026-10-18',
      type: 'Servicio',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    // Gasto con céntimos (S/ 500.35) para demostrar la Ley de Redondeo en Efectivo de Perú y Yape
    {
      id: 'exp-oct-2',
      receiptId: 'FAC-F004-9842',
      description: 'Factura F004-9842 Mercadería y Repuestos para Stock',
      supplierId: 'sup-4',
      amount: 500.35,
      dueDate: '2026-10-24',
      type: 'Proveedor',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-oct-3',
      receiptId: 'NPS-SUNAT-1020',
      description: 'Impuesto SUNAT - IGV y Renta (Octubre 2026)',
      supplierId: 'sup-3',
      amount: 1850.00,
      dueDate: '2026-10-20',
      type: 'Impuesto',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-oct-4',
      receiptId: 'CUOTA-BCP-0824',
      description: 'Cuota Préstamo de Capital de Trabajo #08',
      supplierId: 'sup-6',
      amount: 3400.00,
      dueDate: '2026-10-25',
      type: 'Préstamo',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-oct-5',
      receiptId: 'REC-SEDAPAL-1022',
      description: 'Servicio de Agua Potable - Planta y Oficinas',
      supplierId: 'sup-2',
      amount: 215.40,
      dueDate: '2026-10-28',
      type: 'Servicio',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-oct-6',
      receiptId: 'REC-MOVISTAR-1015',
      description: 'Enlace de Fibra Óptica Empresarial e Internet Dedicado',
      supplierId: 'sup-8',
      amount: 289.90,
      dueDate: '2026-10-22',
      type: 'Telecomunicaciones',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-oct-7',
      receiptId: 'POLIZA-RIMAC-1030',
      description: 'Póliza Multiriesgo Local Comercial e Inventarios',
      supplierId: 'sup-9',
      amount: 450.00,
      dueDate: '2026-10-30',
      type: 'Seguros',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-oct-8',
      receiptId: 'REC-ARRIENDO-1005',
      description: 'Alquiler Mensual de Inmueble Comercial',
      supplierId: 'sup-5',
      amount: 2800.00,
      dueDate: '2026-10-05',
      type: 'Alquiler',
      status: 'realizado',
      paymentDate: '2026-10-04',
      paymentMethod: 'Transferencia Bancaria',
      ref: 'TR-849201',
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: SAMPLE_VOUCHER_SVG
    },
    {
      id: 'exp-oct-9',
      receiptId: 'SERV-MANT-1009',
      description: 'Mantenimiento Preventivo de Equipos y Servidores',
      supplierId: 'sup-7',
      amount: 750.00,
      dueDate: '2026-10-09',
      type: 'Mantenimiento',
      status: 'realizado',
      paymentDate: '2026-10-09',
      paymentMethod: 'Yape (Billetera Digital)',
      ref: 'YAPE-991823',
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: SAMPLE_VOUCHER_SVG
    },
    {
      id: 'exp-oct-10',
      receiptId: 'FACT-PROTEC-1015',
      description: 'Servicio de Seguridad y Vigilancia Quincenal',
      supplierId: 'sup-11',
      amount: 920.00,
      dueDate: '2026-10-15',
      type: 'Servicio',
      status: 'realizado',
      paymentDate: '2026-10-15',
      paymentMethod: 'Transferencia Bancaria',
      ref: 'TR-891044',
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: SAMPLE_VOUCHER_SVG
    },
    {
      id: 'exp-oct-11',
      receiptId: 'FAC-F002-3891',
      description: 'Compra de Papelería Continua y Facturación',
      supplierId: 'sup-10',
      amount: 180.00,
      dueDate: '2026-10-11',
      type: 'Proveedor',
      status: 'realizado',
      paymentDate: '2026-10-11',
      paymentMethod: 'Yape (Billetera Digital)',
      ref: 'YAPE-910244',
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: SAMPLE_VOUCHER_SVG
    },

    // --- Noviembre 2026 (Próximo Mes) ---
    {
      id: 'exp-nov-1',
      receiptId: 'REC-ARRIENDO-1105',
      description: 'Alquiler Mensual de Inmueble Comercial (Noviembre)',
      supplierId: 'sup-5',
      amount: 2800.00,
      dueDate: '2026-11-05',
      type: 'Alquiler',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-nov-2',
      receiptId: 'REC-ENEL-1118',
      description: 'Recibo de Energía Eléctrica Estimado Noviembre',
      supplierId: 'sup-1',
      amount: 640.00,
      dueDate: '2026-11-18',
      type: 'Servicio',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-nov-3',
      receiptId: 'NPS-SUNAT-1120',
      description: 'Impuesto SUNAT Estimado - Periodo Noviembre 2026',
      supplierId: 'sup-3',
      amount: 1920.00,
      dueDate: '2026-11-20',
      type: 'Impuesto',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-nov-4',
      receiptId: 'REC-SEDAPAL-1122',
      description: 'Servicio de Agua Potable Estimado Noviembre',
      supplierId: 'sup-2',
      amount: 210.00,
      dueDate: '2026-11-22',
      type: 'Servicio',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-nov-5',
      receiptId: 'REC-MOVISTAR-1122',
      description: 'Enlace de Fibra Óptica Empresarial Noviembre',
      supplierId: 'sup-8',
      amount: 289.90,
      dueDate: '2026-11-22',
      type: 'Telecomunicaciones',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    },
    {
      id: 'exp-nov-6',
      receiptId: 'CUOTA-BCP-0924',
      description: 'Cuota Préstamo de Capital de Trabajo #09',
      supplierId: 'sup-6',
      amount: 3400.00,
      dueDate: '2026-11-25',
      type: 'Préstamo',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null,
      titularProofPhoto: SAMPLE_DNI_SVG,
      paymentReceiptPhoto: null
    }
  ];

  const USERS = {
    gerente: {
      username: 'gerente',
      password: 'gerente123',
      role: 'gerente',
      fullName: 'Carlos Mendoza'
    },
    asistente: {
      username: 'asistente',
      password: 'asistente123',
      role: 'asistente',
      fullName: 'Ana Torres'
    }
  };

  const DEFAULT_PAYMENT_METHODS = [
    'Transferencia Bancaria',
    'Yape (Billetera Digital)',
    'Efectivo',
    'Tarjeta de Débito',
    'Tarjeta de Crédito',
    'Plin (Billetera Digital)',
    'PagoEfectivo'
  ];

  const DEFAULT_ACCOUNTS = [
    {
      id: 'acc-1',
      bank: 'Banco de Crédito del Perú (BCP)',
      type: 'Cuenta Corriente Soles',
      holder: 'Carlos Mendoza',
      identifier: 'CTA: 191-8849201-0-45',
      currency: 'PEN',
      status: 'Activa'
    },
    {
      id: 'acc-2',
      bank: 'BBVA Continental',
      type: 'Tarjeta Débito Empresarial',
      holder: 'Carlos Mendoza',
      identifier: 'Terminación **** 4819',
      currency: 'PEN',
      status: 'Activa'
    },
    {
      id: 'acc-3',
      bank: 'Interbank',
      type: 'Cuenta de Ahorros Tributaria',
      holder: 'Carlos Mendoza',
      identifier: 'CTA: 200-3004819-2-11',
      currency: 'PEN',
      status: 'Activa'
    }
  ];

  const STORAGE_KEYS = {
    SUPPLIERS: 'cuentaclara_suppliers_v4',
    EXPENSES: 'cuentaclara_expenses_v4',
    TYPES: 'cuentaclara_types_v4',
    METHODS: 'cuentaclara_methods_v4',
    ACCOUNTS: 'cuentaclara_accounts_v4',
    SESSION: 'cuentaclara_session_v4'
  };

  const SHARED_DATA_KEYS = {
    suppliers: STORAGE_KEYS.SUPPLIERS,
    expenses: STORAGE_KEYS.EXPENSES,
    types: STORAGE_KEYS.TYPES,
    methods: STORAGE_KEYS.METHODS,
    accounts: STORAGE_KEYS.ACCOUNTS
  };

  let syncController = null;

  function saveSharedData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    if (syncController) syncController.schedule();
  }

  function readSharedState() {
    const state = {};
    Object.keys(SHARED_DATA_KEYS).forEach(name => {
      const saved = localStorage.getItem(SHARED_DATA_KEYS[name]);
      state[name] = saved ? JSON.parse(saved) : [];
    });
    return state;
  }

  function applySharedState(state) {
    Object.keys(SHARED_DATA_KEYS).forEach(name => {
      if (state[name] !== undefined) {
        localStorage.setItem(SHARED_DATA_KEYS[name], JSON.stringify(state[name]));
      }
    });
  }

  function statesEqual(first, second) {
    return JSON.stringify(first) === JSON.stringify(second);
  }

  function mergeSharedState(base, local, remote) {
    const merged = {};
    Object.keys(SHARED_DATA_KEYS).forEach(name => {
      const original = base[name] || [];
      const localItems = local[name] || [];
      const remoteItems = remote[name] || [];
      const isObjectList = original.concat(localItems, remoteItems)
        .some(item => item && typeof item === 'object' && item.id !== undefined);

      if (!isObjectList) {
        merged[name] = statesEqual(original, localItems) ? remoteItems : localItems;
        return;
      }

      const idOf = item => String(item.id);
      const originalById = new Map(original.map(item => [idOf(item), item]));
      const localById = new Map(localItems.map(item => [idOf(item), item]));
      const remoteById = new Map(remoteItems.map(item => [idOf(item), item]));
      const allIds = new Set([...originalById.keys(), ...localById.keys(), ...remoteById.keys()]);
      const result = [];

      allIds.forEach(id => {
        const oldValue = originalById.get(id);
        const localValue = localById.get(id);
        const remoteValue = remoteById.get(id);
        const localChanged = !statesEqual(oldValue, localValue);
        const chosen = localChanged ? localValue : remoteValue;
        if (chosen !== undefined) result.push(chosen);
      });
      merged[name] = result;
    });
    return merged;
  }

  function setConnectionStatus(status) {
    const element = document.getElementById('connectionStatus');
    if (!element) return;
    element.textContent = status === 'online' ? 'Conectado al servidor' :
      status === 'syncing' ? 'Sincronizando...' : 'Sin conexión al servidor';
    element.className = `connection-status connection-${status}`;
  }

  function createSyncController() {
    let revision = 0;
    let baseState = null;
    let enabled = false;
    let dirty = false;
    let publishing = false;
    let pollTimer = null;
    let publishTimer = null;
    let offlineNotified = false;

    async function requestState() {
      const response = await fetch('/api/state', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Error al consultar el servidor (${response.status}).`);
      return response.json();
    }

    async function publish() {
      if (!enabled || publishing || !dirty) return;
      publishing = true;
      dirty = false;
      setConnectionStatus('syncing');
      let state = readSharedState();

      try {
        let response = await fetch('/api/state', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ revision, state })
        });
        let result = await response.json();

        if (response.status === 409) {
          state = mergeSharedState(baseState || result.state, state, result.state);
          applySharedState(state);
          revision = result.revision;
          baseState = result.state;
          response = await fetch('/api/state', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ revision, state })
          });
          result = await response.json();
        }

        if (!response.ok) throw new Error(result.error || `Error al guardar (${response.status}).`);
        revision = result.revision;
        baseState = result.state;
        offlineNotified = false;
        setConnectionStatus('online');
      } catch (error) {
        dirty = true;
        setConnectionStatus('offline');
        if (!offlineNotified) {
          showToast('No se pudo sincronizar con el servidor. Se reintentará automáticamente.', 'error');
          offlineNotified = true;
        }
        console.error('Error de sincronización:', error);
      } finally {
        publishing = false;
        if (dirty) schedule();
      }
    }

    function schedule() {
      dirty = true;
      clearTimeout(publishTimer);
      publishTimer = setTimeout(publish, 300);
    }

    async function refresh() {
      try {
        const result = await requestState();
        if (result.state && result.revision > revision) {
          if (dirty || publishing) {
            await publish();
            return;
          }
          applySharedState(result.state);
          baseState = result.state;
          revision = result.revision;
          const session = Store.getSession();
          if (session) setAuthenticatedView(session);
        }
        offlineNotified = false;
        setConnectionStatus('online');
      } catch (error) {
        setConnectionStatus('offline');
        if (!offlineNotified) {
          showToast('Se perdió la conexión con el servidor. Los cambios locales se sincronizarán al reconectar.', 'error');
          offlineNotified = true;
        }
        console.error('Error al actualizar datos compartidos:', error);
      }
    }

    return {
      async start() {
        try {
          const result = await requestState();
          revision = result.revision;
          if (result.state) {
            applySharedState(result.state);
            baseState = result.state;
          } else {
            baseState = readSharedState();
            dirty = true;
            enabled = true;
            await publish();
          }
          enabled = true;
          setConnectionStatus('online');
        } catch (error) {
          enabled = true;
          baseState = readSharedState();
          setConnectionStatus('offline');
          console.error('No se pudo iniciar la sincronización:', error);
        }

        pollTimer = setInterval(refresh, 3000);
        if (dirty) schedule();
      },
      schedule
    };
  }

  // ==========================================================================
  // Almacenamiento Local (Store)
  // ==========================================================================

  const Store = {
    init() {
      // Por defecto para la exposición ante el profesor, el sistema inicia limpio/vacío (0 registros)
      if (localStorage.getItem(STORAGE_KEYS.SUPPLIERS) === null) {
        localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify([]));
      }
      if (localStorage.getItem(STORAGE_KEYS.EXPENSES) === null) {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
      }
      if (localStorage.getItem(STORAGE_KEYS.TYPES) === null) {
        localStorage.setItem(STORAGE_KEYS.TYPES, JSON.stringify(DEFAULT_EXPENSE_TYPES));
      }
      if (localStorage.getItem(STORAGE_KEYS.METHODS) === null) {
        localStorage.setItem(STORAGE_KEYS.METHODS, JSON.stringify(DEFAULT_PAYMENT_METHODS));
      }
      if (localStorage.getItem(STORAGE_KEYS.ACCOUNTS) === null) {
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([]));
      }
    },

    getSuppliers() {
      const data = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      return data ? JSON.parse(data) : [];
    },

    saveSuppliers(suppliers) {
      saveSharedData(STORAGE_KEYS.SUPPLIERS, suppliers);
    },

    getSupplierById(id) {
      const suppliers = this.getSuppliers();
      return suppliers.find(s => s.id === id) || null;
    },

    addSupplier(supplierData) {
      const suppliers = this.getSuppliers();
      const newSupplier = {
        id: 'sup-' + Date.now(),
        ...supplierData
      };
      suppliers.push(newSupplier);
      this.saveSuppliers(suppliers);
      return newSupplier;
    },

    updateSupplier(supplierData) {
      const suppliers = this.getSuppliers();
      const idx = suppliers.findIndex(s => s.id === supplierData.id);
      if (idx !== -1) {
        suppliers[idx] = { ...suppliers[idx], ...supplierData };
        this.saveSuppliers(suppliers);
        return suppliers[idx];
      }
      return null;
    },

    getExpenseTypes() {
      const data = localStorage.getItem(STORAGE_KEYS.TYPES);
      return data ? JSON.parse(data) : DEFAULT_EXPENSE_TYPES;
    },

    addExpenseType(typeName) {
      const types = this.getExpenseTypes();
      const cleanName = typeName.trim();
      if (!types.includes(cleanName)) {
        types.push(cleanName);
        saveSharedData(STORAGE_KEYS.TYPES, types);
      }
      return types;
    },

    getPaymentMethods() {
      const data = localStorage.getItem(STORAGE_KEYS.METHODS);
      return data ? JSON.parse(data) : DEFAULT_PAYMENT_METHODS;
    },

    savePaymentMethods(methods) {
      saveSharedData(STORAGE_KEYS.METHODS, methods);
    },

    addPaymentMethod(methodName) {
      const methods = this.getPaymentMethods();
      const clean = methodName.trim();
      if (clean && !methods.includes(clean)) {
        methods.push(clean);
        this.savePaymentMethods(methods);
      }
      return methods;
    },

    deletePaymentMethod(methodName) {
      let methods = this.getPaymentMethods();
      methods = methods.filter(m => m !== methodName);
      this.savePaymentMethods(methods);
      return methods;
    },

    getAccounts() {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return data ? JSON.parse(data) : [];
    },

    saveAccounts(accounts) {
      saveSharedData(STORAGE_KEYS.ACCOUNTS, accounts);
    },

    addAccount(accountData) {
      const accounts = this.getAccounts();
      const newAccount = {
        id: 'acc-' + Date.now(),
        ...accountData
      };
      accounts.push(newAccount);
      this.saveAccounts(accounts);
      return newAccount;
    },

    deleteAccount(accountId) {
      let accounts = this.getAccounts();
      accounts = accounts.filter(a => a.id !== accountId);
      this.saveAccounts(accounts);
      return accounts;
    },

    getExpenses() {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    },

    saveExpenses(expenses) {
      saveSharedData(STORAGE_KEYS.EXPENSES, expenses);
    },

    getExpenseById(id) {
      const expenses = this.getExpenses();
      return expenses.find(e => e.id === id) || null;
    },

    addExpense(expenseData) {
      const expenses = this.getExpenses();
      const newExpense = {
        id: 'exp-' + Date.now(),
        status: 'pendiente',
        paymentDate: null,
        paymentMethod: null,
        ref: null,
        paymentReceiptPhoto: null,
        ...expenseData
      };
      expenses.push(newExpense);
      this.saveExpenses(expenses);
      return newExpense;
    },

    updateExpense(expenseData) {
      const expenses = this.getExpenses();
      const idx = expenses.findIndex(e => e.id === expenseData.id);
      if (idx !== -1) {
        expenses[idx] = { ...expenses[idx], ...expenseData };
        this.saveExpenses(expenses);
        return expenses[idx];
      }
      return null;
    },

    markExpenseAsPaid(expenseId, paymentDate, paymentMethod, ref, photoData) {
      const expenses = this.getExpenses();
      const index = expenses.findIndex(e => e.id === expenseId);
      if (index !== -1) {
        expenses[index].status = 'realizado';
        expenses[index].paymentDate = paymentDate;
        expenses[index].paymentMethod = paymentMethod;
        expenses[index].ref = ref || null;
        expenses[index].paymentReceiptPhoto = photoData || SAMPLE_VOUCHER_SVG;
        this.saveExpenses(expenses);
        return expenses[index];
      }
      return null;
    },

    getSession() {
      const session = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      return session ? JSON.parse(session) : null;
    },

    setSession(user) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    },

    clearSession() {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    },

    loadDemoData() {
      saveSharedData(STORAGE_KEYS.SUPPLIERS, DEFAULT_SUPPLIERS);
      saveSharedData(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
      saveSharedData(STORAGE_KEYS.TYPES, DEFAULT_EXPENSE_TYPES);
      saveSharedData(STORAGE_KEYS.METHODS, DEFAULT_PAYMENT_METHODS);
      saveSharedData(STORAGE_KEYS.ACCOUNTS, DEFAULT_ACCOUNTS);
    },

    clearAllData() {
      saveSharedData(STORAGE_KEYS.SUPPLIERS, []);
      saveSharedData(STORAGE_KEYS.EXPENSES, []);
      saveSharedData(STORAGE_KEYS.TYPES, DEFAULT_EXPENSE_TYPES);
      saveSharedData(STORAGE_KEYS.METHODS, DEFAULT_PAYMENT_METHODS);
      saveSharedData(STORAGE_KEYS.ACCOUNTS, []);
    },

    resetDemoData() {
      this.loadDemoData();
    }
  };

  // Notificaciones Toast de Persistencia Local
  let toastTimeout = null;
  function showToast(message, type = 'success') {
    let toast = document.getElementById('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      document.body.appendChild(toast);
    }
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    toast.style.display = 'flex';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 300);
    }, 3500);
  }

  // ==========================================================================
  // Formateadores y Reglas de Negocio
  // ==========================================================================

  function formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return 'S/ ' + num.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Ley N° 29571 (Código de Protección al Consumidor, Art. 44) y BCRP:
   * En transacciones en efectivo, no habiendo monedas de 1 y 5 céntimos,
   * el redondeo es obligatorio HACIA ABAJO a la decena de céntimos inferior (a favor del cliente).
   */
  function calculateCashRounding(amount) {
    const original = parseFloat(amount) || 0;
    // Redondear hacia abajo al múltiplo de 0.10 más cercano
    const rounded = Math.floor(original * 10) / 10;
    const difference = original - rounded; // cantidad descontada a favor del cliente
    return {
      original,
      rounded,
      difference
    };
  }

  // ==========================================================================
  // Manejo de Navegación Temporal (Mes Pasado / Actual / Próximo)
  // ==========================================================================

  // Periodo ancla inicial: Octubre 2026 (mes 9, 0-indexed)
  let activePeriodYear = 2026;
  let activePeriodMonth = 9; // 0 = Enero ... 9 = Octubre

  const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  function getActivePeriodKey() {
    const mStr = String(activePeriodMonth + 1).padStart(2, '0');
    return `${activePeriodYear}-${mStr}`;
  }

  function getActivePeriodLabel() {
    return `${MONTH_NAMES[activePeriodMonth]} ${activePeriodYear}`;
  }

  function changePeriod(deltaMonths) {
    activePeriodMonth += deltaMonths;
    if (activePeriodMonth < 0) {
      activePeriodMonth = 11;
      activePeriodYear -= 1;
    } else if (activePeriodMonth > 11) {
      activePeriodMonth = 0;
      activePeriodYear += 1;
    }
    updatePeriodViews();
  }

  // ==========================================================================
  // Elementos DOM
  // ==========================================================================

  const DOM = {
    // Header & Sesión
    appHeader: document.getElementById('appHeader'),
    userHeaderActions: document.getElementById('userHeaderActions'),
    userBadgeInfo: document.getElementById('userBadgeInfo'),
    resetDemoBtn: document.getElementById('resetDemoBtn'),
    logoutBtn: document.getElementById('logoutBtn'),

    // Navegación temporal
    periodNavigatorContainer: document.getElementById('periodNavigatorContainer'),
    prevMonthBtn: document.getElementById('prevMonthBtn'),
    nextMonthBtn: document.getElementById('nextMonthBtn'),
    currentPeriodLabel: document.getElementById('currentPeriodLabel'),
    jumpMonthSelect: document.getElementById('jumpMonthSelect'),
    jumpYearInput: document.getElementById('jumpYearInput'),
    applyPeriodJumpBtn: document.getElementById('applyPeriodJumpBtn'),
    jumpCurrentMonthBtn: document.getElementById('jumpCurrentMonthBtn'),

    // Login
    loginView: document.getElementById('loginView'),
    loginForm: document.getElementById('loginForm'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    loginAlert: document.getElementById('loginAlert'),
    loginDemoBox: document.getElementById('loginDemoBox'),
    demoGerenteBtn: document.getElementById('demoGerenteBtn'),
    demoAsistenteBtn: document.getElementById('demoAsistenteBtn'),

    // Barra Discreta de Demostración (Modo Presentación)
    secretDevToolbar: document.getElementById('secretDevToolbar'),
    btnLoadDemoData: document.getElementById('btnLoadDemoData'),
    btnClearAllData: document.getElementById('btnClearAllData'),

    // Gerente View
    gerenteView: document.getElementById('gerenteView'),
    kpiManagerPending: document.getElementById('kpiManagerPending'),
    kpiManagerPendingCount: document.getElementById('kpiManagerPendingCount'),
    kpiManagerPaid: document.getElementById('kpiManagerPaid'),
    kpiManagerPaidCount: document.getElementById('kpiManagerPaidCount'),
    kpiManagerOverdue: document.getElementById('kpiManagerOverdue'),
    kpiManagerOverdueCount: document.getElementById('kpiManagerOverdueCount'),
    kpiManagerNextDate: document.getElementById('kpiManagerNextDate'),
    kpiManagerNextDesc: document.getElementById('kpiManagerNextDesc'),
    managerAllExpensesTableBody: document.getElementById('managerAllExpensesTableBody'),
    managerAllExpensesEmpty: document.getElementById('managerAllExpensesEmpty'),

    // Cuentas y Tarjetas Bancarias del Gerente
    openNewAccountModalBtn: document.getElementById('openNewAccountModalBtn'),
    managerAccountsTableBody: document.getElementById('managerAccountsTableBody'),
    managerAccountsEmpty: document.getElementById('managerAccountsEmpty'),
    newAccountModal: document.getElementById('newAccountModal'),
    newAccountForm: document.getElementById('newAccountForm'),
    accountBankInput: document.getElementById('accountBankInput'),
    accountTypeSelect: document.getElementById('accountTypeSelect'),
    accountHolderInput: document.getElementById('accountHolderInput'),
    accountIdentifierInput: document.getElementById('accountIdentifierInput'),
    accountCurrencySelect: document.getElementById('accountCurrencySelect'),
    accountStatusSelect: document.getElementById('accountStatusSelect'),
    closeNewAccountModalBtn: document.getElementById('closeNewAccountModalBtn'),
    cancelNewAccountModalBtn: document.getElementById('cancelNewAccountModalBtn'),

    // Acciones de Gerente y Métodos de Pago
    openGerenteNewSupplierModalBtn: document.getElementById('openGerenteNewSupplierModalBtn'),
    openNewExpenseTypeModalBtn: document.getElementById('openNewExpenseTypeModalBtn'),
    openSupplierListModalBtn: document.getElementById('openSupplierListModalBtn'),
    openPaymentMethodsModalBtn: document.getElementById('openPaymentMethodsModalBtn'),
    paymentMethodsModal: document.getElementById('paymentMethodsModal'),
    newPaymentMethodForm: document.getElementById('newPaymentMethodForm'),
    newPaymentMethodNameInput: document.getElementById('newPaymentMethodNameInput'),
    paymentMethodsListContainer: document.getElementById('paymentMethodsListContainer'),
    closePaymentMethodsModalBtn: document.getElementById('closePaymentMethodsModalBtn'),
    closePaymentMethodsFooterBtn: document.getElementById('closePaymentMethodsFooterBtn'),

    // Asistente View
    asistenteView: document.getElementById('asistenteView'),
    openNewExpenseModalBtn: document.getElementById('openNewExpenseModalBtn'),
    filterSupplier: document.getElementById('filterSupplier'),
    filterType: document.getElementById('filterType'),
    filterStatus: document.getElementById('filterStatus'),
    filterSort: document.getElementById('filterSort'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    assistantPaymentsTableBody: document.getElementById('assistantPaymentsTableBody'),
    assistantPaymentsEmpty: document.getElementById('assistantPaymentsEmpty'),
    asistenteOverdueAlert: document.getElementById('asistenteOverdueAlert'),
    asistenteOverdueAlertText: document.getElementById('asistenteOverdueAlertText'),
    btnGoToOverduePeriod: document.getElementById('btnGoToOverduePeriod'),

    // Modal: Registrar Pago
    recordPaymentModal: document.getElementById('recordPaymentModal'),
    recordPaymentForm: document.getElementById('recordPaymentForm'),
    paymentExpenseId: document.getElementById('paymentExpenseId'),
    modalPaymentReceiptId: document.getElementById('modalPaymentReceiptId'),
    modalPaymentExpenseDesc: document.getElementById('modalPaymentExpenseDesc'),
    modalPaymentExpenseSupplier: document.getElementById('modalPaymentExpenseSupplier'),
    modalPaymentExpenseAmount: document.getElementById('modalPaymentExpenseAmount'),
    paymentDateInput: document.getElementById('paymentDateInput'),
    paymentMethodSelect: document.getElementById('paymentMethodSelect'),
    paymentRefInput: document.getElementById('paymentRefInput'),
    paymentReceiptPhotoInput: document.getElementById('paymentReceiptPhotoInput'),
    paymentReceiptPreviewContainer: document.getElementById('paymentReceiptPreviewContainer'),
    paymentReceiptPreviewImg: document.getElementById('paymentReceiptPreviewImg'),
    closePaymentModalBtn: document.getElementById('closePaymentModalBtn'),
    cancelPaymentModalBtn: document.getElementById('cancelPaymentModalBtn'),

    // Cajas de Yape y Redondeo en Efectivo
    yapeDetailsBox: document.getElementById('yapeDetailsBox'),
    yapeSupplierPhone: document.getElementById('yapeSupplierPhone'),
    yapeSupplierHolder: document.getElementById('yapeSupplierHolder'),
    cashRoundingBox: document.getElementById('cashRoundingBox'),
    cashOriginalAmount: document.getElementById('cashOriginalAmount'),
    cashRoundingDifference: document.getElementById('cashRoundingDifference'),
    cashRoundedTotal: document.getElementById('cashRoundedTotal'),
    cashReceivedInput: document.getElementById('cashReceivedInput'),
    cashChangeAmount: document.getElementById('cashChangeAmount'),

    // Modal: Nuevo Gasto
    newExpenseModal: document.getElementById('newExpenseModal'),
    newExpenseForm: document.getElementById('newExpenseForm'),
    expenseReceiptIdInput: document.getElementById('expenseReceiptIdInput'),
    expenseDescInput: document.getElementById('expenseDescInput'),
    expenseSupplierSelect: document.getElementById('expenseSupplierSelect'),
    expenseTypeSelect: document.getElementById('expenseTypeSelect'),
    expenseAmountInput: document.getElementById('expenseAmountInput'),
    expenseDueDateInput: document.getElementById('expenseDueDateInput'),
    expenseTitularProofInput: document.getElementById('expenseTitularProofInput'),
    expenseTitularPreviewContainer: document.getElementById('expenseTitularPreviewContainer'),
    expenseTitularPreviewImg: document.getElementById('expenseTitularPreviewImg'),
    closeExpenseModalBtn: document.getElementById('closeExpenseModalBtn'),
    cancelExpenseModalBtn: document.getElementById('cancelExpenseModalBtn'),

    // Modal: Nuevo Proveedor (Gerente)
    newSupplierModal: document.getElementById('newSupplierModal'),
    newSupplierForm: document.getElementById('newSupplierForm'),
    supplierRucInput: document.getElementById('supplierRucInput'),
    supplierNameInput: document.getElementById('supplierNameInput'),
    supplierCategorySelect: document.getElementById('supplierCategorySelect'),
    supplierContactInput: document.getElementById('supplierContactInput'),
    supplierPhoneInput: document.getElementById('supplierPhoneInput'),
    supplierEmailInput: document.getElementById('supplierEmailInput'),
    supplierHasYapeCheck: document.getElementById('supplierHasYapeCheck'),
    supplierYapeFields: document.getElementById('supplierYapeFields'),
    supplierYapePhoneInput: document.getElementById('supplierYapePhoneInput'),
    supplierYapeHolderInput: document.getElementById('supplierYapeHolderInput'),
    closeSupplierModalBtn: document.getElementById('closeSupplierModalBtn'),
    cancelSupplierModalBtn: document.getElementById('cancelSupplierModalBtn'),

    // Modal: Editar Proveedor
    editSupplierModal: document.getElementById('editSupplierModal'),
    editSupplierForm: document.getElementById('editSupplierForm'),
    editSupplierId: document.getElementById('editSupplierId'),
    editSupplierRucInput: document.getElementById('editSupplierRucInput'),
    editSupplierNameInput: document.getElementById('editSupplierNameInput'),
    editSupplierCategorySelect: document.getElementById('editSupplierCategorySelect'),
    editSupplierContactInput: document.getElementById('editSupplierContactInput'),
    editSupplierPhoneInput: document.getElementById('editSupplierPhoneInput'),
    editSupplierEmailInput: document.getElementById('editSupplierEmailInput'),
    editSupplierHasYapeCheck: document.getElementById('editSupplierHasYapeCheck'),
    editSupplierYapeFields: document.getElementById('editSupplierYapeFields'),
    editSupplierYapePhoneInput: document.getElementById('editSupplierYapePhoneInput'),
    editSupplierYapeHolderInput: document.getElementById('editSupplierYapeHolderInput'),
    closeEditSupplierModalBtn: document.getElementById('closeEditSupplierModalBtn'),
    cancelEditSupplierModalBtn: document.getElementById('cancelEditSupplierModalBtn'),

    // Modal: Editar Gasto / Pago (Asistente)
    editExpenseModal: document.getElementById('editExpenseModal'),
    editExpenseForm: document.getElementById('editExpenseForm'),
    editExpenseId: document.getElementById('editExpenseId'),
    editExpenseReceiptIdInput: document.getElementById('editExpenseReceiptIdInput'),
    editExpenseDescInput: document.getElementById('editExpenseDescInput'),
    editExpenseSupplierSelect: document.getElementById('editExpenseSupplierSelect'),
    editExpenseTypeSelect: document.getElementById('editExpenseTypeSelect'),
    editExpenseAmountInput: document.getElementById('editExpenseAmountInput'),
    editExpenseDueDateInput: document.getElementById('editExpenseDueDateInput'),
    editExpensePaymentFields: document.getElementById('editExpensePaymentFields'),
    editExpensePaymentDateInput: document.getElementById('editExpensePaymentDateInput'),
    editExpensePaymentMethodSelect: document.getElementById('editExpensePaymentMethodSelect'),
    editExpenseRefInput: document.getElementById('editExpenseRefInput'),
    closeEditExpenseModalBtn: document.getElementById('closeEditExpenseModalBtn'),
    cancelEditExpenseModalBtn: document.getElementById('cancelEditExpenseModalBtn'),

    // Modal: Nuevo Tipo de Gasto (Gerente)
    newExpenseTypeModal: document.getElementById('newExpenseTypeModal'),
    newExpenseTypeForm: document.getElementById('newExpenseTypeForm'),
    expenseTypeNameInput: document.getElementById('expenseTypeNameInput'),
    currentExpenseTypesList: document.getElementById('currentExpenseTypesList'),
    closeExpenseTypeModalBtn: document.getElementById('closeExpenseTypeModalBtn'),
    cancelExpenseTypeModalBtn: document.getElementById('cancelExpenseTypeModalBtn'),

    // Modal: Directorio de Proveedores
    supplierListModal: document.getElementById('supplierListModal'),
    supplierCatalogTableBody: document.getElementById('supplierCatalogTableBody'),
    closeSupplierListModalBtn: document.getElementById('closeSupplierListModalBtn'),
    closeSupplierListBtn: document.getElementById('closeSupplierListBtn'),

    // Modal: Visualizador de Evidencias (DNI / Voucher)
    imageViewerModal: document.getElementById('imageViewerModal'),
    imageViewerTitle: document.getElementById('imageViewerTitle'),
    imageViewerDisplay: document.getElementById('imageViewerDisplay'),
    closeImageViewerBtn: document.getElementById('closeImageViewerBtn'),
    closeImageViewerFooterBtn: document.getElementById('closeImageViewerFooterBtn')
  };

  // Cache temporal para fotos cargadas en modales
  let temporaryUploadedPaymentPhoto = null;
  let temporaryUploadedTitularPhoto = null;

  // ==========================================================================
  // Renderizado: Gerente (Dashboard con 4 KPIs y Listas Unificadas)
  // ==========================================================================

  function renderGerenteDashboard() {
    const expenses = Store.getExpenses();
    const suppliers = Store.getSuppliers();
    const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

    const periodKey = getActivePeriodKey(); // Ej. '2026-10'

    // Separación por periodos
    const periodExpenses = expenses.filter(e => {
      const dateToCheck = e.dueDate || e.paymentDate;
      return dateToCheck && dateToCheck.startsWith(periodKey);
    });

    const pendingExpenses = periodExpenses.filter(e => e.status === 'pendiente');
    const paidExpenses = periodExpenses.filter(e => e.status === 'realizado');

    // KPI 1: Total Pendiente del Mes
    const totalPending = pendingExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    DOM.kpiManagerPending.textContent = formatCurrency(totalPending);
    DOM.kpiManagerPendingCount.textContent = `${pendingExpenses.length} pago${pendingExpenses.length === 1 ? '' : 's'} pendiente${pendingExpenses.length === 1 ? '' : 's'}`;

    // KPI 2: Total Pagado del Mes
    const totalPaid = paidExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    DOM.kpiManagerPaid.textContent = formatCurrency(totalPaid);
    DOM.kpiManagerPaidCount.textContent = `${paidExpenses.length} pago${paidExpenses.length === 1 ? '' : 's'} realizado${paidExpenses.length === 1 ? '' : 's'}`;

    // KPI 3: Deudas Vencidas Anteriores (Gastos pendientes de meses anteriores al seleccionado)
    const overdueExpenses = expenses.filter(e => {
      return e.status === 'pendiente' && e.dueDate && e.dueDate < `${periodKey}-01`;
    });
    const totalOverdue = overdueExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    DOM.kpiManagerOverdue.textContent = formatCurrency(totalOverdue);
    DOM.kpiManagerOverdueCount.textContent = `${overdueExpenses.length} deuda${overdueExpenses.length === 1 ? '' : 's'} anterior${overdueExpenses.length === 1 ? '' : 'es'}`;

    // KPI 4: Próximo Vencimiento del periodo
    if (pendingExpenses.length > 0) {
      const sortedPending = [...pendingExpenses].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      const nextExp = sortedPending[0];
      DOM.kpiManagerNextDate.textContent = formatDate(nextExp.dueDate);
      DOM.kpiManagerNextDesc.textContent = `${nextExp.description} (${formatCurrency(nextExp.amount)})`;
    } else {
      DOM.kpiManagerNextDate.textContent = 'Sin pendientes';
      DOM.kpiManagerNextDesc.textContent = 'Todas las obligaciones del periodo están al día.';
    }

    // Tabla Única Consolidada: Todas las Obligaciones y Pagos del Periodo
    DOM.managerAllExpensesTableBody.innerHTML = '';
    if (periodExpenses.length === 0) {
      DOM.managerAllExpensesEmpty.classList.remove('hidden');
    } else {
      DOM.managerAllExpensesEmpty.classList.add('hidden');

      // Ordenar: Pendientes primero por fecha de vencimiento, luego realizados
      const sortedExpenses = [...periodExpenses].sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === 'pendiente' ? -1 : 1;
        }
        return a.dueDate.localeCompare(b.dueDate);
      });

      sortedExpenses.forEach(exp => {
        const tr = document.createElement('tr');
        const supplierName = supplierMap.get(exp.supplierId) || 'No especificado';
        const isPaid = exp.status === 'realizado';

        // N° Operación visible tanto para Gerente como Asistente
        const opCell = isPaid && exp.ref
          ? `<code class="receipt-id-tag">${escapeHtml(exp.ref)}</code>`
          : '<span style="color: var(--color-text-muted);">-</span>';

        // Ambos botones visibles a la vez cuando está pagado (Observación Compañero)
        const proofCell = isPaid
          ? `<div class="evidence-btns-cell">
               <button type="button" class="btn-link view-titular-btn" data-id="${exp.id}">Ver Titular / DNI</button>
               <button type="button" class="btn-link view-receipt-btn" data-id="${exp.id}" style="color: #059669; font-weight: 600;">Ver Voucher</button>
             </div>`
          : `<button type="button" class="btn-link view-titular-btn" data-id="${exp.id}">Ver Titular / DNI</button>`;

        tr.innerHTML = `
          <td><span class="receipt-id-tag">${escapeHtml(exp.receiptId || 'S/N')}</span></td>
          <td><strong>${escapeHtml(exp.description)}</strong></td>
          <td>${escapeHtml(supplierName)}</td>
          <td><span class="badge badge-type">${escapeHtml(exp.type)}</span></td>
          <td>${formatDate(exp.dueDate)}</td>
          <td class="amount-col">${formatCurrency(exp.amount)}</td>
          <td>${opCell}</td>
          <td>${proofCell}</td>
          <td><span class="badge ${isPaid ? 'badge-paid' : 'badge-pending'}">${isPaid ? 'Realizado' : 'Pendiente'}</span></td>
        `;
        DOM.managerAllExpensesTableBody.appendChild(tr);
      });

      // Eventos de visualización de evidencias
      DOM.managerAllExpensesTableBody.querySelectorAll('.view-titular-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          showTitularPhoto(id);
        });
      });

      DOM.managerAllExpensesTableBody.querySelectorAll('.view-receipt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          showPaymentPhoto(id);
        });
      });
    }

    // Renderizar cuentas bancarias dinámicas del gerente
    renderManagerAccounts();
  }

  // ==========================================================================
  // Renderizado: Cuentas Bancarias y Tarjetas del Gerente
  // ==========================================================================

  function renderManagerAccounts() {
    if (!DOM.managerAccountsTableBody) return;
    const accounts = Store.getAccounts();
    DOM.managerAccountsTableBody.innerHTML = '';

    if (accounts.length === 0) {
      if (DOM.managerAccountsEmpty) DOM.managerAccountsEmpty.classList.remove('hidden');
    } else {
      if (DOM.managerAccountsEmpty) DOM.managerAccountsEmpty.classList.add('hidden');
      accounts.forEach(acc => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(acc.bank)}</strong></td>
          <td>${escapeHtml(acc.type)}</td>
          <td>${escapeHtml(acc.holder)}</td>
          <td><code>${escapeHtml(acc.identifier)}</code></td>
          <td><span class="badge badge-type">${escapeHtml(acc.currency)}</span></td>
          <td><span class="badge ${acc.status === 'Activa' ? 'badge-paid' : 'badge-pending'}">${escapeHtml(acc.status)}</span></td>
          <td style="text-align: right;">
            <button type="button" class="btn btn-secondary btn-sm delete-account-btn" data-id="${acc.id}">Eliminar</button>
          </td>
        `;
        DOM.managerAccountsTableBody.appendChild(tr);
      });

      DOM.managerAccountsTableBody.querySelectorAll('.delete-account-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          if (confirm('¿Está seguro de eliminar esta cuenta bancaria o tarjeta?')) {
            Store.deleteAccount(id);
            renderManagerAccounts();
            showToast('Cuenta eliminada de la base de datos.', 'info');
          }
        });
      });
    }
  }

  // ==========================================================================
  // Renderizado: Métodos de Pago Habilitados (Gerente)
  // ==========================================================================

  function renderPaymentMethods() {
    if (!DOM.paymentMethodsListContainer) return;
    const methods = Store.getPaymentMethods();
    DOM.paymentMethodsListContainer.innerHTML = '';

    methods.forEach(method => {
      const item = document.createElement('div');
      item.className = 'payment-method-item';
      item.innerHTML = `
        <span class="payment-method-name">${escapeHtml(method)}</span>
        <button type="button" class="btn btn-secondary btn-sm delete-method-btn" data-name="${escapeHtml(method)}">Eliminar</button>
      `;
      DOM.paymentMethodsListContainer.appendChild(item);
    });

    DOM.paymentMethodsListContainer.querySelectorAll('.delete-method-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        if (confirm(`¿Desea eliminar el método de pago "${name}"?`)) {
          Store.deletePaymentMethod(name);
          renderPaymentMethods();
          updatePaymentMethodSelects();
          showToast(`Método de pago "${name}" eliminado.`, 'info');
        }
      });
    });
  }

  function updatePaymentMethodSelects() {
    const methods = Store.getPaymentMethods();

    // Selector en Modal Registrar Pago
    if (DOM.paymentMethodSelect) {
      const currentVal = DOM.paymentMethodSelect.value;
      DOM.paymentMethodSelect.innerHTML = '<option value="">Seleccione un método</option>';
      methods.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        DOM.paymentMethodSelect.appendChild(opt);
      });
      DOM.paymentMethodSelect.value = currentVal;
    }

    // Selector en Modal Editar Pago
    if (DOM.editExpensePaymentMethodSelect) {
      DOM.editExpensePaymentMethodSelect.innerHTML = '<option value="">Seleccione un método</option>';
      methods.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        DOM.editExpensePaymentMethodSelect.appendChild(opt);
      });
    }
  }

  // ==========================================================================
  // Renderizado: Asistente
  // ==========================================================================

  function updateTypeSelects() {
    const types = Store.getExpenseTypes();

    // Filtro de tipos
    const currentFilterVal = DOM.filterType.value;
    DOM.filterType.innerHTML = '<option value="all">Todos los tipos</option>';
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      DOM.filterType.appendChild(opt);
    });
    DOM.filterType.value = currentFilterVal;

    // Selector en Modal Nuevo Gasto
    DOM.expenseTypeSelect.innerHTML = '<option value="">Seleccione un tipo</option>';
    types.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      DOM.expenseTypeSelect.appendChild(opt);
    });

    // Selector en Modal Editar Gasto
    if (DOM.editExpenseTypeSelect) {
      DOM.editExpenseTypeSelect.innerHTML = '<option value="">Seleccione un tipo</option>';
      types.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        DOM.editExpenseTypeSelect.appendChild(opt);
      });
    }

    // Lista de tipos en modal de gerente
    DOM.currentExpenseTypesList.innerHTML = '';
    types.forEach(t => {
      const span = document.createElement('span');
      span.className = 'badge badge-type';
      span.textContent = t;
      DOM.currentExpenseTypesList.appendChild(span);
    });
  }

  function updateSupplierSelects() {
    const suppliers = Store.getSuppliers();

    // Filtro de proveedores
    const currentFilterVal = DOM.filterSupplier.value;
    DOM.filterSupplier.innerHTML = '<option value="all">Todos los proveedores</option>';
    suppliers.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      DOM.filterSupplier.appendChild(opt);
    });
    DOM.filterSupplier.value = currentFilterVal;

    // Selector en Modal Nuevo Gasto (Solo proveedores autorizados por el Gerente)
    DOM.expenseSupplierSelect.innerHTML = '<option value="">Seleccione un proveedor</option>';
    suppliers.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} (${s.category})${s.hasYape ? ' - Acepta Yape' : ''}`;
      DOM.expenseSupplierSelect.appendChild(opt);
    });

    // Selector en Modal Editar Gasto
    if (DOM.editExpenseSupplierSelect) {
      DOM.editExpenseSupplierSelect.innerHTML = '<option value="">Seleccione un proveedor</option>';
      suppliers.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.name} (${s.category})`;
        DOM.editExpenseSupplierSelect.appendChild(opt);
      });
    }
  }

  function renderAssistantPayments() {
    const expenses = Store.getExpenses();
    const suppliers = Store.getSuppliers();
    const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

    const periodKey = getActivePeriodKey(); // Ej. '2026-10'

    // Alerta de deudas pendientes de meses anteriores para el Asistente (Observación Compañero)
    const overdueExpenses = expenses.filter(e => {
      return e.status === 'pendiente' && e.dueDate && e.dueDate < `${periodKey}-01`;
    });

    if (DOM.asistenteOverdueAlert) {
      if (overdueExpenses.length > 0) {
        const totalOverdue = overdueExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        DOM.asistenteOverdueAlertText.textContent = `Existen ${overdueExpenses.length} deuda(s) vencida(s) de meses anteriores por un total de ${formatCurrency(totalOverdue)}.`;
        DOM.asistenteOverdueAlert.classList.remove('hidden');
      } else {
        DOM.asistenteOverdueAlert.classList.add('hidden');
      }
    }

    const supplierFilter = DOM.filterSupplier.value;
    const typeFilter = DOM.filterType.value;
    const statusFilter = DOM.filterStatus.value;
    const sortFilter = DOM.filterSort.value;

    let filtered = expenses.filter(exp => {
      // Filtrar por periodo consultado
      const dateToCheck = exp.dueDate || exp.paymentDate;
      if (!dateToCheck || !dateToCheck.startsWith(periodKey)) {
        return false;
      }
      if (supplierFilter !== 'all' && exp.supplierId !== supplierFilter) {
        return false;
      }
      if (typeFilter !== 'all' && exp.type !== typeFilter) {
        return false;
      }
      if (statusFilter !== 'all' && exp.status !== statusFilter) {
        return false;
      }
      return true;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      if (sortFilter === 'due_asc') {
        return a.dueDate.localeCompare(b.dueDate);
      } else if (sortFilter === 'due_desc') {
        return b.dueDate.localeCompare(a.dueDate);
      } else if (sortFilter === 'amount_desc') {
        return parseFloat(b.amount) - parseFloat(a.amount);
      } else if (sortFilter === 'amount_asc') {
        return parseFloat(a.amount) - parseFloat(b.amount);
      }
      return 0;
    });

    DOM.assistantPaymentsTableBody.innerHTML = '';
    if (filtered.length === 0) {
      DOM.assistantPaymentsEmpty.classList.remove('hidden');
    } else {
      DOM.assistantPaymentsEmpty.classList.add('hidden');
      filtered.forEach(exp => {
        const tr = document.createElement('tr');
        const supplierName = supplierMap.get(exp.supplierId) || 'No especificado';
        const isPaid = exp.status === 'realizado';

        // N° Operación visible tanto para Gerente como Asistente
        const opCell = isPaid && exp.ref
          ? `<code class="receipt-id-tag">${escapeHtml(exp.ref)}</code>`
          : '<span style="color: var(--color-text-muted);">-</span>';

        // Ambos botones visibles a la vez cuando está pagado
        const titularCell = `
          <button type="button" class="btn-link view-titular-btn" data-id="${exp.id}">Ver Titular / DNI</button>
        `;

        const receiptCell = isPaid
          ? `<button type="button" class="btn-link view-receipt-btn" data-id="${exp.id}" style="color: #059669; font-weight: 600;">Ver Voucher</button>`
          : '<span class="form-hint">Sin voucher</span>';

        // Acciones: Botón de editar gasto/pago en caso de equivocación + acción de registrar pago
        const actionCell = `
          <div class="table-actions-cell">
            <button type="button" class="btn btn-secondary btn-sm edit-expense-btn" data-id="${exp.id}">Editar</button>
            ${isPaid
              ? `<span style="color: var(--color-text-muted); font-size: 12px; margin-left: 4px;">Pagado (${formatDate(exp.paymentDate)})</span>`
              : `<button type="button" class="btn btn-primary btn-sm record-btn" data-id="${exp.id}">Registrar Pago</button>`
            }
          </div>
        `;

        tr.innerHTML = `
          <td><span class="receipt-id-tag">${escapeHtml(exp.receiptId || 'S/N')}</span></td>
          <td><strong>${escapeHtml(exp.description)}</strong></td>
          <td>${escapeHtml(supplierName)}</td>
          <td><span class="badge badge-type">${escapeHtml(exp.type)}</span></td>
          <td>${formatDate(exp.dueDate)}</td>
          <td class="amount-col">${formatCurrency(exp.amount)}</td>
          <td><span class="badge ${isPaid ? 'badge-paid' : 'badge-pending'}">${isPaid ? 'Realizado' : 'Pendiente'}</span></td>
          <td>${opCell}</td>
          <td>${titularCell}</td>
          <td>${receiptCell}</td>
          <td style="text-align: right;">${actionCell}</td>
        `;
        DOM.assistantPaymentsTableBody.appendChild(tr);
      });

      // Eventos
      DOM.assistantPaymentsTableBody.querySelectorAll('.record-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          openRecordPaymentModal(id);
        });
      });

      DOM.assistantPaymentsTableBody.querySelectorAll('.edit-expense-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          openEditExpenseModal(id);
        });
      });

      DOM.assistantPaymentsTableBody.querySelectorAll('.view-titular-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          showTitularPhoto(id);
        });
      });

      DOM.assistantPaymentsTableBody.querySelectorAll('.view-receipt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          showPaymentPhoto(id);
        });
      });
    }
  }

  function renderSupplierCatalog() {
    const suppliers = Store.getSuppliers();
    DOM.supplierCatalogTableBody.innerHTML = '';
    suppliers.forEach(s => {
      const tr = document.createElement('tr');
      const yapeInfo = s.hasYape
        ? `<span class="badge badge-paid">Sí</span> (${escapeHtml(s.yapePhone || '-')})`
        : '<span class="badge badge-type">No</span>';

      tr.innerHTML = `
        <td><strong>${escapeHtml(s.ruc)}</strong></td>
        <td>${escapeHtml(s.name)}</td>
        <td><span class="badge badge-type">${escapeHtml(s.category)}</span></td>
        <td>${escapeHtml(s.contact)}</td>
        <td><code>${escapeHtml(s.phone)}</code></td>
        <td>${yapeInfo}</td>
        <td style="text-align: right;">
          <button type="button" class="btn btn-secondary btn-sm edit-supplier-btn" data-id="${s.id}">Editar</button>
        </td>
      `;
      DOM.supplierCatalogTableBody.appendChild(tr);
    });

    DOM.supplierCatalogTableBody.querySelectorAll('.edit-supplier-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openEditSupplierModal(id);
      });
    });
  }

  // ==========================================================================
  // Sincronización y Navegación de Periodo
  // ==========================================================================

  function syncPeriodJumpInputs() {
    if (DOM.jumpMonthSelect) DOM.jumpMonthSelect.value = String(activePeriodMonth);
    if (DOM.jumpYearInput) DOM.jumpYearInput.value = String(activePeriodYear);
  }

  function updatePeriodViews() {
    DOM.currentPeriodLabel.textContent = getActivePeriodLabel();
    syncPeriodJumpInputs();

    const activeSession = Store.getSession();
    if (activeSession) {
      if (activeSession.role === 'gerente') {
        renderGerenteDashboard();
      } else {
        renderAssistantPayments();
      }
    }
  }


  // ==========================================================================
  // Gestión de Modales y Reglas de Negocio
  // ==========================================================================

  function openRecordPaymentModal(expenseId) {
    const exp = Store.getExpenseById(expenseId);
    if (!exp) return;

    const supplier = Store.getSupplierById(exp.supplierId);

    DOM.paymentExpenseId.value = exp.id;
    DOM.modalPaymentReceiptId.textContent = exp.receiptId || 'S/N';
    DOM.modalPaymentExpenseDesc.textContent = exp.description;
    DOM.modalPaymentExpenseSupplier.textContent = supplier ? supplier.name : 'No asignado';
    DOM.modalPaymentExpenseAmount.textContent = formatCurrency(exp.amount);

    // Fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    DOM.paymentDateInput.value = today;
    DOM.paymentMethodSelect.value = '';
    DOM.paymentRefInput.value = '';

    // Ocultar cajas especiales inicialmente
    DOM.yapeDetailsBox.classList.add('hidden');
    DOM.cashRoundingBox.classList.add('hidden');
    DOM.paymentReceiptPreviewContainer.classList.add('hidden');
    DOM.paymentReceiptPhotoInput.value = '';
    temporaryUploadedPaymentPhoto = null;

    DOM.recordPaymentModal.classList.remove('hidden');
  }

  function handlePaymentMethodChange() {
    const expId = DOM.paymentExpenseId.value;
    const exp = Store.getExpenseById(expId);
    if (!exp) return;

    const method = DOM.paymentMethodSelect.value;
    const supplier = Store.getSupplierById(exp.supplierId);

    // 1. Caso Billetera Digital (Yape)
    if (method === 'Yape (Billetera Digital)') {
      DOM.cashRoundingBox.classList.add('hidden');
      if (supplier && supplier.hasYape && supplier.yapePhone) {
        DOM.yapeSupplierPhone.textContent = `Número Celular: ${supplier.yapePhone}`;
        DOM.yapeSupplierHolder.textContent = `Titular / Alias: ${supplier.yapeHolder || 'No especificado'}`;
        DOM.yapeDetailsBox.classList.remove('hidden');
      } else {
        DOM.yapeSupplierPhone.textContent = 'Aviso: El proveedor no tiene número de Yape preconfigurado.';
        DOM.yapeSupplierHolder.textContent = 'Puede coordinar con Gerencia para registrar sus datos.';
        DOM.yapeDetailsBox.classList.remove('hidden');
      }
    }
    // 2. Caso Efectivo: Redondeo Ley N° 29571 / BCRP y Vuelto
    else if (method === 'Efectivo') {
      DOM.yapeDetailsBox.classList.add('hidden');
      const rounding = calculateCashRounding(exp.amount);

      DOM.cashOriginalAmount.textContent = formatCurrency(rounding.original);
      DOM.cashRoundingDifference.textContent = rounding.difference > 0
        ? `-${formatCurrency(rounding.difference)} (descuento en céntimos)`
        : 'S/ 0.00 (monto exacto)';
      DOM.cashRoundedTotal.textContent = formatCurrency(rounding.rounded);

      DOM.cashReceivedInput.value = '';
      DOM.cashChangeAmount.textContent = 'S/ 0.00';
      DOM.cashRoundingBox.classList.remove('hidden');
    }
    // Otros métodos
    else {
      DOM.yapeDetailsBox.classList.add('hidden');
      DOM.cashRoundingBox.classList.add('hidden');
    }
  }

  function handleCashReceivedChange() {
    const expId = DOM.paymentExpenseId.value;
    const exp = Store.getExpenseById(expId);
    if (!exp) return;

    const rounding = calculateCashRounding(exp.amount);
    const received = parseFloat(DOM.cashReceivedInput.value) || 0;

    if (received >= rounding.rounded) {
      const change = received - rounding.rounded;
      DOM.cashChangeAmount.textContent = formatCurrency(change);
    } else {
      DOM.cashChangeAmount.textContent = 'S/ 0.00 (Efectivo insuficiente)';
    }
  }

  function closeRecordPaymentModal() {
    DOM.recordPaymentModal.classList.add('hidden');
    DOM.recordPaymentForm.reset();
  }

  function openNewExpenseModal() {
    DOM.newExpenseForm.reset();
    updateSupplierSelects();
    updateTypeSelects();
    DOM.expenseTitularPreviewContainer.classList.add('hidden');
    temporaryUploadedTitularPhoto = null;
    DOM.newExpenseModal.classList.remove('hidden');
  }

  function closeNewExpenseModal() {
    DOM.newExpenseModal.classList.add('hidden');
    DOM.newExpenseForm.reset();
  }

  function openNewSupplierModal() {
    DOM.newSupplierForm.reset();
    DOM.supplierYapeFields.classList.add('hidden');
    DOM.newSupplierModal.classList.remove('hidden');
  }

  function closeNewSupplierModal() {
    DOM.newSupplierModal.classList.add('hidden');
    DOM.newSupplierForm.reset();
  }

  function openNewExpenseTypeModal() {
    DOM.newExpenseTypeForm.reset();
    updateTypeSelects();
    DOM.newExpenseTypeModal.classList.remove('hidden');
  }

  function closeNewExpenseTypeModal() {
    DOM.newExpenseTypeModal.classList.add('hidden');
    DOM.newExpenseTypeForm.reset();
  }

  function openSupplierListModal() {
    renderSupplierCatalog();
    DOM.supplierListModal.classList.remove('hidden');
  }

  function closeSupplierListModal() {
    DOM.supplierListModal.classList.add('hidden');
  }

  // Modales de Métodos de Pago y Cuentas Bancarias (Gerente)
  function openPaymentMethodsModal() {
    renderPaymentMethods();
    DOM.newPaymentMethodNameInput.value = '';
    DOM.paymentMethodsModal.classList.remove('hidden');
  }

  function closePaymentMethodsModal() {
    DOM.paymentMethodsModal.classList.add('hidden');
    DOM.newPaymentMethodForm.reset();
  }

  function openNewAccountModal() {
    DOM.newAccountForm.reset();
    DOM.accountHolderInput.value = 'Carlos Mendoza';
    DOM.accountCurrencySelect.value = 'PEN';
    DOM.accountStatusSelect.value = 'Activa';
    DOM.newAccountModal.classList.remove('hidden');
  }

  function closeNewAccountModal() {
    DOM.newAccountModal.classList.add('hidden');
    DOM.newAccountForm.reset();
  }

  // Modales de Edición (Proveedores y Gastos)
  function openEditSupplierModal(supplierId) {
    const s = Store.getSupplierById(supplierId);
    if (!s) return;

    DOM.editSupplierId.value = s.id;
    DOM.editSupplierRucInput.value = s.ruc || '';
    DOM.editSupplierNameInput.value = s.name || '';
    DOM.editSupplierCategorySelect.value = s.category || 'Proveedor';
    DOM.editSupplierContactInput.value = s.contact || '';
    DOM.editSupplierPhoneInput.value = s.phone ? s.phone.replace(/\D/g, '').slice(0, 9) : '';
    DOM.editSupplierEmailInput.value = s.email || '';

    DOM.editSupplierHasYapeCheck.checked = Boolean(s.hasYape);
    if (s.hasYape) {
      DOM.editSupplierYapeFields.classList.remove('hidden');
      DOM.editSupplierYapePhoneInput.value = s.yapePhone ? s.yapePhone.replace(/\D/g, '').slice(0, 9) : '';
      DOM.editSupplierYapeHolderInput.value = s.yapeHolder || '';
    } else {
      DOM.editSupplierYapeFields.classList.add('hidden');
      DOM.editSupplierYapePhoneInput.value = '';
      DOM.editSupplierYapeHolderInput.value = '';
    }

    DOM.editSupplierModal.classList.remove('hidden');
  }

  function closeEditSupplierModal() {
    DOM.editSupplierModal.classList.add('hidden');
    DOM.editSupplierForm.reset();
  }

  function openEditExpenseModal(expenseId) {
    const exp = Store.getExpenseById(expenseId);
    if (!exp) return;

    updateSupplierSelects();
    updateTypeSelects();
    updatePaymentMethodSelects();

    DOM.editExpenseId.value = exp.id;
    DOM.editExpenseReceiptIdInput.value = exp.receiptId || '';
    DOM.editExpenseDescInput.value = exp.description || '';
    DOM.editExpenseSupplierSelect.value = exp.supplierId || '';
    DOM.editExpenseTypeSelect.value = exp.type || '';
    DOM.editExpenseAmountInput.value = exp.amount;
    DOM.editExpenseDueDateInput.value = exp.dueDate || '';

    if (exp.status === 'realizado') {
      DOM.editExpensePaymentFields.classList.remove('hidden');
      DOM.editExpensePaymentDateInput.value = exp.paymentDate || '';
      DOM.editExpensePaymentMethodSelect.value = exp.paymentMethod || '';
      DOM.editExpenseRefInput.value = exp.ref || '';
    } else {
      DOM.editExpensePaymentFields.classList.add('hidden');
      DOM.editExpensePaymentDateInput.value = '';
      DOM.editExpensePaymentMethodSelect.value = '';
      DOM.editExpenseRefInput.value = '';
    }

    DOM.editExpenseModal.classList.remove('hidden');
  }

  function closeEditExpenseModal() {
    DOM.editExpenseModal.classList.add('hidden');
    DOM.editExpenseForm.reset();
  }

  // Validación y Sanitización Estricta de Teléfonos Perú (9 dígitos numéricos)
  function isValidPeruPhone(phone) {
    return /^[0-9]{9}$/.test(phone);
  }

  function isValidYapePhone(phone) {
    return /^9[0-9]{8}$/.test(phone);
  }

  function isValidIdentityNumber(value) {
    return /^[0-9]{1,11}$/.test(value);
  }

  function setupPhoneInputSanitizers() {
    const phoneInputs = [
      DOM.supplierPhoneInput,
      DOM.supplierYapePhoneInput,
      DOM.editSupplierPhoneInput,
      DOM.editSupplierYapePhoneInput
    ];
    phoneInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', function () {
          const digits = this.value.replace(/\D/g, '').slice(0, 9);
          this.value = input === DOM.supplierYapePhoneInput || input === DOM.editSupplierYapePhoneInput
            ? (digits.startsWith('9') ? digits : '')
            : digits;
        });
      }
    });

    [DOM.supplierContactInput, DOM.editSupplierContactInput].forEach(input => {
      if (input) {
        input.addEventListener('input', function () {
          this.value = this.value.replace(/[0-9]/g, '');
        });
      }
    });
  }

  // ==========================================================================
  // Visualizador de Evidencias (Foto DNI o Foto Voucher)
  // ==========================================================================

  function showTitularPhoto(expenseId) {
    const exp = Store.getExpenseById(expenseId);
    if (!exp) return;

    DOM.imageViewerTitle.textContent = `Titularidad y DNI: ${exp.description}`;
    DOM.imageViewerDisplay.src = exp.titularProofPhoto || SAMPLE_DNI_SVG;
    DOM.imageViewerModal.classList.remove('hidden');
  }

  function showPaymentPhoto(expenseId) {
    const exp = Store.getExpenseById(expenseId);
    if (!exp) return;

    DOM.imageViewerTitle.textContent = `Comprobante de Pago: ${exp.description}`;
    DOM.imageViewerDisplay.src = exp.paymentReceiptPhoto || SAMPLE_VOUCHER_SVG;
    DOM.imageViewerModal.classList.remove('hidden');
  }

  function closeImageViewer() {
    DOM.imageViewerModal.classList.add('hidden');
    DOM.imageViewerDisplay.src = '';
  }

  // ==========================================================================
  // Control de Sesión
  // ==========================================================================

  function setAuthenticatedView(user) {
    DOM.loginView.classList.add('hidden');
    DOM.userHeaderActions.classList.remove('hidden');
    DOM.periodNavigatorContainer.classList.remove('hidden');
    DOM.userBadgeInfo.innerHTML = `<strong>${escapeHtml(user.fullName)}</strong> (${user.role === 'gerente' ? 'Gerente' : 'Asistente'})`;

    updateTypeSelects();
    updateSupplierSelects();
    updatePeriodViews();

    if (user.role === 'gerente') {
      DOM.asistenteView.classList.add('hidden');
      DOM.gerenteView.classList.remove('hidden');
      renderGerenteDashboard();
    } else if (user.role === 'asistente') {
      DOM.gerenteView.classList.add('hidden');
      DOM.asistenteView.classList.remove('hidden');
      renderAssistantPayments();
    }
  }

  function setUnauthenticatedView() {
    Store.clearSession();
    DOM.loginAlert.classList.add('hidden');
    DOM.loginForm.reset();

    DOM.loginView.classList.remove('hidden');
    DOM.gerenteView.classList.add('hidden');
    DOM.asistenteView.classList.add('hidden');
    DOM.periodNavigatorContainer.classList.add('hidden');
    DOM.userHeaderActions.classList.add('hidden');
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  function attachEvents() {
    // Login
    DOM.loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = DOM.usernameInput.value.trim().toLowerCase();
      const password = DOM.passwordInput.value.trim();

      const user = USERS[username];
      if (user && user.password === password) {
        DOM.loginAlert.classList.add('hidden');
        Store.setSession(user);
        setAuthenticatedView(user);
      } else {
        DOM.loginAlert.textContent = 'Usuario o contraseña incorrectos.';
        DOM.loginAlert.classList.remove('hidden');
      }
    });

    // Credenciales rápidas de demo
    DOM.demoGerenteBtn.addEventListener('click', function () {
      DOM.usernameInput.value = 'gerente';
      DOM.passwordInput.value = 'gerente123';
      DOM.loginAlert.classList.add('hidden');
    });

    DOM.demoAsistenteBtn.addEventListener('click', function () {
      DOM.usernameInput.value = 'asistente';
      DOM.passwordInput.value = 'asistente123';
      DOM.loginAlert.classList.add('hidden');
    });

    // Logout
    DOM.logoutBtn.addEventListener('click', setUnauthenticatedView);

    // Navegación temporal
    DOM.prevMonthBtn.addEventListener('click', () => changePeriod(-1));
    DOM.nextMonthBtn.addEventListener('click', () => changePeriod(1));

    // Filtros de Asistente
    DOM.filterSupplier.addEventListener('change', renderAssistantPayments);
    DOM.filterType.addEventListener('change', renderAssistantPayments);
    DOM.filterStatus.addEventListener('change', renderAssistantPayments);
    DOM.filterSort.addEventListener('change', renderAssistantPayments);

    DOM.resetFiltersBtn.addEventListener('click', function () {
      DOM.filterSupplier.value = 'all';
      DOM.filterType.value = 'all';
      DOM.filterStatus.value = 'all';
      DOM.filterSort.value = 'due_asc';
      renderAssistantPayments();
    });

    // ========================================================================
    // Modo Presentación Discreto (Atajo: Ctrl+Shift+D o Ctrl+D o 3 clics en Logo)
    // ========================================================================

    function toggleSecretToolbar() {
      if (!DOM.secretDevToolbar) return;
      const isHidden = DOM.secretDevToolbar.classList.contains('hidden');
      if (isHidden) {
        DOM.secretDevToolbar.classList.remove('hidden');
        if (DOM.loginDemoBox) DOM.loginDemoBox.classList.remove('hidden');
        showToast('Modo Presentación activado.', 'info');
      } else {
        DOM.secretDevToolbar.classList.add('hidden');
        if (DOM.loginDemoBox) DOM.loginDemoBox.classList.add('hidden');
        showToast('Modo Presentación ocultado.', 'info');
      }
    }

    // Atajo de teclado secreto: Ctrl+Shift+D o Ctrl+D o Ctrl+M
    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) ||
          (e.ctrlKey && (e.key === 'd' || e.key === 'D')) ||
          (e.ctrlKey && (e.key === 'm' || e.key === 'M'))) {
        e.preventDefault();
        toggleSecretToolbar();
      }
    });

    // Respaldo alternativo: 3 clics rápidos en el título "CuentaClara"
    let logoClickCount = 0;
    let logoClickTimer = null;
    document.querySelectorAll('.brand-title, .login-header h1').forEach(elem => {
      elem.addEventListener('click', function () {
        logoClickCount++;
        clearTimeout(logoClickTimer);
        logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 800);
        if (logoClickCount >= 3) {
          logoClickCount = 0;
          toggleSecretToolbar();
        }
      });
    });

    // Botones de la Barra Secreta
    if (DOM.btnLoadDemoData) {
      DOM.btnLoadDemoData.addEventListener('click', function () {
        Store.loadDemoData();
        updateSupplierSelects();
        updateTypeSelects();
        updatePaymentMethodSelects();
        updatePeriodViews();
        showToast('Datos de prueba cargados exitosamente.', 'success');
      });
    }

    if (DOM.btnClearAllData) {
      DOM.btnClearAllData.addEventListener('click', function () {
        Store.clearAllData();
        updateSupplierSelects();
        updateTypeSelects();
        updatePaymentMethodSelects();
        updatePeriodViews();
        showToast('Base de datos vaciada. Sistema limpio para exposición.', 'info');
      });
    }

    // Salto Directo a Periodo (Mes y Año sin exceso de clics)
    if (DOM.applyPeriodJumpBtn) {
      DOM.applyPeriodJumpBtn.addEventListener('click', function () {
        const m = parseInt(DOM.jumpMonthSelect.value, 10);
        const y = parseInt(DOM.jumpYearInput.value, 10);
        if (!isNaN(m) && !isNaN(y)) {
          activePeriodMonth = m;
          activePeriodYear = y;
          updatePeriodViews();
          showToast(`Visualizando periodo: ${getActivePeriodLabel()}`, 'info');
        }
      });
    }

    if (DOM.jumpCurrentMonthBtn) {
      DOM.jumpCurrentMonthBtn.addEventListener('click', function () {
        activePeriodYear = 2026;
        activePeriodMonth = 9; // Octubre 2026
        updatePeriodViews();
        showToast(`Periodo reestablecido a: ${getActivePeriodLabel()}`, 'info');
      });
    }

    // Alerta de deudas pendientes en Asistente -> Botón Ver Deudas Anteriores
    if (DOM.btnGoToOverduePeriod) {
      DOM.btnGoToOverduePeriod.addEventListener('click', function () {
        const expenses = Store.getExpenses();
        const periodKey = getActivePeriodKey();
        const overdue = expenses.filter(e => e.status === 'pendiente' && e.dueDate && e.dueDate < `${periodKey}-01`);
        if (overdue.length > 0) {
          const sorted = [...overdue].sort((a, b) => b.dueDate.localeCompare(a.dueDate));
          const parts = sorted[0].dueDate.split('-');
          activePeriodYear = parseInt(parts[0], 10);
          activePeriodMonth = parseInt(parts[1], 10) - 1;
        } else {
          changePeriod(-1);
        }
        updatePeriodViews();
        showToast(`Cambiado al periodo con deudas vencidas: ${getActivePeriodLabel()}`, 'info');
      });
    }

    // Modal: Métodos de Pago Habilitados (Gerente)
    if (DOM.openPaymentMethodsModalBtn) {
      DOM.openPaymentMethodsModalBtn.addEventListener('click', openPaymentMethodsModal);
    }
    if (DOM.closePaymentMethodsModalBtn) {
      DOM.closePaymentMethodsModalBtn.addEventListener('click', closePaymentMethodsModal);
    }
    if (DOM.closePaymentMethodsFooterBtn) {
      DOM.closePaymentMethodsFooterBtn.addEventListener('click', closePaymentMethodsModal);
    }

    if (DOM.newPaymentMethodForm) {
      DOM.newPaymentMethodForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = DOM.newPaymentMethodNameInput.value.trim();
        if (!name) return;
        Store.addPaymentMethod(name);
        DOM.newPaymentMethodNameInput.value = '';
        renderPaymentMethods();
        updatePaymentMethodSelects();
        showToast(`Método de pago "${name}" agregado exitosamente.`, 'success');
      });
    }

    // Modal: Registrar Cuenta o Tarjeta Bancaria (Gerente)
    if (DOM.openNewAccountModalBtn) {
      DOM.openNewAccountModalBtn.addEventListener('click', openNewAccountModal);
    }
    if (DOM.closeNewAccountModalBtn) {
      DOM.closeNewAccountModalBtn.addEventListener('click', closeNewAccountModal);
    }
    if (DOM.cancelNewAccountModalBtn) {
      DOM.cancelNewAccountModalBtn.addEventListener('click', closeNewAccountModal);
    }

    if (DOM.newAccountForm) {
      DOM.newAccountForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const bank = DOM.accountBankInput.value.trim();
        const type = DOM.accountTypeSelect.value;
        const holder = DOM.accountHolderInput.value.trim();
        const identifier = DOM.accountIdentifierInput.value.trim();
        const currency = DOM.accountCurrencySelect.value;
        const status = DOM.accountStatusSelect.value;

        if (!bank || !type || !holder || !identifier) {
          alert('Por favor complete todos los datos requeridos de la cuenta.');
          return;
        }

        Store.addAccount({
          bank,
          type,
          holder,
          identifier,
          currency,
          status
        });

        closeNewAccountModal();
        renderManagerAccounts();
        showToast('Cuenta bancaria o tarjeta guardada con éxito.', 'success');
      });
    }

    // Modal: Editar Proveedor
    if (DOM.closeEditSupplierModalBtn) {
      DOM.closeEditSupplierModalBtn.addEventListener('click', closeEditSupplierModal);
    }
    if (DOM.cancelEditSupplierModalBtn) {
      DOM.cancelEditSupplierModalBtn.addEventListener('click', closeEditSupplierModal);
    }

    if (DOM.editSupplierHasYapeCheck) {
      DOM.editSupplierHasYapeCheck.addEventListener('change', function () {
        if (DOM.editSupplierHasYapeCheck.checked) {
          DOM.editSupplierYapeFields.classList.remove('hidden');
        } else {
          DOM.editSupplierYapeFields.classList.add('hidden');
        }
      });
    }

    if (DOM.editSupplierForm) {
      DOM.editSupplierRucInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 11);
      });

      DOM.editSupplierForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = DOM.editSupplierId.value;
        const ruc = DOM.editSupplierRucInput.value.trim();
        const name = DOM.editSupplierNameInput.value.trim();
        const category = DOM.editSupplierCategorySelect.value;
        const contact = DOM.editSupplierContactInput.value.trim();
        const phone = DOM.editSupplierPhoneInput.value.trim();
        const email = DOM.editSupplierEmailInput.value.trim();

        const hasYape = DOM.editSupplierHasYapeCheck.checked;
        const yapePhone = DOM.editSupplierYapePhoneInput.value.trim();
        const yapeHolder = DOM.editSupplierYapeHolderInput.value.trim();

        if (!ruc || !name || !category || !contact || !phone || !email) {
          alert('Por favor complete todos los campos obligatorios del proveedor.');
          return;
        }

        if (!isValidIdentityNumber(ruc)) {
          alert('El RUC / documento de identidad debe contener máximo 11 caracteres numéricos.');
          return;
        }

        if (!isValidPeruPhone(phone)) {
          alert('El teléfono principal debe contener exactamente 9 dígitos numéricos (formato Perú).');
          return;
        }

        if (hasYape && yapePhone && !isValidYapePhone(yapePhone)) {
          alert('El número celular de Yape debe contener 9 dígitos numéricos y comenzar con 9.');
          return;
        }

        Store.updateSupplier({
          id,
          ruc,
          name,
          category,
          contact,
          phone,
          email,
          hasYape,
          yapePhone: hasYape ? yapePhone : '',
          yapeHolder: hasYape ? yapeHolder : ''
        });

        closeEditSupplierModal();
        renderSupplierCatalog();
        updateSupplierSelects();

        const user = Store.getSession();
        if (user && user.role === 'gerente') {
          renderGerenteDashboard();
        } else {
          renderAssistantPayments();
        }
        showToast(`Proveedor "${name}" actualizado con éxito.`, 'success');
      });
    }

    // Modal: Editar Gasto u Obligación (Asistente)
    if (DOM.closeEditExpenseModalBtn) {
      DOM.closeEditExpenseModalBtn.addEventListener('click', closeEditExpenseModal);
    }
    if (DOM.cancelEditExpenseModalBtn) {
      DOM.cancelEditExpenseModalBtn.addEventListener('click', closeEditExpenseModal);
    }

    if (DOM.editExpenseForm) {
      DOM.editExpenseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = DOM.editExpenseId.value;
        const receiptId = DOM.editExpenseReceiptIdInput.value.trim();
        const description = DOM.editExpenseDescInput.value.trim();
        const supplierId = DOM.editExpenseSupplierSelect.value;
        const type = DOM.editExpenseTypeSelect.value;
        const amount = parseFloat(DOM.editExpenseAmountInput.value);
        const dueDate = DOM.editExpenseDueDateInput.value;

        if (!receiptId || !description || !supplierId || !type || isNaN(amount) || !dueDate) {
          alert('Por favor complete todos los campos requeridos del gasto.');
          return;
        }

        const existing = Store.getExpenseById(id);
        const updateData = {
          id,
          receiptId,
          description,
          supplierId,
          type,
          amount,
          dueDate
        };

        if (existing && existing.status === 'realizado') {
          updateData.paymentDate = DOM.editExpensePaymentDateInput.value || existing.paymentDate;
          updateData.paymentMethod = DOM.editExpensePaymentMethodSelect.value || existing.paymentMethod;
          updateData.ref = DOM.editExpenseRefInput.value.trim() || null;
        }

        Store.updateExpense(updateData);
        closeEditExpenseModal();

        const user = Store.getSession();
        if (user && user.role === 'gerente') {
          renderGerenteDashboard();
        } else {
          renderAssistantPayments();
        }
        showToast(`Obligación "${description}" actualizada correctamente.`, 'success');
      });
    }

    // Inicializar sanitizadores de teléfonos de 9 dígitos en tiempo real
    setupPhoneInputSanitizers();

    // Modal: Registrar Pago
    DOM.closePaymentModalBtn.addEventListener('click', closeRecordPaymentModal);
    DOM.cancelPaymentModalBtn.addEventListener('click', closeRecordPaymentModal);
    DOM.paymentMethodSelect.addEventListener('change', handlePaymentMethodChange);
    DOM.cashReceivedInput.addEventListener('input', handleCashReceivedChange);

    // Carga de foto de comprobante de pago
    DOM.paymentReceiptPhotoInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          temporaryUploadedPaymentPhoto = evt.target.result;
          DOM.paymentReceiptPreviewImg.src = temporaryUploadedPaymentPhoto;
          DOM.paymentReceiptPreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    DOM.recordPaymentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const expenseId = DOM.paymentExpenseId.value;
      const paymentDate = DOM.paymentDateInput.value;
      const paymentMethod = DOM.paymentMethodSelect.value;
      const ref = DOM.paymentRefInput.value.trim();

      if (!paymentDate || !paymentMethod) {
        alert('Por favor complete la fecha y el método de pago.');
        return;
      }

      Store.markExpenseAsPaid(expenseId, paymentDate, paymentMethod, ref, temporaryUploadedPaymentPhoto);
      closeRecordPaymentModal();

      const user = Store.getSession();
      if (user && user.role === 'gerente') {
        renderGerenteDashboard();
      } else {
        renderAssistantPayments();
      }

      showToast('Pago registrado exitosamente y archivado en la base de datos local.', 'success');
    });

    // Modal: Nuevo Gasto
    DOM.openNewExpenseModalBtn.addEventListener('click', openNewExpenseModal);
    DOM.closeExpenseModalBtn.addEventListener('click', closeNewExpenseModal);
    DOM.cancelExpenseModalBtn.addEventListener('click', closeNewExpenseModal);

    // Carga de foto de titularidad / DNI
    DOM.expenseTitularProofInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          temporaryUploadedTitularPhoto = evt.target.result;
          DOM.expenseTitularPreviewImg.src = temporaryUploadedTitularPhoto;
          DOM.expenseTitularPreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    DOM.newExpenseForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const receiptId = DOM.expenseReceiptIdInput.value.trim();
      const description = DOM.expenseDescInput.value.trim();
      const supplierId = DOM.expenseSupplierSelect.value;
      const type = DOM.expenseTypeSelect.value;
      const amount = parseFloat(DOM.expenseAmountInput.value);
      const dueDate = DOM.expenseDueDateInput.value;

      if (!receiptId || !description || !supplierId || !type || isNaN(amount) || !dueDate) {
        alert('Por favor complete todos los campos obligatorios del gasto.');
        return;
      }

      Store.addExpense({
        receiptId,
        description,
        supplierId,
        type,
        amount,
        dueDate,
        titularProofPhoto: temporaryUploadedTitularPhoto || SAMPLE_DNI_SVG
      });

      closeNewExpenseModal();
      renderAssistantPayments();
      showToast('Obligación registrada y guardada en la base de datos local.', 'success');
    });

    // Modal: Nuevo Proveedor (Gerente)
    DOM.openGerenteNewSupplierModalBtn.addEventListener('click', openNewSupplierModal);
    DOM.closeSupplierModalBtn.addEventListener('click', closeNewSupplierModal);
    DOM.cancelSupplierModalBtn.addEventListener('click', closeNewSupplierModal);

    DOM.supplierHasYapeCheck.addEventListener('change', function () {
      if (DOM.supplierHasYapeCheck.checked) {
        DOM.supplierYapeFields.classList.remove('hidden');
      } else {
        DOM.supplierYapeFields.classList.add('hidden');
      }
    });

    DOM.supplierRucInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 11);
    });

    DOM.newSupplierForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const ruc = DOM.supplierRucInput.value.trim();
      const name = DOM.supplierNameInput.value.trim();
      const category = DOM.supplierCategorySelect.value;
      const contact = DOM.supplierContactInput.value.trim();
      const phone = DOM.supplierPhoneInput.value.trim();
      const email = DOM.supplierEmailInput.value.trim();

      const hasYape = DOM.supplierHasYapeCheck.checked;
      const yapePhone = DOM.supplierYapePhoneInput.value.trim();
      const yapeHolder = DOM.supplierYapeHolderInput.value.trim();

      if (!ruc || !name || !category || !contact || !phone || !email) {
        alert('Por favor complete todos los campos obligatorios del proveedor.');
        return;
      }

      if (!isValidIdentityNumber(ruc)) {
        alert('El RUC / documento de identidad debe contener máximo 11 caracteres numéricos.');
        return;
      }

      if (!isValidPeruPhone(phone)) {
        alert('El teléfono principal debe contener exactamente 9 dígitos numéricos (formato Perú).');
        return;
      }

      if (hasYape && yapePhone && !isValidYapePhone(yapePhone)) {
        alert('El número celular de Yape debe contener 9 dígitos numéricos y comenzar con 9.');
        return;
      }

      Store.addSupplier({
        ruc,
        name,
        category,
        contact,
        phone,
        email,
        hasYape,
        yapePhone: hasYape ? yapePhone : '',
        yapeHolder: hasYape ? yapeHolder : ''
      });

      closeNewSupplierModal();
      updateSupplierSelects();
      renderGerenteDashboard();
      showToast('Proveedor guardado con éxito en el catálogo local.', 'success');
    });

    // Modal: Nuevo Tipo de Gasto (Gerente)
    DOM.openNewExpenseTypeModalBtn.addEventListener('click', openNewExpenseTypeModal);
    DOM.closeExpenseTypeModalBtn.addEventListener('click', closeNewExpenseTypeModal);
    DOM.cancelExpenseTypeModalBtn.addEventListener('click', closeNewExpenseTypeModal);

    DOM.newExpenseTypeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const typeName = DOM.expenseTypeNameInput.value.trim();
      if (!typeName) return;

      Store.addExpenseType(typeName);
      closeNewExpenseTypeModal();
      updateTypeSelects();
      showToast(`Tipo de gasto "${typeName}" guardado en la base de datos local.`, 'success');
    });

    // Modal: Catálogo de Proveedores
    DOM.openSupplierListModalBtn.addEventListener('click', openSupplierListModal);
    DOM.closeSupplierListModalBtn.addEventListener('click', closeSupplierListModal);
    DOM.closeSupplierListBtn.addEventListener('click', closeSupplierListModal);

    // Modal: Visualizador de Evidencias
    DOM.closeImageViewerBtn.addEventListener('click', closeImageViewer);
    DOM.closeImageViewerFooterBtn.addEventListener('click', closeImageViewer);
  }

  // ==========================================================================
  // Inicialización
  // ==========================================================================

  async function init() {
    Store.init();
    syncController = createSyncController();
    await syncController.start();
    attachEvents();

    const activeSession = Store.getSession();
    if (activeSession) {
      setAuthenticatedView(activeSession);
    } else {
      setUnauthenticatedView();
    }

    window.Store = Store;
    window.updatePeriodViews = updatePeriodViews;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
