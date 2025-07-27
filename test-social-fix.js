const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1400, height: 900 }
  });
  const page = await browser.newPage();
  
  try {
    console.log('Testing social links editing fix...');
    
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Bio builder loaded');
    
    // Click on Social Links block to select it
    const socialBlock = await page.$('[data-block-type="social"], .draggable-block:nth-child(3)');
    if (socialBlock) {
      await socialBlock.click();
      console.log('Social block selected');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if properties panel shows social links
      const propertiesPanel = await page.$('.properties-panel');
      if (propertiesPanel) {
        const panelText = await page.evaluate(el => el.textContent, propertiesPanel);
        console.log('Properties panel content includes social:', panelText.includes('Social Links Settings'));
        
        // Try to find and clear a social input
        const instagramInput = await page.$('input[placeholder*="instagram"]');
        if (instagramInput) {
          console.log('Found Instagram input');
          
          // Clear the field
          await instagramInput.click({ clickCount: 3 });
          await instagramInput.type('');
          console.log('Cleared Instagram field');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if it was removed from preview
          const previewContent = await page.evaluate(() => {
            const preview = document.querySelector('.mobile-preview-content, .preview-content');
            return preview ? preview.textContent : 'No preview found';
          });
          console.log('Preview updated:', previewContent.includes('instagram') ? 'Instagram still visible' : 'Instagram removed');
        }
        
        // Test adding a new social link
        const twitterInput = await page.$('input[placeholder*="twitter"]');
        if (twitterInput) {
          console.log('Found Twitter input');
          await twitterInput.click();
          await twitterInput.type('https://twitter.com/test');
          console.log('Added Twitter link');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Test save functionality
    const shareButton = await page.$('.share-button');
    if (shareButton) {
      console.log('Testing save...');
      await shareButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check for toast messages
      const toasts = await page.$$eval('[class*="toast"], .notification', 
        els => els.map(el => el.textContent).filter(text => text.trim())
      );
      console.log('Toast messages:', toasts);
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'social-links-fix-test.png',
      fullPage: true 
    });
    console.log('Screenshot saved: social-links-fix-test.png');
    
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Error during test:', error);
    await page.screenshot({ 
      path: 'social-links-fix-error.png',
      fullPage: true 
    });
  }
  
  await browser.close();
})();