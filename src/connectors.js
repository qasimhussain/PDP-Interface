import { InjectedConnector } from '@web3-react/injected-connector';
import { PortisConnector } from '@web3-react/portis-connector'

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })
export const portis = new PortisConnector({ dAppId: "90c7b0fc-d9d2-4879-b67b-53f3fb651609", networks: [5] });
