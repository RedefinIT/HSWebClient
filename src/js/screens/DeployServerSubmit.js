/**
 * Created by avireddi on 12/18/2019.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  Anchor,
  Header,
  Heading,
  Form,
  Footer,
  Button,
  Box,
  Paragraph,
  TextArea,
  FormField,
  Grid,
  Select
} from 'grommet';
import {Notification} from 'grommet-controls';
import ReactJson from 'react-json-view';

import {
  saveDeploymentSettings, performDeployServers, unloadDeployServers
} from '../actions/deployservers';

import {pageLoaded} from './utils';
import {DocumentConfig, DocumentDownload} from 'grommet-icons';
import {saveAs as FileSaveAs} from 'file-saver';

import {postRESTApi1} from '../api/server-rest';
import SyntaxHighlighter from "react-syntax-highlighter";

class DeployServerSubmit extends Component {

  constructor(props) {

    super(props);

    this.state = {
      activeState: 5,
      submitted: false,
      deployJSON: {
        "hosts": [],
        "osPackage": "",
        "deploymentMode": "",
        "rmDetails": {}
      }
    };

    this.genNetworkSettings = this.genNetworkSettings.bind(this);
    this.genDeployJSON4VCenter = this.genDeployJSON4VCenter.bind(this);
    this.genDeployJSON4RedfishBMC = this.genDeployJSON4RedfishBMC.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleBack = this.handleBack.bind(this);
    // this.handleCommonOSConfig = this.handleCommonOSConfig.bind(this);
    this.generateDeployJSON = this.generateDeployJSON.bind(this);
    this._handleDownloadJSON = this._handleDownloadJSON.bind(this);

  }

  componentDidMount() {
    pageLoaded('DeployServerSubmit');
    //console.log("DeployServerSubmit: componentDidMount: ")
    this.generateDeployJSON();
    // this.props.dispatch(loadDeployServers());
  }

  componentWillUnmount() {
    //console.log("DeployServerSubmit: componentWillUnmount: ")
    // this.props.dispatch(unloadDeployServers());
  }

  _handleDownloadJSON() {
    //console.log(JSON.stringify(this.state.deployJSON, null, 2));
    let jsondata = JSON.stringify(this.state.deployJSON, null, 2);
    let jsonblob = new Blob([jsondata], {type: "text/plain;charset=utf-8"});
    FileSaveAs(jsonblob, "deploy.json");
  }

  loadOVData() {
    let url = '/rest/rm/list';
    restGet(url).then(data => {
      this.setState({
        oneViewList: data['result']
      });
      //console.log(data);
    });
  }

  // loadOSPackages() {
  //   var url = '/rest/ospackage/list';
  //   restGet(url).then(data => {
  //     this.setState({
  //       OSPackages: data['result']
  //     });
  //   });
  // }

  handleCancel() {
    this.props.onCancel();
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({isFail: false, isSuccess: false});
  }

  genDeployJSON4RedfishBMC(){
    let hosts = this.props.deployServerSettings.hostsdata;
    let deplSettings = this.props.deployServerSettings;

    let hostIPAssignment = this.getHostAssignmentSettings(deplSettings);
    let deployJSON = {};
    let hostsconfig = [];

    // if(deplSettings['hostIPAssignmentMode'] === "Static-Range") {
    //   hostIPAssignment = {
    //     'mode': "static-range",
    //     'startIP': deplSettings['startIPRange'],
    //     'endIP': deplSettings['endIPRange']
    //   };
    // }
    // else if(deplSettings['hostIPAssignmentMode'] === "Static") {
    //   hostIPAssignment = { 'mode': "static"};
    // }
    // else if(deplSettings['hostIPAssignmentMode'] === "DHCP") {
    //   hostIPAssignment = { 'mode': "dhcp"};
    // }
    // else if(deplSettings['hostIPAssignmentMode'] === "Address-Pool") {
    //   // TODO: Support for Pool mode is pending
    //   hostIPAssignment = { 'mode': "address-pool", 'pool_name': "Not Supported Yet"};
    // }

    hostsconfig = hosts.map((host) => {
      //console.log("host: ", host);
      //console.log("this.props.deployServerSettings: ", this.props.deployServerSettings);
      let osconfig = {};
      //console.log("handleAddHost: before!!  ILO osconfig: ", osconfig);
      if (osconfig['networkName'] === "User Defined")
        osconfig['networkName'] = "";
      osconfig['bmcIPAddr'] = host['bmcIPAddr'];
      osconfig['bmcUser'] = host['bmcUser'];
      osconfig['bmcPassword'] = host['bmcPassword'];
      osconfig['hostName'] = host['hostName'];
      osconfig['osPackage'] = deplSettings['osPackage'];
      osconfig['firmwareOnly'] = deplSettings['firmwareOnly'];
      osconfig['firmwareBundle'] = deplSettings['firmwareBundle'];
      if (deplSettings['kickstart'] === "Default")
        osconfig['kickstartFile'] = "";
      else
        osconfig['kickstartFile'] = deplSettings['kickstart'];


      osconfig['networks'] = this.genNetworkSettings(deplSettings, host);

      //console.log("now drive: ");
      if (this.props.deployServerSettings.commonOSConfig['createLocalRAID'] === true) {
        // should create a RAID logical drive for OS installation destination

        let operation = "";
        if (this.props.deployServerSettings.commonOSConfig['deleteAllLD'] === true)
          operation = "DELETE_ALL_AND_CREATE";
        else
          operation = "CREATE";

        osconfig['osDrive'] = {
          "logicalDrive": {
            "driveTechnology": this.props.deployServerSettings.commonOSConfig['driveTechnology'],
            "capacity": this.props.deployServerSettings.commonOSConfig['driveSize'],
            "capacityUnit": "GB",
            "raidLevel": this.props.deployServerSettings.commonOSConfig['raidLevel'],
            "operation": operation
          }
        };
      } else if ('osDrive' in host) {
        osconfig['osDrive'] = host['osDrive']
      }

      //console.log("handleAddHost: ILO osconfig: ", osconfig);

      return osconfig;
    });

    deployJSON = {
      "name": deplSettings['name'],
      "hosts": hostsconfig,
      "hostIPAssignment": hostIPAssignment,
      "deploymentMode": deplSettings['deploymentMode'],
    };

    return deployJSON;
  }

  genNetworkSettings(deplSettings, host) {
    // Networks is array of two networks
    let networks = [{}, {}];
    if(deplSettings['hostIPAssignmentMode'] === "Static-Range")
      networks[0]['ipAddr'] = host['ipAddr'];
    else
      networks[0]['ipAddr'] = "";

    if(deplSettings['hostIPAssignmentMode'] === "Static"
        || deplSettings['hostIPAssignmentMode'] === "Static-Range"){

      if(deplSettings['hostIPAssignmentMode'] === "Static")
        networks[0]['ipAddr'] = host['ipAddr'];
      else
      if(deplSettings['hostIPAssignmentMode'] === "Static-Range")
        networks[0]['ipAddr'] = "";

      networks[0]['subnetmask'] = this.props.deployServerSettings['selectedEnv']['mgmtNetwork']['subnetmask'];
      networks[0]['gateway'] = this.props.deployServerSettings['selectedEnv']['mgmtNetwork']['gateway'];
      networks[0]['dns1'] = this.props.deployServerSettings['selectedEnv']['mgmtNetwork']['dns1'];
      networks[0]['bootProto'] = "Static";
    }
    else if(deplSettings['hostIPAssignmentMode'] === "DHCP") {
      networks[0]['bootProto'] = "DHCP";
      networks[0]['ipAddr'] = "";
      networks[0]['subnetmask'] = "";
      networks[0]['gateway'] = "";
      networks[0]['dns1'] = "";
      networks[0]['bootProto'] = "";
    }
    // NIC1
    networks[0]['nic1'] = host['nic1'];
    // NIC2
    networks[0]['nic2'] = host['nic2'];

    // networks[0]['bootProto'] = this.props.deployServerSettings.commonOSConfig['bootProto'];

    // if(host['ethPorts'].length > 0){
    //
    //   let selectedPort = host['ethPorts'].find((port) =>{
    //     return (host['nic1'].indexOf(port.macAddress) != -1)
    //   });
    //   networks[0]['nic1'] = {"adapterId": selectedPort['adapterId'], "portId": selectedPort['portId']};

    //   // if( "nic2" in deplSettings['commonOSConfig']) {
    //   if( "nic2" in host) {
    //     selectedPort = host['ethPorts'].find((port) =>{
    //       return (host['nic2'].indexOf(port.macAddress) != -1)
    //     });
    //     networks[0]['nic2'] = {"adapterId": selectedPort['adapterId'], "portId": selectedPort['portId']};
    //   }
    // }


    networks[0]['bondingType'] = "";
    networks[0]['vlans'] = this.props.deployServerSettings['selectedEnv']['mgmtNetwork']['vlan'];

    return networks;
  }

  genDeployJSON4VCenter(){

    let hosts = this.props.deployServerSettings.hostsdata;
    let deplSettings = this.props.deployServerSettings;

    //console.log("genDeployJSON4VCenter: deplSettings: ", deplSettings)

    let hostIPAssignment = this.getHostAssignmentSettings(deplSettings);
    let deployJSON = {};
    let hostsconfig = [];



    hostsconfig = hosts.map((host) => {
      //console.log("host: ", host);
      //console.log("this.props.deployServerSettings: ", this.props.deployServerSettings);
      let osconfig = {};
      //console.log("handleAddHost: before!!  ILO osconfig: ", osconfig);
      if (osconfig['networkName'] === "User Defined")
        osconfig['networkName'] = "";
      osconfig['hostName'] = host['hostName'];

      // Networks is array of two networks
      let networks = [{}, {}];
      if(deplSettings['hostIPAssignmentMode'] === "Static-Range")
        networks[0]['ipAddr'] = host['ipAddr'];
      else
        networks[0]['ipAddr'] = "";

      if(deplSettings['hostIPAssignmentMode'] === "Static"
          || deplSettings['hostIPAssignmentMode'] === "Static-Range"){

        if(deplSettings['hostIPAssignmentMode'] === "Static")
          networks[0]['ipAddr'] = host['ipAddr'];
        else
        if(deplSettings['hostIPAssignmentMode'] === "Static-Range")
          networks[0]['ipAddr'] = "";

        networks[0]['subnetmask'] = this.props.deployServerSettings['selectedEnv']['mgmtNetwork']['subnetmask'];
        networks[0]['gateway'] = this.props.deployServerSettings['selectedEnv']['mgmtNetwork']['gateway'];
        networks[0]['dns1'] = this.props.deployServerSettings['selectedEnv']['mgmtNetwork']['dns1'];
        networks[0]['bootProto'] = "Static";
      }
      else if(deplSettings['hostIPAssignmentMode'] === "DHCP") {
        networks[0]['bootProto'] = "DHCP";
        networks[0]['ipAddr'] = "";
        networks[0]['subnetmask'] = "";
        networks[0]['gateway'] = "";
        networks[0]['dns1'] = "";
        networks[0]['bootProto'] = "";
      }
      // NIC1
      networks[0]['nic1'] = host['nic1'];
      // NIC2
      networks[0]['nic2'] = host['nic2'];

      networks[0]['bondingType'] = "";
      networks[0]['vlans'] = this.props.deployServerSettings['selectedEnv']['mgmtNetwork']['vlan'];

      osconfig['networks'] = networks;

      //console.log("now drive: ");
      if (this.props.deployServerSettings.commonOSConfig['createLocalRAID'] === true) {
        // should create a RAID logical drive for OS installation destination

        let operation = "";
        if (this.props.deployServerSettings.commonOSConfig['deleteAllLD'] === true)
          operation = "DELETE_ALL_AND_CREATE";
        else
          operation = "CREATE";

        osconfig['osDrive'] = {
          "logicalDrive": {
            "driveTechnology": this.props.deployServerSettings.commonOSConfig['driveTechnology'],
            "capacity": this.props.deployServerSettings.commonOSConfig['driveSize'],
            "capacityUnit": "GB",
            "raidLevel": this.props.deployServerSettings.commonOSConfig['raidLevel'],
            "operation": operation
          }
        };
      } else if ('osDrive' in host) {
        osconfig['osDrive'] = host['osDrive']
      }

      //console.log("handleAddHost: ILO osconfig: ", osconfig);

      return osconfig;
    });

    deployJSON = {
      "name": deplSettings['name'],
      "hosts": hostsconfig,
      "hostIPAssignment": hostIPAssignment,
      "deploymentMode": deplSettings['deploymentMode'],
      "rmDetails": {
        "vcenterDC": deplSettings['rmDetails']['vcenterDC']['name'],
        "vcenterCluster": deplSettings['rmDetails']['vcenterCluster']['name'],
        "vcenterHost": deplSettings['rmDetails']['vcenterHost']['name'],
        "vcenterVMTemplate": deplSettings['rmDetails']['vcenterVMTemplate']['name'],
        "rmAlias": deplSettings['rmDetails']['virtMgr']['alias'],
        "rmType": deplSettings['rmDetails']['virtMgr']['rmType']
      }
    };

    //console.log("genDeployJSON4VCenter: returning: ", deployJSON);
    return deployJSON;
  }

  generateDeployJSON() {

    let hosts = this.props.deployServerSettings.hostsdata;
    let deplSettings = this.props.deployServerSettings;

    //console.log("generateDeployJSON: this.props.deployServerSettings: ", this.props.deployServerSettings);
    //console.log("generateDeployJSON: deplSettings: ", deplSettings);

    let hostIPAssignment = this.getHostAssignmentSettings(deplSettings);
    let deployJSON = {};
    let hostsconfig = [];

    if (deplSettings['deploymentMode'] === 'vm') {
      deployJSON = this.genDeployJSON4VCenter()
    }
    else if (deplSettings['deploymentMode'] === 'hpeoneview') {
      hostsconfig = hosts.map((host) => {
        // //console.log("host: ", host);
        let osconfig = {};

        if (osconfig['networkName'] === "User Defined")
          osconfig['networkName'] = "";
        osconfig['serverProfile'] = host['serverProfile'];
        osconfig['hostName'] = host['hostName'];

        osconfig['osPackage'] = deplSettings['osPackage'];
        if (deplSettings['kickstart'] == "Default")
          osconfig['kickstartFile'] = "";
        else
          osconfig['kickstartFile'] = deplSettings['kickstart'];

        osconfig['networks'] = this.genNetworkSettings(deplSettings, host);

        let selectedDrive = deplSettings['commonOSConfig']['osDrive'].split(" -> ")[0];
        osconfig['osDrive'] = {"driveName": selectedDrive};

        //console.log("handleAddHost: Synergy osconfig: ", osconfig);

        return osconfig;
      });

      deployJSON = {
        "name": deplSettings['name'],
        "hosts": hostsconfig,
        "hostIPAssignment": hostIPAssignment,
        "deploymentMode": deplSettings['deploymentMode'],
        "createServerProfile": this.props.deployServerSettings.commonOSConfig['createServerProfile'],
        "rmDetails": {
          "rmAlias": deplSettings['rmDetails']['rmAlias'],
          "ovSPT": deplSettings['rmDetails']['ovSPTName']['name']
        }
      };

    } else if (deplSettings['deploymentMode'] === 'hpeilo5'
      || deplSettings['deploymentMode'] === 'hpeilo_gen9'
      || deplSettings['deploymentMode'] === 'dell_idrac9') {

      deployJSON = this.genDeployJSON4RedfishBMC();

    }

    //console.log("handleSubmit: hostsconfig: ", hostsconfig);

    this.setState({deployJSON: deployJSON});
  }

  handleSubmit() {
    //console.log("DeployServerSubmit: handleSubmit: : ");

    // this.props.dispatch(saveDeploymentSettings(deplSettings));
    // Set the submitted state parameter to true
    this.state.submitted = true;
    this.props.dispatch(performDeployServers(this.state.deployJSON))
    // //console.log("handleSubmit: deployServerSettings: ", this.props.deployServerSettings);

    // const { router } = this.context;
    // router.push({
    //   pathname: '/activity'
    // });

  }

  handleBack() {
    //console.log("DeployServerSubmit: handleBack: this.state.activeState: ", this.state.activeState);

    // This will navigate the page to previous page
    this.props.onBack(this.state.activeState);
  }

  render() {
    //console.log("render: deployServerSubmit: this.state.deployJSON: ", this.state.deployJSON);
    //console.log("render: deployServerSubmit: this.props: ", this.props);
    //console.log("render: deployServerSubmit: this.props: ", typeof (this.props.deployServerSettings));

    const {error, deployServerSettings, deployProgressData} = this.props;
    const {intl, router} = this.context;

    let notification = "";

    if (this.state.submitted === true) {
      //console.log("render: deployServerSubmit: deployProgressData.status.error: ", typeof (deployProgressData.status.error));
      //console.log("render: deployServerSubmit: deployProgressData.status.error: ", Object.keys(deployProgressData.status.error));

      // If the status has error: {} then deployment must be successfully initiated
      if (Object.keys(deployProgressData.status.error).length === 0) {
        //console.log("render: deployServerSubmit: deployProgressData.status.error: ", deployProgressData.status.error);
        // router.push({
        //   pathname: '/deployprogress/'
        // });
      } else {
        // There must be some error so display the error in this screen
        notification = (<Notification status='critical'
                                      message={deployProgressData.status.error.message}
        />);
        // reset the submit flag to false to allow the user to try submit again
        this.state.submitted = false;
      }
    }

    return (
      <div>
        {notification}
        <Form pad='large'>
          <Header>
            <Heading level={4} size="small" strong={true}>Server Deployment</Heading>
          </Header>
          <Heading strong={true} level={5}>
            Summmary and Submit
          </Heading>
          <Grid id="kvgrid" responsive={true} justify="stretch" fill
                rows={['flex', 'xsmall', 'xxsmall']}
                columns={['full']}
                gap="small"
                areas={[
                  { name: 'jsonview', start: [0, 0], end: [0, 0] },
                  { name: 'download', start: [0, 1], end: [0, 1] },
                  { name: 'footer', start: [0, 2], end: [0, 2] },
                ]}
          >
            <Box gridArea="jsonview" direction="column" align="center" gap="small" border={{"style":"ridge","size":"medium"}} >
                {Object.keys(this.state.deployJSON).length !== 0 && (
                  <ReactJson
                    src={this.state.deployJSON}
                    margin="small"
                    collapsed={1}
                    theme="summerfruit:inverted"
                    displayDataTypes={false}
                  />
                )}
              </Box>
            <Box gridArea="download" align="start" >
              <Anchor icon={<DocumentDownload/>}
                      primary={false} label='Download JSON' onClick={this._handleDownloadJSON}/>
            </Box>
            <Box gridArea="footer"  >
              <Footer pad={{vertical: 'medium'}} justify="between">
                <Button label='Deploy'
                        primary={true}
                        onClick={this.handleSubmit}
                />
                <Button label='Prev'
                        primary={false}
                        onClick={this.handleBack}
                />
                <Button label='Cancel'
                        primary={false}
                        onClick={this.handleCancel}
                />
              </Footer>
            </Box>
          </Grid>
        </Form>
      </div>
    );
  }

  getHostAssignmentSettings(deplSettings) {

    let hostIPAssignment = {};

    if(deplSettings['hostIPAssignmentMode'] === "Static-Range") {
      hostIPAssignment = {
        'mode': "static-range",
        'startIP': deplSettings['startIPRange'],
        'endIP': deplSettings['endIPRange']
      };
    }
    else if(deplSettings['hostIPAssignmentMode'] === "Static") {
      hostIPAssignment = { 'mode': "static"};
    }
    else if(deplSettings['hostIPAssignmentMode'] === "DHCP") {
      hostIPAssignment = { 'mode': "dhcp"};
    }
    else if(deplSettings['hostIPAssignmentMode'] === "Address-Pool") {
      // TODO: Support for Pool mode is pending
      hostIPAssignment = { 'mode': "address-pool", 'pool_name': "Not Supported Yet"};
    }

    return hostIPAssignment;
  }


}

DeployServerSubmit.defaultProps = {
  error: undefined,
  deployServerSettings: {},
  deployProgressData: {}
};

DeployServerSubmit.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  deployServerSettings: PropTypes.object,
  deployProgressData: PropTypes.object
};

DeployServerSubmit.contextTypes = {
  router: PropTypes.object
};

const select = state => ({...state.deployservers});

export default connect(select)(DeployServerSubmit);

