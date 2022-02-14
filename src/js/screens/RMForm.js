/**
 * Created by avireddi on 11/10/2019.
 */


import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Box, Header, Heading, Anchor, Footer, Form, FormField, Button, TextInput, Text, Select} from 'grommet';
import {CircleAlert, Close as CloseIcon, StatusGood, Trash as TrashIcon} from 'grommet-icons';
import { loadIntegration, deleteIntegration, unloadIntegration } from '../actions/integrations';
import history from '../history';
import Notification1 from "../components/Notification1";

class RMForm extends Component {

  constructor (props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
    this._onRemove = this._onRemove.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onPasswordChange = this._onPasswordChange.bind(this);

    this.state = {
      rmTypes: [
        {type: 'oneview', label: 'HPE OneView'},
        {type: 'vcenter', label: 'VMware vCenter'}
      ],
      errors: {},
      rmType: "",
      alias: "",
      host: "",
      username: "",
      password: "",
      passwordconfirm: "",
      passwordmatch: true,
      closeOnSubmit: false
    };
  }

  componentDidMount () {
    //console.log("OneViewAppForm: componentDidMount: this.props: ", this.props );

    if(this.props.location ) {
      let alias = this.props.location.pathname.substr("/ui/rm/edit/".length);
      this.props.dispatch(loadIntegration("/rest/rm/" + alias, false));

    }
  }

  componentWillUnmount() {
    //console.log("OneViewAppForm: componentWillUnmount: this.props: ", this.props );
    this.setState({closeOnSubmit: false});

    this.props.dispatch(unloadIntegration());
  }

  _onSubmit (event) {
    //console.log("onSubmit: state: ", this.state);
    //console.log("onSubmit: this.props.formtype: ", this.props.formtype);
    event.preventDefault();

    if(this.state.closeOnSubmit === true){
      history.push({
        pathname: '/ui/rm'
      });

      return
    }

    if(this.props.formtype == "add") {
      let errors = {};
      let noErrors = true;
      if (noErrors) {
        let data = {
          rmType: this.state.rmType['type'],
          alias: this.state.alias,
          host: this.state.host,
          username: this.state.username,
          password: this.state.password
        };
        //console.log("onSubmit: data: ", data);
        this.props.onSubmit(data);
      } else {
        this.state.errors = errors;
      }
    }
    else {
      history.push({
        pathname: '/ui/rm'
      });
    }

  }

  _onChange (event) {

    const attribute = event.target.getAttribute('id');

    //console.log("Event target: ", attribute);
    // console.log("Event value: ", event.target.value);

    const value = event.target.value;
    if(attribute == "alias"){
      this.setState({alias: value});
    }
    else if(attribute == "host"){
      this.state.host = value;
      this.setState({host: value});
    }
    else if(attribute == "username"){
      this.setState({username: value});
    }

  }

  _onRemove(event) {

    //console.log("RMForm _onRemove: this.props.location.pathname: ", this.props.location.pathname);

    // const { router } = this.context;

    let alias = this.props.location.pathname.substr("/ui/rm/edit/".length);
    this.props.dispatch(deleteIntegration("/rest/rm/" + alias, false));

    //console.log("###########$$$$$$$$$$$$$$$$$$");

    history.push({
      pathname: '/ui/rm'
    });
    //console.log("###########$$$$$$$$$$$$$$$$$$^^^^^^^^");

  }

  _onPasswordChange (event) {

    const attribute = event.target.getAttribute('id');

    // console.log("Event target: ", this.state);
    // console.log("Event target: ", attribute);
    // console.log("Event value: ", event.target.value);

    const value = event.target.value;

    if(attribute === 'password') {

      // this.setState({password: {value}});
      this.setState({password: value});
    }
    else if(attribute === 'passwordconfirm') {

      // this.setState({passwordconfirm: {value}});
      this.setState({passwordconfirm: value});
    }

    if(this.state.passwordconfirm !== ""){
      if(this.state.password === value){
        this.state.passwordmatch = true;
      }
      else{
        this.state.passwordmatch = false;
      }
    }
    else{
      this.state.passwordmatch = true;
    }

  }


  render () {

    //console.log("OneView Form render: this.state: ", this.state);
    //console.log("OneView Form render: this.props: ", this.props);
    //console.log("OneView Form ...", this.state.passwordmatch);

    const {formtype} = this.props;
    //console.log("OneView Form appliance: formtype: ", formtype);

    let result = this.props.result || "";
    let error = this.props.error || {};

    let label= this.props.submitLabel || "Close";

    let notification = "";

    if ('error' in result) {
      notification = (<Notification1 message={result.error['msg']} status='status-error'
      />);

      //   ( <Box
      //   animation="fadeIn"
      //   align="center"
      //   background="validation-critical"
      //   direction="row"
      //   gap="xsmall"
      //   margin={{top: 'medium', bottom: 'medium'}}
      //   pad="small"
      //   round="4px"
      // >
      //   <CircleAlert size="small"/>
      //   <Text color='status-error' size="xsmall">{result.error['msg']}</Text>
      // </Box>);
    }
    else if ( 'result' in result) {
      label = "Close";
      notification = (<Notification1 message='Registered successfully' status='ok'/>);
    }

    let passwordmismatchlabel;
    if(this.state.passwordmatch == false){

      passwordmismatchlabel = (
        <Box tag='label'>
          Password mismatch!
        </Box>
      );
    }
    else passwordmismatchlabel = "";

    let heading = this.props.heading? this.props.heading: "Edit Connection"

    // If its edit screen then include Integration-Type form field
    let integration_type = ""
    if (formtype === undefined ||  formtype !== "add") {
      integration_type = (
        <Box align="start" justify="start" direction="row"
             background={{"color":"background-contrast"}}
             pad="xsmall" gap="medium"
        >
          <Text color="brand" size="small" textAlign="start">
            Type
          </Text>
          <Text color="brand" size="small" weight="bold" textAlign="start">
            HPE OneView Appliance
          </Text>
        </Box>
      );
    }

    return (
      <Box id="top2" fill="vertical" overflow="auto" align="start" justify="start" direction="column" pad="large" margin='medium' >
        <Header fill='horizontal'>
          <Heading level={4} margin="none" strong={true}>
            {heading}
          </Heading>
          <Button onClick={() => {history.push({ pathname: `/ui/rm`})}} icon={<CloseIcon />}
                  a11yTitle={`Close ${heading} Form`}/>
        </Header>
        {notification}
        <br/>
        <div>
          {integration_type}
          <FormField label='Resource Manager Type' >
            <Select
              id='rm_type'
              name='rm_type'
              placeholder="Select"
              options={this.state.rmTypes}
              value={this.state.rmType}
              labelKey='label'
              valueKey={{ key: 'type', reduce: false }}
              onChange={({ option }) => this.setState({"rmType": option})}
            />
          </FormField>
          <FormField label='Alias' >
            <TextInput id="alias" value={this.state.alias} onChange={this._onChange} />
          </FormField>
          <FormField label='Hostname or IP Address'>
            <TextInput id="host" value={this.state.host} onChange={this._onChange} />
          </FormField>
          <FormField label='Username'>
            <TextInput id="username" value={this.state.username} onChange={this._onChange} />
          </FormField>
          <FormField label='Password'>
            <TextInput type="password" id="password" value={this.state.password} onChange={this._onPasswordChange} />
          </FormField>
          <FormField label='Confirm Password'>
            <TextInput type="password" id="passwordconfirm" value={this.state.passwordconfirm} onChange={this._onPasswordChange}/>
            {passwordmismatchlabel}
          </FormField>
        </div>

        <Footer pad={{vertical: 'medium'}} justify="between">
          <Button type="submit" primary={true} label={label}
                  onClick={this._onSubmit} />
          <Button disabled type="button" primary={true} label="Test"
          />
          {this.props.location &&
          <Button icon={<TrashIcon />} label="Remove"
                  a11yTitle={`Remove `} plain={true} onClick={this._onRemove}/>
          }
        </Footer>
      </Box>
    );
  }
}

RMForm.defaultProps = {
  error: undefined,
  currentItem: {},
  result: {},
};

RMForm.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.object,
  currentItem: PropTypes.object,
  result: PropTypes.object
};

RMForm.contextTypes = {
  router: PropTypes.object
};

const select = state => ({ ...state.oneviewappls });

export default connect(select)(RMForm);
