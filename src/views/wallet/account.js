import React, { Component, Fragment, useEffect, useState } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { withIexec } from '../../provider/IExecProvider';
import "iexec";

class AccountDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
        address: ""
    };
  }

  render() {
    const { loading, handleDeposit, handleWithdraw } = this.props;
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
                <h3>Account</h3>

                  <h6>Deposit</h6>
                  <div class="container">
                    <div>
                      <div style={divparallelstyle}><label for="account-deposit-input">Amount</label></div>
                      <div style={divparallelstyle}>
                      <input
                        id="account-deposit-input"
                        type="number"
                        min="1"
                        placeholder="nRLC to deposit"
                      />
                      </div>
                      <button id="account-deposit-button" onClick={handleDeposit}>DEPOSIT</button>
                    </div>
                    <label id="account-deposit-error" class="error"></label>
                  </div>

                  <h6>Withdraw</h6>
                  <div class="container">
                    <div>
                    <div style={divparallelstyle}><label for="account-withdraw-input">Amount</label></div>
                    <div style={divparallelstyle}>
                      <input
                        id="account-withdraw-input"
                        type="number"
                        min="1"
                        placeholder="nRLC to withdraw"
                      />
                    </div>



                      <button id="account-withdraw-button" onClick={handleWithdraw}>WITHDRAW</button>
                    </div>
                    <label id="account-withdraw-error" class="error"></label>
                  </div>
             </div>
          </div>
          )}
        </header>
      </div>
      );
  }
}

export default AccountDetails;
