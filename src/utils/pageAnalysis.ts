export const fetchPageContent = async (url: string) => {
  try {
    // Use cors-anywhere as a fallback proxy if allorigins fails
    const proxyUrls = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`,
      `https://api.codetabs.com/v1/proxy?quest=${url}`
    ];

    let response;
    let data;
    let proxyError = null;

    // Try each proxy until one works
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
    
    // Create a temporary DOM element to parse the content
    const parser = new DOMParser();
    const doc = parser.parseFromString(typeof contents === 'string' ? contents : JSON.stringify(contents), 'text/html');
    
    // Enhanced React detection with more indicators
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

    // Extract metadata
    const metadata = {
      title: doc.title || '',
      description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
      isReactApp,
    };

    // Create an iframe with longer timeout for React apps
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    if (iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(contents);
      iframe.contentDocument.close();
    }

    // Wait longer for React apps to hydrate
    const waitTime = isReactApp ? 8000 : 3000;
    await new Promise(resolve => setTimeout(resolve, waitTime));

    // Get content after waiting for hydration
    const textContent = iframe.contentDocument?.body.innerText || doc.body.innerText;
    const cleanContent = iframe.contentDocument?.body.innerHTML || doc.body.innerHTML;

    // Clean up
    document.body.removeChild(iframe);

    console.log('Content captured:', {
      isReactApp,
      contentLength: textContent.length,
      hasHydrated: textContent.length > doc.body.innerText.length
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
