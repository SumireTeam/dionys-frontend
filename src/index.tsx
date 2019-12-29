import React from 'react';
import { render } from 'react-dom';

import App from '~components/app';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  if (!container) {
    return console.error('#app not found');
  }

  render(<App />, container);
});
