export const detectReactApp = (doc: Document, contents: string): boolean => {
  const indicators = [
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

  return indicators.some(indicator => {
    try {
      return indicator();
    } catch {
      return false;
    }
  });
};