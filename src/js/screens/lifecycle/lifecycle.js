/**
 * Created by avireddi on 12/18/2019.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Header, Heading, Form, FormField, Footer, Button, Box, TextInput, RadioButton, Main, Tip, Text} from 'grommet';

import {
  loadDeployServers, saveDeploymentSettings, unloadDeployServers
} from '../../actions/deployservers';

import { pageLoaded } from '../utils';

class Lifecycle extends Component {

  constructor(props) {

    super(props);

    this.state = {
      activeState: 0,
      origin: 3,
      deployServerSettings: {},
    };

    this.initialState = {
      deployServerSettings: {
        "deploymentMode": "",
        "name": "notitle",
        "firmwareOnly": false,
        "firmwareBundle": "",
        "hostIPAssignmentMode": "Static",
        "origin": 3,
        "activeState": 0,
        "rmDetails": {
          "Type": "OneView|Synergy",
          "OVName": "",
          "OVSPTName": "",
          "sptEthPorts": [],
          "sptDrivesList": []
        },
        "iLOChecklist": [
          {"Id": 1, "Msg": "", "Check": false},
          {"Id": 2, "Msg": "", "Check": false},
          {"Id": 3, "Msg": "", "Check": false},
          {"Id": 4, "Msg": "", "Check": false}
        ],
        "OSPackage": "",

        "OSInstallDest": "LocalDrive|BFS",
        "hosts": [{
          "iLOIP": "",
          "iLOUsr": "",
          "iLOPwd": "",
          "ServerProfile":"",
          "Hostname": "",
          "IP": "",
          "Netmask": "",
          "Gateway": "",
          "DNS1": "",
          "DNS2": "",
          "VLAN": "",
          "rootPWD": ""
        }],
        commonOSConfig: {
          "bootProto": "Static",
          "networkName": "",
          "netmask": "",
          "gateway": "",
          "dns": "",
          "vlan": "",
          "createLocalRAID": false,
          "createServerProfile": true

        },
        hostsdata: [
        ]
      },
      screenData: {
        "ovList": [],
        "sptList": [],
        "sptDrivesList": [],
        "sptEthPorts": [],
        "osPackages": [],
        "kickstarts": []
      },
      deployProgressData: {}
    };

    this.handleDeployModeRadio = this.handleDeployModeRadio.bind(this);

    this._onNameChange = this._onNameChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.handleNext= this.handleNext.bind(this);

  }

  componentDidMount() {
    pageLoaded('Lifecycle');
    //console.log("Lifecycle: componentDidMount: ")
    this.props.dispatch(loadDeployServers(this.initialState));
  }

  componentWillUnmount() {
    //console.log("Lifecycle: componentWillUnmount: ")
    this.props.dispatch(unloadDeployServers());
  }

  _onNameChange(event){
    const value = event.target.value;

    //console.log("_onProjectNameChange: value: ", value);

    var data = {...this.props.deployServerSettings};

    data.name = value;

    this.props.dispatch(saveDeploymentSettings(data));


  }

  onCancel() {
    var data = { ...this.props.deployServerSettings};

    data.activeState = 0;

    this.props.dispatch(saveDeploymentSettings(data));

  }

  onBack(fromState) {
    //console.log("onBack: fromState: ", fromState);
    var nextState = 0;

    const origin = this.props.deployServerSettings.origin;
    //console.log("onBack: origin: ", origin);

    // if the origin is through Synergy
    if(origin === 1) {
      if(fromState === 5){
        nextState = 4;
      }
      if(fromState === 4){
        nextState = 1;
      }
      if(fromState === 1){
        nextState = 0;
      }
    }

    // if the origin is direct iLO deployment
    if(origin === 3) {
      if(fromState === 5){
        nextState = 6;
      }
      if(fromState === 6){
        nextState = 3;
      }
      if(fromState === 3){
        nextState = 0;
      }
    }

    var data = { ...this.props.deployServerSettings};

    data.activeState = nextState;

    this.props.dispatch(saveDeploymentSettings(data));
  }

  onNext(activeState) {

    //console.log("onNext: activeState: ", activeState);
    // this variable indicates which wizard screen should be displayed
    // 0 - Initial page
    // 1 - HPE Synergy screen
    // 2 - HPE OneView screen
    // 3 - HPE iLO checklist screen
    // 4 - OS Customization screen
    // 5 - final summary screen
    // 6 - ilo OS customization screen
    // 7 - Bulk deployment screen
    var nextState = 0;
    if(activeState === 1 || activeState === 2){
      nextState = 4;
    }

    if (activeState === 3){
      nextState = 6;
    }

    if (activeState === 4 || activeState === 6) {
      nextState = 5;
    }

    var data = { ...this.props.deployServerSettings};

    data.activeState = nextState;

    this.props.dispatch(saveDeploymentSettings(data));

  }

  handleClick() {
    // console.log('clicked');
    this.setState({open: true});
  }

  handleDeployModeRadio(event) {
    //console.log("handleDeployModeRadio: ", event.target.name);
    // The below line gets a deep copy of the requested object instead of mutable object reference
    var data = { ...this.props.deployServerSettings};
    data.deploymentMode = event.target.name;
    // this.state.deployServerSettings["DeploymentMode"] = event.target.value;
    // this.setState({
    //   deployServerSettings: data
    // })

    this.props.dispatch(saveDeploymentSettings(data));

  }

  handleNext() {
    // this variable indicates which wizard screen should be displayed
    // 0 - Initial page
    // 1 - HPE Synergy screen
    // 2 - HPE OneView screen
    // 3 - HPE iLO screen
    // 4 - OS Customization screen
    // 5 - final summary screen

    // The below line gets a deep copy of the requested object instead of mutable object reference
    var data = { ...this.props.deployServerSettings};

    if(data.deploymentMode === "hpeoneview"){
      data.origin = 1;
      data.activeState = 1;
    }
    else if(data.deploymentMode === "dellom"){
      data.origin = 2;
      data.activeState = 2;
    }
    else if( data.deploymentMode === "dell_idrac9"
      || data.deploymentMode === "hpeilo5"
      || data.deploymentMode === "hpeilo_gen9"){
      data.origin = 3;
      data.activeState = 3;
    }
    else if(data.deploymentMode === "vm"){
      data.origin = 4;
      data.activeState = 4;
    }
    else if(data.deploymentMode === "bulkmode"){
      data.origin = 7;
      data.activeState = 7;
    }
      // else if(data.deploymentMode === "dell_idrac9"){
      //   data.origin = 8;
      //   data.activeState = 8;
    // }
    else {
      // window.alert("Please select the deployment mode!")
    }

    this.props.dispatch(saveDeploymentSettings(data));
  }

  render() {
    //console.log("render: Lifecycle: this.props: ", this.props);

    // { deployServerSettings.activeState === 2 && (
    //   <div><DeployServersOV data={this.state.deployServerSettings}
    //                         onNext={this.onNext} onBack={this.onBack}/></div>
    // )}
    // { deployServerSettings.activeState === 3 && (
    //   <div><DeployServersILOChecklist data={this.state.deployServerSettings}
    //                          onNext={this.onNext} onBack={this.onBack}/></div>
    // )}
    // { deployServerSettings.activeState === 5 && (
    //   <div><DeployServerSubmit data={this.state.deployServerSettings}
    //                            onNext={this.onNext} onBack={this.onBack}/></div>
    // )}


    const { error, deployServerSettings } = this.props;
    const { intl } = this.context;

    // console.log("render: Lifecycle: ", deployServerSettings);
    // console.log("render: Lifecycle: this.state: ", this.state);

    return (
      <Box id="top2" fill="vertical" overflow="auto" align="start" flex="grow"  justify="start" direction="column" pad="large"  >
        { deployServerSettings.activeState === 0 && (
            <div>
              <Header>
                <Heading level={4} size="small"  strong={true} >Lifecycle Management </Heading>
                <Text color='status-critical'>(Feature not available yet)</Text>
              </Header>
              <Header>
                <Heading level={5} size="small"  strong={true} >Choose Method</Heading>
              </Header>
                <Box margin="small">
                  <Tip plain={false}
                       dropProps={{ align: { left: 'right' } }}
                       content="Choose iLO 5 for HPE Gen10 servers">
                    <RadioButton id='hpeilo5'
                                 name='hpeilo5'
                                 label='HPE iLO 5'
                                 checked={deployServerSettings.deploymentMode === 'hpeilo5' ? true:false}
                                 onChange={this.handleDeployModeRadio} />
                  </Tip>
                  <Tip plain={false}
                       dropProps={{ align: { left: 'right' } }}
                       content="Choose iDRAC9 for Dell PowerEdge Gen14 or later">
                    <RadioButton id='dell_idrac9'
                                 name='dell_idrac9'
                                 label='Dell iDRAC9'
                                 checked={deployServerSettings.deploymentMode === 'dell_idrac9' ? true:false}
                                 disabled={false}
                                 onChange={this.handleDeployModeRadio} />
                  </Tip>
                  <Tip plain={false}
                       dropProps={{ align: { left: 'right' } }}
                       content="Connect to HPE OneView or Synergy Composer">
                    <RadioButton id='hpeoneview'
                                 name='hpeoneview'
                                 label='HPE OneView'
                                 checked={deployServerSettings.deploymentMode === 'hpeoneview' ? true:false}
                                 onChange={this.handleDeployModeRadio} />
                  </Tip>
                  <Tip plain={false}
                       dropProps={{ align: { left: 'right' } }}
                       content="Connect to Dell OpenManager">
                    <RadioButton id='dellom'
                                 name='dellom'
                                 label='Dell OpenManage'
                                 checked={deployServerSettings.deploymentMode === 'dellom' ? true:false}
                                 disabled={false}
                                 onChange={this.handleDeployModeRadio} />
                  </Tip>
                  <Tip plain={false}
                       dropProps={{ align: { left: 'right' } }}
                       content="Connect to VMWare vCenter">
                    <RadioButton id='vm'
                                 name='vm'
                                 label='Virtual Machine (vSphere)'
                                 checked={deployServerSettings.deploymentMode === 'vm' ? true:false}
                                 disabled={false}
                                 onChange={this.handleDeployModeRadio} />
                  </Tip>
                </Box>
              <Footer pad={{vertical: 'medium'}} justify="between">
                <Button label='Next'
                        type='submit'
                        primary={true}
                        disabled
                        onClick={this.handleNext}
                />
                {/*<Button label='Cancel'*/}
                {/*primary={false}*/}
                {/*onClick={this.handleClick}*/}
                {/*/>*/}
              </Footer>

            </div>
        )}
      </Box>
    );
  }
}

Lifecycle.defaultProps = {
  error: undefined,
  deployServerSettings: {}
};

Lifecycle.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  deployServerSettings: PropTypes.object
};

Lifecycle.contextTypes = {
  intl: PropTypes.object
};

// const select = state => ({ ...state.deployservers });
const select = state => ({ deployServerSettings: state.deployservers.deployServerSettings});

export default connect(select)(Lifecycle);
