import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const config = {
  maxDuration: 60,
  api: {
    bodyParser: {
      sizeLimit: '12mb'
    },
    responseLimit: false
  }
};

const MAX_HTML_SIZE = 11 * 1024 * 1024;

const cleanBaseUrl = (url) => String(url || 'https://a4exam.com').replace(/["<>]/g, '').replace(/\/$/, '');

const errorMessage = (error) => String(error?.message || error || 'Erreur génération PDF');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html, baseUrl } = req.body || {};
  if (!html || typeof html !== 'string') {
    return res.status(400).json({ error: 'HTML manquant' });
  }

  if (html.length > MAX_HTML_SIZE) {
    return res.status(413).json({ error: 'Document trop grand pour générer le PDF' });
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1240, height: 1754 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();
    page.setDefaultTimeout(45000);

    const safeBase = cleanBaseUrl(baseUrl);
    const documentHtml = `<!doctype html>
<html>
<head>
  <base href="${safeBase}/">
  <meta charset="utf-8">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    html, body { margin: 0 !important; padding: 0 !important; background: white !important; overflow: visible !important; }
    body { width: 100% !important; }
    .cahier-pdf-export-button, .app-tabs, .tab-button, button { display: none !important; }
    .cahier-preview-zone { overflow: visible !important; height: auto !important; max-height: none !important; padding: 0 !important; background: white !important; }
    .a4-page, .cahier-page { break-after: page !important; page-break-after: always !important; margin: 0 auto !important; box-shadow: none !important; }
    .a4-page:last-child, .cahier-page:last-child { break-after: auto !important; page-break-after: auto !important; }
  </style>
</head>
<body>
  <div class="cahier-preview-zone">${html}</div>
</body>
</html>`;

    await page.setContent(documentHtml, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready.catch(() => {});
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      scale: 1
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Cahier-de-texte-2026-2027.pdf"');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('PDF_EXPORT_ERROR', error);
    return res.status(500).json({ error: errorMessage(error) });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
