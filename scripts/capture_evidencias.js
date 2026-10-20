const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs', 'evidencias');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 960 });

  console.log('Navegando a http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Login inicial
  console.log('Capturando 01_login_inicial.png');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_login_inicial.png'), fullPage: false });

  // 2. Error de credenciales
  console.log('Capturando 02_login_error_credenciales.png');
  await page.type('#usernameInput', 'usuario_invalido');
  await page.type('#passwordInput', 'clave_invalida');
  await page.click('button[type="submit"]');
  await sleep(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_login_error_credenciales.png'), fullPage: false });

  // 3. Login Gerente
  console.log('Capturando 03_gerente_dashboard_octubre.png');
  await page.evaluate(() => {
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
  });
  await page.type('#usernameInput', 'gerente');
  await page.type('#passwordInput', 'gerente123');
  await page.click('button[type="submit"]');
  await sleep(600);
  await page.evaluate(() => {
    Store.loadDemoData();
    updatePeriodViews();
  });
  await sleep(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_gerente_dashboard_octubre.png'), fullPage: true });

  // 4. Mes Anterior: Septiembre 2026
  console.log('Capturando 04_gerente_mes_anterior_septiembre.png');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.getElementById('prevMonthBtn').click();
  });
  await sleep(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_gerente_mes_anterior_septiembre.png'), fullPage: true });

  // 5. Próximo Mes: Noviembre 2026
  console.log('Capturando 05_gerente_proximo_mes_noviembre.png');
  await page.evaluate(() => {
    document.getElementById('nextMonthBtn').click(); // vuelve a octubre
  });
  await sleep(300);
  await page.evaluate(() => {
    document.getElementById('nextMonthBtn').click(); // va a noviembre
  });
  await sleep(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_gerente_proximo_mes_noviembre.png'), fullPage: true });

  // Volver a Octubre 2026
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.getElementById('prevMonthBtn').click();
  });
  await sleep(400);

  // 6. Modal Ver Titular / DNI
  console.log('Capturando 06_modal_ver_titular_dni.png');
  const viewTitularBtns = await page.$$('.view-titular-btn');
  if (viewTitularBtns.length > 0) {
    await viewTitularBtns[0].click();
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_modal_ver_titular_dni.png'), fullPage: false });
    await page.evaluate(() => document.getElementById('closeImageViewerBtn').click());
    await sleep(300);
  }

  // 7. Cuentas confidenciales Gerente (Tabla Dinámica de Cuentas y Tarjetas)
  console.log('Capturando 07_cuentas_confidenciales_gerente.png');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await sleep(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_cuentas_confidenciales_gerente.png'), fullPage: false });

  // 7b. Modal Nueva Cuenta / Tarjeta Bancaria (Observación Gerente)
  console.log('Capturando 07b_modal_nueva_cuenta_tarjeta.png');
  await page.evaluate(() => {
    document.getElementById('openNewAccountModalBtn').click();
  });
  await sleep(400);
  await page.type('#accountBankInput', 'Scotiabank Perú');
  await page.select('#accountTypeSelect', 'Cuenta Corriente');
  await page.evaluate(() => {
    document.getElementById('accountIdentifierInput').value = 'CTA: 000-4829104-0-99';
  });
  await sleep(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07b_modal_nueva_cuenta_tarjeta.png'), fullPage: false });
  await page.evaluate(() => document.getElementById('cancelNewAccountModalBtn').click());
  await sleep(300);

  // Volver arriba
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);

  // 8. Modal Nuevo Proveedor con Validación Estricta de 9 Dígitos (Observación Perú)
  console.log('Capturando 08_modal_nuevo_proveedor_yape.png');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.getElementById('openGerenteNewSupplierModalBtn').click();
  });
  await sleep(400);
  await page.type('#supplierRucInput', '20778899001');
  await page.type('#supplierNameInput', 'Tecnología & Servicios Digitales S.A.C.');
  await page.select('#supplierCategorySelect', 'Servicio');
  await page.type('#supplierContactInput', 'Mario Gómez');
  await page.type('#supplierPhoneInput', '998877665'); // 9 dígitos numéricos
  await page.type('#supplierEmailInput', 'ventas@tecnodigital.pe');
  await page.click('#supplierHasYapeCheck');
  await sleep(200);
  await page.type('#supplierYapePhoneInput', '998877665'); // 9 dígitos numéricos
  await page.type('#supplierYapeHolderInput', 'Mario Gómez / TecnoDigital');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_modal_nuevo_proveedor_yape.png'), fullPage: false });
  await page.evaluate(() => document.getElementById('closeSupplierModalBtn').click());
  await sleep(300);

  // 9. Modal Nuevo Tipo de Gasto
  console.log('Capturando 09_modal_nuevo_tipo_gasto.png');
  await page.evaluate(() => document.getElementById('openNewExpenseTypeModalBtn').click());
  await sleep(400);
  await page.type('#expenseTypeNameInput', 'Seguros Empresariales');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_modal_nuevo_tipo_gasto.png'), fullPage: false });
  await page.evaluate(() => document.getElementById('closeExpenseTypeModalBtn').click());
  await sleep(300);

  // 9b. Modal Gestión de Métodos de Pago (Observación Gerente)
  console.log('Capturando 09b_modal_metodos_pago.png');
  await page.evaluate(() => document.getElementById('openPaymentMethodsModalBtn').click());
  await sleep(400);
  await page.type('#newPaymentMethodNameInput', 'Plin (Billetera Digital BBVA/Interbank)');
  await sleep(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09b_modal_metodos_pago.png'), fullPage: false });
  await page.evaluate(() => document.getElementById('closePaymentMethodsModalBtn').click());
  await sleep(300);

  // 10. Catálogo de Proveedores con Botón Editar
  console.log('Capturando 10_catalogo_proveedores.png');
  await page.evaluate(() => document.getElementById('openSupplierListModalBtn').click());
  await sleep(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_catalogo_proveedores.png'), fullPage: false });

  // 10b. Modal Editar Proveedor (Observación Edición)
  console.log('Capturando 10b_modal_editar_proveedor.png');
  const editSupBtns = await page.$$('.edit-supplier-btn');
  if (editSupBtns.length > 0) {
    await editSupBtns[0].click();
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '10b_modal_editar_proveedor.png'), fullPage: false });
    await page.evaluate(() => document.getElementById('closeEditSupplierModalBtn').click());
    await sleep(300);
  }
  await page.evaluate(() => document.getElementById('closeSupplierListModalBtn').click());
  await sleep(300);

  // Cerrar sesión Gerente
  console.log('Cerrando sesión de Gerente...');
  await page.evaluate(() => document.getElementById('logoutBtn').click());
  await sleep(400);

  // 11. Login Asistente (Con Alerta de Deudas Anteriores, N° Operación y Salto de Periodo)
  console.log('Capturando 11_asistente_consola_octubre.png');
  await page.evaluate(() => {
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
  });
  await page.type('#usernameInput', 'asistente');
  await page.type('#passwordInput', 'asistente123');
  await page.click('button[type="submit"]');
  await sleep(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '11_asistente_consola_octubre.png'), fullPage: true });

  // 11b. Salto Rápido a Periodo (Observación Selector Directo de Mes y Año)
  console.log('Capturando 11b_salto_periodo_rapido.png');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.getElementById('jumpMonthSelect').value = '8'; // Septiembre
    document.getElementById('jumpYearInput').value = '2026';
    document.getElementById('applyPeriodJumpBtn').click();
  });
  await sleep(500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '11b_salto_periodo_rapido.png'), fullPage: true });

  // Volver a Octubre 2026
  await page.evaluate(() => {
    document.getElementById('jumpCurrentMonthBtn').click();
  });
  await sleep(400);

  // 12. Modal Nuevo Gasto del Asistente
  console.log('Capturando 12_modal_asistente_nuevo_gasto.png');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.getElementById('openNewExpenseModalBtn').click();
  });
  await sleep(400);
  await page.type('#expenseReceiptIdInput', 'SUMIN-SEDAPAL-1092');
  await page.type('#expenseDescInput', 'Servicio de Agua Potable - Planta de Producción');
  await page.type('#expenseAmountInput', '412.50');
  await page.type('#expenseDueDateInput', '2026-10-28');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '12_modal_asistente_nuevo_gasto.png'), fullPage: false });
  await page.evaluate(() => document.getElementById('closeExpenseModalBtn').click());
  await sleep(300);

  // 13. Modal Liquidación Yape
  console.log('Capturando 13_modal_pago_yape_datos.png');
  // Buscar botón de registrar pago del gasto FAC-F004-9842 (monto 500.35)
  const targetBtn = await page.$('.record-btn[data-id="exp-oct-2"]');
  if (targetBtn) {
    await targetBtn.click();
  } else {
    const recordBtns = await page.$$('.record-btn');
    if (recordBtns.length > 1) await recordBtns[1].click();
  }
  await sleep(400);

  await page.select('#paymentMethodSelect', 'Yape (Billetera Digital)');
  await sleep(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '13_modal_pago_yape_datos.png'), fullPage: false });

  // 14. Modal Liquidación Efectivo Ley 29571
  console.log('Capturando 14_modal_pago_efectivo_redondeo_ley29571.png');
  await page.select('#paymentMethodSelect', 'Efectivo');
  await sleep(300);
  await page.type('#cashReceivedInput', '510.00');
  await sleep(300);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '14_modal_pago_efectivo_redondeo_ley29571.png'), fullPage: false });

  // 15. Liquidar pago registrando N° Operación
  await page.select('#paymentMethodSelect', 'Transferencia Bancaria');
  await sleep(200);
  await page.type('#paymentRefInput', 'OP-9988221');
  await page.click('#recordPaymentForm button[type="submit"]');
  await sleep(600);

  // 16. Asistente con pago completado (Muestra N° Operación y ambos botones: Ver Titular y Ver Voucher)
  await page.select('#filterStatus', 'all');
  await sleep(400);
  console.log('Capturando 15_asistente_pago_completado.png');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '15_asistente_pago_completado.png'), fullPage: true });

  // 15b. Modal Editar Gasto Registrado (Observación Edición de Pagos)
  console.log('Capturando 15b_modal_editar_gasto_asistente.png');
  const editExpBtns = await page.$$('.edit-expense-btn');
  if (editExpBtns.length > 0) {
    await editExpBtns[0].click();
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '15b_modal_editar_gasto_asistente.png'), fullPage: false });
    await page.evaluate(() => document.getElementById('closeEditExpenseModalBtn').click());
    await sleep(300);
  }

  // 17. Ver Voucher del pago completado
  console.log('Capturando 16_modal_comprobante_voucher.png');
  const clickedVoucher = await page.evaluate(() => {
    const btn = document.querySelector('.view-receipt-btn');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  if (clickedVoucher) {
    await sleep(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '16_modal_comprobante_voucher.png'), fullPage: false });
    await page.evaluate(() => {
      const closeBtn = document.getElementById('closeImageViewerBtn');
      if (closeBtn) closeBtn.click();
    });
    await sleep(300);
  }

  // Dejar la base de datos completamente limpia y vacía para la exposición en vivo ante el profesor
  await page.evaluate(() => {
    Store.clearAllData();
  });

  await browser.close();
  console.log('¡Todas las capturas se guardaron exitosamente en docs/evidencias!');
}

run().catch(err => {
  console.error('Error al capturar evidencias:', err);
  process.exit(1);
});
