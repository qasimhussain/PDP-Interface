import React, { Component, Fragment, useEffect, useState } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { withIexec } from '../../provider/IExecProvider';
import { BasicTable } from '../../components/BasicTable'
import { IExec } from "iexec";
import BootstrapTable from 'react-bootstrap-table-next';
import axios from "axios";
import { APIENDPOINT } from '../../app.config'

class Results extends Component {
  constructor(props) {
    super(props)
    this.getActionFormat = this.getActionFormat.bind(this);
    this.state = {
      address: "",
      tasks: [],
      iexec: ''
    };
    let iexec = this.props.iexec;
    this.iexec = iexec;
    iexec.wallet.getAddress().then(iexecAddress => {
      console.log("#iexec response: ", iexecAddress);
      let url = APIENDPOINT + "/researcher/" + iexecAddress+ "/tasks";
      let http = axios.create({
        baseURL: url
      });
      http.get("").then(response => {
        console.log("response: ", response.data.body);
        this.setState({tasks: response.data.body});
        return true;
      }).catch(e => {
        alert("error: " + e.message);
      })
    });
  }

/*  componentDidMount(){
    console.log('Greeting - shouldComponentUpdate lifecycle', this.props.address);
    let http = axios.create({
      baseURL: "http://8946d68a7b46.ngrok.io/pdp/researcher/"+ this.props.address+ "/tasks"
    });
    http.get("").then(response => {
      console.log("response: ", response.data.body);
      this.setState({tasks: response.data.body});
      return true;
    }).catch(e => {
      alert("error: " + e.message);
    })
  }*/

  getActionFormat(cell, row) {
    return (
        <div>
          <button type="button" className="btn btn-outline-primary btn-sm ts-button" size="sm"
                  onClick={() => this.handleModelEdit(row)}>
            Download Result
          </button>

        </div>
    );
  }

  async handleModelEdit(row) {
    console.log("###tasks roww ID:", row.taskAddress);
    try {
      const res = await this.iexec.task.fetchResults(row.taskAddress, {
        ipfsGatewayURL: "https://ipfs.iex.ec"
      });
      const file = await res.blob();
      const fileName = `${row.taskAddress}.zip`;
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

  getColumnList() {
    const columns = [
      {
        dataField: 'id',
        text: 'ID'
      }, {
        dataField: 'researcherId',
        text: 'Researcher ID'
      }, {
        dataField: 'datasetId',
        text: 'Dataset ID'
      }, {
        dataField: 'appId',
        text: 'App ID'
      }, {
        dataField: 'taskAddress',
        text: 'Task Address'
      }, {
        dataField: 'taskDescription',
        text: 'Task Description'
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
    const { downloadResults, handleTaskShow, handleDownloadResults, iexec, loading } = this.props;
    // console.log("addddreesss", address);
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
              <h3>My Tasks</h3>
                 <div class="container">
                   <BootstrapTable keyField='id' data={this.state.tasks}
                                   columns={this.getColumnList  ()}/>
                 </div>
              <hr />

              <h3>Tasks Information</h3>
                <div class="container">
                <div style={divparallelstyle}><label for="results-taskid-input">Task ID</label></div>
                <div style={divparallelstyle}>
                  <input
                    id="results-taskid-input"
                    type="text"
                    placeholder="Task ID"
                  />
                </div>
                <div style={divparallelstyle}> <label id="results-showtask-error" class="error"></label> </div>
                <div style={divparallelstyle}> <div class="scrollable" id="results-taskdetails-output"></div> </div>
                <button id="results-showtask-button" onClick={handleTaskShow}>SHOW TASK</button>
                </div>

              <hr />

             </div>
          </div>
          )}

        </header>
      </div>
      );
  }
}

export default Results;
