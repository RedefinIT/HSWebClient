/**
 * Created by avireddi on 11/10/2019.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import {Heading, Box, Text, Button, Footer, FormField, TextInput, Select, TextArea, Spinner} from 'grommet';
import { Actions, StatusWarning } from 'grommet-icons';
import {postRESTApi} from '../api/server-rest';
import LayerForm from "./LayerForm";
import {IntegerInput, NumberInput} from "grommet-controls";
import IPAddressInput from "./IPAddressInput";

// Theme for spinner but not used
const themeWithAnimation = {

  spinner: {
    icon: Actions,
    container: {
      color: 'accent-2',
      align: 'center',
      justify: 'center',
      size: 'large',
      animation: { type: 'rotateLeft', duration: 900 },
    },
  },
};

class InventoryReport extends Component {

  constructor (props) {
    super(props);

    this.state = {

    };

  }


  render () {

    //console.log("render: this.props: ", this.props);

    return (
      <LayerForm
        title={this.props.heading}
        titleTag={4}
        submitLabel="Submit "
        onClose={() => {}} onSubmit={this._onSubmit}
      >
        <FormField label='Hostname'>
          <TextInput
            id="hostname"
            onChange={this._handleHostDetailsChange}
            value={this.state.newhostdata.hostName}
          />
        </FormField>
        <br/>
        <br/>
        <br/>
        <Footer pad={{vertical: 'medium'}} justify="between">
          <Button label='Add'
                  primary={true}
                  onClick={this.handleAddHost}
          />

          <Button label='Cancel'
                  primary={false}
                  onClick={this.props.handleCancelAddHost}
          />
        </Footer>
      </LayerForm>

    );
  }
}

InventoryReport.defaultProps = {
  error: undefined,
};

InventoryReport.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.object,
  heading: PropTypes.string,
};

InventoryReport.contextTypes = {
  intl: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  router: PropTypes.object
};

const select = state => ({ ...state.pools });

export default connect(select)(InventoryReport);
