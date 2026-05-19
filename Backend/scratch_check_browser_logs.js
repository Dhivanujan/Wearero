const { chromium } = require('playwright');

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Collect logs
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  page.on('requestfailed', req => console.error('REQUEST FAILED:', req.url(), req.failure().errorText));

  console.log("Navigating to http://localhost:5173/ ...");
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  console.log("Page loaded. Waiting for 3 seconds...");
  await page.waitForTimeout(3000);

  // Evaluate image elements
  const imagesInfo = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      offsetWidth: img.offsetWidth,
      offsetHeight: img.offsetHeight,
      opacity: window.getComputedStyle(img).opacity,
      visibility: window.getComputedStyle(img).visibility,
      display: window.getComputedStyle(img).display
    }));
  });

  console.log("\n--- IMAGES ON HOMEPAGE ---");
  imagesInfo.forEach((info, index) => {
    console.log(`Image ${index + 1}:`);
    console.log(`  src: ${info.src}`);
    console.log(`  complete: ${info.complete}`);
    console.log(`  natural dimensions: ${info.naturalWidth}x${info.naturalHeight}`);
    console.log(`  rendered size: ${info.offsetWidth}x${info.offsetHeight}`);
    console.log(`  opacity: ${info.opacity}, visibility: ${info.visibility}, display: ${info.display}`);
  });

  await browser.close();
};

run().catch(console.error);
