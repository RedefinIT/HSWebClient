/**
 * Created by avireddi on 12/18/2019.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Header, Heading, Form, FormField, Footer, Button, Box, TextInput, RadioButton, Main, Tip} from 'grommet';

// import { getMessage } from 'grommet/utils/Intl';
import DeployServersOneView from "./DeployServersOneView";
import DeployVM from "./DeployVM";
import DeployServerSubmit from "./DeployServerSubmit";
import DeployServersBMC from "./DeployServersBMC";
import DeployBulk from "./DeployBulk";
import DeployCSV from "./DeployCSV";
import DeployServersBMCChecklist from "./DeployServersBMCChecklist";

import {
  loadDeployServers, saveDeploymentSettings, unloadDeployServers
} from '../actions/deployservers';

import { pageLoaded } from './utils';
import DeployServersServerPool from "./DeployServersServerPool";

class DeployServers extends Component {

  constructor(props) {

    super(props);

    this.state = {
      activeState: 0,
      origin: 3,
      deployServerSettings: {},
    };

    this.initialState = {
      deployServerSettings: {
        deploymentMode: "",
        name: "notitle",
        firmwareOnly: false,
        firmwareBundle: "",
        hostIPAssignmentMode: "Static",
        origin: 3,
        activeState: 0,
        serverPool: {
          name: ""
        },
        rmDetails: {
          virtType: {},
          virtMgr: {},
          virtMgrsList: [],
          vcenterDCs: [],
          vcenterClusters: [],
          vcenterHosts: [],
          vcenterDC: {},
          vcenterCluster: {},
          vcenterHost: {},
          vcenterVMTemplates: [],
          vcenterVMTemplate: {},
        },
        selectedEnv: {mgmtNetwork: {}},

        iLOChecklist: [
        ],
        OSPackage: "",

        OSInstallDest: "LocalDrive|BFS",
        hosts: [{
          iLOIP: "",
          iLOUsr: "",
          iLOPwd: "",
          ServerProfile:"",
          Hostname: "",
          IP: "",
          Netmask: "",
          Gateway: "",
          DNS1: "",
          DNS2: "",
          VLAN: "",
          rootPWD: ""
        }],
        commonOSConfig: {
          bootProto: "Static",
          networkName: "",
          netmask: "",
          gateway: "",
          dns: "",
          vlan: "",
          createLocalRAID: false,
          createServerProfile: true

        },
        hostsdata: [
        ]
      },
      screenData: {
        "envList": [],
        "ovList": [],
        "serverPools": [],
        "sptList": [],
        "sptDrivesList": [],
        "sptEthPorts": [],
        "osPackages": [],
        "scripts": []
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
    pageLoaded('DeployServers');
    //console.log("DeployServers: componentDidMount: ")
    this.props.dispatch(loadDeployServers(this.initialState));
  }

  componentWillUnmount() {
    //console.log("DeployServers: componentWillUnmount: ")
    this.props.dispatch(unloadDeployServers());
  }

  _onNameChange(event){
    const value = event.target.value;

    //console.log("_onProjectNameChange: value: ", value);

    let data = {...this.props.deployServerSettings};

    data.name = value;

    this.props.dispatch(saveDeploymentSettings(data));
  }

  onCancel() {
    let data = { ...this.props.deployServerSettings};

    data.activeState = 0;

    this.props.dispatch(saveDeploymentSettings(data));
  }

  onBack(fromState) {
    //console.log("onBack: fromState: ", fromState);
    var nextState = 0;

    const origin = this.props.deployServerSettings.origin;
    //console.log("onBack: origin: ", origin);

    // if the origin is through OneView
    if(origin === 1) {
      if(fromState === 5){
        nextState = 1;
      }
      if(fromState === 5){
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

    // if the origin is VM deployment
    if(origin === 4) {
      if(fromState === 5){
        nextState = 4;
      }
      if(fromState === 6){
        nextState = 4;
      }
      if(fromState === 4){
        nextState = 0;
      }
    }

    let data = { ...this.props.deployServerSettings};

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
      nextState = 5;
    }

    if (activeState === 3){
      nextState = 6;
    }

    if (activeState === 4 || activeState === 6) {
      nextState = 5;
    }

    let data = { ...this.props.deployServerSettings};

    data.activeState = nextState;

    this.props.dispatch(saveDeploymentSettings(data));

  }

  handleClick() {
    // console.log('clicked');
    this.setState({open: true});
  }

  handleDeployModeRadio(event) {
    console.log("handleDeployModeRadio: ", event.target.name);
    // The below line gets a deep copy of the requested object instead of mutable object reference
    let data = { ...this.props.deployServerSettings};
    data.deploymentMode = event.target.name;
    // BMA supports only DHCP for Dell iDRAC9 servers
    if(event.target.name === 'dell_idrac9' || event.target.name === 'supermicro') {
      data.hostIPAssignmentMode = 'DHCP';
    }

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
    let data = { ...this.props.deployServerSettings};

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
      || data.deploymentMode === "supermicro"
      || data.deploymentMode === "hpeilo_gen9"){
      data.origin = 3;
      data.activeState = 3;
    }
    else if(data.deploymentMode === "vmware"){
      data.origin = 4;
      data.activeState = 4;
    }
    else if(data.deploymentMode === "bulkmode"){
      data.origin = 7;
      data.activeState = 7;
    }
    else if(data.deploymentMode === "serverpools"){
      data.origin = 9;
      data.activeState = 9;
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
    //console.log("render: DeployServers: this.props: ", this.props);

    const { error, deployServerSettings } = this.props;
    const { intl } = this.context;

    // console.log("render: DeployServers: ", deployServerSettings);
    // console.log("render: DeployServers: this.state: ", this.state);

    return (
      <Box id="top2" fill align="start" flex="grow"  justify="start" direction="column" pad="large"  >
        { deployServerSettings.activeState === 0 && (
          <div>
            <Header>
              <Heading level={4} size="small"  strong={true} >Server Deployment</Heading>
            </Header>
            <Heading level={5} strong={true} >Choose Method</Heading>


            <Box margin="small" direction='column' gap='large' wrap>
              <div>
                <Box direction={"row"} gap={"large"}>
                  <Box elevation='medium' justify={"center"} pad='medium'>
                    <Tip plain={false}
                         dropProps={{ align: { left: 'right' } }}
                         content="Using Server Pools">
                      <RadioButton id='serverpools'
                                   name='serverpools'
                                   label='Server Pools'
                                   checked={deployServerSettings.deploymentMode === 'serverpools' ? true:false}
                                   onChange={this.handleDeployModeRadio} />
                    </Tip>
                  </Box>
                  <Box elevation='medium' justify={"center"} pad='medium'>
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
                         content="Choose Supermicro X11 or later generation servers.">
                      <RadioButton id='supermicro'
                                   name='supermicro'
                                   label='Supermicro'
                                   checked={deployServerSettings.deploymentMode === 'supermicro' ? true:false}
                                   disabled={true}
                                   onChange={this.handleDeployModeRadio} />
                    </Tip>
                  </Box>

                </Box>

              </div>

              {/*<RadioButton id='hpeilo_gen9'*/}
              {/*             name='hpeilo_gen9'*/}
              {/*             label='HPE iLO 4 (Gen9)'*/}
              {/*             checked={deployServerSettings.deploymentMode === 'hpeilo_gen9' ? true:false}*/}
              {/*             onChange={this.handleDeployModeRadio} />*/}
              {/*<RadioButton id='hpesynergy'*/}
              {/*             name='hpesynergy'*/}
              {/*             label='HPE OneView and Synergy'*/}
              {/*             checked={deployServerSettings.deploymentMode === 'hpesynergy' ? true:false}*/}
              {/*             onChange={this.handleDeployModeRadio} />*/}

              <div>
                <Box direction={"row"} gap={"large"}>
                <Box elevation='medium' justify={"center"} pad='medium'>
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
                                 disabled={true}
                                 onChange={this.handleDeployModeRadio} />
                  </Tip>
                </Box>
                  <Box elevation='medium' justify={"center"} pad='medium'>
                    <Tip plain={false}
                         dropProps={{ align: { left: 'right' } }}
                         content="Connect to VMWare vCenter">
                      <RadioButton id='vmware'
                                   name='vmware'
                                   label='Virtual Machine (vSphere)'
                                   checked={deployServerSettings.deploymentMode === 'vmware' ? true:false}
                                   disabled={false}
                                   onChange={this.handleDeployModeRadio} />
                    </Tip>
                    <Tip plain={false}
                         dropProps={{ align: { left: 'right' } }}
                         content="Connect to KVM">
                      <RadioButton id='kvm'
                                   name='kvm'
                                   label='Virtual Machine (KVM)'
                                   checked={deployServerSettings.deploymentMode === 'kvm' ? true:false}
                                   disabled={true}
                                   onChange={this.handleDeployModeRadio} />
                    </Tip>
                  </Box>
                </Box>
              </div>

              <div>
                <Box elevation='medium' justify={"center"} pad='medium'>
                  <Tip plain={false}
                       dropProps={{ align: { left: 'right' } }}
                       content="Deploy multiple servers using JSON file">
                    <RadioButton id='bulkmode'
                                 name='bulkmode'
                                 label='Bulk deployment'
                                 checked={deployServerSettings.deploymentMode === 'bulkmode' ? true:false}
                                 onChange={this.handleDeployModeRadio} />
                  </Tip>
                </Box>
              </div>
              {/*<RadioButton id='csv'*/}
              {/*             name='csv'*/}
              {/*             label='Deployment using CSV'*/}
              {/*             checked={deployServerSettings.deploymentMode === 'csv' ? true:false}*/}
              {/*             onChange={this.handleDeployModeRadio} />*/}

            </Box>
            <Footer pad={{vertical: 'medium'}} justify="between">
              <Tip plain={false}
                   dropProps={{ align: { left: 'right' } }}
                   content="Go to next page">
                <Button label='Next'
                        type='submit'
                        primary={true}
                        onClick={this.handleNext}
                />
              </Tip>
              {/*<Button label='Cancel'*/}
              {/*primary={false}*/}
              {/*onClick={this.handleClick}*/}
              {/*/>*/}
            </Footer>
          </div>
        )}

        { deployServerSettings.activeState === 1 && (
          <div><DeployServersOneView
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { deployServerSettings.activeState === 3 && (
          <div><DeployServersBMCChecklist
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel} /></div>
        )}
        { deployServerSettings.activeState === 6 && (
          <div><DeployServersBMC
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { deployServerSettings.activeState === 4 && (
          <div><DeployVM
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { deployServerSettings.activeState === 5 && (
          <div><DeployServerSubmit
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { deployServerSettings.activeState === 7  && (
          <div><DeployBulk
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { deployServerSettings.activeState === 8  && (
          <div><DeployServersBMC
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { deployServerSettings.activeState === 9  && (
          <div><DeployServersServerPool
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
      </Box>
    );
  }
}

DeployServers.defaultProps = {
  error: undefined,
  deployServerSettings: {}
};

DeployServers.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  deployServerSettings: PropTypes.object
};

DeployServers.contextTypes = {
  intl: PropTypes.object
};

// const select = state => ({ ...state.deployservers });
const select = state => ({ deployServerSettings: state.deployservers.deployServerSettings});

export default connect(select)(DeployServers);
