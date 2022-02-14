/**
 * Created by avireddi on .
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import {
  Select,
  Box,
  Button,
  FormField,
  CheckBox,
  TableRow, Table, TableCell, TableHeader, TableBody, Heading, Card, CardHeader, Text, CardBody, CardFooter
} from 'grommet';
import {getRESTApi} from '../api/server-rest'
import {
  saveDeploymentSettings,
  sptEthPorts,
  sptStorageDrives,
  loadSPTItems,
  loadOneViews,
} from '../actions/deployservers';

import DeployScreen from "../components/deployscreens/DeployScreen";

import { pageLoaded } from './utils';
import {Add as AddIcon, Edit, Trash as DeleteIcon, View} from 'grommet-icons';
import {loadPool, loadPools} from "../actions/pools";
import history from "../history";

class DeployServersServerPool extends Component {

  constructor(props) {

    super(props);

    this.state = {
      activeState: 9,
      deployServerSettings: {},
      screenData: {},
      ethPorts: [],
      drives: [],
      nic1: {},
      nic2: {},
      osDrive: {}
    };

    this.getHostsTable = this.getHostsTable.bind(this);
    this._onCheckListChange = this._onCheckListChange.bind(this);
    this._deleteHost = this._deleteHost.bind(this);
    this.handleCancelAddHost = this.handleCancelAddHost.bind(this);
    this.handleAddHost = this.handleAddHost.bind(this);
    this._onBulkDeploymentCheck = this._onBulkDeploymentCheck.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handlePoolChange = this.handlePoolChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleOSDrive = this.handleOSDrive.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleMgmtNic= this.handleMgmtNic.bind(this);
    this.handleNext= this.handleNext.bind(this);
  }

  componentDidMount() {
    pageLoaded('DeployServersServerPool');
    //console.log("DeployServersServerPool: componentWillMount: ");
    this.props.dispatch(loadPools());
  }

  componentWillUnmount() {
    //console.log("DeployServersServerPool: componentWillUnmount: ")
    // this.props.dispatch(unloadDeployServers());
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({isFail: false, isSuccess: false});
  }

  handleNext() {
    //console.log("DeployServerSynergy: handleNext: this.state.activeState: ", this.state.activeState);

    // This will navigate the page to next
    this.props.onNext(this.state.activeState);
  }

  handleBack() {
    //console.log("DeployServerSynergy: handleBack: this.state.activeState: ", this.state.activeState);
    // This will navigate the page to previous page
    this.props.onBack(this.state.activeState);
  }

  handleCancel() {
    //console.log("DeployServerSynergy: handleClose");
    this.props.onCancel();
  }

  handlePoolChange(event) {
    //console.log("DeployServerSynergy: handlePoolChange: event.option: ",  event.option);

    let data = { ...this.props.deployServerSettings};
    data.serverPool.name = event.option;
    data.commonOSConfig.nic1 = "";
    data.commonOSConfig.nic2 = "";
    data.commonOSConfig.osDrive = "";

    this.props.dispatch(saveDeploymentSettings(data));

    this.props.dispatch(loadPool(event.option));
  }

  handleMgmtNic(event, value) {
    console.log("handleMgmtNic: ", value)
    console.log("handleMgmtNic: event.option", event.option)

    if(event.target.id ==="nic1")
      this.setState({"nic1": event.option})
    else if(event.target.id ==="nic2")
      this.setState({"nic2": event.option})

  }

  handleOSDrive(event, value) {
    let data = { ...this.props.deployServerSettings};
    data.commonOSConfig.osDrive = event.option;
    this.props.dispatch(saveDeploymentSettings(data));
  }

  handleAddHost(event){
    console.log("handleAddHost: this.state.newhostdata: ", this.state.newhostdata);
    var deplSettings = { ...this.props.deployServerSettings};
    var hosts = deplSettings.hostsdata;
    var newhost = { ...this.state.newhostdata };
    hosts.push(newhost);
    deplSettings['hostsdata'] = hosts;
    console.log("handleAddHost: adding the hosts: ", hosts);
    this.props.dispatch(saveDeploymentSettings(deplSettings));
    this.setState({addhost: false});
  }

  _onBulkDeploymentCheck (event) {
    this.setState({ ...this.state, "isbulk": event.target.checked });
  }

  _deleteHost(name) {
    // The input param 'name' will have serverprofile value for the selected hosts item
    console.log("DeployServerPage3: _deleteHost: ", name);
    let deplSettings = { ...this.props.deployServerSettings};
    let hosts = deplSettings.hostsdata;

    console.log("hosts: ", hosts);

    deplSettings['hostsdata'] = hosts.filter(host => host.serverProfile !== name);
    this.props.dispatch(saveDeploymentSettings(deplSettings));
  }

  handleCancelAddHost(event){
    console.log("handleCancelAddHost");
    this.setState({addhost: false});
  }

  _onCheckListChange(event) {
    console.log('_onCheckListChange: event: ');

    let data = { ...this.props.deployServerSettings};

    data['commonOSConfig']['createServerProfile'] = !data['commonOSConfig']['createServerProfile']

    this.props.dispatch(saveDeploymentSettings(data));
  }

  getHostsTable(deployServerSettings){
    console.log("getHostsTable: ", deployServerSettings)

    let hoststablerows = deployServerSettings['hostsdata'].map((row, index) => (
      <TableRow key={index}>
        <TableCell>
          {row.serverProfile}
        </TableCell>
        <TableCell>
          {row.hostName}
        </TableCell>
        <TableCell>
          {row.ipAddr}
        </TableCell>
        <TableCell>
        <Button id="567" icon={<DeleteIcon />}
                onClick={this._deleteHost.bind(this, row.serverProfile)}
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
          Server Profile
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
    console.log("render: DeployServersServerPool: this.props: ", this.props);
    //console.log("render: DeployServersServerPool: this.state: ", this.state);

    const { deployServerSettings, screenData, pools} = this.props;

    // console.log("render: DeployServersServerPool: ", deployServerSettings);
    // console.log("render: DeployServersServerPool: screenData: ", screenData);

    let serverPools = pools["pools"]["pools"];
    let selected_pool = pools["currentItem"];

    let serverPoolsList = [];
    if (serverPools.length > 0) {
      serverPoolsList = serverPools.map((value, index) => (
          value["name"]
      ));
    }
    console.log("########## serverPoolsList: ", serverPoolsList);
    let poolsPlaceHolderText = (serverPools.length >= 1)? "Select":"None";
    console.log("########## poolsPlaceHolderText: ", poolsPlaceHolderText);
    console.log("########## selected_pool: ", selected_pool);
    console.log("########## selected_pool.length: ", selected_pool.length);

    let ethPortsPlaceHolderText = ""
    let ethPorts = [];
    let drivesPlaceHolderText = "";
    let drives = [];

    if(selected_pool !== null && selected_pool.hasOwnProperty("serverProfile")){
      ethPortsPlaceHolderText = (selected_pool["serverProfile"]["serverData"]["networkDetails"].length >= 1)? "Select":"None";
      ethPorts = selected_pool["serverProfile"]["serverData"]["networkDetails"].map((item, index) => (
          item
      ));

      drivesPlaceHolderText = (selected_pool["serverProfile"]["serverData"]["storageDetails"].length >= 1)? "Select":"None";
      drives = selected_pool["serverProfile"]["serverData"]["storageDetails"].map((item, index) => (
          item.capacityGB + " -> " + item.driveType + "-" + item.mediaType
      ));
    }
    console.log("########## ETHPORTS: ", ethPorts);


    // let drivesPlaceHolderText = (screenData.sptDrivesList.length >= 1)? "Select":"None";
    // let sptDrives = screenData.sptDrivesList.map((item, index) => (
    //   item.name + " -> " + item.raidLevel
    // ));

    let method_fields = (
      <div label="Server Pools">
        <Heading level={5} size="small" strong={true}>Server Pools</Heading>
        <Box justify='start' direction='column' align='stretch' gap='medium' pad='small' elevation='medium' responsive wrap>

        <Box justify='start' align='start' direction='row' gap='medium' pad='small' responsive wrap>
          <FormField htmlFor="serverpools" label='Server Pools'>
            <Select placeHolder={poolsPlaceHolderText}
                    options={serverPoolsList}
                    value={deployServerSettings.serverPool.name}
                    onChange={this.handlePoolChange} />
          </FormField>
        </Box>
        <Box justify='start' align='start' direction='row' gap='medium' pad='small' responsive wrap>
          <FormField  label='Management NIC 1'>
            <Select placeHolder={ethPortsPlaceHolderText}
                    options={ethPorts}
                    id="nic1"
                    labelKey="portName"
                    valueKey={{ key: 'portName', reduce: false }}
                    value={this.state.nic1}
                    onChange={this.handleMgmtNic} />
          </FormField>
          <FormField  label='Management NIC 2'>
            <Select placeHolder={ethPortsPlaceHolderText}
                    options={ethPorts}
                    id="nic2"
                    labelKey="portName"
                    valueKey={{ key: 'portName', reduce: false }}
                    value={this.state.nic2}
                    onChange={this.handleMgmtNic} />
          </FormField>
        </Box>
        <Box justify='start' align='start' direction='row' gap='medium' pad='small' responsive wrap>
          <FormField  label='OS Drive'>
            <Select placeHolder={drivesPlaceHolderText}
                    options={drives}
                    value={this.state.osDrive}
                    onChange={this.handleOSDrive} />
          </FormField>
        </Box>
        </Box>
      </div>
    );

    return (
      <DeployScreen
        heading={'Deployment using Server Pools'}
        deployServerSettings={this.props.deployServerSettings}
        screenData={this.props.screenData}
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

DeployServersServerPool.defaultProps = {
  error: undefined,
  deployServerSettings: {},
  screenData: {},
  pools: {}
};

DeployServersServerPool.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  deployServerSettings: PropTypes.object,
  screenData: PropTypes.object,
  pools: PropTypes.object

};

DeployServersServerPool.contextTypes = {
  intl: PropTypes.object
};

// const select = state => ({ ...state.deployservers });
const select = state => ({ deployServerSettings: state.deployservers.deployServerSettings, screenData: state.deployservers.screenData, pools: state.pools });

export default connect(select)(DeployServersServerPool);
