const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  try {
    // First navigate to login page
    await page.goto('http://localhost:3000/login', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('Navigated to login page');
    
    // Fill in login credentials
    await page.type('input[type="email"]', 'chinmayinbox8@gmail.com');
    await page.type('input[type="password"]', 'Chinmayinbox8');
    
    // Click sign in button
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    
    console.log('Logged in successfully');
    
    // Navigate to bio builder
    await page.goto('http://localhost:3000/dashboard/bio', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for the bio builder to fully load
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take full page screenshot
    await page.screenshot({
      path: 'bio-builder-screenshot.png',
      fullPage: true,
      type: 'png'
    });
    
    console.log('Bio builder screenshot saved as bio-builder-screenshot.png');
    
    // Take a viewport-only screenshot
    await page.screenshot({
      path: 'bio-builder-viewport.png',
      type: 'png'
    });
    
    console.log('Viewport screenshot saved as bio-builder-viewport.png');
    
  } catch (error) {
    console.error('Error:', error);
    
    // Take screenshot of current page for debugging
    await page.screenshot({
      path: 'debug-screenshot.png',
      type: 'png'
    });
    
    console.log('Debug screenshot saved as debug-screenshot.png');
  }
  
  // Keep browser open for 10 seconds to manually inspect
  console.log('Keeping browser open for inspection...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  await browser.close();
})();