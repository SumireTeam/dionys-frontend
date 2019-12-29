import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import routes from '~/router';
import { store } from '~store';

export function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          {routes.map((route, index) => <Route key={index} {...route}></Route>)}
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
