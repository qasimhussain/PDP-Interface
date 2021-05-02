import React, { Component, Fragment, useEffect, useState } from "react";
import { Row } from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx, Separator } from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { withIexec } from '../../provider/IExecProvider';
import "iexec";

class BlankPage extends Component {
  render() {
      return (
          <Fragment>
          <Row>
            <Colxx xxs="12">
              <Breadcrumb heading="menu.blank-page" match={this.props.match} />
              <Separator className="mb-5" />
            </Colxx>
          </Row>
          <Row>
            <Colxx xxs="12" className="mb-4">
              <p><IntlMessages id="menu.blank-page"/></p>
            </Colxx>
          </Row>
        </Fragment>
      )
  }
}

export default withIexec(BlankPage);