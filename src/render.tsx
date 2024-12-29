import * as fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

const renderApp = () => {
  try {
    const appHtml = ReactDOMServer.renderToString(
      <StaticRouter location="/">
        <App />
      </StaticRouter>
    );

    // Read the existing index.html
    const indexHtml = fs.readFileSync('index.html', 'utf-8');

    // Inject the rendered app into the index.html
    const finalHtml = indexHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // Write the final HTML to the public directory
    fs.writeFileSync('public/index.html', finalHtml);

    console.log('Static HTML generated in public/index.html');
  } catch (error) {
    console.error('Error rendering app:', error);
  }
};

renderApp();
