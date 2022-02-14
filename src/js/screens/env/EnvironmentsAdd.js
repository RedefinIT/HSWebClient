  /**
 * Created by avireddi on 11/10/2019.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { addNetwork } from '../../actions/env';
import DeploymentNetworksForm from './EnvironmentsForm';
import history from '../../history';

const DEFAULT_IMAGE = {
  category: "images",
  name: ''
};

class EnvironmentsAdd extends Component {

  constructor (props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
  }

  _onSubmit (data) {
    //console.log("onSubmit: ", data);
    this.props.dispatch(addNetwork(data));

    const { router } = this.context;
    history.push({
      pathname: '/ui/env',
      search: document.location.search
    });
    // window.location.href = '/ui/networks';
  }

  render () {
    //console.log("DeploymentAddHost render ...");
    return (
        <DeploymentNetworksForm heading={this.props.heading}
                                submitLabel="Add" formtype="add"
                                onSubmit={this._onSubmit}
                                handleAddEnv={this.props.handleAddEnv}
                                handleCancel={this.props.handleCancel}
                                busyMessage={this.props.changing ? 'Adding' : null} />
    );
  }
}

EnvironmentsAdd.defaultProps = {
  error: undefined,
  integrations: []
};

EnvironmentsAdd.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.object,
  integrations: PropTypes.arrayOf(PropTypes.object)
};

EnvironmentsAdd.contextTypes = {
  intl: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  integrations: PropTypes.object,
  router: PropTypes.object
};

const select = state => ({ ...state.networks });

export default connect(select)(EnvironmentsAdd);
