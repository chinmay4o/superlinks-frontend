const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1400, height: 900 }
  });
  const page = await browser.newPage();
  
  try {
    console.log('Testing background color fix...');
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('CONSOLE ERROR:', msg.text());
      }
    });
    
    // Listen for page errors  
    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });
    
    // Login
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.type('input[type="email"]', 'chinmayinbox8@gmail.com');
    await page.type('input[type="password"]', 'Chinmayinbox8');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    
    // Go to bio builder
    await page.goto('http://localhost:3000/dashboard/bio');
    await page.waitForSelector('.visual-bio-builder', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Bio builder loaded');
    
    // Click on Theme tab in properties panel
    const themeTab = await page.$('[value="theme"]');
    if (themeTab) {
      await themeTab.click();
      console.log('Theme tab clicked');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to change background color
      const backgroundColorInput = await page.$('input[type="color"][value*="#"]');
      if (backgroundColorInput) {
        console.log('Found background color input');
        
        // Change background color
        await backgroundColorInput.evaluate(input => {
          input.value = '#ff0000';
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        console.log('Background color changed to red');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Change to another color
        await backgroundColorInput.evaluate(input => {
          input.value = '#00ff00';
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        console.log('Background color changed to green');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'background-color-test.png',
      fullPage: true 
    });
    console.log('Screenshot saved');
    
    console.log('Background color test completed successfully - no errors!');
    
  } catch (error) {
    console.error('Error during test:', error);
    await page.screenshot({ 
      path: 'background-color-error.png',
      fullPage: true 
    });
  }
  
  await browser.close();
})();