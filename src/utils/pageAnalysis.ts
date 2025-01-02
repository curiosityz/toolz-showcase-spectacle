export const fetchPageContent = async (url: string) => {
  try {
    // First try direct fetch
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ToolzAnalyzer/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch the page (Status: ${response.status})`);
    }

    const html = await response.text();
    return html;
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
};

export const analyzePage = async (html: string, apiKey: string) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    // Extract both static and dynamic content
    const staticContent = doc.body.innerText || '';
    const scripts = Array.from(doc.getElementsByTagName('script')).map(script => script.src);
    const meta = {
      title: doc.title,
      description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      scripts: scripts,
      isReactApp: scripts.some(src => src.includes('react')),
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
              
              Static Content: ${staticContent}
              
              Page Metadata:
              - Title: ${meta.title}
              - Description: ${meta.description}
              - Is React App: ${meta.isReactApp}
              
              Please provide analysis on:
              1. Content Quality and Clarity
              2. SEO Optimization
              3. Technical Implementation
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

    return await response.json();
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};