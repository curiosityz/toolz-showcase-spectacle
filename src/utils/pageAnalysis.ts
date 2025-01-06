export const fetchPageContent = async (url: string) => {
  try {
    const proxyUrls = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`,
      `https://api.codetabs.com/v1/proxy?quest=${url}`
    ];

    let response;
    let data;
    let proxyError = null;

    for (const proxyUrl of proxyUrls) {
      try {
        response = await fetch(proxyUrl);
        if (response.ok) {
          data = await response.json();
          break;
        }
      } catch (err) {
        proxyError = err;
        continue;
      }
    }

    if (!data) {
      throw proxyError || new Error('All proxies failed');
    }

    const contents = data.contents || data.body || data;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(typeof contents === 'string' ? contents : JSON.stringify(contents), 'text/html');
    
    const reactIndicators = [
      () => Boolean(doc.getElementById('root')),
      () => Boolean(doc.querySelector('[data-reactroot]')),
      () => Boolean(doc.querySelector('script[src*="react"]')),
      () => Boolean(doc.querySelector('script[src*="bundle.js"]')),
      () => contents.includes('_reactRootContainer'),
      () => contents.includes('__NEXT_DATA__'),
      () => contents.includes('ReactDOM'),
      () => contents.includes('React.createElement'),
      () => contents.includes('_jsx('),
      () => Boolean(doc.querySelector('script[src*="chunk"]')),
      () => Boolean(doc.querySelector('script[src*="webpack"]')),
      () => Boolean(doc.querySelector('div[id="__next"]')),
    ];

    const isReactApp = reactIndicators.some(indicator => {
      try {
        return indicator();
      } catch {
        return false;
      }
    });

    console.log('React detection result:', isReactApp);

    // Extract metadata first
    const metadata = {
      title: doc.title || '',
      description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
      isReactApp,
    };

    // Create a hidden iframe for content capture
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: absolute; width: 1024px; height: 768px; top: -9999px; left: -9999px;';
    document.body.appendChild(iframe);

    // Set viewport meta to ensure proper rendering
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    
    // Write content to iframe with necessary setup
    if (iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <base href="${url}">
            ${meta.outerHTML}
            ${Array.from(doc.getElementsByTagName('link')).map(link => link.outerHTML).join('')}
            ${Array.from(doc.getElementsByTagName('style')).map(style => style.outerHTML).join('')}
          </head>
          <body>
            ${contents}
          </body>
        </html>
      `);
      iframe.contentDocument.close();
    }

    // Function to check if content has been hydrated
    const checkContent = () => {
      const currentContent = iframe.contentDocument?.body.innerText || '';
      return currentContent.length > 10 && !currentContent.includes('Loading') && 
             iframe.contentDocument?.getElementById('root')?.children.length > 0;
    };

    // Wait for content with timeout and periodic checks
    let attempts = 0;
    const maxAttempts = 20;
    const checkInterval = 500;

    while (attempts < maxAttempts) {
      console.log(`Attempt ${attempts + 1}: Checking for hydrated content...`);
      
      if (checkContent()) {
        console.log('Content successfully hydrated!');
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, checkInterval));
      attempts++;
    }

    // Capture the final content
    const textContent = iframe.contentDocument?.body.innerText || doc.body.innerText;
    const cleanContent = iframe.contentDocument?.body.innerHTML || doc.body.innerHTML;

    // Clean up
    document.body.removeChild(iframe);

    console.log('Content capture complete:', {
      isReactApp,
      contentLength: textContent.length,
      hasHydrated: textContent.length > doc.body.innerText.length,
      attempts: attempts + 1
    });

    return {
      metadata,
      textContent,
      htmlContent: cleanContent,
      renderedContent: cleanContent
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    throw new Error('Unable to fetch the page. Please check the URL and try again.');
  }
};

export const analyzePage = async (pageData: any, apiKey: string) => {
  try {
    // Format the content for analysis
    const analysisPrompt = `Analyze this webpage content and metadata:
    
    Page Title: ${pageData.metadata.title}
    Meta Description: ${pageData.metadata.description}
    OG Image: ${pageData.metadata.ogImage}
    Is React App: ${pageData.metadata.isReactApp}
    
    Page Content:
    ${pageData.renderedContent || pageData.textContent}
    
    Please provide a detailed analysis in the following format:
    
    1. Content Quality and Clarity
    - Main message clarity
    - Content organization
    - Writing quality
    
    2. SEO Optimization
    - Title effectiveness
    - Meta description quality
    - Content keyword usage
    
    3. Technical Implementation
    - Page structure
    - Content loading
    - Mobile responsiveness
    
    4. Conversion Potential
    - Call-to-actions
    - User journey clarity
    - Trust indicators
    
    5. Key Recommendations
    - Top 3 immediate improvements
    - Long-term optimization suggestions`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: analysisPrompt
            }],
          }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to analyze the page");
    }

    const analysisResult = await response.json();
    return {
      ...analysisResult,
      metadata: pageData.metadata,
    };
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};
