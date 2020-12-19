import React from 'react';
import { Switch, Route } from 'react-router-dom';

import App from './Routes/App';
import Logs from './Routes/Logs';

const Router = () => {
    return (
        <Switch> {/* The Switch decides which component to show based on the current URL.*/}
            <Route exact path='/' component={App}></Route>
            <Route exact path='/logs' component={Logs}></Route>
        </Switch>
    );
}

export default Router;