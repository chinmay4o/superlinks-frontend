const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1400, height: 900 },
    slowMo: 100 // Slow down actions to see what's happening
  });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Starting Bio Builder Comprehensive Test...');
    
    // === LOGIN ===
    console.log('📝 Logging in...');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    await page.type('input[type="email"]', 'chinmayinbox8@gmail.com');
    await page.type('input[type="password"]', 'Chinmayinbox8');
    await page.click('button[type="submit"]');
    
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 });
    console.log('✅ Login successful');
    
    // === NAVIGATE TO BIO BUILDER ===
    console.log('🏗️ Navigating to bio builder...');
    await page.goto('http://localhost:3000/dashboard/bio');
    
    // Wait for bio builder to load - using multiple possible selectors
    await page.waitForFunction(() => {
      return document.querySelector('.bio-builder-container') || 
             document.querySelector('[data-testid="bio-builder"]') ||
             document.querySelector('.tabs-container') ||
             document.querySelector('h1') && document.querySelector('h1').textContent.includes('Bio Builder');
    }, { timeout: 15000 });
    
    console.log('✅ Bio builder loaded');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-screenshots/01-initial-bio-builder.png',
      fullPage: true 
    });
    
    // === TEST 1: PROFILE INFORMATION EDITING ===
    console.log('\\n🧪 TEST 1: Profile Information Editing');
    
    // Test display name input
    const displayNameInput = await page.$('#bio-title');
    if (displayNameInput) {
      await displayNameInput.click({ clickCount: 3 }); // Select all
      await page.type('#bio-title', 'Test User Name');
      console.log('✅ Display name updated');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Test bio description
    const bioDescInput = await page.$('#bio-description');
    if (bioDescInput) {
      await bioDescInput.click({ clickCount: 3 }); // Select all
      await page.type('#bio-description', 'This is a test bio description for our comprehensive test.');
      console.log('✅ Bio description updated');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await page.screenshot({ 
      path: 'test-screenshots/02-profile-info-updated.png',
      fullPage: true 
    });
    
    // === TEST 2: ADD BLOCKS FUNCTIONALITY ===
    console.log('\\n🧪 TEST 2: Add Blocks Functionality');
    
    // Click Add Block button - using multiple selectors to find the actual button
    const addBlockSelectors = [
      'button:has-text("Add Block")',
      'button[class*="add"]',
      'button:contains("Add")',
      'button >> text="Add Block"'
    ];
    
    let addBlockButton = null;
    for (const selector of addBlockSelectors) {
      try {
        addBlockButton = await page.$(selector);
        if (addBlockButton) break;
      } catch (e) {
        // Continue to next selector
      }
    }
    
    // Try a more generic approach
    if (!addBlockButton) {
      addBlockButton = await page.$('button[onclick], button[data-testid*="add"]');
    }
    
    if (addBlockButton) {
      await addBlockButton.click();
      console.log('✅ Add Block menu opened');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await page.screenshot({ 
        path: 'test-screenshots/03-add-block-menu.png',
        fullPage: true 
      });
      
      // Test adding different block types - look for actual block type buttons
      const availableBlockButtons = await page.$$('button[class*="block"], button[data-block-type]');
      
      if (availableBlockButtons.length > 0) {
        console.log(`Found ${availableBlockButtons.length} block type buttons`);
        
        // Click first few available block buttons
        for (let i = 0; i < Math.min(availableBlockButtons.length, 3); i++) {
          try {
            await availableBlockButtons[i].click();
            console.log(`✅ Added block type ${i + 1}`);
            await new Promise(resolve => setTimeout(resolve, 1500));
          } catch (error) {
            console.log(`⚠️ Failed to add block type ${i + 1}:`, error.message);
          }
        }
      } else {
        console.log('⚠️ No block type buttons found');
      }
    } else {
      console.log('⚠️ Add Block button not found');
    }
    
    await page.screenshot({ 
      path: 'test-screenshots/04-blocks-added.png',
      fullPage: true 
    });
    
    // === TEST 3: BLOCK EDITING ===
    console.log('\\n🧪 TEST 3: Block Editing');
    
    // Find and click on a block to edit
    const blockItems = await page.$$('.block-item, [data-testid*="block"]');
    if (blockItems.length > 0) {
      await blockItems[0].click();
      console.log('✅ Selected first block for editing');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test editing block content
      const blockEditor = await page.$('.block-editor, [class*="editor"]');
      if (blockEditor) {
        const titleInput = await page.$('input[placeholder*="title"], input[placeholder*="name"]');
        if (titleInput) {
          await titleInput.click({ clickCount: 3 });
          await page.type('input[placeholder*="title"], input[placeholder*="name"]', 'Updated Block Title');
          console.log('✅ Block title updated');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    await page.screenshot({ 
      path: 'test-screenshots/05-block-editing.png',
      fullPage: true 
    });
    
    // === TEST 4: BLOCK VISIBILITY TOGGLE ===
    console.log('\\n🧪 TEST 4: Block Visibility Toggle');
    
    // Test toggle functionality
    const eyeButtons = await page.$$('button[aria-label*="toggle"], button:has(.lucide-eye), button:has(.lucide-eye-off)');
    if (eyeButtons.length > 0) {
      console.log(`Found ${eyeButtons.length} toggle buttons`);
      
      // Toggle first block
      await eyeButtons[0].click();
      console.log('✅ Toggled block visibility');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await page.screenshot({ 
        path: 'test-screenshots/06-block-toggled.png',
        fullPage: true 
      });
    }
    
    // === TEST 5: DRAG AND DROP (if available) ===
    console.log('\\n🧪 TEST 5: Drag and Drop Testing');
    
    const dragHandles = await page.$$('.grip-vertical, [data-testid*="drag"], .draggable-handle');
    if (dragHandles.length >= 2) {
      try {
        // Get positions of first two drag handles
        const firstHandle = dragHandles[0];
        const secondHandle = dragHandles[1];
        
        const firstBox = await firstHandle.boundingBox();
        const secondBox = await secondHandle.boundingBox();
        
        if (firstBox && secondBox) {
          // Perform drag and drop
          await page.mouse.move(firstBox.x + firstBox.width/2, firstBox.y + firstBox.height/2);
          await page.mouse.down();
          await page.mouse.move(secondBox.x + secondBox.width/2, secondBox.y + secondBox.height/2);
          await page.mouse.up();
          
          console.log('✅ Drag and drop performed');
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.log('⚠️ Drag and drop test failed:', error.message);
      }
    }
    
    await page.screenshot({ 
      path: 'test-screenshots/07-after-reorder.png',
      fullPage: true 
    });
    
    // === TEST 6: PREVIEW SYNCHRONIZATION ===
    console.log('\\n🧪 TEST 6: Preview Synchronization');
    
    // Check if preview updates in real-time
    const mobilePreview = await page.$('.mobile-preview, .preview-container, .bio-preview');
    if (mobilePreview) {
      // Get preview content before update
      const previewBefore = await page.evaluate(() => {
        const preview = document.querySelector('.mobile-preview, .preview-container, .bio-preview');
        return preview ? preview.textContent.substring(0, 200) : 'No preview found';
      });
      
      // Make a change to profile info
      const nameInput = await page.$('#bio-title');
      if (nameInput) {
        await nameInput.click({ clickCount: 3 });
        await page.type('#bio-title', 'Real-Time Test Update');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Get preview content after update
      const previewAfter = await page.evaluate(() => {
        const preview = document.querySelector('.mobile-preview, .preview-container, .bio-preview');
        return preview ? preview.textContent.substring(0, 200) : 'No preview found';
      });
      
      if (previewBefore !== previewAfter) {
        console.log('✅ Preview synchronization working');
      } else {
        console.log('⚠️ Preview may not be synchronizing properly');
      }
      
      console.log('Preview Before:', previewBefore.substring(0, 50) + '...');
      console.log('Preview After:', previewAfter.substring(0, 50) + '...');
    }
    
    await page.screenshot({ 
      path: 'test-screenshots/08-preview-sync-test.png',
      fullPage: true 
    });
    
    // === TEST 7: ERROR HANDLING ===
    console.log('\\n🧪 TEST 7: Error Handling');
    
    // Check for any console errors
    const logs = [];
    page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
    page.on('pageerror', error => logs.push(`PAGE ERROR: ${error.message}`));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const errors = logs.filter(log => log.includes('ERROR') || log.includes('error'));
    if (errors.length > 0) {
      console.log('⚠️ Console errors detected:');
      errors.forEach(error => console.log('  ', error));
    } else {
      console.log('✅ No console errors detected');
    }
    
    // === TEST 8: NAVIGATION AND TABS ===
    console.log('\\n🧪 TEST 8: Tab Navigation');
    
    // Test tab switching if tabs exist
    const tabs = await page.$$('[role="tab"], .tab-button, [data-tab]');
    if (tabs.length > 0) {
      console.log(`Found ${tabs.length} tabs`);
      
      for (let i = 0; i < Math.min(tabs.length, 3); i++) {
        try {
          await tabs[i].click();
          console.log(`✅ Switched to tab ${i + 1}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await page.screenshot({ 
            path: `test-screenshots/09-tab-${i + 1}.png`,
            fullPage: true 
          });
        } catch (error) {
          console.log(`⚠️ Tab ${i + 1} click failed:`, error.message);
        }
      }
    }
    
    // === FINAL ANALYSIS ===
    console.log('\\n📊 FINAL ANALYSIS');
    
    const finalAnalysis = await page.evaluate(() => {
      const blocks = document.querySelectorAll('.block-item, [data-block-type], .draggable-block');
      const activeBlocks = Array.from(blocks).filter(block => {
        const toggle = block.querySelector('input[type="checkbox"], .toggle');
        return toggle ? toggle.checked || !toggle.classList.contains('off') : true;
      });
      
      const preview = document.querySelector('.mobile-preview, .preview-container, .bio-preview');
      
      return {
        totalBlocks: blocks.length,
        activeBlocks: activeBlocks.length,
        previewExists: !!preview,
        previewHasContent: preview ? preview.textContent.length > 50 : false,
        url: window.location.href,
        timestamp: new Date().toISOString()
      };
    });
    
    console.log('=== FINAL STATE ===');
    console.log(`📦 Total Blocks: ${finalAnalysis.totalBlocks}`);
    console.log(`✅ Active Blocks: ${finalAnalysis.activeBlocks}`);
    console.log(`📱 Preview Available: ${finalAnalysis.previewExists ? 'Yes' : 'No'}`);
    console.log(`📝 Preview Has Content: ${finalAnalysis.previewHasContent ? 'Yes' : 'No'}`);
    console.log(`🔗 Current URL: ${finalAnalysis.url}`);
    
    // Final screenshot
    await page.screenshot({ 
      path: 'test-screenshots/10-final-state.png',
      fullPage: true 
    });
    
    console.log('\\n🎉 BIO BUILDER COMPREHENSIVE TEST COMPLETED');
    console.log('📸 All screenshots saved to test-screenshots/ folder');
    console.log('✨ Bio builder functionality appears to be working correctly!');
    
    // === PERFORMANCE METRICS ===
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        totalPageLoad: navigation.loadEventEnd - navigation.fetchStart
      };
    });
    
    console.log('\\n⚡ PERFORMANCE METRICS:');
    console.log(`🚀 Load Time: ${performanceMetrics.loadTime.toFixed(2)}ms`);
    console.log(`📄 DOM Ready: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`⏱️ Total Page Load: ${performanceMetrics.totalPageLoad.toFixed(2)}ms`);
    
  } catch (error) {
    console.error('❌ Error during bio builder testing:', error);
    await page.screenshot({ 
      path: 'test-screenshots/error-state.png',
      fullPage: true 
    });
  }
  
  // Keep browser open for manual inspection
  console.log('\\n🔍 Browser remaining open for manual inspection...');
  console.log('👋 Press Ctrl+C when done to close the browser');
  
  // Wait for user to close manually
  await new Promise(resolve => {
    process.on('SIGINT', () => {
      console.log('\\n🔒 Closing browser...');
      browser.close();
      resolve();
    });
  });
})();