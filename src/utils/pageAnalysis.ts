import { fetchWithProxy } from './proxy/proxyService';
import { detectReactApp } from './detection/reactDetector';
import { extractMetadata, createContentFrame, waitForContent } from './content/contentExtractor';

export const fetchPageContent = async (url: string) => {
  try {
    const contents = await fetchWithProxy(url);
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      typeof contents === 'string' ? contents : JSON.stringify(contents),
      'text/html'
    );
    
    const metadata = extractMetadata(doc);
    metadata.isReactApp = detectReactApp(doc, contents);

    console.log('React detection result:', metadata.isReactApp);

    const iframe = createContentFrame(url, contents);
    const textContent = await waitForContent(iframe);
    
    // Clean up
    document.body.removeChild(iframe);

    console.log('Content capture complete:', {
      isReactApp: metadata.isReactApp,
      contentLength: textContent.length,
      hasHydrated: textContent.length > doc.body.innerText.length
    });

    return {
      metadata,
      textContent,
      htmlContent: doc.body.innerHTML,
      renderedContent: textContent
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
