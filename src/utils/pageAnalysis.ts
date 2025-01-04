export const fetchPageContent = async (url: string) => {
  try {
    // Use a CORS proxy to fetch the content
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch the page (Status: ${response.status})`);
    }

    const data = await response.json();
    
    // Create a temporary DOM element to parse the content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.contents;

    // Wait for a short time to allow potential client-side rendering
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract both static and dynamic content
    const staticContent = tempDiv.innerText;
    const scripts = Array.from(tempDiv.getElementsByTagName('script'));
    
    // Look for indicators of a React app
    const isReactApp = scripts.some(script => 
      script.src?.includes('react') || 
      script.textContent?.includes('react') ||
      data.contents.includes('root') ||
      data.contents.includes('__next') ||
      data.contents.includes('reactRoot')
    );

    // If it's a React app, try to get rendered content
    if (isReactApp) {
      try {
        // Create an iframe to render the page (this will capture client-side rendered content)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        if (iframe.contentWindow) {
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(data.contents);
          iframe.contentWindow.document.close();
          
          // Wait for React to render
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Get the rendered content
          const renderedContent = iframe.contentWindow.document.body.innerText;
          document.body.removeChild(iframe);
          
          return renderedContent;
        }
      } catch (error) {
        console.warn('Failed to capture rendered content:', error);
        // Fall back to static content if rendering fails
      }
    }

    return staticContent;
  } catch (error) {
    console.error('Error fetching page:', error);
    throw new Error('Unable to fetch the page. Please check the URL and try again.');
  }
};

export const analyzePage = async (html: string, apiKey: string) => {
  try {
    // Extract metadata and analyze content
    const metadata = {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
      isReactApp: false,
      renderedContent: html,
    };

    // Call Gemini API with enhanced context
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this webpage content and metadata. Note that this is a fully rendered version of the page including client-side content:
              
              Content: ${html.substring(0, 5000)} // Limiting content length for API
              
              Page Metadata:
              - Title: ${metadata.title}
              - Description: ${metadata.description}
              - OG Image: ${metadata.ogImage}
              
              Please provide analysis on:
              1. Content Quality and Clarity
              2. SEO Optimization
              3. Technical Implementation
              4. Conversion Potential
              5. Specific recommendations for improvement
              
              Consider both the initial page load and the fully rendered content in your analysis.`,
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
      metadata,
    };
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};