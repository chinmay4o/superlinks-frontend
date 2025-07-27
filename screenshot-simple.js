const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to dashboard...');
    await page.goto('http://localhost:3000/dashboard', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Take screenshot of dashboard
    await page.screenshot({
      path: 'dashboard-screenshot.png',
      type: 'png'
    });
    console.log('Dashboard screenshot saved');
    
    // Try to navigate to bio builder
    console.log('Navigating to bio builder...');
    await page.goto('http://localhost:3000/dashboard/bio-builder', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait a bit for components to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take full page screenshot
    await page.screenshot({
      path: 'bio-builder-full.png',
      fullPage: true,
      type: 'png'
    });
    
    console.log('Bio builder full screenshot saved');
    
    // Take viewport screenshot
    await page.screenshot({
      path: 'bio-builder-viewport.png',
      type: 'png'
    });
    
    console.log('Bio builder viewport screenshot saved');
    
  } catch (error) {
    console.error('Error:', error);
    
    // Take debug screenshot
    await page.screenshot({
      path: 'debug-error.png',
      type: 'png'
    });
    
    console.log('Debug screenshot saved');
  }
  
  // Keep browser open briefly
  console.log('Keeping browser open for 5 seconds...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await browser.close();
})();