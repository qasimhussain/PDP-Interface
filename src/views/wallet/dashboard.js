import React, { Component, Fragment, useEffect, useState } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { withIexec } from '../../provider/IExecProvider';
import "iexec";

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
        chainId: "",
        address: "",
        nativeWallet: "",
        rlcWallet: "",
        balance: ""
    };
  }

  render() {
      const { loading, chainId, address, nativeWallet, rlcWallet, balance, data } = this.props;
      let {chain} = "";
      if (chainId == 5)
        chain = "Goerli";

      console.log(data);
      return (
        <div>
            { loading && (
              <div>
                Contacting provider...
              </div>
            )}
            { !loading &&(
              <div>
              <h2>Patient Data Privacy Portal</h2>
              <hr />
              <h3>Dashboard</h3>
                <Fragment>
                <Row>
                  <Colxx xxs="12" className="mb-4">
                    <p><b>Chain:</b>	 {chain}</p>
                    <p><b>Address:</b>	 {address}</p>
                    <p><b>Native:</b>	 {nativeWallet}</p>
                    <p><b>RLC Wallet:</b>	 {rlcWallet}</p>
                    <p><b>Balance:</b>	 {balance}</p>
                  </Colxx>
                </Row>
              </Fragment>

              </div>
      )}
      </div>
      )
  }
}

export default Dashboard;
