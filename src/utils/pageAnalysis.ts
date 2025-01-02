export const fetchPageContent = async (url: string) => {
  try {
    // Use a CORS proxy to fetch the content
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch the page (Status: ${response.status})`);
    }

    const data = await response.json();
    return data.contents; // allorigins returns the page content in the 'contents' field
  } catch (error) {
    console.error('Error fetching page:', error);
    throw new Error('Unable to fetch the page. Please check the URL and try again.');
  }
};

export const analyzePage = async (html: string, apiKey: string) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    // Extract both static and dynamic content
    const staticContent = doc.body?.innerText || '';
    const scripts = Array.from(doc.getElementsByTagName('script')).map(script => script.src || script.textContent || '');
    const meta = {
      title: doc.title,
      description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      scripts: scripts,
      isReactApp: scripts.some(script => 
        script.includes('react') || 
        script.includes('jsx') || 
        html.includes('root') || 
        html.includes('__next')
      ),
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
              text: `Analyze this webpage content and metadata:
              
              Static Content: ${staticContent.substring(0, 5000)} // Limiting content length for API
              
              Page Metadata:
              - Title: ${meta.title}
              - Description: ${meta.description}
              - Is React App: ${meta.isReactApp}
              - Number of Scripts: ${scripts.length}
              
              Please provide analysis on:
              1. Content Quality and Clarity
              2. SEO Optimization
              3. Technical Implementation (${meta.isReactApp ? 'React-based' : 'Standard HTML'})
              4. Conversion Potential
              5. Specific recommendations for improvement`,
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
      technicalDetails: {
        isReactApp: meta.isReactApp,
        scriptsCount: scripts.length,
        title: meta.title,
        hasDescription: !!meta.description,
      }
    };
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};