/**
 * Created by avireddi on 11/10/2019.
 */


import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import Article from 'grommet/components/Article';
import {Box, Header, Heading, Anchor, Form, Footer, FormField, Button, TextInput, Select} from 'grommet';
import { Close as CloseIcon } from 'grommet-icons';
import {deleteNetwork} from '../../actions/env';
import { Trash as TrashIcon } from 'grommet-icons';
import history from "../../history";

class EnvironmentsForm extends Component {

  constructor (props) {
    super(props);
    this._onRemove = this._onRemove.bind(this);
    // this.deleteNetwork = this.deleteNetwork.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onChange = this._onChange.bind(this);

    this.state = {
      errors: {},
      env: { envType: "", name: "", mgmtNetwork: {}},
      network: {},
      heading: "Add Network",
      envType: "",
      name: "",
      subnetname: "",
      subnetmask: "",
      gateway: "",
      dns1: "",
      dns2: "",
      vlan: 0,
      ntp: ""
    };
  }

  componentDidMount () {
    //console.log("EnvironmentsForm: componentDidMount: this.props: ", this.props );
    //console.log("EnvironmentsForm: window.location.pathname: ", window.location.pathname)
    let pathname = window.location.pathname

  }

  // componentWillReceiveProps (nextProps) {
  //
  // }

  _onSubmit (event) {
    //console.log("onSubmit: state: ", this.state);
    //console.log("onSubmit: this.props.formtype: ", this.props.formtype);
    event.preventDefault();

    if(this.props.formtype === "add") {
      let errors = {};
      let noErrors = true;
      if (noErrors) {
        let env = this.state.env;
        env.envType = this.state.envType;
        //console.log("onSubmit: data: ", env);
        this.props.onSubmit(env);
      } else {
        this.state.errors = errors;
      }
    }
    else{
      history.push({pathname: "/ui/env"});
    }
  }

  // deleteNetwork(networkName) {
  //   console.log("deleteNetwork: ");
  //
  //   let uri = "/rest/networks/" + networkName
  //
  //   // let data = {"name": networkName};
  //   this.props.dispatch(deleteNetwork(uri))
  //
  //   // postRESTApi(uri, data)
  //   //   .then((response) => {
  //   //     console.log("deleteNetwork: response: ", response);
  //   //     console.log("deleteNetwork: response.result: ", response.result);
  //   //
  //   //     if ('error' in response && response['error'] == {}) {
  //   //       window.alert("Failed to remove the network. " + response['error']['statusText']);
  //   //     }
  //   //     else
  //   //       history.push({pathname: "/ui/env"})
  //   //       // this.props.dispatch(deleteCurrentItem())
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log("loadNetworks: err: ", err);
  //   //     window.alert("Failed to remove the network. " + str(err));
  //   //   })
  // }

  _onRemove (event) {
    //console.log("_onRemove: this.props.currentItem['name']: ", this.props.currentItem['name']);
    //console.log("_onRemove: state: ", this.state);
    //console.log("_onRemove: this.props.formtype: ", this.props.formtype);

    // this.deleteNetwork(this.props.currentItem['name']);
    this.props.dispatch(deleteNetwork(this.props.currentItem['name']))
  }

  _onChange (event) {
    const field = event.target.getAttribute('id');

    //console.log("Event target: ", field);
    //console.log("Event value: ", event.target.value);

    let env = {...this.state.env};

    if (field === "name") {
      env[field] = event.target.value;
      this.setState({env: env});
    }
    else{
      env.mgmtNetwork[field] = event.target.value;
      this.setState({env: env});
    }
  }


  render (){

    //console.log("EnvironmentsForm render: this.props: ", this.props);
    //console.log("EnvironmentsForm ...", this.state.passwordmatch);

    let form_type = this.props.formtype;

    let network = {};

    let action_button = "";

    if (form_type == 'add') {
      network = {}

    }
    else{
      network = this.props.currentItem || {};
      action_button = (
        <Button icon={<TrashIcon />} label="Remove"
                a11yTitle={`Remove `} plain={true} onClick={this._onRemove} />
      )
    }

    console.log("EnvironmentsForm network: ", network);

    return (
      <Box id="top2" fill="vertical" overflow="auto" align="start" justify="start" direction="column" pad="large" border={{"color":"brand"}} >
          <Header fill='horizontal'>
            <Heading level={4} margin="none" strong={true}>
              {this.props.heading}
            </Heading>
            <Button onClick={this.props.handleCancel}
                    icon={<CloseIcon />}
                    a11yTitle={`Close ${this.props.heading} Form`}/>
          </Header>
          <div>
            <FormField label='Type' >
              <Select
                  options={['Prod', 'UAT', 'Test', 'Dev']}
                  value={this.state.envType}
                  onChange={({ option }) => this.setState({"envType": option})}
              />
            </FormField>
            <FormField label='Name' >
              <TextInput id="name" value={network['name']} onChange={this._onChange} />
            </FormField>
            <FormField label='Subnet Mask'>
              <TextInput id="subnetmask" value={network['subnetmask']} onChange={this._onChange} />
            </FormField>
            <FormField label='Gateway'>
              <TextInput id="gateway" value={network['gateway']} onChange={this._onChange} />
            </FormField>
            <FormField label='DNS1'>
              <TextInput id="dns1" value={network['dns1']} onChange={this._onChange} />
            </FormField>
            <FormField label='DNS2'>
              <TextInput id="dns2" value={network['dns2']} onChange={this._onChange} />
            </FormField>
            <FormField label='VLAN'>
              <TextInput id="vlan" value={network['vlan']} onChange={this._onChange} />
            </FormField>
            <FormField label='NTP Server'>
              <TextInput id="ntp" value={network['ntp']} onChange={this._onChange} />
            </FormField>
          </div>
          <Footer pad={{vertical: 'medium'}} justify="between">
            <Button type="submit" primary={true} label={this.props.submitLabel || "Close"}
                    onClick={this._onSubmit} />
            {action_button}
          </Footer>
      </Box>
    );
  }
}

EnvironmentsForm.defaultProps = {
  error: undefined,
  currentItem: PropTypes.object,
  alias: ""
};

EnvironmentsForm.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.object,
  network: PropTypes.object,
};

EnvironmentsForm.contextTypes = {
  intl: PropTypes.object,
  router: PropTypes.object
};

// const select = state => ({ ...state.networks});

// let select = (state, props) => {
//   console.log("EnvironmentsForm select: state: ", state);
//   console.log("EnvironmentsForm select: props: ", props);
//   if( props.hasOwnProperty("location")){
//     console.log("EnvironmentsForm select: props: ", props.location.pathname);
//     console.log("EnvironmentsForm select: props alias: ", props.location.pathname.substr("/networks/edit/".length));
//
//     return {
//       network: state.currentItem || {},
//       alias: props.location.pathname.substr("/networks/edit/".length)
//     };
//   }
//   else{
//     return {
//       network: {},
//       alias: ""
//     };
//
//   }
// };

const select = state => ({ ...state.env });

export default connect(select)(EnvironmentsForm);
