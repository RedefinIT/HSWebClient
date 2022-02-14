/**
 * Created by avireddi on .
 */
import React, {Component} from 'react';
import { PropTypes } from 'prop-types';
import {connect} from 'react-redux';
import {Add as AddIcon, More, Trash as DeleteIcon} from 'grommet-icons';
import {
  Box,
  Button,
  CheckBox,
  FormField,
  Select,
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableRow,
  Text, Heading
} from 'grommet';
import "../components/IPAddressInput";

import {
  saveDeploymentSettings, loadOSPackages
} from '../actions/deployservers';

import {pageLoaded} from './utils';
import DeployScreen from "../components/deployscreens/DeployScreen";

class DeployServersBMC extends Component {

  constructor(props) {

    super(props);

    this.state = {
      // localstorageconfiguration: false,
      deleteAllLD: true,
      activeState: 6,
      deployServerSettings: {},
      screenData: {},
      errors: {},
      isbulk: false,
      addhost: false,
      newhostdata: {
        iloIP: '',
        bmcUser: '',
        bmcPassword: '',
        confirmilopassword: '',
        hostName: '',
        ipAddr: '',
        passwordmatch: false,
        nic11: "",
        nic12: "",
        ethPorts: [],
        osDrives: []
      },
      deleteHostConfirmDlg: false
    };

    this.getHostsTable = this.getHostsTable.bind(this);
    this.onAction = this.onAction.bind(this);
    this.onChildren = this.onChildren.bind(this);
    this.handleFirmwareBundle = this.handleFirmwareBundle.bind(this);
    this._handleFirmwareOnly = this._handleFirmwareOnly.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this._deleteHost = this._deleteHost.bind(this);
    this.handleCancelAddHost = this.handleCancelAddHost.bind(this);
    this.handleAddHost = this.handleAddHost.bind(this);
  }

  componentDidMount() {
    pageLoaded('DeployServersBMC');
    //console.log("DeployServersBMC: componentDidMount: ");
    this.props.deployServerSettings['commonOSConfig']['createLocalRAID'] = false;
    this.props.dispatch(loadOSPackages());
    // this.loadEnvironments();
  }

  componentWillUnmount() {
    //console.log("DeployServersBMC: componentWillUnmount: ")
    // this.props.dispatch(unloadDeployServers());
  }

  handleCancelAddHost(event) {
    //console.log("handleCancelAddHost");
    this.setState({addhost: false});
  }

  handleAddHost(event, newhostdata) {
    //console.log("handleAddHost: newhostdata: ", newhostdata);

    let deplSettings = {...this.props.deployServerSettings};
    let hosts = deplSettings.hostsdata;
    let newhost = {...newhostdata};
    hosts.push(newhost);
    deplSettings['hostsdata'] = hosts;
    //console.log("handleAddHost: adding the hosts: ", hosts);
    this.props.dispatch(saveDeploymentSettings(deplSettings));
    this.setState({addhost: false});

  }

  _deleteHost(name) {

    // if(this.state.deleteHostConfirmDlg === false) {
    //   // On delete, show the delete confirmation dialog first
    //   this.setState({ deleteHostConfirmDlg: true })
    // }
    // else{
    // The input param 'name' will have serverprofile value for the selected hosts item
    //console.log("DeployServersBMC: _deleteHost: ", name);
    let deplSettings = {...this.props.deployServerSettings};
    let hosts = deplSettings.hostsdata;

    const updatedhosts = hosts.filter(host => host.bmcIPAddr !== name);

    deplSettings['hostsdata'] = updatedhosts;
    this.props.dispatch(saveDeploymentSettings(deplSettings));
    this.setState({deleteHostConfirmDlg: false})

    // }

  }

  handleCancel() {
    // console.log('clicked');
    // this.setState({open: true});
    this.props.onCancel();
  }

  handleNext() {

    // This will navigate the page to next
    this.props.onNext(this.state.activeState);
  }

  handleBack() {
    // This will navigate the page to previous page
    this.props.onBack(this.state.activeState);
  }

  _handleFirmwareOnly(event) {
    //console.log('_handleFirmwareOnly: event: ', event.target.getAttribute('id'));

    let data = {...this.props.deployServerSettings};

    data.firmwareOnly = data.firmwareOnly? false:true;

    this.props.dispatch(saveDeploymentSettings(data));
  }
  handleFirmwareBundle(event) {
    // this.props.dispatch(updateScreenData("screenData", "selectedOSP", event.option));
    let data = {...this.props.deployServerSettings};
    data.firmwareBundle = event.option;

    this.props.dispatch(saveDeploymentSettings(data));
  }

  // _onLocalStorageEnable(){
  //   let data = { ...this.props.deployServerSettings};
  //   //console.log("_onLocalStorageEnable: ", data['commonOSConfig']['createLocalRAID']);
  //
  //   data['commonOSConfig']['createLocalRAID'] = ! data['commonOSConfig']['createLocalRAID'];
  //
  //   this.props.dispatch(saveDeploymentSettings(data));
  //
  // }
  // _deleteAllLD(){
  //
  //   //console.log("_deleteAllLD: ", this.state.deleteAllLD);
  //
  //   let data = { ...this.props.deployServerSettings};
  //
  //   data['commonOSConfig']['deleteAllLD'] = ! data['commonOSConfig']['deleteAllLD'];
  //
  //   this.props.dispatch(saveDeploymentSettings(data));
  //
  // }

  onChildren(datum, index) {
    //console.log("onChildren: ", index);
    //console.log(datum);
    return (
      <Box key={index} direction="row" background={{"color": "accent-4"}} pad={{between: 'small'}} align="center">
      <Text truncate={false} margin="small"> {datum.bmcIPAddr}</Text>
      <Text truncate={false} margin="small">{datum.bmcUser}</Text>
      <Text truncate={false} margin="small">{datum.hostName}</Text>
      <Text truncate={false} margin="small">{datum.ipAddr}</Text>
    </Box>);

  }

  onAction(datum, index) {
    //console.log("onAction: ", index);
    //console.log(datum);
    return (<Button plain={false}
                    key={index}
                    margin="xsmall"
                    type="button"
                    icon={<More />}
                    onClick={() => {
                      history.push({pathname: `/ui/deployprogress/${datum.taskId}`})}
                    }/>);
  }

  getHostsTable(deployServerSettings){
    console.log("getHostsTable: ", deployServerSettings)

    let hoststablerows = deployServerSettings['hostsdata'].map((row, index) => (
      <TableRow key={index}>
        <TableCell>
          {row.bmcIPAddr}
        </TableCell>
        <TableCell>
          {row.hostName}
        </TableCell>
        <TableCell>
          {row.ipAddr}
        </TableCell>
        <TableCell>
          <Button id="567" icon={<DeleteIcon />}
                  onClick={this._deleteHost.bind(this, row.bmcIPAddr)}
                  href='#' />
        </TableCell>
      </TableRow>
    ));

    let hoststable = (
      <Box fill align="start" pad="small">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>
                BMC IP
              </TableCell>
              <TableCell>
                Hostname
              </TableCell>
              <TableCell>
                IP Address
              </TableCell>
              <TableCell>

              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hoststablerows}
          </TableBody>
        </Table>
      </Box>
    );

    return hoststable;
  }

  render() {
    console.log("render: DeployServersBMC: this.props: ", this.props);

    const {error, deployServerSettings, screenData} = this.props;
    const {intl} = this.context;

    //console.log("render: DeployServersBMC: screenData: ", screenData);
    // console.log("render: DeployServersBMC: this.state: ", this.state);

    // let layerAddHost = this._renderLayer();
    let fwbPlaceHolderText = "None";
    let ospList = [];

    if(screenData.osPackages) {
      let firmware_bundles = screenData['osPackages'].filter(package1 => package1.osType === "Firmware_Bundle")
      ospList = firmware_bundles.map((item, index) => (
          item.package
      ));
    }

    let method_fields = (
      <div>
        <Heading level={5} size="small" strong={true}>Firmware Update</Heading>
        <Box justify='start' align='start' direction='row' gap='medium' pad='small' elevation='medium' responsive wrap>
        <FormField label='Firmware Update Only'>
          <CheckBox key={1} id="firmware_only"
                    checked={deployServerSettings.firmwareOnly}
                    label="Firmware Update Only"
                    onChange={this._handleFirmwareOnly} />
        </FormField>
        <FormField label='Select Firmware Bundle'>
          <Select placeholder={fwbPlaceHolderText}
                  options={ospList}
                  value={deployServerSettings.firmwareBundle}
                  onChange={this.handleFirmwareBundle}/>
        </FormField>
        </Box>
      </div>
    );

    return (
      <DeployScreen
        heading={'Server Deployment using Redfish'}
        onNext={this.handleNext}
        onBack={this.handleBack}
        onCancel={this.handleCancel}
        getHostsTable={this.getHostsTable}
      >
        {method_fields}
      </DeployScreen>
    );
  }
}

DeployServersBMC.defaultProps = {
  error: undefined,
  deployServerSettings: {},
  screenData: {}
};

DeployServersBMC.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  deployServerSettings: PropTypes.object,
  screenData: PropTypes.object
};

DeployServersBMC.contextTypes = {
  intl: PropTypes.object
};

// const select = state => ({ ...state.deployservers });
const select = state => ({
  deployServerSettings: state.deployservers.deployServerSettings,
  screenData: state.deployservers.screenData
});

export default connect(select)(DeployServersBMC);
