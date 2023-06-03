import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-gk1mwq7vzst50zhs.eu.auth0.com"
      clientId="LSGAVOEPkUZKjenwFeHJYaQKLQG1Ayo1"
      redirectUri={window.location.origin + '/react-auth0/profile'}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

