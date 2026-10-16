/**
 * CuentaClara - Logica de Aplicacion (MVP)
 * Arquitectura modular para gestion de autenticacion, datos y vistas
 */

(function () {
  'use strict';

  // ==========================================================================
  // Datos Semilla Iniciales
  // ==========================================================================

  const DEFAULT_SUPPLIERS = [
    {
      id: 'sup-1',
      ruc: '20100128218',
      name: 'Enel Distribución Perú S.A.A.',
      category: 'Servicio',
      contact: 'Atención Corporativa',
      phone: '01-517-1717',
      email: 'corporativo@enel.pe'
    },
    {
      id: 'sup-2',
      ruc: '20100152356',
      name: 'Sedapal S.A.',
      category: 'Servicio',
      contact: 'Mesa de Empresas',
      phone: '01-317-8000',
      email: 'empresas@sedapal.com.pe'
    },
    {
      id: 'sup-3',
      ruc: '20131312955',
      name: 'SUNAT',
      category: 'Impuesto',
      contact: 'Orientación Tributaria',
      phone: '01-315-0730',
      email: 'consultas@sunat.gob.pe'
    },
    {
      id: 'sup-4',
      ruc: '20456789123',
      name: 'Distribuidora Logística Norte S.A.C.',
      category: 'Proveedor',
      contact: 'Juan Pérez Ramos',
      phone: '987-654-321',
      email: 'ventas@logisticanorte.pe'
    },
    {
      id: 'sup-5',
      ruc: '20334455667',
      name: 'Inmobiliaria Central Lima S.A.',
      category: 'Proveedor',
      contact: 'Rosa Vargas Castro',
      phone: '998-112-233',
      email: 'administracion@inmolicentral.pe'
    },
    {
      id: 'sup-6',
      ruc: '20100047218',
      name: 'Banco de Crédito del Perú (BCP)',
      category: 'Préstamo',
      contact: 'Ejecutivo de Negocios Pyme',
      phone: '01-311-9898',
      email: 'pyme@bcp.com.pe'
    }
  ];

  const DEFAULT_EXPENSES = [
    {
      id: 'exp-1',
      description: 'Recibo de Energía Eléctrica - Local Principal',
      supplierId: 'sup-1',
      amount: 620.00,
      dueDate: '2026-10-18',
      type: 'servicio',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null
    },
    {
      id: 'exp-2',
      description: 'Impuesto SUNAT - IGV y Renta (Octubre 2026)',
      supplierId: 'sup-3',
      amount: 1850.00,
      dueDate: '2026-10-20',
      type: 'impuesto',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null
    },
    {
      id: 'exp-3',
      description: 'Servicio de Agua Potable y Alcantarillado',
      supplierId: 'sup-2',
      amount: 210.00,
      dueDate: '2026-10-22',
      type: 'servicio',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null
    },
    {
      id: 'exp-4',
      description: 'Cuota Préstamo de Capital de Trabajo #08',
      supplierId: 'sup-6',
      amount: 3400.00,
      dueDate: '2026-10-25',
      type: 'prestamo',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null
    },
    {
      id: 'exp-5',
      description: 'Factura F004-9842 Mercadería para Stock',
      supplierId: 'sup-4',
      amount: 4200.00,
      dueDate: '2026-10-28',
      type: 'proveedor',
      status: 'pendiente',
      paymentDate: null,
      paymentMethod: null,
      ref: null
    },
    {
      id: 'exp-6',
      description: 'Alquiler Mensual de Inmueble Comercial',
      supplierId: 'sup-5',
      amount: 2800.00,
      dueDate: '2026-10-05',
      type: 'proveedor',
      status: 'realizado',
      paymentDate: '2026-10-04',
      paymentMethod: 'Transferencia Bancaria',
      ref: 'TR-849201'
    },
    {
      id: 'exp-7',
      description: 'Mantenimiento Preventivo de Equipos y Servidores',
      supplierId: 'sup-4',
      amount: 750.00,
      dueDate: '2026-10-09',
      type: 'servicio',
      status: 'realizado',
      paymentDate: '2026-10-09',
      paymentMethod: 'Transferencia Bancaria',
      ref: 'TR-849310'
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
    SUPPLIERS: 'cuentaclara_suppliers_v1',
    EXPENSES: 'cuentaclara_expenses_v1',
    SESSION: 'cuentaclara_session_v1'
  };

  // ==========================================================================
  // Capa de Almacenamiento Local
  // ==========================================================================

  const Store = {
    init() {
      if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
        localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(DEFAULT_SUPPLIERS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
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
        ...expenseData
      };
      expenses.push(newExpense);
      this.saveExpenses(expenses);
      return newExpense;
    },

    markExpenseAsPaid(expenseId, paymentDate, paymentMethod, ref) {
      const expenses = this.getExpenses();
      const index = expenses.findIndex(e => e.id === expenseId);
      if (index !== -1) {
        expenses[index].status = 'realizado';
        expenses[index].paymentDate = paymentDate;
        expenses[index].paymentMethod = paymentMethod;
        expenses[index].ref = ref || null;
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
  // Formateadores y Utilidades
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

  function getMonthYearLabel(date = new Date()) {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
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

  // ==========================================================================
  // Controlador de Vistas y Elementos DOM
  // ==========================================================================

  const DOM = {
    // Header
    appHeader: document.getElementById('appHeader'),
    assistantNav: document.getElementById('assistantNav'),
    tabPaymentsBtn: document.getElementById('tabPaymentsBtn'),
    tabSuppliersBtn: document.getElementById('tabSuppliersBtn'),
    userHeaderActions: document.getElementById('userHeaderActions'),
    userBadgeInfo: document.getElementById('userBadgeInfo'),
    logoutBtn: document.getElementById('logoutBtn'),

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
    gerenteMonthTitle: document.getElementById('gerenteMonthTitle'),
    kpiManagerPending: document.getElementById('kpiManagerPending'),
    kpiManagerPendingCount: document.getElementById('kpiManagerPendingCount'),
    kpiManagerPaid: document.getElementById('kpiManagerPaid'),
    kpiManagerPaidCount: document.getElementById('kpiManagerPaidCount'),
    kpiManagerNextDate: document.getElementById('kpiManagerNextDate'),
    kpiManagerNextDesc: document.getElementById('kpiManagerNextDesc'),
    managerPendingTableBody: document.getElementById('managerPendingTableBody'),
    managerPendingEmpty: document.getElementById('managerPendingEmpty'),
    managerPaidTableBody: document.getElementById('managerPaidTableBody'),
    managerPaidEmpty: document.getElementById('managerPaidEmpty'),

    // Asistente View
    asistenteView: document.getElementById('asistenteView'),
    assistantPaymentsSection: document.getElementById('assistantPaymentsSection'),
    assistantSuppliersSection: document.getElementById('assistantSuppliersSection'),
    openNewExpenseModalBtn: document.getElementById('openNewExpenseModalBtn'),
    openNewSupplierModalBtn: document.getElementById('openNewSupplierModalBtn'),
    filterSupplier: document.getElementById('filterSupplier'),
    filterType: document.getElementById('filterType'),
    filterStatus: document.getElementById('filterStatus'),
    filterSort: document.getElementById('filterSort'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    assistantPaymentsTableBody: document.getElementById('assistantPaymentsTableBody'),
    assistantPaymentsEmpty: document.getElementById('assistantPaymentsEmpty'),
    assistantSuppliersTableBody: document.getElementById('assistantSuppliersTableBody'),
    assistantSuppliersEmpty: document.getElementById('assistantSuppliersEmpty'),

    // Modal: Registrar Pago
    recordPaymentModal: document.getElementById('recordPaymentModal'),
    recordPaymentForm: document.getElementById('recordPaymentForm'),
    paymentExpenseId: document.getElementById('paymentExpenseId'),
    modalPaymentExpenseDesc: document.getElementById('modalPaymentExpenseDesc'),
    modalPaymentExpenseSupplier: document.getElementById('modalPaymentExpenseSupplier'),
    modalPaymentExpenseAmount: document.getElementById('modalPaymentExpenseAmount'),
    paymentDateInput: document.getElementById('paymentDateInput'),
    paymentMethodSelect: document.getElementById('paymentMethodSelect'),
    paymentRefInput: document.getElementById('paymentRefInput'),
    closePaymentModalBtn: document.getElementById('closePaymentModalBtn'),
    cancelPaymentModalBtn: document.getElementById('cancelPaymentModalBtn'),

    // Modal: Nuevo Gasto
    newExpenseModal: document.getElementById('newExpenseModal'),
    newExpenseForm: document.getElementById('newExpenseForm'),
    expenseDescInput: document.getElementById('expenseDescInput'),
    expenseSupplierSelect: document.getElementById('expenseSupplierSelect'),
    expenseTypeSelect: document.getElementById('expenseTypeSelect'),
    expenseAmountInput: document.getElementById('expenseAmountInput'),
    expenseDueDateInput: document.getElementById('expenseDueDateInput'),
    closeExpenseModalBtn: document.getElementById('closeExpenseModalBtn'),
    cancelExpenseModalBtn: document.getElementById('cancelExpenseModalBtn'),

    // Modal: Nuevo Proveedor
    newSupplierModal: document.getElementById('newSupplierModal'),
    newSupplierForm: document.getElementById('newSupplierForm'),
    supplierRucInput: document.getElementById('supplierRucInput'),
    supplierNameInput: document.getElementById('supplierNameInput'),
    supplierCategorySelect: document.getElementById('supplierCategorySelect'),
    supplierContactInput: document.getElementById('supplierContactInput'),
    supplierPhoneInput: document.getElementById('supplierPhoneInput'),
    supplierEmailInput: document.getElementById('supplierEmailInput'),
    closeSupplierModalBtn: document.getElementById('closeSupplierModalBtn'),
    cancelSupplierModalBtn: document.getElementById('cancelSupplierModalBtn')
  };

  // ==========================================================================
  // Renderizado: Gerente
  // ==========================================================================

  function renderGerenteDashboard() {
    const expenses = Store.getExpenses();
    const suppliers = Store.getSuppliers();
    const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

    // Asumimos el mes representativo actual (Octubre 2026)
    const currentMonthPrefix = '2026-10';
    DOM.gerenteMonthTitle.textContent = `Resumen de Pagos - ${getMonthYearLabel(new Date('2026-10-15'))}`;

    // Filtrar por mes actual
    const currentMonthExpenses = expenses.filter(e => {
      const dateToCheck = e.dueDate || e.paymentDate;
      return dateToCheck && dateToCheck.startsWith(currentMonthPrefix);
    });

    const pendingExpenses = currentMonthExpenses.filter(e => e.status === 'pendiente');
    const paidExpenses = currentMonthExpenses.filter(e => e.status === 'realizado');

    // Totales
    const totalPending = pendingExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const totalPaid = paidExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    DOM.kpiManagerPending.textContent = formatCurrency(totalPending);
    DOM.kpiManagerPendingCount.textContent = `${pendingExpenses.length} pago${pendingExpenses.length === 1 ? '' : 's'} pendiente${pendingExpenses.length === 1 ? '' : 's'}`;

    DOM.kpiManagerPaid.textContent = formatCurrency(totalPaid);
    DOM.kpiManagerPaidCount.textContent = `${paidExpenses.length} pago${paidExpenses.length === 1 ? '' : 's'} realizado${paidExpenses.length === 1 ? '' : 's'}`;

    // Proximo vencimiento
    if (pendingExpenses.length > 0) {
      const sortedPending = [...pendingExpenses].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      const nextExp = sortedPending[0];
      DOM.kpiManagerNextDate.textContent = formatDate(nextExp.dueDate);
      DOM.kpiManagerNextDesc.textContent = `${nextExp.description} (${formatCurrency(nextExp.amount)})`;
    } else {
      DOM.kpiManagerNextDate.textContent = 'Sin pendientes';
      DOM.kpiManagerNextDesc.textContent = 'Todas las obligaciones del mes están al día.';
    }

    // Tabla de Pendientes
    DOM.managerPendingTableBody.innerHTML = '';
    if (pendingExpenses.length === 0) {
      DOM.managerPendingEmpty.classList.remove('hidden');
    } else {
      DOM.managerPendingEmpty.classList.add('hidden');
      pendingExpenses.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      pendingExpenses.forEach(exp => {
        const tr = document.createElement('tr');
        const supplierName = supplierMap.get(exp.supplierId) || 'No especificado';
        tr.innerHTML = `
          <td><strong>${escapeHtml(exp.description)}</strong></td>
          <td>${escapeHtml(supplierName)}</td>
          <td><span class="badge badge-type">${escapeHtml(exp.type)}</span></td>
          <td>${formatDate(exp.dueDate)}</td>
          <td class="amount-col">${formatCurrency(exp.amount)}</td>
          <td><span class="badge badge-pending">Pendiente</span></td>
        `;
        DOM.managerPendingTableBody.appendChild(tr);
      });
    }

    // Tabla de Realizados
    DOM.managerPaidTableBody.innerHTML = '';
    if (paidExpenses.length === 0) {
      DOM.managerPaidEmpty.classList.remove('hidden');
    } else {
      DOM.managerPaidEmpty.classList.add('hidden');
      paidExpenses.sort((a, b) => (b.paymentDate || '').localeCompare(a.paymentDate || ''));
      paidExpenses.forEach(exp => {
        const tr = document.createElement('tr');
        const supplierName = supplierMap.get(exp.supplierId) || 'No especificado';
        tr.innerHTML = `
          <td><strong>${escapeHtml(exp.description)}</strong></td>
          <td>${escapeHtml(supplierName)}</td>
          <td><span class="badge badge-type">${escapeHtml(exp.type)}</span></td>
          <td>${formatDate(exp.paymentDate)}</td>
          <td>${escapeHtml(exp.paymentMethod || 'No especificado')} ${exp.ref ? `<span class="form-hint">(${escapeHtml(exp.ref)})</span>` : ''}</td>
          <td class="amount-col">${formatCurrency(exp.amount)}</td>
          <td><span class="badge badge-paid">Realizado</span></td>
        `;
        DOM.managerPaidTableBody.appendChild(tr);
      });
    }
  }

  // ==========================================================================
  // Renderizado: Asistente
  // ==========================================================================

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

    // Selector en Modal Nuevo Gasto
    DOM.expenseSupplierSelect.innerHTML = '<option value="">Seleccione un proveedor</option>';
    suppliers.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} (${s.category})`;
      DOM.expenseSupplierSelect.appendChild(opt);
    });
  }

  function renderAssistantPayments() {
    const expenses = Store.getExpenses();
    const suppliers = Store.getSuppliers();
    const supplierMap = new Map(suppliers.map(s => [s.id, s.name]));

    const supplierFilter = DOM.filterSupplier.value;
    const typeFilter = DOM.filterType.value;
    const statusFilter = DOM.filterStatus.value;
    const sortFilter = DOM.filterSort.value;

    let filtered = expenses.filter(exp => {
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

        const paymentDetail = isPaid
          ? `${formatDate(exp.paymentDate)} - ${escapeHtml(exp.paymentMethod || '')}`
          : '<span class="form-hint">Pendiente de abono</span>';

        const actionCell = isPaid
          ? '<span style="color: var(--color-text-muted); font-size: 13px;">Completado</span>'
          : `<button type="button" class="btn btn-primary btn-sm record-btn" data-id="${exp.id}">Registrar Pago</button>`;

        tr.innerHTML = `
          <td><strong>${escapeHtml(exp.description)}</strong></td>
          <td>${escapeHtml(supplierName)}</td>
          <td><span class="badge badge-type">${escapeHtml(exp.type)}</span></td>
          <td>${formatDate(exp.dueDate)}</td>
          <td class="amount-col">${formatCurrency(exp.amount)}</td>
          <td><span class="badge ${isPaid ? 'badge-paid' : 'badge-pending'}">${isPaid ? 'Realizado' : 'Pendiente'}</span></td>
          <td>${paymentDetail}</td>
          <td style="text-align: right;">${actionCell}</td>
        `;
        DOM.assistantPaymentsTableBody.appendChild(tr);
      });

      // Vincular eventos a los botones de Registrar Pago
      DOM.assistantPaymentsTableBody.querySelectorAll('.record-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          openRecordPaymentModal(id);
        });
      });
    }
  }

  function renderAssistantSuppliers() {
    const suppliers = Store.getSuppliers();
    DOM.assistantSuppliersTableBody.innerHTML = '';

    if (suppliers.length === 0) {
      DOM.assistantSuppliersEmpty.classList.remove('hidden');
    } else {
      DOM.assistantSuppliersEmpty.classList.add('hidden');
      suppliers.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(s.ruc)}</strong></td>
          <td>${escapeHtml(s.name)}</td>
          <td><span class="badge badge-type">${escapeHtml(s.category)}</span></td>
          <td>${escapeHtml(s.contact)}</td>
          <td>${escapeHtml(s.phone)}</td>
          <td>${escapeHtml(s.email)}</td>
        `;
        DOM.assistantSuppliersTableBody.appendChild(tr);
      });
    }
  }

  // ==========================================================================
  // Gestion de Modales
  // ==========================================================================

  function openRecordPaymentModal(expenseId) {
    const exp = Store.getExpenseById(expenseId);
    if (!exp) return;

    const supplier = Store.getSupplierById(exp.supplierId);

    DOM.paymentExpenseId.value = exp.id;
    DOM.modalPaymentExpenseDesc.textContent = exp.description;
    DOM.modalPaymentExpenseSupplier.textContent = supplier ? supplier.name : 'No asignado';
    DOM.modalPaymentExpenseAmount.textContent = formatCurrency(exp.amount);

    // Fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    DOM.paymentDateInput.value = today;
    DOM.paymentMethodSelect.value = '';
    DOM.paymentRefInput.value = '';

    DOM.recordPaymentModal.classList.remove('hidden');
  }

  function closeRecordPaymentModal() {
    DOM.recordPaymentModal.classList.add('hidden');
    DOM.recordPaymentForm.reset();
  }

  function openNewExpenseModal() {
    DOM.newExpenseForm.reset();
    updateSupplierSelects();
    DOM.newExpenseModal.classList.remove('hidden');
  }

  function closeNewExpenseModal() {
    DOM.newExpenseModal.classList.add('hidden');
    DOM.newExpenseForm.reset();
  }

  function openNewSupplierModal() {
    DOM.newSupplierForm.reset();
    DOM.newSupplierModal.classList.remove('hidden');
  }

  function closeNewSupplierModal() {
    DOM.newSupplierModal.classList.add('hidden');
    DOM.newSupplierForm.reset();
  }

  // ==========================================================================
  // Manejo de Estados y Sesion
  // ==========================================================================

  function setAuthenticatedView(user) {
    DOM.loginView.classList.add('hidden');
    DOM.userHeaderActions.classList.remove('hidden');
    DOM.userBadgeInfo.innerHTML = `<strong>${escapeHtml(user.fullName)}</strong> (${user.role === 'gerente' ? 'Gerente' : 'Asistente'})`;

    if (user.role === 'gerente') {
      DOM.assistantNav.classList.add('hidden');
      DOM.asistenteView.classList.add('hidden');
      DOM.gerenteView.classList.remove('hidden');
      renderGerenteDashboard();
    } else if (user.role === 'asistente') {
      DOM.gerenteView.classList.add('hidden');
      DOM.assistantNav.classList.remove('hidden');
      DOM.asistenteView.classList.remove('hidden');

      // Activar pestaña Pagos por defecto
      switchAssistantTab('payments');
      updateSupplierSelects();
      renderAssistantPayments();
      renderAssistantSuppliers();
    }
  }

  function setUnauthenticatedView() {
    Store.clearSession();
    DOM.loginAlert.classList.add('hidden');
    DOM.loginForm.reset();

    DOM.loginView.classList.remove('hidden');
    DOM.gerenteView.classList.add('hidden');
    DOM.asistenteView.classList.add('hidden');
    DOM.assistantNav.classList.add('hidden');
    DOM.userHeaderActions.classList.add('hidden');
  }

  function switchAssistantTab(tab) {
    if (tab === 'payments') {
      DOM.tabPaymentsBtn.classList.add('active');
      DOM.tabSuppliersBtn.classList.remove('active');
      DOM.assistantPaymentsSection.classList.remove('hidden');
      DOM.assistantSuppliersSection.classList.add('hidden');
      renderAssistantPayments();
    } else {
      DOM.tabSuppliersBtn.classList.add('active');
      DOM.tabPaymentsBtn.classList.remove('active');
      DOM.assistantSuppliersSection.classList.remove('hidden');
      DOM.assistantPaymentsSection.classList.add('hidden');
      renderAssistantSuppliers();
    }
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

    // Credenciales rapidas de demo
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
    DOM.logoutBtn.addEventListener('click', function () {
      setUnauthenticatedView();
    });

    // Navegacion Asistente
    DOM.tabPaymentsBtn.addEventListener('click', () => switchAssistantTab('payments'));
    DOM.tabSuppliersBtn.addEventListener('click', () => switchAssistantTab('suppliers'));

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

    // Modal Registrar Pago
    DOM.closePaymentModalBtn.addEventListener('click', closeRecordPaymentModal);
    DOM.cancelPaymentModalBtn.addEventListener('click', closeRecordPaymentModal);

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

      Store.markExpenseAsPaid(expenseId, paymentDate, paymentMethod, ref);
      closeRecordPaymentModal();
      renderAssistantPayments();
    });

    // Modal Nuevo Gasto
    DOM.openNewExpenseModalBtn.addEventListener('click', openNewExpenseModal);
    DOM.closeExpenseModalBtn.addEventListener('click', closeNewExpenseModal);
    DOM.cancelExpenseModalBtn.addEventListener('click', closeNewExpenseModal);

    DOM.newExpenseForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const description = DOM.expenseDescInput.value.trim();
      const supplierId = DOM.expenseSupplierSelect.value;
      const type = DOM.expenseTypeSelect.value;
      const amount = parseFloat(DOM.expenseAmountInput.value);
      const dueDate = DOM.expenseDueDateInput.value;

      if (!description || !supplierId || !type || isNaN(amount) || !dueDate) {
        alert('Por favor complete todos los campos obligatorios.');
        return;
      }

      Store.addExpense({
        description,
        supplierId,
        type,
        amount,
        dueDate
      });

      closeNewExpenseModal();
      renderAssistantPayments();
    });

    // Modal Nuevo Proveedor
    DOM.openNewSupplierModalBtn.addEventListener('click', openNewSupplierModal);
    DOM.closeSupplierModalBtn.addEventListener('click', closeNewSupplierModal);
    DOM.cancelSupplierModalBtn.addEventListener('click', closeNewSupplierModal);

    DOM.newSupplierForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const ruc = DOM.supplierRucInput.value.trim();
      const name = DOM.supplierNameInput.value.trim();
      const category = DOM.supplierCategorySelect.value;
      const contact = DOM.supplierContactInput.value.trim();
      const phone = DOM.supplierPhoneInput.value.trim();
      const email = DOM.supplierEmailInput.value.trim();

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
        email
      });

      closeNewSupplierModal();
      updateSupplierSelects();
      renderAssistantSuppliers();
      renderAssistantPayments();
    });
  }

  // ==========================================================================
  // Inicializacion de la Aplicacion
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
