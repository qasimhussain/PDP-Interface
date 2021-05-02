import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';


// import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core'
// import Portis from '@portis/web3';
import reportWebVitals from './reportWebVitals';
import IExecProvider from './provider/IExecProvider';

import { Web3Provider } from '@ethersproject/providers'

function getLibrary(provider, connector) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const App = React.lazy(() => import(/* webpackChunkName: "App" */'./App' ));

// ReactDOM.render(
//   <React.StrictMode>
//   <Provider store={configureStore()}>
//     <Web3ReactProvider getLibrary={getLibrary}>
//       <IExecProvider>
//         <App />
//       </IExecProvider>
//     </Web3ReactProvider>
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );



ReactDOM.render(
  <Provider store={configureStore()}>
    <Web3ReactProvider getLibrary={getLibrary}>
        <IExecProvider>
        <Suspense fallback={<div className="loading" />}>
          <App />
        </Suspense>
      </IExecProvider>
    </Web3ReactProvider>
  </Provider>,
  document.getElementById('root')
);
/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
reportWebVitals();
serviceWorker.unregister();
