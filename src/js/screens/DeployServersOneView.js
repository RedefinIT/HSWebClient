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
  TableRow, Table, TableCell, TableHeader, TableBody, Heading
} from 'grommet';
import {getRESTApi} from '../api/server-rest'
import {
  saveDeploymentSettings,
  sptEthPorts,
  sptStorageDrives,
  loadSPTItems,
  loadOneViews,
  loadRMServerProfiles
} from '../actions/deployservers';

import DeployScreen from "../components/deployscreens/DeployScreen";

import { pageLoaded } from './utils';
import {Add as AddIcon, Trash as DeleteIcon} from 'grommet-icons';

class DeployServersOneView extends Component {

  constructor(props) {

    super(props);

    this.state = {
      activeState: 1,
      deployServerSettings: {},
      screenData: {},
      serverProfiles: []
    };

    this.getHostsTable = this.getHostsTable.bind(this);
    this._onCheckListChange = this._onCheckListChange.bind(this);
    this._deleteHost = this._deleteHost.bind(this);
    this.handleCancelAddHost = this.handleCancelAddHost.bind(this);
    this.handleAddHost = this.handleAddHost.bind(this);
    this._onBulkDeploymentCheck = this._onBulkDeploymentCheck.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOVChange = this.handleOVChange.bind(this);
    this.handleSPTChange = this.handleSPTChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleOSDrive = this.handleOSDrive.bind(this);
    this.getSPTItems = this.getSPTItems.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleMgmtNic= this.handleMgmtNic.bind(this);
    this.handleNext= this.handleNext.bind(this);
  }

  componentDidMount() {
    pageLoaded('DeployServersOneView');
    //console.log("DeployServersOneView: componentWillMount: ");
    this.props.dispatch(loadOneViews());
  }

  componentWillUnmount() {
    //console.log("DeployServersOneView: componentWillUnmount: ")
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
    this.props.onNext(1);
  }

  handleBack() {
    //console.log("DeployServerSynergy: handleBack: this.state.activeState: ", this.state.activeState);
    // This will navigate the page to previous page
    this.props.onBack(1);
  }

  handleCancel() {
    //console.log("DeployServerSynergy: handleClose");
    this.props.onCancel();
  }

  handleOVChange(event) {
    //console.log("DeployServerSynergy: handleOVChange: event.option: ",  event.option);

    let data = { ...this.props.deployServerSettings};
    data.rmDetails.rmAlias = event.option;
    data.rmDetails.ovSPT = {};
    data.commonOSConfig.nic1 = "";
    data.commonOSConfig.nic2 = "";
    data.commonOSConfig.osDrive = "";

    this.props.dispatch(saveDeploymentSettings(data));

    this.props.dispatch(loadSPTItems(event.option));
  }

  handleSPTChange(event) {
    console.log("handleSPTChange: event.option: ", event.option)
    // this.props.dispatch(updateScreenData("screenData", "selectedSPT", event.option));
    let data = { ...this.props.deployServerSettings};
    data.commonOSConfig.nic1 = "";
    data.commonOSConfig.nic2 = "";
    data.commonOSConfig.osDrive = "";
    data.rmDetails.ovSPT = event.option;
    this.props.dispatch(saveDeploymentSettings(data));

    this.props.dispatch(sptEthPorts(data.rmDetails.rmAlias, data.rmDetails.ovSPT['name']));
    this.props.dispatch(sptStorageDrives(data.rmDetails.rmAlias, data.rmDetails.ovSPT['name']));
  }


  getSPTItems(value) {
    //console.log("getSPTItems: value: ",value);
    let url = '/rest/rm/spt/list?ovalias=' + value;

    getRESTApi(url)
      .then((response) => {
        console.log("getSPTItems: response: ", response);
        //console.log("getSPTItems: response.result: ", response.result);
        this.setState({
          SPTItems: response['result']
        });
      })
      .catch((err) => {
        //console.log("getSPTItems: err: ", err);
      })
  }

  handleMgmtNic(event, value) {
    let data = { ...this.props.deployServerSettings};

    if(event.target.id ==="nic1")
      data.commonOSConfig.nic1 = event.option;
    else if(event.target.id ==="nic2")
      data.commonOSConfig.nic2 = event.option;

    this.props.dispatch(saveDeploymentSettings(data));
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

    if (!data['commonOSConfig']['createServerProfile']) {
      loadRMServerProfiles(data.rmDetails.rmAlias, data.rmDetails.ovSPT['name'], ((result) => {
        this.setState({"serverProfiles": result});
      }));
    }
    else{
      this.setState({"serverProfiles": []});
    }

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
    console.log("render: DeployServersOneView: this.props: ", this.props);
    console.log("render: DeployServersOneView: this.state: ", this.state);

    const { deployServerSettings, screenData } = this.props;

    // console.log("render: DeployServersOneView: ", deployServerSettings);
    // console.log("render: DeployServersOneView: screenData: ", screenData);

    let oneViewList = [];

    let ovPlaceHolderText = (screenData.ovList.length >= 1)? "Select":"None";
    if(screenData.ovList) {
      oneViewList = screenData['ovList'].map((item, index) => (
        item.alias
      ));
    }

    let sptPlaceHolderText = (screenData.sptList.length >= 1)? "Select":"None";

    let ethPortsPlaceHolderText = (screenData.sptEthPorts.length >= 1)? "Select":"None";
    let ethPorts = screenData.sptEthPorts.map((item, index) => (
      item.connectionName + " -> " + item.portId
    ));

    let drivesPlaceHolderText = (screenData.sptDrivesList.length >= 1)? "Select":"None";
    let sptDrives = screenData.sptDrivesList.map((item, index) => (
      item.name + " -> " + item.raidLevel
    ));

    let method_fields = (
      <div label="HPE OneView ">
        <Heading level={5} size="small" strong={true}>HPE OneView</Heading>
        <Box justify='start' direction='column' align='stretch' gap='medium' pad='small' elevation='medium' responsive wrap>

        <Box justify='start' align='start' direction='row' gap='medium' pad='small' responsive wrap>
          <FormField htmlFor="ovappliance" label='OneView Appliance'>
            <Select placeHolder={ovPlaceHolderText}
                    options={oneViewList}
                    value={deployServerSettings.rmDetails.alias}
                    onChange={this.handleOVChange} />
          </FormField>
          <FormField  label='Server Profile Template'>
            <Select placeHolder={sptPlaceHolderText}
                    options={screenData.sptList}
                    labelKey="name"
                    children={(option, index, options, { active, disabled, selected }) =>
                    { return option?option['name'] + " (" + option['model'] + ")":"Select"}}
                    value={deployServerSettings.rmDetails.ovSPT}
                    onChange={this.handleSPTChange} />
          </FormField>
        </Box>
        <Box justify='start' align='start' direction='row' gap='medium' pad='small' responsive wrap>
          <FormField  label='Management NIC 1'>
            <Select placeHolder={ethPortsPlaceHolderText}
                    options={ethPorts}
                    id="nic1"
                    value={deployServerSettings.commonOSConfig.nic1}
                    onChange={this.handleMgmtNic} />
          </FormField>
          <FormField  label='Management NIC 2'>
            <Select placeHolder={ethPortsPlaceHolderText}
                    options={ethPorts}
                    id="nic2"
                    value={deployServerSettings.commonOSConfig.nic2}
                    onChange={this.handleMgmtNic} />
          </FormField>
        </Box>
        <Box justify='start' align='start' direction='row' gap='medium' pad='small' responsive wrap>
          <FormField  label='OS Drive'>
            <Select placeHolder={drivesPlaceHolderText}
                    options={sptDrives}
                    value={deployServerSettings.commonOSConfig.osDrive}
                    onChange={this.handleOSDrive} />
          </FormField>
        <FormField  label='Server Profile Creation'>
          <CheckBox id="createSP" disabled={false} label='Create Server Profile' checked={deployServerSettings['commonOSConfig']['createServerProfile']} onChange={this._onCheckListChange}/>
        </FormField>
        </Box>
        </Box>
      </div>
    );

    return (
      <DeployScreen
        heading={'Server Deployment using HPE OneView'}
        deployServerSettings={this.props.deployServerSettings}
        screenData={this.props.screenData}
        serverProfiles={this.state.serverProfiles}
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

DeployServersOneView.defaultProps = {
  error: undefined,
  deployServerSettings: {},
  screenData: {},
};

DeployServersOneView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  deployServerSettings: PropTypes.object,
  screenData: PropTypes.object
};

DeployServersOneView.contextTypes = {
  intl: PropTypes.object
};

// const select = state => ({ ...state.deployservers });
const select = state => ({ deployServerSettings: state.deployservers.deployServerSettings, screenData: state.deployservers.screenData });

export default connect(select)(DeployServersOneView);
