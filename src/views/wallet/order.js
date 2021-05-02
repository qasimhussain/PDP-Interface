import React, {Component, Fragment, useEffect, useState, useRef} from "react";
import {Row} from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import {Colxx, Separator} from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import {withIexec} from '../../provider/IExecProvider';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from "axios";
import {APIENDPOINT} from '../../app.config';

import {IExec} from "iexec";

import styled from 'styled-components';

// import { Table } from '../../table';
// import { Styles } from '../../table';
// import makeData from '../../makeData';

class OrderDetails extends Component {
    constructor(props) {
        super(props);
        this.getActionFormat = this.getActionFormat.bind(this);
        this.state = {
            address: '',
            iexec: '',
            datasets: [],
            apps: []
        };


        let iexec = this.props.iexec;
        this.iexec = iexec;
        let url = APIENDPOINT + "/datasets";
        console.log(url);
        console.log("#CCOMPONENT DID MOUNT ");
        let http = axios.create({
            baseURL: APIENDPOINT + "/datasets"
        });
        http.get("").then(response => {
            console.log("response: ", response.data.body);
            this.setState({datasets: response.data.body});
        }).catch(e => {
            alert("error: " + e.message);
        });
        let http2 = axios.create({
            baseURL: APIENDPOINT + "/apps"
        });
        http2.get("").then(response => {
            console.log("response: ", response.data.body);
            this.setState({apps: response.data.body});
        }).catch(e => {
            alert("error: " + e.message);
        })
    }

    componentDidMount() {
        // send HTTP request
        // save it to the state
        // fetch('http://0.0.0.0:9000/pdp/datasets')
        // .then(res => res.json())
        // .then((data) => {
        //   this.setState({ datasets: data })
        // })
        // .catch(console.log)
    }

    getActionFormat(cell, row) {
      const divparallelstyle = {
        display: "inline-block",
        padding: "5px"
      };
        return (
            <div>
                <div style={divparallelstyle}>
                  <input
                    id="appAddress"
                    type="text"
                    placeholder="App Address"/>
                    </div>
                <div style={divparallelstyle}>
                <button type="button" className="btn btn-outline-primary btn-sm ts-button" size="sm"
                        onClick={() => this.handleModelEdit(row)}>
                    Request
                </button>
                </div>
            </div>
        );
    }

    async handleModelEdit(row) {
        const patientDatasetAddress = row.datasetAddress;
        // extracting value from input field
        const appAddress = document.getElementById("appAddress");
        // iexec wallet extraction
        let addr = await this.iexec.wallet.getAddress();
        return new Promise((resolve, reject) => {

            let responseStr = "";
            const request = {
                datasetRequestInfo: "string",
                patientDatasetAddress: patientDatasetAddress,
                researcherAppAddress: appAddress.value,
                status: "REQUESTED"
            };

            const endpoint = `/dataset/${addr}/request`;
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
                console.log('FAILURE!!', error);
            });
            setTimeout(() => {
                console.log('posted')
                resolve(responseStr)
            }, 2000)
        });
        // QQ >> check async
    }

    updateAppAddress(evt) {
        this.setState({
            appAddress: evt.target.value
        });
        console.log("value set to appAddress :::", this.appAddress);
    }

    // notifyDatasetRequest(datasetRequestInfo,patientDatasetAddress,researcherAppAddress) {
    //   return new Promise((resolve, reject) => {

    //     let responseStr = "";
    //     const request = { datasetRequestId: datasetRequestId
    //     };

    //     const endpoint = `/pdp/dataset/request/accept`;
    //     let apiEndpointURL = pdpEngineUrl + endpoint;
    //     console.log(apiEndpointURL);

    //     axios.post(apiEndpointURL,
    //           request,
    //           {
    //               headers: {
    //                   'Content-Type': 'application/json'
    //               }
    //           }
    //       ).then(function (response) {
    //           responseStr = response;
    //       }).catch(function (error) {
    //           console.log('FAILURE!!', error);
    //       });
    //       setTimeout(() => {
    //           console.log('posted')
    //           resolve(responseStr)
    //       }, 2000)
    //   });
    // }

    getColumnList() {
        const columns = [
            {
                dataField: 'id',
                text: 'ID'
            }, {
                dataField: 'patientId',
                text: 'Patient ID'
            }, {
                dataField: 'datasetAddress',
                text: 'Dataset Address'
            }, {
                dataField: 'datasetPrice',
                text: 'Dataset Price'
            }, {
                dataField: 'datasetVolume',
                text: 'Dataset Volume'
            }, {
                dataField: 'datasetDescription',
                text: 'Dataset Description'
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

    getAppColumnList() {
        const columns = [
            {
                dataField: 'id',
                text: 'ID'
            }, {
                dataField: 'researcherId',
                text: 'Researcher Id'
            }, {
                dataField: 'appName',
                text: 'App Name'
            }, {
                dataField: 'appAddress',
                text: 'App Address'
            }, {
                dataField: 'appDescription',
                text: 'App Description'
            }
        ];
        return columns;
    }

    render() {
        const {iexec, loading} = this.props;
        // const Datasets = this.state.datasets;
        // console.log(Datasets);

        // const tablestyle = {
        //   display: "inline-block",
        //   padding: "5px"
        // };
        // .table {
        // 	font-family: arial, sans-serif;
        // 	border-collapse: collapse;
        // 	width: 100%;
        // }


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
                            <div>
                                <h2>All Datasets</h2>
                                <BootstrapTable keyField='id' data={this.state.datasets}
                                                columns={this.getColumnList()}/>
                            </div>
                            <div>
                                <h2>Apps</h2>
                                <BootstrapTable keyField='id' data={this.state.apps}
                                                columns={this.getAppColumnList()}/>
                            </div>
                            <div id="ops">
                                <h2>Orderbook</h2>
                                <div class="container">
                                    <div>
                                        <label for="orderbook-datasetaddress-input">Dataset address : </label>
                                        <input
                                            hash
                                            id="orderbook-datasetaddress-input"
                                            type="text"
                                            value="0x917D71168fF60A10afD684d8D815b4A78097225D"
                                            placeholder="Dataset address"
                                        />
                                        <button id="orderbook-show-button" disabled>SHOW DATASET ORDERBOOK</button>
                                    </div>
                                    <label id="orderbook-show-error" class="error"></label>
                                    <div class="scrollable" id="orderbook-show-output"></div>
                                </div>
                            </div>
                        </div>
                    )}

                </header>
            </div>
        );
    }
}

export default OrderDetails;
