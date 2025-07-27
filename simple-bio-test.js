const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1400, height: 900 }
  });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    console.log('Logging in...');
    await page.type('input[type="email"]', 'chinmayinbox8@gmail.com');
    await page.type('input[type="password"]', 'Chinmayinbox8');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Login successful, navigating to bio builder...');
    
    await page.goto('http://localhost:3000/dashboard/bio');
    await page.waitForSelector('.visual-bio-builder', { timeout: 10000 });
    
    console.log('Bio builder loaded successfully!');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take screenshot of the current state
    await page.screenshot({ 
      path: 'bio-builder-current-state.png',
      fullPage: true 
    });
    console.log('Screenshot taken');
    
    // Get all the text content to understand current state
    const pageAnalysis = await page.evaluate(() => {
      // Find blocks panel
      const blocksPanel = document.querySelector('.blocks-panel');
      const blocksInfo = blocksPanel ? {
        text: blocksPanel.textContent.substring(0, 300),
        buttons: Array.from(blocksPanel.querySelectorAll('button')).length,
        blocks: Array.from(blocksPanel.querySelectorAll('[data-block-type]')).map(el => el.getAttribute('data-block-type'))
      } : null;
      
      // Find mobile preview
      const mobilePreview = document.querySelector('.mobile-preview');
      const previewInfo = mobilePreview ? {
        text: mobilePreview.textContent.substring(0, 200),
        hasFrame: !!mobilePreview.querySelector('iframe, .preview-frame')
      } : null;
      
      // Find properties panel
      const propertiesPanel = document.querySelector('.properties-panel');
      const propertiesInfo = propertiesPanel ? {
        text: propertiesPanel.textContent.substring(0, 200)
      } : null;
      
      // Find existing blocks
      const existingBlocks = Array.from(document.querySelectorAll('.draggable-block, .block-item')).map(el => ({
        type: el.getAttribute('data-block-type') || 'unknown',
        text: el.textContent.substring(0, 50),
        isActive: el.querySelector('input[type="checkbox"]')?.checked
      }));
      
      return {
        url: window.location.href,
        blocksPanel: blocksInfo,
        mobilePreview: previewInfo,
        propertiesPanel: propertiesInfo,
        existingBlocks: existingBlocks,
        pageTitle: document.title
      };
    });
    
    console.log('=== PAGE ANALYSIS ===');
    console.log(JSON.stringify(pageAnalysis, null, 2));
    
    // Try to find and click specific elements
    console.log('\\n=== TESTING INTERACTIONS ===');
    
    // Test 1: Look for Add Block button
    const addBlockSelectors = [
      'button[class*="add"]',
      '.add-block-button',
      'button:has-text("Add block")',
      'button[data-testid="add-block"]'
    ];
    
    for (const selector of addBlockSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          console.log(`Found add block button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Selector might not be valid, continue
      }
    }
    
    // Test 2: Try to interact with existing blocks
    const blockToggles = await page.$$('input[type="checkbox"]');
    console.log(`Found ${blockToggles.length} checkboxes/toggles`);
    
    if (blockToggles.length > 0) {
      console.log('Testing first toggle...');
      await blockToggles[0].click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Take screenshot after toggle
      await page.screenshot({ 
        path: 'bio-builder-after-toggle.png',
        fullPage: true 
      });
      console.log('Toggle tested and screenshot taken');
    }
    
    // Test 3: Try to save/share
    const shareButton = await page.$('button.share-button, .share-button');
    if (shareButton) {
      console.log('Found share button, testing save...');
      await shareButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check for toast messages or feedback
      const toasts = await page.$$('.toast, [class*="toast"], .notification');
      if (toasts.length > 0) {
        const toastTexts = await Promise.all(
          toasts.map(toast => page.evaluate(el => el.textContent, toast))
        );
        console.log('Toast messages:', toastTexts);
      }
    }
    
    // Final screenshot
    await page.screenshot({ 
      path: 'bio-builder-final-state.png',
      fullPage: true 
    });
    console.log('\\n=== TEST COMPLETED ===');
    console.log('Check the screenshots to see the current state of the bio builder');
    
  } catch (error) {
    console.error('Error during testing:', error);
    await page.screenshot({ 
      path: 'bio-builder-error-state.png',
      fullPage: true 
    });
  }
  
  // Keep browser open for manual inspection
  console.log('\\nBrowser will remain open for manual testing...');
  console.log('Press Ctrl+C when done to close the browser');
  
  // Wait for user to close manually
  await new Promise(resolve => {
    process.on('SIGINT', () => {
      console.log('\\nClosing browser...');
      browser.close();
      resolve();
    });
  });
  
})();