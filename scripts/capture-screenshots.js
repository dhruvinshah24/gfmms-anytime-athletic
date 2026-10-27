const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.join(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function run() {
  console.log('Launching headless Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('1. Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Hero Landing Page
  console.log('Capturing 01_hero_dashboard.png...');
  await page.screenshot({ path: path.join(outputDir, '01_hero_dashboard.png') });

  // 2. Open Google Auth Modal
  console.log('Opening Google modal...');
  await page.evaluate(() => {
    if (typeof openGoogleModal === 'function') openGoogleModal();
  });
  await new Promise(r => setTimeout(r, 600));
  console.log('Capturing 02_google_auth_modal.png...');
  await page.screenshot({ path: path.join(outputDir, '02_google_auth_modal.png') });

  // 3. Login as Alice Johnson & Capture Athlete Member Portal
  console.log('Logging in as Alice Johnson...');
  await page.evaluate(async () => {
    if (typeof loginWithGoogle === 'function') {
      await loginWithGoogle('alice.johnson@example.com', 'Alice Johnson');
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  // Open Alice's QR Pass Modal or view portal
  console.log('Opening Alice 24/7 QR Pass modal...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick*="viewMemberPassModal"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  console.log('Capturing 03_athlete_portal_qr.png...');
  await page.screenshot({ path: path.join(outputDir, '03_athlete_portal_qr.png') });

  // Close modal
  await page.evaluate(() => {
    if (typeof closeModal === 'function') closeModal();
  });
  await new Promise(r => setTimeout(r, 400));

  // 4. Switch to Join Now (/register)
  console.log('Navigating to Join Now...');
  await page.evaluate(() => {
    if (typeof switchPage === 'function') switchPage('register');
  });
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing 04_plan_tiers_onboarding.png...');
  await page.screenshot({ path: path.join(outputDir, '04_plan_tiers_onboarding.png') });

  // 5. Test Smart Duplicate Recovery Alert
  console.log('Filling form with existing active member email...');
  await page.evaluate(() => {
    document.getElementById('regFullName').value = 'Dhruvin Shah';
    document.getElementById('regDOB').value = '1998-05-20';
    document.getElementById('regContact').value = '+917866880786';
    document.getElementById('regEmail').value = 'dhruvin12347@gmail.com';
    document.getElementById('regEmergency').value = '+919876543210';
  });
  await page.evaluate(async () => {
    const form = document.getElementById('registrationForm');
    if (form) {
      const evt = new Event('submit', { cancelable: true });
      form.dispatchEvent(evt);
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('Capturing 05_smart_duplicate_recovery.png...');
  await page.screenshot({ path: path.join(outputDir, '05_smart_duplicate_recovery.png') });

  // 6. Switch to Kiosk Simulator
  console.log('Navigating to Kiosk...');
  await page.evaluate(() => {
    if (typeof switchPage === 'function') switchPage('kiosk');
  });
  await new Promise(r => setTimeout(r, 800));

  // Simulate Alice Scan -> Access Granted
  console.log('Simulating Alice QR Scan...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick*="AF-QR-ALICE001"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing 06_optical_turnstile_kiosk.png...');
  await page.screenshot({ path: path.join(outputDir, '06_optical_turnstile_kiosk.png') });

  // 7. Immediate Re-scan -> 60-Minute Anti-Passback Denied
  console.log('Simulating immediate duplicate re-scan...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick*="AF-QR-ALICE001"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing 07_turnstile_anti_passback.png...');
  await page.screenshot({ path: path.join(outputDir, '07_turnstile_anti_passback.png') });

  // 8. Switch to Classes
  console.log('Navigating to Classes...');
  await page.evaluate(() => {
    if (typeof switchPage === 'function') switchPage('classes');
  });
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing 08_group_fitness_classes.png...');
  await page.screenshot({ path: path.join(outputDir, '08_group_fitness_classes.png') });

  // 9. Inspect FIFO Waitlist Modal on Spinning Class
  console.log('Inspecting FIFO queue modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const fifoBtn = btns.find(b => b.textContent && b.textContent.includes('INSPECT FIFO QUEUE'));
    if (fifoBtn) fifoBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  console.log('Capturing 09_fifo_waitlist_modal.png...');
  await page.screenshot({ path: path.join(outputDir, '09_fifo_waitlist_modal.png') });

  // Close modal
  await page.evaluate(() => {
    if (typeof closeModal === 'function') closeModal();
  });
  await new Promise(r => setTimeout(r, 400));

  // 10. Switch to Owner Session (Club Owner Dhruvin)
  console.log('Logging in as Club Owner Dhruvin...');
  await page.evaluate(async () => {
    if (typeof loginWithGoogle === 'function') {
      await loginWithGoogle('dynamitedhruvin@gmail.com', 'Dhruvin Owner');
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // Switch to Members view
  await page.evaluate(() => {
    if (typeof switchPage === 'function') switchPage('members');
  });
  await new Promise(r => setTimeout(r, 800));
  console.log('Capturing 10_owner_member_directory.png...');
  await page.screenshot({ path: path.join(outputDir, '10_owner_member_directory.png') });

  // 11. Open Alice's Dossier Modal
  console.log('Opening Alice Dossier modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const dossierBtn = btns.find(b => b.textContent && b.textContent.includes('DOSSIER'));
    if (dossierBtn) dossierBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  console.log('Capturing 11_athlete_dossier_modal.png...');
  await page.screenshot({ path: path.join(outputDir, '11_athlete_dossier_modal.png') });

  // Close modal
  await page.evaluate(() => {
    if (typeof closeModal === 'function') closeModal();
  });
  await new Promise(r => setTimeout(r, 400));

  // 12. Switch to Payments & Open 18% GST Invoice
  console.log('Navigating to Payments...');
  await page.evaluate(() => {
    if (typeof switchPage === 'function') switchPage('payments');
  });
  await new Promise(r => setTimeout(r, 800));

  console.log('Opening GST invoice modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const invoiceBtn = btns.find(b => b.textContent && b.textContent.includes('INVOICE'));
    if (invoiceBtn) invoiceBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  console.log('Capturing 12_financial_ledger_gst_invoice.png...');
  await page.screenshot({ path: path.join(outputDir, '12_financial_ledger_gst_invoice.png') });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
