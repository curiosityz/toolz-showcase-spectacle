const proxyUrls = [
  `https://api.allorigins.win/get?url=`,
  `https://cors-anywhere.herokuapp.com/`,
  `https://api.codetabs.com/v1/proxy?quest=`
];

export const fetchWithProxy = async (url: string) => {
  let proxyError = null;

  for (const proxyUrl of proxyUrls) {
    try {
      const response = await fetch(`${proxyUrl}${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        return data.contents || data.body || data;
      }
    } catch (err) {
      proxyError = err;
      continue;
    }
  }

  throw proxyError || new Error('All proxies failed');
};