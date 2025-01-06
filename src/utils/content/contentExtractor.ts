interface PageMetadata {
  title: string;
  description: string;
  ogImage: string;
  isReactApp: boolean;
}

export const extractMetadata = (doc: Document): PageMetadata => ({
  title: doc.title || '',
  description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
  ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
  isReactApp: false, // Will be updated after React detection
});

export const createContentFrame = (url: string, contents: string): HTMLIFrameElement => {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position: absolute; width: 1024px; height: 768px; top: -9999px; left: -9999px;';
  document.body.appendChild(iframe);

  if (iframe.contentDocument) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';

    iframe.contentDocument.open();
    iframe.contentDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <base href="${url}">
          ${meta.outerHTML}
        </head>
        <body>${contents}</body>
      </html>
    `);
    iframe.contentDocument.close();
  }

  return iframe;
};

export const waitForContent = async (iframe: HTMLIFrameElement): Promise<string> => {
  const maxAttempts = 20;
  const checkInterval = 500;

  const checkContent = () => {
    const content = iframe.contentDocument?.body.innerText || '';
    const root = iframe.contentDocument?.getElementById('root');
    return content.length > 10 && !content.includes('Loading') && root?.children.length > 0;
  };

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    console.log(`Attempt ${attempts + 1}: Checking for hydrated content...`);
    
    if (checkContent()) {
      console.log('Content successfully hydrated!');
      return iframe.contentDocument?.body.innerText || '';
    }
    
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }

  return iframe.contentDocument?.body.innerText || '';
};