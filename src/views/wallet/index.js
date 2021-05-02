import {withIexec} from '../../provider/IExecProvider';
import AppLayout from '../../layout/AppLayout';
import React, {Suspense, useEffect, useState} from 'react';
import {useWeb3React} from '@web3-react/core'
import {utils} from "iexec";
import dashboard from './dashboard';
import fs from 'fs';

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import axios from 'axios';


const ViewDashboard = React.lazy(() =>
    import(/* webpackChunkName: "views" */ './dashboard')
);
const ViewAccount = React.lazy(() =>
    import(/* webpackChunkName: "views" */ './account')
);
const ViewOrder = React.lazy(() =>
    import(/* webpackChunkName: "views" */ './order')
);
const ViewDataSet = React.lazy(() =>
    import(/* webpackChunkName: "views" */ './dataset')
);

const ViewRequest = React.lazy(() =>
    import(/* webpackChunkName: "views" */ './request')
);

const ViewApps = React.lazy(() =>
    import(/* webpackChunkName: "views" */ './apps')
);

const ViewResults = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './results')
);

const ViewDetails = React.lazy(() =>
    import(/* webpackChunkName: "views" */ './details')
);

function App(props) {
    // eslint-disable-next-line
    const {iexec, match} = props;
    const {chainId} = useWeb3React();
    const [address, setAddress] = useState("");
    const [wallet, setWallet] = useState("");
    const [rlcWallet, setRLCWallet] = useState("");
    const [balance, setBalance] = useState("");
    const [datasetCount, setDatasetCount] = useState("");
    const [appCount, setAppCount] = useState("");

    const [loading, setLoading] = useState(true);
    let [amount, setAmount] = useState("");
    let secretFileContent = '';
    const [files, setFiles] = useState([]);

    const networkOutput = document.getElementById("network");
    const addressOutput = document.getElementById("address");
    const rlcWalletOutput = document.getElementById("rlc-wallet");
    const nativeWalletOutput = document.getElementById("native-wallet");
    const accountOutput = document.getElementById("account");

    const accountDepositInput = document.getElementById("account-deposit-input");
    const accountDepositButton = document.getElementById("account-deposit-button");
    const accountDepositError = document.getElementById("account-deposit-error");

    const accountWithdrawInput = document.getElementById("account-withdraw-input");
    const accountWithdrawButton = document.getElementById("account-withdraw-button");
    const accountWithdrawError = document.getElementById("account-withdraw-error");

    const datasetsShowInput = document.getElementById("datasets-address-input");
    const datasetsShowButton = document.getElementById("datasets-show-button");
    const datasetsShowError = document.getElementById("datasets-show-error");
    const datasetShowOutput = document.getElementById("datasets-details-output");
    const datasetsCountButton = document.getElementById("datasets-count-button");
    const datasetsCountError = document.getElementById("datasets-count-error");
    const datasetsCountOutput = document.getElementById("datasets-count-output");
    const datasetsIndexInput = document.getElementById("datasets-index-input");
    const datasetsShowIndexButton = document.getElementById("datasets-showindex-button");
    const datasetsShowIndexError = document.getElementById("datasets-showindex-error");
    const datasetsShowIndexOutput = document.getElementById("datasets-showindex-output");

    const datasetDeployedAddressInput = document.getElementById("dataset-deployed-address-input");
    const datasetDeployedKeystoreInput = document.getElementById("dataset-deployed-keystore-input");
    const datasetPushSecretButton = document.getElementById("dataset-push-secret-button");
    const datasetPushSecretError = document.getElementById("dataset-push-secret-error");
    const datasetPushSecretOutput = document.getElementById("dataset-push-secret-output");

    const datasetsDeployNameInput = document.getElementById("datasets-deployname-input");
    const datasetsDeployMultiaddrInput = document.getElementById("datasets-deploymultiaddr-input");
    const datasetsDeployButton = document.getElementById("datasets-deploy-button");
    const datasetsDeployError = document.getElementById("datasets-deploy-error");
    const datasetsDeployOutput = document.getElementById("datasets-deploy-output");

    const sellDatasetAddressInput = document.getElementById("sell-datasetaddress-input");
    const sellDatasetPriceInput = document.getElementById("sell-datasetprice-input");
    const sellDatasetVolumeInput = document.getElementById("sell-volume-input");
    const sellDatasetApprestrictInput = document.getElementById("sell-apprestrict-input");
    const sellPublishButton = document.getElementById("sell-publish-button");
    const sellPublishError = document.getElementById("sell-publish-error");
    const sellPublishOutput = document.getElementById("sell-publish-output");
    const sellUnpublishOrderhashInput = document.getElementById("sell-unpublishhash-input");
    const sellUnpublishButton = document.getElementById("sell-unpublish-button");
    const sellUnpublishError = document.getElementById("sell-unpublish-error");
    const sellUnpublishOutput = document.getElementById("sell-unpublish-output");
    const sellCancelOrderhashInput = document.getElementById("sell-cancelhash-input");
    const sellCancelButton = document.getElementById("sell-cancel-button");
    const sellCancelError = document.getElementById("sell-cancel-error");
    const sellCancelOutput = document.getElementById("sell-cancel-output");

    const orderbookDatasetAddressInput = document.getElementById("orderbook-datasetaddress-input");
    const orderbookShowButton = document.getElementById("orderbook-show-button");
    const orderbookShowError = document.getElementById("orderbook-show-error");
    const orderbookShowOutput = document.getElementById("orderbook-show-output");

//  Researcers
    const appsShowInput = document.getElementById("apps-address-input");
    const appsShowButton = document.getElementById("apps-show-button");
    const appsShowError = document.getElementById("apps-show-error");
    const appShowOutput = document.getElementById("apps-details-output");
    const appsCountButton = document.getElementById("apps-count-button");
    const appsCountError = document.getElementById("apps-count-error");
    const appsCountOutput = document.getElementById("apps-count-output");
    const appsIndexInput = document.getElementById("apps-index-input");
    const appsShowIndexButton = document.getElementById("apps-showindex-button");
    const appsShowIndexError = document.getElementById("apps-showindex-error");
    const appsShowIndexOutput = document.getElementById("apps-showindex-output");

    const appsDeployNameInput = document.getElementById("apps-deployname-input");
    const appsDeployMultiaddrInput = document.getElementById("apps-deploymultiaddr-input");
    const appsDeployMREnclaveInput = document.getElementById("app-deploy-mrenclave-input");
    const appsDeployChecksumInput = document.getElementById("apps-deploychecksum-input");

    const appsDeployButton = document.getElementById("apps-deploy-button");
    const appsDeployError = document.getElementById("apps-deploy-error");
    const appsDeployOutput = document.getElementById("apps-deploy-output");

    const appRunDatasetMultiaddrInput = document.getElementById("app-run-dataset-address-input");
    const appRunPriceInput = document.getElementById("app-run-price-input");
    const appRunAddressInput = document.getElementById("app-run-address-input");
    const appRunButton = document.getElementById("app-run-button");
    const appRunError = document.getElementById("app-run-error");
    const appRunOutput = document.getElementById("app-run-output");

    const resultsTaskIdInput = document.getElementById("results-taskid-input");
    const resultsShowTaskButton = document.getElementById("results-showtask-button");
    const resultsShowTaskError = document.getElementById("results-showtask-error");
    const resultsShowTaskOutput = document.getElementById("results-taskdetails-output");

    const resultsDownloadInput = document.getElementById("results-download-input");
    const resultsDownloadButton = document.getElementById("results-download-button");
    const resultsDownloadError = document.getElementById("results-download-error");

    const hiddenDataFileInput = React.useRef(null);
    const hiddenKeyFileInput = React.useRef(null);



    const pdpEngineUrl = 'http://localhost:9000/';
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const addr = await iexec.wallet.getAddress();
            const wallet = await iexec.wallet.checkBalances(addr);
            const balance = await iexec.account.checkBalance(addr); //account

            const nativeWalletText = wallet.wei.isZero()
                ? '<a href="https://goerli-faucet.slock.it/" target="_blank">Need some goerli ether to continue?</a>'
                : `${utils.formatEth(wallet.wei)} ether`;

            const rlcWalletText = wallet.nRLC.isZero()
                ? `<a href="https://faucet.iex.ec/goerli/${addr}" target="_blank">Need some goerli RLC to continue?</a>`
                : `${utils.formatRLC(wallet.nRLC)} RLC`;

            const accountOutputText = `${utils.formatRLC(balance.stake)} RLC (+ ${utils.formatRLC(balance.locked)} RLC locked)`;
            setAddress(addr);
            setWallet(nativeWalletText);
            setRLCWallet(rlcWalletText);
            console.log("rlc wallet: " + rlcWalletText);
            setLoading(false);

            setBalance(accountOutputText);


            let datasetCountResponse = "";
            let appCountResponse = "";
            try {
                const d_count = await iexec.dataset.countUserDatasets(
                    await iexec.wallet.getAddress()
                );

                datasetCountResponse = `TOTAL DEPLOYED DATASETS: ${d_count}`;
                const a_count = await iexec.app.countUserApps(
                    await iexec.wallet.getAddress()
                );
                appCountResponse = `TOTAL DEPLOYED APPLICATIONs: ${a_count}`;

            } catch (error) {
            } finally {

                setDatasetCount(datasetCountResponse);
                setAppCount(appCountResponse);
            }
        }

        fetchData();
        // refreshUser(iexec);
    }, [iexec.wallet]);

    async function handleDeposit() {
        try {

            accountDepositButton.disabled = true;
            accountDepositError.innerText = "";
            const amount = accountDepositInput.value;
            await iexec.account.deposit(amount);
            accountDepositError.innerText = "Success";
            // fetchData();
            refreshUser(iexec)();
        } catch (error) {
            accountDepositError.innerText = error;
        } finally {
            accountDepositButton.disabled = false;
        }
    }

    async function handleWithdraw() {
        try {
            accountWithdrawButton.disabled = true;
            accountWithdrawError.innerText = "";
            const amount = accountWithdrawInput.value;
            await iexec.account.withdraw(amount);
            accountWithdrawError.innerText = "Success";
            refreshUser(iexec);
        } catch (error) {
            accountWithdrawError.innerText = error;
        } finally {
            accountWithdrawButton.disabled = false;
        }
    }

    async function refreshUser(iexec) {
        setLoading(true);
        const addr = await iexec.wallet.getAddress();
        const wallet = await iexec.wallet.checkBalances(addr);
        const balance = await iexec.account.checkBalance(addr); //account

        const nativeWalletText = wallet.wei.isZero()
            ? '<a href="https://goerli-faucet.slock.it/" target="_blank">Need some goerli ether to continue?</a>'
            : `${utils.formatEth(wallet.wei)} ether`;

        const rlcWalletText = wallet.nRLC.isZero()
            ? `<a href="https://faucet.iex.ec/goerli/${addr}" target="_blank">Need some goerli RLC to continue?</a>`
            : `${utils.formatRLC(wallet.nRLC)} RLC`;

        const accountOutputText = `${utils.formatRLC(balance.stake)} RLC (+ ${utils.formatRLC(balance.locked)} RLC locked)`;
        setAddress(addr);
        setWallet(nativeWalletText);
        setRLCWallet(rlcWalletText);
        setLoading(false);
        setBalance(accountOutputText);
    }

    async function handleCountUserDatasets() {

        try {
            datasetsCountButton.disabled = true;
            datasetsCountError.innerText = "";
            datasetsCountOutput.innerText = "";
            const count = await iexec.dataset.countUserDatasets(
                await iexec.wallet.getAddress()
            );
            // testing
            // const resp = await notifyDatasetDeploy();
            // const isExist = await isSecretExist();
            // const resp = notifyDatasetDeploy('0x87671e5bE51a94e013D2dd22cD79e33080D63543','0x062ebB2443CE8dFd3D38A24F77289743aBad80f0',"q");
            // console.log(resp);
            datasetsCountOutput.innerText = `TOTAL DEPLOYED DATASETS: ${count}`;
        } catch (error) {
            datasetsCountError.innerText = error;
        } finally {
            datasetsCountButton.disabled = false;
        }
    }

    async function handleShowUserDatasets() {
        try {
            datasetsShowIndexButton.disabled = true;
            datasetsShowIndexError.innerText = "";
            datasetsShowIndexOutput.innerText = "";
            const datasetIndex = datasetsIndexInput.value;
            const res = await iexec.dataset.showUserDataset(
                datasetIndex,
                await iexec.wallet.getAddress()
            );
            datasetsShowIndexOutput.innerText = JSON.stringify(res, null, 2);
        } catch (error) {
            datasetsShowIndexError.innerText = error;
        } finally {
            datasetsShowIndexButton.disabled = false;
        }
    }

    async function handleShowUserDatasetsByAddress() {
        try {
            datasetsShowButton.disabled = true;
            datasetsShowError.innerText = "";
            datasetShowOutput.innerText = "";
            const datasetAddress = datasetsShowInput.value;
            const res = await iexec.dataset.showDataset(datasetAddress);
            datasetShowOutput.innerText = JSON.stringify(res, null, 2);
        } catch (error) {
            datasetsShowError.innerText = error;
        } finally {
            datasetsShowButton.disabled = false;
        }
    }

    async function handleCountApps() {
        try {
            appsCountButton.disabled = true;
            appsCountError.innerText = "";
            appsCountOutput.innerText = "";
            // const count = await iexec.app.countUserApps(
            //     await iexec.wallet.getAddress()
            // );
            // appsCountOutput.innerText = `TOTAL DEPLOYED APPLICATIONS: ${count}`;
            // const resp = notifyDatasetDeploy('0x87671e5bE51a94e013D2dd22cD79e33080D63543','0x062ebB2443CE8dFd3D38A24F77289743aBad80f0',"q");
            // console.log(resp);

        } catch (error) {
            appsCountError.innerText = error;
        } finally {
            appsCountButton.disabled = false;
        }
    }

// ------- dataset deploy:

    function onFileUpload(event) {
        event.preventDefault();
        // Get the file Id
        let id = event.target.id;
        // Create an instance of FileReader API
        let file_reader = new FileReader();
        // Get the actual file itself
        let file = event.target.files[0];
        file_reader.onload = () => {
            // After uploading the file
            // appending the file to our state array
            // set the object keys and values accordingly
            setFiles([...files, {file_id: id, uploaded_file: file_reader.result}]);
        };
        // reading the actual uploaded file
        file_reader.readAsDataURL(file);
    }

    function onKeyFileUpload(event) {
        event.preventDefault();
        // Get the file Id
        let id = event.target.id;
        // Create an instance of FileReader API
        let file_reader = new FileReader();
        // Get the actual file itself
        let file = event.target.files[0];
        file_reader.onload = () => {
            // After uploading the file
            // appending the file to our state array
            // set the object keys and values accordingly
            setFiles([...files, {file_id: id, uploaded_file: file_reader.result}]);
        };
        // reading the actual uploaded file
        file_reader.readAsDataURL(file);
    }

    async function postDatasetToIPFS() {
        return new Promise((resolve, reject) => {
            let ipfsHash = '';
            let formData = new FormData();
            formData.append('data-binary', files[0]);

            let apiEndpointURL = 'https://e0cl4f1xo2-e0ky84jkon-ipfs.de0-aws.kaleido.io/api/v0/add';
            axios.post(apiEndpointURL,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    auth: {
                        username: 'e0nustfzpr',
                        password: 'pY8FdMmnzVXzxclz_RuWcJjmqUrNJVyeaAohIbifdhY'
                    }
                }
            ).then(function (response) {
                ipfsHash = response;
            }).catch(function (error) {
                console.log('FAILURE!!');
            });
            setTimeout(() => {
                console.log('loop completed')
                resolve(ipfsHash)
            }, 2000)
        });

    }

    function notifyDatasetDeploy(address,datasetAddress,datastname) {
      return new Promise((resolve, reject) => {

        let responseStr = "";
        const request = { datasetAddress: datasetAddress,
          datasetDescription: datastname,
          datasetPrice: 0,
          datasetVolume: 0,
        };

          const endpoint = `/pdp/patient/${address}/dataset`;
        let apiEndpointURL = pdpEngineUrl + endpoint;
        console.log(apiEndpointURL);

        axios.post(apiEndpointURL,
              request,
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              }
          ).then(function (response) {
              responseStr = response;
          }).catch(function (error) {
              console.log('FAILURE!!');
          });
          setTimeout(() => {
              console.log('posted')
              resolve(responseStr)
          }, 2000)
      });
    }

    async function handleDeployDataset(e) {
        try {
            e.preventDefault();
            // console.log(files);
            datasetsDeployButton.disabled = true;
            datasetsDeployError.innerText = "";
            datasetsDeployOutput.innerText = "";

            const owner = await iexec.wallet.getAddress();
            const name = datasetsDeployNameInput.value;
            const checksum = "0x0000000000000000000000000000000000000000000000000000000000000000"; // not used today

            const ipfsHash = await postDatasetToIPFS();

            const ipfsURL = "https://e0nustfzpr:pY8FdMmnzVXzxclz_RuWcJjmqUrNJVyeaAohIbifdhY@e0cl4f1xo2-e0ky84jkon-ipfs.de0-aws.kaleido.io/ipfs/";
            const multiaddr = ipfsURL + ipfsHash;
            console.log("##multiaddr", multiaddr);
            await iexec.dataset.deployDataset({
                owner,
                name,
                multiaddr,
                checksum
            }).then(function (datasetAddress) {
                debugger
                console.log("##datasetAddress: ", datasetAddress);
                datasetsDeployOutput.innerText = `Dataset deployed at address ${datasetAddress}`;
                const pushSecretResponse = pushSecret(datasetAddress, files[1]);
                // refreshUser(iexec)();
                // TODO : QQ >> chck aysnc
                const resp = notifyDatasetDeploy(owner,datasetAddress,name);
            });
       } catch (error) {
         datasetsDeployError.innerText = error;
       } finally {
         datasetsDeployButton.disabled = false;
       }
    }

    async function pushSecret(datasetAddress, secretFile) {
        // return new Promise((resolve, reject) => {
        let pushSecretResponse = "";
        debugger;
        console.log("## datasetAddressdatasetAddressdatasetAddressdatasetAddress")
        try {
            //readfile contents
            // let fr = new FileReader();
            // let text = fr.readAsDataURL(secretFile);
            const secret = '90066aed6813e7bf78af155a1b79b6dea404f2012b4f81bccf32705da4514466|37b86c57c7836edcd2734c7b70737870';
            const pushed = await iexec.dataset.pushDatasetSecret(
                datasetAddress.address,
                secret
            );
            pushSecretResponse = JSON.stringify(pushed, null, 2);
        } catch (error) {
            pushSecretResponse = error;
        } finally {
            return pushSecretResponse;
        }
        // });

    }

//  --- test utils func now:
    async function handlePushSecret() {
        try {
            datasetPushSecretButton.disabled = true;
            datasetPushSecretError.innerText = "";
            datasetPushSecretOutput.innerText = "";
            // const val = datasetDeployedKeystore.click();
            // console.log(val);
            const datasetAddress = datasetDeployedAddressInput.value;
            const secret = datasetDeployedKeystoreInput.value;

            const pushed = await iexec.dataset.pushDatasetSecret(
                datasetAddress,
                secret,
            );
            datasetPushSecretOutput.innerText = JSON.stringify(pushed, null, 2);
            datasetPushSecretOutput.innerText = pushed;
        } catch (error) {
            datasetPushSecretError.innerText = error;
        } finally {
            datasetPushSecretButton.disabled = false;
        }
    }

    async function isSecretExist() {
        const isSecretSet = await iexec.dataset.checkDatasetSecretExists(
            '0xeE0FDDe6F06b65532e717e3e8AC4E598279875ac',
        );
        console.log('secret exists:', isSecretSet);
    }

// ------- dataset sell:

    //  call from onclick cell: dataset = dataset requests
    function handleDatasetAcceptRequest(){
      const datasetAddress = '';
      const appAddress = '';
      const datasetRequestId ='';
      // QQ >> check async
      const resp = sellDataset(datasetAddress,appAddress,datasetRequestId);
    }

    function notifyDatasetRequestAccept(datasetRequestId) {
      return new Promise((resolve, reject) => {

        let responseStr = "";
        const request = { datasetRequestId: datasetRequestId
        };

        const endpoint = `/pdp/dataset/request/accept`;
        let apiEndpointURL = pdpEngineUrl + endpoint;
        console.log(apiEndpointURL);

        axios.post(apiEndpointURL,
              request,
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              }
          ).then(function (response) {
              responseStr = response;
          }).catch(function (error) {
              console.log('FAILURE!!', error);
          });
          setTimeout(() => {
              console.log('posted')
              resolve(responseStr)
          }, 2000)
      });
    }

    async function sellDataset(datasetAddress,appAddress,datasetRequestId) {
      let response = "";
      try {

          const dataset = datasetAddress;
          const datasetprice = '0'; //hd to  0 for now:
          const volume = '10'; //hd to 10 for now:
          const apprestrict = appAddress;
          const datasetOrder = await iexec.order.createDatasetorder({
              dataset,
              datasetprice,
              volume,
              apprestrict
            });
          console.log(datasetOrder);

          const signedOrder = await iexec.order.signDatasetorder(datasetOrder);
          console.log(signedOrder);

          const orderHash = await iexec.order.publishDatasetorder(signedOrder);
          console.log(orderHash);

          response = `Order published with hash ${orderHash}`;

          const resp = notifyDatasetRequestAccept(datasetRequestId);
        } catch (error) {
          response = error;
        } finally {
          console.log(response);
        }
    }



    async function handlePublishDataset() {
        try {

            sellPublishButton.disabled = true;
            sellPublishError.innerText = "";
            sellPublishOutput.innerText = "";
            const dataset = sellDatasetAddressInput.value;
            const datasetprice = sellDatasetPriceInput.value;
            const volume = sellDatasetVolumeInput.value;
            const apprestrict = sellDatasetApprestrictInput.value;
            const datasetOrder = await iexec.order.createDatasetorder({
                dataset,
                datasetprice,
                volume,
                apprestrict
            });
            console.log(datasetOrder);

            const signedOrder = await iexec.order.signDatasetorder(datasetOrder);
            console.log(signedOrder);

            const orderHash = await iexec.order.publishDatasetorder(signedOrder);
            console.log(orderHash);

            sellPublishOutput.innerText = `Order published with hash ${orderHash}`;
            sellUnpublishOrderhashInput.value = orderHash;
            sellCancelOrderhashInput.value = orderHash;
        } catch (error) {
            sellPublishError.innerText = error;
        } finally {
            sellPublishButton.disabled = false;
        }
    }

    async function handleUnpublishDataset() {
        try {
            sellUnpublishButton.disabled = true;
            sellUnpublishError.innerText = "";
            sellUnpublishOutput.innerText = "";
            const orderHash = sellUnpublishOrderhashInput.value;
            const unpublishedOrderHash = await iexec.order.unpublishDatasetorder(
                orderHash
            );
            sellUnpublishOutput.innerText = `Order with hash ${unpublishedOrderHash} is unpublished`;
        } catch (error) {
            sellUnpublishError.innerText = error;
        } finally {
            sellUnpublishButton.disabled = false;
        }
    }

    async function handleCancelOrder() {
        try {
            sellCancelButton.disabled = true;
            sellCancelError.innerText = "";
            sellCancelOutput.innerText = "";
            const orderHash = sellCancelOrderhashInput.value;
            const {order} = await iexec.orderbook.fetchDatasetorder(orderHash);
            const {txHash} = await iexec.order.cancelDatasetorder(order);
            sellCancelOutput.innerText = `Order canceled (tx:${txHash})`;
            refreshUser(iexec)();
        } catch (error) {
            sellCancelError.innerText = error;
        } finally {
            sellCancelButton.disabled = false;
        }
    }

    async function handleShowOrderBook() {
        try {
            orderbookShowButton.disabled = true;
            orderbookShowError.innerText = "";
            orderbookShowOutput.innerText = "";
            const datasetAddress = orderbookDatasetAddressInput.value;
            const res = await iexec.orderbook.fetchDatasetOrderbook(datasetAddress);
            orderbookShowOutput.innerText = JSON.stringify(res, null, 2);
        } catch (error) {
            orderbookShowError.innerText = error;
        } finally {
            orderbookShowButton.disabled = false;
        }
    }

    async function handleShowAppsByAddress() {
      try {
          appsShowButton.disabled = true;
          appsShowError.innerText = "";
          appShowOutput.innerText = "";

          const appAddress = appsShowInput.value;
          const res = await iexec.app.showApp(appAddress);

          appShowOutput.innerText = JSON.stringify(res, null, 2);

        } catch (error) {
          appsShowError.innerText = error;
        } finally {
          appsShowButton.disabled = false;
        }
    }

    async function handleShowAppsByIndex() {
      try {
          appsShowIndexButton.disabled = true;
          appsShowIndexError.innerText = "";
          appsShowIndexOutput.innerText = "";
          const appIndex = appsIndexInput.value;
          const res = await iexec.app.showUserApp(
            appIndex,
            await iexec.wallet.getAddress()
          );
          appsShowIndexOutput.innerText = JSON.stringify(res, null, 2);

        } catch (error) {
          appsShowIndexError.innerText = error;
        } finally {
          appsShowIndexButton.disabled = false;
        }
    }

// ------- app Deploy:
    function notifyAppDeploy(wallet,appAddress,appName) {
      return new Promise((resolve, reject) => {
        let responseStr = "";

        const request = {
            appAddress: appAddress,
            appDescription: "string",
            appName:appName
        };

        const endpoint = `/pdp/researcher/${wallet}/application`;
        let apiEndpointURL = pdpEngineUrl + endpoint;
        console.log("-----",apiEndpointURL);

        axios.post(apiEndpointURL,
              request,
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              }
          ).then(function (response) {
              responseStr = response;
          }).catch(function (error) {
              console.log('FAILURE!!');
          });
          setTimeout(() => {
              console.log('posted')
              resolve(responseStr)
          }, 2000)
        });
    }

    async function handleAppDeploy() {
      try {
          appsDeployButton.disabled = true;
          appsDeployError.innerText = "";
          appsDeployOutput.innerText = "";
          const owner = await iexec.wallet.getAddress();
          const name = appsDeployNameInput.value;
          const type = "DOCKER"; // only "DOCKER" is supported for now
          const multiaddr = appsDeployMultiaddrInput.value;
          const checksum = appsDeployChecksumInput.value;
          const mrenclave = appsDeployMREnclaveInput.value; // used for Scone apps
          iexec.app.deployApp({
            owner,
            name,
            type,
            multiaddr,
            checksum,
            mrenclave
          }).then(async address => {
            appsDeployOutput.innerText = `App deployed at address ${address}`;
            debugger;
            const resp =  await notifyAppDeploy(owner,address.address,name);
            // const resp =  await notifyAppDeploy('0xA9f5c282B958B7227D2C008646D6161874589481','0xb8248FdA547fE5829912aFE42986AD9bbD216221','ALS-1');
            // refreshUser(iexec)();
          });

        } catch (error) {
          appsDeployError.innerText = error;
        } finally {
          appsDeployButton.disabled = false;
        }
    }

    //  call from onclick cell: application = dataset available
    async function handleDatasetRequest(){
      const owner = await iexec.wallet.getAddress();
      const datasetAddress = '';
      const researcherAppAddress = '';

      const resp = await notifyDatasetRequest(owner,datasetAddress,researcherAppAddress);
    }

    function notifyDatasetRequest(wallet, datasetAddress, researcherAppAddress) {
      return new Promise((resolve, reject) => {

        let responseStr = "";
        const request = {
          datasetRequestInfo: "string",
          patientDatasetAddress: datasetAddress,
          researcherAppAddress: researcherAppAddress,
          status: 'REQUESTED',
        };

        const endpoint = `/pdp/dataset/${wallet}/request`;
        let apiEndpointURL = pdpEngineUrl + endpoint;
        console.log(apiEndpointURL);

        axios.post(apiEndpointURL,
              request,
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              }
          ).then(function (response) {
              responseStr = response;
          }).catch(function (error) {
              console.log('FAILURE!!');
          });
          setTimeout(() => {
              console.log('posted')
              resolve(responseStr)
          }, 2000)
      });
    }

    //  call from onclick cell: application = approved request?
    async function appRun(appAddress,appDatasetAddress) {
      try {
        appRunButton.disabled = true;
        appRunError.innerText = "";
        appRunOutput.innerText = "";

        const userAddress = await iexec.wallet.getAddress();

        const category = '1'; // TODO: hd to TEE
        const params = ""; // TODO: hd to none
        // if (!checkStorageInitialized()){
        //   console.log("not init")
        //   initStorage();
        // }

        //publishing app:
        const app = appDatasetAddress;
        const appprice = '0'; //TODO: hd to none
        const volume = '1'; //TODO: hd to n
        const tag = 'tee';
        //TODO: could restrict the access to requester only.
        const signedOrder = await iexec.order.signApporder(
          await iexec.order.createApporder({
            app,
            appprice,
            volume,
            tag
          })
        );
        const orderHash = await iexec.order.publishApporder(signedOrder);
        console.log(`Order published with hash ${orderHash}`)

        const { datasetOrders } = await iexec.orderbook.fetchDatasetOrderbook(appDatasetAddress);
        const datasetOrder = datasetOrders && datasetOrders[0] && datasetOrders[0].order;
        if (!datasetOrder) throw Error(`no datasetorder found for the dataset address ${appDatasetAddress}`);

        const { appOrders } = await iexec.orderbook.fetchAppOrderbook(appAddress);
        const appOrder = appOrders && appOrders[0] && appOrders[0].order;
        if (!appOrder) throw Error(`no apporder found for app ${appAddress}`);

        const { workerpoolOrders } = await iexec.orderbook.fetchWorkerpoolOrderbook({ category });
        const workerpoolOrder = workerpoolOrders && workerpoolOrders[0] && workerpoolOrders[0].order;
        if (!workerpoolOrder) throw Error(`no workerpoolorder found for category ${category}`);

  //        TODO : request order
        const requestOrderToSign = await iexec.order.createRequestorder({
          app: appOrder.app,
          appmaxprice: appOrder.appprice,
          dataset: datasetOrder.dataset,
          datasetmaxprice: datasetOrder.datasetprice,
          workerpoolmaxprice: workerpoolOrder.workerpoolprice,
          requester: userAddress,
          volume: 1,
          tag:tag,
          params: params,
          category: category
        });

        // TODO: sign order
        const requestOrder = await iexec.order.signRequestorder(requestOrderToSign);

        // TODO: match order = find a deal
        const res = await iexec.order.matchOrders({
          datasetOrder: datasetOrder,
          apporder: appOrder,
          workerpoolorder: workerpoolOrder,
          requestorder: requestOrder
        });

        // TODO: app run
        appRunOutput.innerText = JSON.stringify(res, null, 2);
        console.log(`Order published with dealId ${res.dealid}`)
        // refreshUser(iexec)();
        // appRunOutput.innerText = `App Run: ${resp} .`;

        const taskId = await taskShow(res.dealId);
        const resp = await notifyTaskCreation(userAddress,taskId, appDatasetAddress, appAddress );
        } catch (error) {
          appRunError.innerText = error;
        } finally {
          appRunButton.disabled = false;
        }
    }

    function notifyTaskCreation(wallet, taskAddress, datasetAddress, appAddress) {
      return new Promise((resolve, reject) => {

        let responseStr = "";
        const request = {
          appAddress: appAddress,
          datasetAddress: datasetAddress,
          taskAddress: taskAddress,
          taskDescription: "string"
        };

        const endpoint = `/pdp/researcher/${wallet}/task`;
        let apiEndpointURL = pdpEngineUrl + endpoint;
        console.log(apiEndpointURL);

        axios.post(apiEndpointURL,
              request,
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              }
          ).then(function (response) {
              responseStr = response;
          }).catch(function (error) {
              console.log('FAILURE!!');
          });
          setTimeout(() => {
              console.log('posted')
              resolve(responseStr)
          }, 2000)
      });
    }

    async function taskShow(dealId) {
      let taskId = "";
      try {

        const deal = await iexec.deal.show(dealId);
        taskId = deal.tasks["0"];
      }catch (error) {
        console.log(error)
      } finally {
        console.log(taskId)
        return taskId;
      }
    }


    async function handleTaskShow() {
      try {
          resultsShowTaskButton.disabled = true;
          resultsShowTaskError.innerText = "";
          resultsShowTaskOutput.innerText = "";

          const taskId = resultsTaskIdInput.value;
          const res = await iexec.task.show(taskId);
          resultsShowTaskOutput.innerText = JSON.stringify(res, null, 2);
        } catch (error) {
          resultsShowTaskError.innerText = error;
        } finally {
          resultsShowTaskButton.disabled = false;
        }
    }

    async function downloadResults(taskId) {
        try {

            const res = await iexec.task.fetchResults(taskId, {
                ipfsGatewayURL: "https://ipfs.iex.ec"
            });
            const file = await res.blob();
            const fileName = `${taskId}.zip`;
            if (window.navigator.msSaveOrOpenBlob)
                window.navigator.msSaveOrOpenBlob(file, fileName);
            else {
                const a = document.createElement("a");
                const url = URL.createObjectURL(file);
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        } catch (error) {
            console.log(error);
        } finally {
            console.log("downloaded");
        }
    }
    async function handleDownloadResults() {
      try {
          resultsDownloadButton.disabled = true;
          resultsDownloadError.innerText = "";

          const taskId = resultsDownloadInput.value;
          const res = await iexec.task.fetchResults(taskId, {
               ipfsGatewayURL: "https://ipfs.iex.ec"
             });
          const file = await res.blob();
          const fileName = `${taskId}.zip`;
          if (window.navigator.msSaveOrOpenBlob)
           window.navigator.msSaveOrOpenBlob(file, fileName);
          else {
           const a = document.createElement("a");
           const url = URL.createObjectURL(file);
           a.href = url;
           a.download = fileName;
           document.body.appendChild(a);
           a.click();
           setTimeout(() => {
             document.body.removeChild(a);
             window.URL.revokeObjectURL(url);
           }, 0);
          }
        } catch (error) {
          resultsDownloadError.innerText = error;
        } finally {
          resultsDownloadButton.disabled = false;
        }
    }



    async function handleAppRun() {
      try {
        appRunButton.disabled = true;
        appRunError.innerText = "";
        appRunOutput.innerText = "";

        const userAddress = await iexec.wallet.getAddress();

        const appDatasetAddress = appRunDatasetMultiaddrInput.value;
        const appPrice = appRunPriceInput.value;
        const appAddress = appRunAddressInput.value;

        const category = '1'; // TODO: hd to TEE
        const params = ""; // TODO: hd to none
        // if (!checkStorageInitialized()){
        //   console.log("not init")
        //   initStorage();
        // }

//        publishing app:
            const app = appDatasetAddress;
            const appprice = '0'; //TODO: hd to none
            const volume = '1'; //TODO: hd to n
            const tag = 'tee';
//        TODO: could restrict the access to requester only.
            const signedOrder = await iexec.order.signApporder(
                await iexec.order.createApporder({
                    app,
                    appprice,
                    volume,
                    tag
                })
            );
            const orderHash = await iexec.order.publishApporder(signedOrder);
            console.log(`Order published with hash ${orderHash}`)

            const {datasetOrders} = await iexec.orderbook.fetchDatasetOrderbook(appDatasetAddress);
            const datasetOrder = datasetOrders && datasetOrders[0] && datasetOrders[0].order;
            if (!datasetOrder) throw Error(`no datasetorder found for the dataset address ${appDatasetAddress}`);

            const {appOrders} = await iexec.orderbook.fetchAppOrderbook(appAddress);
            const appOrder = appOrders && appOrders[0] && appOrders[0].order;
            if (!appOrder) throw Error(`no apporder found for app ${appAddress}`);

            const {workerpoolOrders} = await iexec.orderbook.fetchWorkerpoolOrderbook({category});
            const workerpoolOrder = workerpoolOrders && workerpoolOrders[0] && workerpoolOrders[0].order;
            if (!workerpoolOrder) throw Error(`no workerpoolorder found for category ${category}`);

//        TODO : request order
            const requestOrderToSign = await iexec.order.createRequestorder({
                app: appOrder.app,
                appmaxprice: appOrder.appprice,
                dataset: datasetOrder.dataset,
                datasetmaxprice: datasetOrder.datasetprice,
                workerpoolmaxprice: workerpoolOrder.workerpoolprice,
                requester: userAddress,
                volume: 1,
                tag: tag,
                params: params,
                category: category
            });

//        TODO: sign order
            const requestOrder = await iexec.order.signRequestorder(requestOrderToSign);

//        TODO: match order = find a deal
            const res = await iexec.order.matchOrders({
                datasetOrder: datasetOrder,
                apporder: appOrder,
                workerpoolorder: workerpoolOrder,
                requestorder: requestOrder
            });

            appRunOutput.innerText = JSON.stringify(res, null, 2);
            console.log(`Order published with dealId ${res.dealid}`)
            refreshUser(iexec)();

        // appRunOutput.innerText = `App Run: ${resp} .`;
        } catch (error) {
          appRunError.innerText = error;
        } finally {
          appRunButton.disabled = false;
        }
    }

    async function initStorage(){
      try {

            const storageToken = await iexec.storage.defaultStorageLogin();
            await iexec.storage.pushStorageToken(storageToken, {forceUpdate: true});

            if (!checkStorageInitialized()) throw Error(`unable to init storage`);
        } catch (error) {
            // storageInitError.innerText = error;
        } finally {
            // storageInitButton.disabled = false;
        }
    }

    async function checkStorageInitialized() {
        const isStorageInitialized = false;
        try {
            isStorageInitialized = await iexec.storage.checkStorageTokenExists(
                await iexec.wallet.getAddress()
            );
            const responseStr = isStorageInitialized
                ? "initialized"
                : "not initialized";
        } catch (error) {
            const errorMsg = error.message;
        } finally {
            return isStorageInitialized;
        }
    }

    function createDataset(param) {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: param})
        };

        return fetch("http://localhost:9000/pdp/", requestOptions)
            .then(response => response.json())
            .then(data => this.setState({postId: data.id}));
    }


    async function getDataSetsForPatient() {
        try {
            return new Promise((resolve, reject) => {
                let http = axios.create({
                    baseURL: "http://0b5e8e01b45d.ngrok.io/pdp/datasets"
                });
                http.get("").then(response => {
                    console.log("response: ", response)
                }).catch(e => {
                    alert("error: " + e.message);
                })
                setTimeout(() => {
                    console.log('loop completed')
                }, 2000)
            });
        } catch (error) {
            resultsDownloadError.innerText = error;
        } finally {
            resultsDownloadButton.disabled = false;
        }
    }

    // function fetchDatasets(param) {
    //   // param is a highlighted word from the user before it clicked the button
    //   return fetch("https://api.com/?param=" + param);
    // }
    //
    // function fetchPatientDatasets(param) {
    //   // param is a highlighted word from the user before it clicked the button
    //   return fetch("https://api.com/?param=" + param);
    // }
    //
    // function fetchApplications() {
    //   // param is a highlighted word from the user before it clicked the button
    //   return fetch("https://api.com/?param=" + param);
    // }
    //
    // function fetchResearcherApplications(param) {
    //   // param is a highlighted word from the user before it clicked the button
    //   return fetch("https://api.com/?param=" + param);
    // }

    return (
        <AppLayout>
        <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Route
                path={`${match.url}/dashboard`}
                render={props => <ViewDashboard loading={loading} chainId = {chainId} address = {address} nativeWallet = {wallet} rlcWallet = {rlcWallet} balance = {balance} />}
              />
              <Route
                path={`${match.url}/account`}
                render={props => <ViewAccount loading={loading} handleDeposit = {handleDeposit} handleWithdraw = {handleWithdraw} />}
              />
              <Route
                path={`${match.url}/order`}
                render={props => <ViewOrder loading={loading} iexec = {iexec} />}
              />
              <Route
                path={`${match.url}/dataset`}
                render={props => <ViewDataSet onFileUpload= {onFileUpload} hiddenDataFileInput = {hiddenDataFileInput} hiddenKeyFileInput = {hiddenKeyFileInput} datasetCount={datasetCount}  handleCountUserDatasets={handleCountUserDatasets} handleShowUserDatasets={handleShowUserDatasets} handleShowUserDatasetsByAddress={handleShowUserDatasetsByAddress} handleDeployDataset={handleDeployDataset} handlePushSecret={handlePushSecret} handlePublishDataset={handlePublishDataset} handleUnpublishDataset={handleUnpublishDataset} handleUnpublishDataset={handleUnpublishDataset} getDataSetsForPatient = {getDataSetsForPatient} iexec = {iexec} loading={loading} />}
              />
              <Route
                path={`${match.url}/request`}
                render={props => <ViewRequest loading={loading} />}
              />
              <Route
                path={`${match.url}/apps`}
                render={props => <ViewApps  appCount = {appCount} handleShowAppsByIndex={handleShowAppsByIndex} handleShowAppsByAddress={handleShowAppsByAddress} handleAppDeploy={handleAppDeploy} handleAppRun={handleAppRun} iexec = {iexec}  loading={loading} />}
              />
              <Route
                path={`${match.url}/results`}
                render={props => <ViewResults  downloadResults = {downloadResults} handleTaskShow = {handleTaskShow} handleDownloadResults= {handleDownloadResults} iexec = {iexec} loading={loading} />}
              />
              <Route
                path="/details"
                render={props => <ViewDetails {...props} />}
              />
              <Redirect to={`${match.url}/dashboard`} />
            </Switch>
        </Suspense>
        </div>
      </AppLayout>
    );
}

export default withIexec(App);
