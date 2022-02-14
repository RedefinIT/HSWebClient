/**
 * Created by avireddi on 11/10/2019.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { addIntegration } from '../actions/integrations';
import OneViewApplForm from './RMForm';

const DEFAULT_IMAGE = {
  category: "images",
  name: ''
};

class RMAdd extends Component {

  constructor (props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
  }

  _onSubmit (data) {
    //console.log("onSubmit: ", data);
    this.props.dispatch(addIntegration(data));
  }

  render () {
    //console.log("Add OneView ...this.props: ", this.props);
    return (
      <OneViewApplForm heading="Register Resource Manager" submitLabel="Add" formtype="add"
                 onSubmit={this._onSubmit}
                 busyMessage={this.props.changing ? 'Adding' : null} />
    );
  }
}

RMAdd.defaultProps = {
  error: undefined,
  currerntItem: {}
};

RMAdd.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.object,
  currentItem: PropTypes.object
};

RMAdd.contextTypes = {
  intl: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  currentItem: PropTypes.object,
  router: PropTypes.object
};

const select = state => ({ ...state.oneviewappls });

export default connect(select)(RMAdd);
