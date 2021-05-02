import React, { Component, Fragment, useEffect, useState } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { withIexec } from '../../provider/IExecProvider';
import { BasicTable } from '../../components/BasicTable'
import "iexec";
import { APIENDPOINT } from '../../app.config'
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";

class Apps extends Component {
  constructor(props) {
    super(props)
    this.getActionFormat = this.getActionFormat.bind(this);
    this.state = {
      address: "",
      datasets: [],
      iexec: ''
    };
    let iexec = this.props.iexec;
    this.iexec = iexec;
    console.log("#CCOMPONENT DID MOUNT ");
    this.iexec.wallet.getAddress().then(addr => {
      let url = APIENDPOINT + "/researcher/"+addr+ "/dataset/requests";
      console.log("###URL ", url);
      let http = axios.create({
        baseURL: url
      });
      http.get("").then(response => {
        console.log("response: ", response.data.body);
        this.setState({datasets: response.data.body});
      }).catch(e => {
        alert("error: " + e.message);
      })
  });
  }

  getActionFormat(cell, row) {
    return (
        <div >
          <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-button" size="sm"
                  onClick={() => this.handleModelEdit(row)}>
            Run App
          </button>
          <p></p>
        </div>
    );
  }

  async taskShow(dealId) {
    let taskId = "";
    try {
      const deal = await this.iexec.deal.show(dealId);
      taskId = deal.tasks["0"];
    }catch (error) {
      console.log(error)
    } finally {
      console.log(taskId)
      return taskId;
    }
  }

  async notifyTaskCreation(wallet, taskAddress, datasetAddress, appAddress) {
    return new Promise((resolve, reject) => {

      let responseStr = "";
      const request = {
        appAddress: appAddress,
        datasetAddress: datasetAddress,
        taskAddress: taskAddress,
        taskDescription: "string"
      };

      const endpoint = `/researcher/${wallet}/task`;
      let apiEndpointURL = APIENDPOINT + endpoint;
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

  async handleModelEdit(row) {
    console.log("###dataset roww ID:", row.id);

    try {
      const userAddress = await this.iexec.wallet.getAddress();

      let appDatasetAddress = row.patientDatasetAddress;
      const appPrice = 1;
      let appAddress = row.researcherAppAddress;

      appDatasetAddress = "0x798b4db00cFeFa79A3571F1B63F8f22975923418";
      appAddress = "0x3Cce85405CF71De81e95f3A896e4E08DC366b457";

      console.log("row", row)

      const category = '0'; // TODO: hd to TEE
      const params = ""; // TODO: hd to none
      // if (!checkStorageInitialized()){
      //   console.log("not init")
      //   initStorage();
      // }

      //publishing app:
      const app = appAddress;
      const appprice = '0'; //TODO: hd to none
      const volume = '1'; //TODO: hd to n
      const tag = 'tee';
      //TODO: could restrict the access to requester only.

      this.iexec.order.signApporder(
          await this.iexec.order.createApporder({
            app,
            appprice,
            volume,
            tag
          })
      ).then(async signedOrder => {
        this.iexec.order.publishApporder(signedOrder).then(orderHash => {
          console.log(`Order published with hash ${orderHash}`)

          let app=this;
          this.iexec.orderbook.fetchDatasetOrderbook(appDatasetAddress).then(datasetOrders => {
            const datasetOrder = datasetOrders.orders && datasetOrders.orders[0] && datasetOrders.orders[0].order;
            if (!datasetOrder) throw Error(`no datasetorder found for the dataset address ${appDatasetAddress}`);

            this.iexec.orderbook.fetchAppOrderbook(appAddress).then(appOrders => {
              const appOrder = appOrders.orders && appOrders.orders[0] && appOrders.orders[0].order;
              if (!appOrder) throw Error(`no apporder found for app ${appAddress}`);


              this.iexec.orderbook.fetchWorkerpoolOrderbook({ category }).then(workerpoolOrders => {
                const workerpoolOrder = workerpoolOrders.orders && workerpoolOrders.orders[0] && workerpoolOrders.orders[0].order;
                if (!workerpoolOrder) throw Error(`no workerpoolorder found for category ${category}`);

                //        TODO : request order
                this.iexec.order.createRequestorder({
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
                }).then(requestOrderToSign => {
                  // TODO: sign order

                  this.iexec.order.signRequestorder(requestOrderToSign).then(requestOrder => {
                    // TODO: match order = find a deal
                    this.iexec.order.matchOrders({
                      datasetorder: datasetOrder,
                      apporder: appOrder,
                      workerpoolorder: workerpoolOrder,
                      requestorder: requestOrder
                    }).then(res => {

                      console.log(`Order published with dealId ${res.dealid}`)

                      this.taskShow(res.dealid).then(taskId => {

                        console.log("###Final taskId", taskId)
                        this.notifyTaskCreation(userAddress,taskId, appDatasetAddress, appAddress ).then(resp => {

                          console.log("###Final Response", resp)
                        });
                      });
                    });
                  });
                });

              });

            });


          });


        });


      }).catch(e => {
        alert("error: " + e.message);
      });

    } catch (error) {
      alert("error: " + error.message);
    } finally {
    }
  }

  getColumnList() {
    const columns = [
      {
        dataField: 'id',
        text: 'ID'
      }, {
        dataField: 'datasetId',
        text: 'Dataset ID'
      }, {
        dataField: 'datasetRequestInfo',
        text: 'Dataset Request Info'
      }, {
        dataField: 'patientDatasetAddress',
        text: 'Patient Dataset Address'
      }, {
        dataField: 'researcherAppAddress',
        text: 'Researcher App Address'
      }, {
        dataField: 'researcherId',
        text: 'Researcher ID'
      }, {
        dataField: 'status',
        text: 'Status'
      },
      {
        text: "",
        dataField: "",
        formatter: this.getActionFormat,
        classes: ""
      }
    ];
    return columns;
  }

  render() {
      //declare variable
    const { appCount, handleCountApps, handleShowAppsByIndex, handleShowAppsByAddress, handleAppDeploy, handleAppRun, loading } = this.props;

    console.log("DatasetsData: ", this.state.datasets);
    const divparallelstyle = {
      display: "inline-block",
      padding: "5px"
    };

      return (
        <div className="App">
          <header className="App-header">
            { loading && (
              <div>
                Contacting provider...
              </div>
            )}
            { !loading && (
              <div>
              <h2>Patient Data Privacy Portal</h2>
                <hr />
                <div id="ops">
                  <h3>Datasets Available</h3>

                  <BootstrapTable keyField='id' data={this.state.datasets}
                                  columns={this.getColumnList()}/>
                  <hr />

                  <h3>Deployed Applicaiton Information</h3>

                  <div class="container">
                  <div style={divparallelstyle}><button id="apps-count-button" onClick={handleCountApps}>Refresh</button></div>
                  <div style={divparallelstyle}><label id="apps-count-error" class="error"></label></div>
                  <div style={divparallelstyle}><div id="apps-count-output">{appCount}</div></div>
                  </div>

                  <div class="container">
                    <div>
                    <div style={divparallelstyle}><label for="apps-index-input">App index</label></div>
                    <div style={divparallelstyle}>
                      <input
                        id="apps-index-input"
                        type="number"
                        min="0"
                        placeholder="App index"
                      />
                    </div>

                      <button id="apps-showindex-button" onClick={handleShowAppsByIndex}>SHOW USER APP</button>
                    </div>
                      <label id="apps-showindex-error" class="error"></label>
                      <div class="scrollable" id="apps-showindex-output"></div>
                  </div>
                  <hr />


                  <h3>Deploy app</h3>
                    <div class="container">
                      <div>
                        <div>
                        <div style={divparallelstyle}><label for="apps-deployname-input">App name</label></div>
                        <div style={divparallelstyle}>
                          <input
                            id="apps-deployname-input"
                            type="text"
                            placeholder="App name"
                          />
                        </div>

                        </div>
                        <div>
                        <div style={divparallelstyle}><label for="apps-deploymultiaddr-input">App image</label></div>
                        <div style={divparallelstyle}>
                          <input
                            id="apps-deploymultiaddr-input"
                            type="text"
                            placeholder="App multiaddr"
                          />
                        </div>

                        </div>

                        <div>
                          <div>
                          <div style={divparallelstyle}><label for="app-deploy-mrenclave-input">MR ENCLAVE</label></div>
                          <div style={divparallelstyle}>
                            <input
                              id="app-deploy-mrenclave-input"
                              type="text"
                              placeholder="mr enclave"
                            />
                          </div>

                          </div>

                        <div>
                        <div style={divparallelstyle}><label for="apps-deploychecksum-input">App checksum</label></div>
                        <div style={divparallelstyle}>
                          <input
                            id="apps-deploychecksum-input"
                            type="text"
                            placeholder="App checksum"
                          />
                        </div>
                        </div>

                        <button id="apps-deploy-button" onClick={handleAppDeploy}>DEPLOY APP</button>
                      </div>
                      <label id="apps-deploy-error" class="error"></label>
                      <div id="apps-deploy-output"></div>
                    </div>
                  </div>

                  <hr />
{/*
                  <h3>Run app</h3>
                  <div class="container">
                    <div>
                      <div>
                        <div style={divparallelstyle}><label for="app-run-dataset-address-input">Dataset address</label></div>
                        <div style={divparallelstyle}>
                          <input
                            id="app-run-dataset-address-input"
                            type="text"
                            placeholder="App address"
                          />
                        </div>
                      </div>

                      <div>
                      <div style={divparallelstyle}><label for="app-run-price-input">Price</label></div>
                      <div style={divparallelstyle}>
                        <input
                          id="app-run-price-input"
                          type="number"
                          min="0"
                          placeholder="Price"
                        />
                      </div>
                      </div>

                      <div>
                      <div style={divparallelstyle}><label for="app-run-address-input">App address</label></div>
                      <div style={divparallelstyle}>
                        <input
                          id="buy-appaddress-input"
                          type="text"
                          placeholder="App address"
                        />
                      </div>
                      </div>

                      <button id="app-run-button" onClick={handleAppRun}>Run App</button>

                    </div>
                    <label id="app-run-error" class="error"></label>
                    <div id="app-run-output"></div>
                  </div>
*/}

                </div>
              </div>
            )}
          </header>
        </div>
      );
  }
}

export default Apps;
