import React from 'react';
import { IExec } from "iexec";
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from '../hooks';
import {
  injected,
  portis,
} from '../connectors'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { Spinner } from '../Spinner';

const connectorsByName = {
  'Injected': injected,
  'Portis': portis,
}

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}


const IExecContext = React.createContext(null);

export default function IExecProvider(props) {
  const [iexec, setIexec] = React.useState(null);
  const [provider, setProvider] = React.useState(null);
  const { chainId, activate, connector, active, error } = useWeb3React();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  console.log("triedEager", triedEager);

  React.useEffect(() => {
    async function provide() {
      const provider = await connector.getProvider();
      console.log("provider", provider);
      setProvider(provider);
    }
    if (active) {
      provide();
    }
  }, [ connector, active ] );

  React.useEffect(() => {
    if (provider != null) {
      setIexec(new IExec({
        ethProvider: provider,
        chainId: chainId
      }));
    }
  }, [ provider, chainId ]);

  if (iexec === null) {
    return (
      <>
        <div>
          <h1>Initializing..</h1>
          {!!error && (<h2>{getErrorMessage(error)}</h2>)}
        </div>
        {Object.keys(connectorsByName).map(name => {
          const currentConnector = connectorsByName[name]
          const activating = currentConnector === activatingConnector
          const connected = currentConnector === connector
          const disabled = !triedEager || !!activatingConnector || connected || !!error
          return (
            <button
              style={{
                height: '3rem',
                borderRadius: '1rem',
                borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
                cursor: disabled ? 'unset' : 'pointer',
                position: 'relative'
              }}
              disabled={disabled}
              key={name}
              onClick={() => {
                setActivatingConnector(currentConnector)
                activate(connectorsByName[name])
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  margin: '0 0 0 1rem'
                }}
              >
                {activating && <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />}
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </button>
          )
        })}
      </>
    );
  }

  return (
    <IExecContext.Provider
      value={{
        iexec: iexec,
        web3: provider,
      }}
    >
      {props.children}
    </IExecContext.Provider>
  )
}

export const withIexec = (WrappedComponent) => {
  class IExecConsumer extends React.Component { // eslint-disable-line
    render() {
      return (
        <IExecContext.Consumer>
          {(context) => (
            <WrappedComponent
              {...this.props}
              iexec={context.iexec}
              web3={context.web3}
            />
          )}
        </IExecContext.Consumer>
      );
    }
  }

  if (WrappedComponent.defaultProps) {
    IExecConsumer.defaultProps = { ...WrappedComponent.defaultProps };
  }

  return hoistNonReactStatics(IExecConsumer, WrappedComponent);
};
