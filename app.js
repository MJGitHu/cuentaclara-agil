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
    'Mantenimiento'
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
    // Gasto con céntimos (S/ 500.35) para demostrar la Ley de Redondeo en Efectivo de Perú
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
      id: 'exp-oct-6',
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

    // --- Noviembre 2026 (Próximo Mes) ---
    {
      id: 'exp-nov-1',
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
      id: 'exp-nov-2',
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

  const STORAGE_KEYS = {
    SUPPLIERS: 'cuentaclara_suppliers_v2',
    EXPENSES: 'cuentaclara_expenses_v2',
    TYPES: 'cuentaclara_types_v2',
    SESSION: 'cuentaclara_session_v2'
  };

  // ==========================================================================
  // Almacenamiento Local (Store)
  // ==========================================================================

  const Store = {
    init() {
      if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
        localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(DEFAULT_SUPPLIERS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.TYPES)) {
        localStorage.setItem(STORAGE_KEYS.TYPES, JSON.stringify(DEFAULT_EXPENSE_TYPES));
      }
    },

    getSuppliers() {
      const data = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      return data ? JSON.parse(data) : [];
    },

    saveSuppliers(suppliers) {
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
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

    getExpenseTypes() {
      const data = localStorage.getItem(STORAGE_KEYS.TYPES);
      return data ? JSON.parse(data) : DEFAULT_EXPENSE_TYPES;
    },

    addExpenseType(typeName) {
      const types = this.getExpenseTypes();
      const cleanName = typeName.trim();
      if (!types.includes(cleanName)) {
        types.push(cleanName);
        localStorage.setItem(STORAGE_KEYS.TYPES, JSON.stringify(types));
      }
      return types;
    },

    getExpenses() {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    },

    saveExpenses(expenses) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
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
    }
  };

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
    logoutBtn: document.getElementById('logoutBtn'),

    // Navegación temporal
    periodNavigatorContainer: document.getElementById('periodNavigatorContainer'),
    prevMonthBtn: document.getElementById('prevMonthBtn'),
    nextMonthBtn: document.getElementById('nextMonthBtn'),
    currentPeriodLabel: document.getElementById('currentPeriodLabel'),

    // Login
    loginView: document.getElementById('loginView'),
    loginForm: document.getElementById('loginForm'),
    usernameInput: document.getElementById('usernameInput'),
    passwordInput: document.getElementById('passwordInput'),
    loginAlert: document.getElementById('loginAlert'),
    demoGerenteBtn: document.getElementById('demoGerenteBtn'),
    demoAsistenteBtn: document.getElementById('demoAsistenteBtn'),

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

    // Acciones de Gerente
    openGerenteNewSupplierModalBtn: document.getElementById('openGerenteNewSupplierModalBtn'),
    openNewExpenseTypeModalBtn: document.getElementById('openNewExpenseTypeModalBtn'),
    openSupplierListModalBtn: document.getElementById('openSupplierListModalBtn'),

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

        const proofCell = isPaid
          ? `<button type="button" class="btn-link view-receipt-btn" data-id="${exp.id}">Ver Voucher</button>`
          : `<button type="button" class="btn-link view-titular-btn" data-id="${exp.id}">Ver Titular / DNI</button>`;

        tr.innerHTML = `
          <td><span class="receipt-id-tag">${escapeHtml(exp.receiptId || 'S/N')}</span></td>
          <td><strong>${escapeHtml(exp.description)}</strong></td>
          <td>${escapeHtml(supplierName)}</td>
          <td><span class="badge badge-type">${escapeHtml(exp.type)}</span></td>
          <td>${formatDate(exp.dueDate)}</td>
          <td class="amount-col">${formatCurrency(exp.amount)}</td>
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
  }

  function renderAssistantPayments() {
    const expenses = Store.getExpenses();
    const suppliers = Store.getSuppliers();
    const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

    const periodKey = getActivePeriodKey(); // Ej. '2026-10'

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

        const titularCell = `
          <button type="button" class="btn-link view-titular-btn" data-id="${exp.id}">Ver Titular / DNI</button>
        `;

        const receiptCell = isPaid
          ? `<button type="button" class="btn-link view-receipt-btn" data-id="${exp.id}">Ver Voucher</button>`
          : '<span class="form-hint">Pendiente</span>';

        const actionCell = isPaid
          ? `<span style="color: var(--color-text-muted); font-size: 13px;">Pagado el ${formatDate(exp.paymentDate)}</span>`
          : `<button type="button" class="btn btn-primary btn-sm record-btn" data-id="${exp.id}">Registrar Pago</button>`;

        tr.innerHTML = `
          <td><span class="receipt-id-tag">${escapeHtml(exp.receiptId || 'S/N')}</span></td>
          <td><strong>${escapeHtml(exp.description)}</strong></td>
          <td>${escapeHtml(supplierName)}</td>
          <td><span class="badge badge-type">${escapeHtml(exp.type)}</span></td>
          <td>${formatDate(exp.dueDate)}</td>
          <td class="amount-col">${formatCurrency(exp.amount)}</td>
          <td><span class="badge ${isPaid ? 'badge-paid' : 'badge-pending'}">${isPaid ? 'Realizado' : 'Pendiente'}</span></td>
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
        ? `<span class="badge badge-paid">Sí</span> (${escapeHtml(s.yapePhone)} - ${escapeHtml(s.yapeHolder)})`
        : '<span class="badge badge-type">No</span>';

      tr.innerHTML = `
        <td><strong>${escapeHtml(s.ruc)}</strong></td>
        <td>${escapeHtml(s.name)}</td>
        <td><span class="badge badge-type">${escapeHtml(s.category)}</span></td>
        <td>${escapeHtml(s.contact)} (${escapeHtml(s.phone)})</td>
        <td>${yapeInfo}</td>
      `;
      DOM.supplierCatalogTableBody.appendChild(tr);
    });
  }

  // ==========================================================================
  // Actualización de Vistas según Periodo
  // ==========================================================================

  function updatePeriodViews() {
    DOM.currentPeriodLabel.textContent = getActivePeriodLabel();

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
      DOM.filterStatus.value = 'pendiente';
      DOM.filterSort.value = 'due_asc';
      renderAssistantPayments();
    });

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

  function init() {
    Store.init();
    attachEvents();

    const activeSession = Store.getSession();
    if (activeSession) {
      setAuthenticatedView(activeSession);
    } else {
      setUnauthenticatedView();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
