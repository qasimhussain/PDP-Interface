import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Dashboard = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ '../wallet/dashboard')
);
const Account = React.lazy(() =>
  import(/* webpackChunkName: "viwes-second-menu" */ '../wallet/account')
);
const Orders = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ '../wallet/order')
);

const Datasets = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ '../wallet/dataset')
);

const Apps = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ '../wallet/apps')
);

class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
              <Route
                path={`${match.url}/dashboard`}
                render={props => <Dashboard {...props} />}
              />
              <Route
                path={`${match.url}/account`}
                render={props => <Account {...props} />}
              />
              <Route
                path={`${match.url}/order`}
                render={props => <Orders {...props} />}
              />
              <Route
                path={`${match.url}/datasets`}
                render={props => <Datasets {...props} />}
              />
              <Route
                path={`${match.url}/wallet/apps`}
                render={props => <Apps {...props} />}
              />
              <Route
                path={`${match.url}/wallet/results`}
                render={props => <Apps {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
