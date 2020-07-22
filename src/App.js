import React, { useState, useEffect } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import Chat from './screen/Chat'
import Registration from './screen/Registration'



function App() {

  return (
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
  );
}

export default App;
