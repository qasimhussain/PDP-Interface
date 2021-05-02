import React, {Component, Fragment, useEffect, useMemo, useState} from "react";
import {Row} from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import {Colxx, Separator} from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import {withIexec} from '../../provider/IExecProvider';
import {BasicTable} from '../../components/BasicTable'
import "iexec";
import BootstrapTable from 'react-bootstrap-table-next';
import axios from "axios";
import {APIENDPOINT} from '../../app.config'

class DataSet extends Component {
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
          let url = APIENDPOINT + "/patient/"+addr+ "/dataset/requests";
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
            <div>
                <button type="button" className="btn btn-outline-primary btn-sm ml-2 ts-button" size="sm"
                        onClick={() => this.approveDatasetRequest(row)}>
                    Approve Request
                </button>
                <p></p>
                {/*
                <button type="button" className="btn btn-outline-danger btn-sm ml-2 ts-button" size="sm"
                        onClick={() => this.handleModelEdit(row)}>
                    Reject Request
                </button>
                */}
            </div>
        );
    }

    handleModelEdit(row) {
        console.log("###dataset roww ID:", row.id);
    }

    async approveDatasetRequest(row) {
        const datasetAddress = row.patientDatasetAddress;
        const appAddress = row.researcherAppAddress;
        const datasetRequestId = row.id;
        // QQ >> check async
        const resp = await this.sellDataset(datasetAddress, appAddress, datasetRequestId);
    }

    async sellDataset(datasetAddress, appAddress, datasetRequestId) {
        let response = "";
        console.log("this", this)
        let app = this;
        try {
            const dataset = datasetAddress;
            const datasetprice = '0'; //hd to  0 for now:
            const volume = '10'; //hd to 10 for now:
            const apprestrict = appAddress;
            console.log("app", this)
            app.iexec.order.createDatasetorder({
                dataset,
                datasetprice,
                volume,
                apprestrict
            }).then(async function (datasetOrder) {

                console.log(datasetOrder);

                app.iexec.order.signDatasetorder(datasetOrder).then(async signedOrder =>{
                console.log("##signedorder",signedOrder);

                app.iexec.order.publishDatasetorder(signedOrder).then(async orderHash =>{

                console.log(orderHash);
                response = `Order published with hash ${orderHash}`;

                const resp = await app.notifyDatasetRequestAccept(datasetRequestId);
                }).catch(function (error) {
                    console.log('FAILURE!!', error);
                });

                });

            }).catch(function (error) {
                console.log('FAILURE!!', error);
            });


        } catch (error) {
            response = error;
        } finally {
            console.log(response);
        }
    }

    async notifyDatasetRequestAccept(datasetRequestId) {
        return new Promise((resolve, reject) => {

            let responseStr = "";
            const request = {
                datasetRequestId: datasetRequestId
            };

            let apiEndpointURL = APIENDPOINT + '/dataset/request/accept';
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
        const {
            onKeyFileUpload, onFileUpload, hiddenFileInput, hiddenKeyFileInput, datasetCount, handleCountUserDatasets, handleShowUserDatasets, handleShowUserDatasetsByAddress,
            handleDeployDataset, handlePublishDataset, handleUnpublishDataset, handlePushSecret, getDataSetsForPatient, iexec, loading
        } = this.props;

        console.log("DatasetsData: ", this.state.datasets);
        const count = {datasetCount};
        // console.log(count);


        const divparallelstyle = {
            display: "inline-block",
            padding: "5px"
        };

        const divfieldstyle = {
            padding: "5px"
        };

        return (
            <div className="App">
                <header className="App-header">
                    {loading && (
                        <div>
                            Contacting provider...
                        </div>
                    )}
                    {!loading && (
                        <div>
                            <h2>Patient Data Privacy Portal</h2>
                            <hr/>
                            <div id="ops">
                                <h3>Dataset Requests</h3>
                                <div class="container">
                                    <BootstrapTable keyField='id' data={this.state.datasets}
                                                    columns={this.getColumnList()}/>
                                </div>

                                <hr/>

                                <h3>Deployed Dataset Information</h3>
                                <div class="container">
                                    <div style={divparallelstyle}><label id="datasets-count-error"
                                                                         class="error"></label></div>
                                    <div style={divparallelstyle}>
                                        <button id="datasets-count-button" onClick={handleCountUserDatasets}>Refresh
                                        </button>
                                    </div>
                                    <div style={divparallelstyle}>
                                        <div id="datasets-count-output">{datasetCount}</div>
                                    </div>
                                </div>

                                <div class="container">
                                    <div>
                                        <label for="datasets-index-input">Dataset index : </label>
                                        <input
                                            id="datasets-index-input"
                                            type="number"
                                            min="1"
                                            placeholder="Dataset index"
                                        />
                                        <button id="datasets-showindex-button" onClick={handleShowUserDatasets}>
                                            SHOW USER DEPLOYED DATASET(By Index)
                                        </button>
                                    </div>
                                    <label id="datasets-showindex-error" class="error"></label>
                                    <div class="scrollable" id="datasets-showindex-output"></div>
                                </div>
{/*
              <div class="container">
                <div>
                  <label for="datasets-address-input">Dataset address : </label>
                  <input
                    id="datasets-address-input"
                    type="text"
                    placeholder="Dataset address"
                  />
                  <button id="datasets-show-button" onClick={handleShowUserDatasetsByAddress}>
                  SHOW USER DEPLOYED DATASET(By Address)
                 </button>
                </div>
                <label id="datasets-show-error" class="error"></label>
                <div class="scrollable" id="datasets-details-output"></div>
              </div>
*/}
                                <hr/>

                                <h3>Deploy Dataset</h3>
                                <div class="container">
                                    <div>
                                        <div>
                                            <div style={divparallelstyle}><label for="datasets-deployname-input">Dataset
                                                name : </label></div>
                                            <div style={divparallelstyle}>
                                                <input
                                                    id="datasets-deployname-input"
                                                    type="text"
                                                    placeholder="Dataset name"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div style={divparallelstyle}><label for="datasets-deploymultiaddr-input">Dataset
                                                url/ipfs : </label></div>
                                            <div style={divparallelstyle}>
                                                <input
                                                    id={1}
                                                    type="file"
                                                    onChange={onFileUpload}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div style={divparallelstyle}><label for="dataset-deployed-Keystore">Dataset
                                                Keystore : </label></div>
                                            <div style={divparallelstyle}>
                                                <input
                                                    id={2}
                                                    type="file"
                                                    onChange={onKeyFileUpload}
                                                />
                                            </div>
                                        </div>

                                        <button id="datasets-deploy-button" onClick={handleDeployDataset}>DEPLOY DATASET
                                            :
                                        </button>
                                    </div>
                                    <label id="datasets-deploy-error" class="error"></label>
                                    <div id="datasets-deploy-output"></div>
                                </div>

                                <hr/>
{/*
              <h2>Push Dataset Secret</h2>
                <div class="container">
                 <div>
                   <div>
                     <label for="dataset-deployed-address-input">Dataset Address : </label>
                     <input
                       id="dataset-deployed-address-input"
                       type="text"
                       placeholder="Dataset Address"
                     />
                   </div>
                   <div>
                     <label for="dataset-deployed-Keystore">Dataset Keystore : </label>
                     <input
                       id="dataset-deployed-keystore-input"
                       type="text"
                       placeholder="Dataset Keystore"
                     />
                   </div>
                   <button id="dataset-push-secret-button" onClick={handlePushSecret}>Push DATASET Secret : </button>
                 </div>
                 <label id="dataset-push-secret-error" class="error"></label>
                 <div id="dataset-push-secret-output"></div>
                </div>
              <hr />
*/}

                                <h3>Unpublish dataset</h3>
                                <div class="container">
                                    <div>
                                        <label for="sell-unpublishhash-input">Order hash : </label>
                                        <input
                                            id="sell-unpublishhash-input"
                                            type="text"
                                            placeholder="Order hash"
                                        />
                                        <button id="sell-unpublish-button">UNPUBLISH ORDER :</button>
                                    </div>
                                    <label id="sell-unpublish-error" class="error"></label>
                                    <div id="sell-unpublish-output"></div>
                                </div>
                                <div class="container">
                                    <div>
                                        <label for="sell-cancelhash-input">Order hash : </label>
                                        <input
                                            id="sell-cancelhash-input"
                                            type="text"
                                            value=""
                                            placeholder="Order hash"
                                        />
                                        <button id="sell-cancel-button" onClick={handleUnpublishDataset}>CANCEL ORDER
                                            :
                                        </button>
                                    </div>
                                    <label id="sell-cancel-error" class="error"></label>
                                    <div id="sell-cancel-output"></div>
                                </div>
                                <hr/>

              {/* comment sell dataset : delegate to onclick table row
              <h3>Sell dataset</h3>
              <div class="container">
                  <div>
                      <div>
                          <label for="sell-datasetaddress-input">Dataset address : </label>
                          <input
                              id="sell-datasetaddress-input"
                              type="text"
                              placeholder="Dataset address"
                          />
                      </div>
                      <div>
                          <label for="sell-datasetprice-input">Price : </label>
                          <input
                              id="sell-datasetprice-input"
                              type="number"
                              min="0"
                              placeholder="Price"
                          />
                      </div>
                      <div>
                          <label for="sell-volume-input">Volume : </label>
                          <input
                              id="sell-volume-input"
                              type="number"
                              min="1"
                              placeholder="Volume"
                          />
                      </div>
                      <div>
                          <label for="sell-apprestrict-input">Restrict to app : </label>
                          <input
                              id="sell-apprestrict-input"
                              type="text"
                              placeholder="app address"
                          />
                      </div>
                      <button id="sell-publish-button" onClick={handlePublishDataset}>PUBLISH SELL
                          ORDER
                      </button>
                  </div>
                  <label id="sell-publish-error" class="error"></label>
                  <div id="sell-publish-output"></div>
              </div>
              <hr/>
              */}
                            </div>
                        </div>
                    )}
                </header>
            </div>
        );
    }

}


export default DataSet;
