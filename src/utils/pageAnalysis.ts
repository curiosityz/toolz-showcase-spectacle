export const fetchPageContent = async (url: string) => {
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch the page (Status: ${response.status})`);
    }

    const data = await response.json();
    
    // Create a temporary DOM element to parse the content
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');
    
    // Wait for client-side rendering (5 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check if it's a React app by looking for common indicators
    const isReactApp = Boolean(
      doc.getElementById('root') || 
      doc.querySelector('[data-reactroot]') ||
      doc.querySelector('script[src*="react"]')
    );

    // Extract metadata
    const metadata = {
      title: doc.title || '',
      description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
      isReactApp,
    };

    // Get all text content, including dynamically rendered content
    const textContent = doc.body.innerText;
    
    // Remove script tags and their content
    const scripts = doc.getElementsByTagName('script');
    Array.from(scripts).forEach(script => script.remove());
    
    // Get the cleaned HTML content
    const cleanContent = doc.body.innerHTML;

    // Create an iframe to capture rendered content
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    if (iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(data.contents);
      iframe.contentDocument.close();
    }

    // Wait for potential dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Capture rendered content
    const renderedContent = iframe.contentDocument?.body.innerHTML || '';
    
    // Clean up
    document.body.removeChild(iframe);

    return {
      metadata,
      textContent: textContent || renderedContent,
      htmlContent: cleanContent,
      renderedContent
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