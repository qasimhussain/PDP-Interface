import React, { Component, Fragment, useEffect, useState } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { withIexec } from '../../provider/IExecProvider';
import "iexec";

class WalletDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
        address: ""
    };
  }

  render() {
      //declare variable
    const { loading } = this.props;
      return (
      <div className="App">
        <header className="App-header">

        </header>
      </div>
      );
  }
}

export default WalletDetails;
