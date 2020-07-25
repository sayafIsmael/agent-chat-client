import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux'
import store from './store';
import {
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import Chat from './screen/Chat'
import Registration from './screen/Registration'



function App() {

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            exact
            strict
            render={props => <Registration {...props} />}
          />

          <Route
            exact
            path="/chat"
            exact
            strict
            render={props => <Chat {...props} />}
          />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
