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
    
    console.log('Bio builder loaded, testing all blocks...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'bio-builder-initial.png',
      fullPage: true 
    });
    console.log('Initial screenshot taken');
    
    // Check existing blocks
    const existingBlocks = await page.$$('.draggable-block, .block-item');
    console.log(`Found ${existingBlocks.length} existing blocks`);
    
    // Test clicking on Add Block button
    console.log('Testing Add Block functionality...');
    const addBlockButton = await page.$('.add-block-button, button:contains("Add block"), button[class*="add"]');
    if (addBlockButton) {
      await addBlockButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Add block button clicked');
    }
    
    // Test Text block
    console.log('Testing Text block...');
    const textBlockElements = await page.$$eval('*', els => 
      els.filter(el => el.textContent && el.textContent.toLowerCase().includes('text')).map(el => el.className)
    );
    console.log('Text block elements found:', textBlockElements.slice(0, 3));
    
    // Try clicking on block toggles to see them in action
    const blockToggles = await page.$$('input[type="checkbox"], .toggle, [role="switch"]');
    console.log(`Found ${blockToggles.length} toggles/switches`);
    
    if (blockToggles.length > 0) {
      console.log('Testing first toggle...');
      await blockToggles[0].click();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Check mobile preview
    console.log('Checking mobile preview...');
    const mobilePreview = await page.$('.mobile-preview, .preview-frame, iframe');
    if (mobilePreview) {
      console.log('Mobile preview found');
      
      // Try to get preview content
      const previewBoundingBox = await mobilePreview.boundingBox();
      if (previewBoundingBox) {
        console.log('Preview dimensions:', previewBoundingBox);
      }
    } else {
      console.log('Mobile preview not found');
    }
    
    // Test properties panel
    console.log('Testing properties panel...');
    const propertiesPanel = await page.$('.properties-panel, .right-panel');
    if (propertiesPanel) {
      console.log('Properties panel found');
      const propertiesText = await page.evaluate(el => el.textContent, propertiesPanel);
      console.log('Properties panel content:', propertiesText.substring(0, 100) + '...');
    }
    
    // Test saving
    console.log('Testing save functionality...');
    const shareButton = await page.$('.share-button, button:contains("SHARE")');
    if (shareButton) {
      await shareButton.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Share button clicked');
    }
    
    // Check for any error messages
    const errorMessages = await page.$$eval('.error, .toast-error, [class*="error"]', 
      els => els.map(el => el.textContent).filter(text => text.trim())
    );
    if (errorMessages.length > 0) {
      console.log('Error messages found:', errorMessages);
    }
    
    // Check for success messages
    const successMessages = await page.$$eval('.success, .toast-success, [class*="success"]', 
      els => els.map(el => el.textContent).filter(text => text.trim())
    );
    if (successMessages.length > 0) {
      console.log('Success messages found:', successMessages);
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'bio-builder-final.png',
      fullPage: true 
    });
    console.log('Final screenshot taken');
    
    // Get page content for analysis
    const pageContent = await page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('.draggable-block, .block-item, [data-block-type]')).map(el => ({
        type: el.getAttribute('data-block-type') || 'unknown',
        text: el.textContent.substring(0, 50),
        className: el.className
      }));
      
      const preview = document.querySelector('.mobile-preview-content, .preview-content, iframe');
      const previewContent = preview ? preview.textContent : 'No preview content found';
      
      return {
        blocks: blocks,
        previewContent: previewContent.substring(0, 200),
        url: window.location.href
      };
    });
    
    console.log('Page analysis:', JSON.stringify(pageContent, null, 2));
    console.log('Testing completed successfully!');
    
  } catch (error) {
    console.error('Error during testing:', error);
    await page.screenshot({ 
      path: 'bio-builder-error.png',
      fullPage: true 
    });
  }
  
  await browser.close();
})();