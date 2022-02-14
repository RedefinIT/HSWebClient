/**
 * Created by avireddi on 11/10/2019.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import {Heading, Box, Text, Button, Footer, FormField, TextInput, Select, TextArea, Spinner} from 'grommet';
import { Actions, StatusWarning } from 'grommet-icons';
import {postRESTApi} from '../../api/server-rest';
import LayerForm from "../LayerForm";
import {IntegerInput, NumberInput} from "grommet-controls";
import IPAddressInput from "../IPAddressInput";

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

class AddHostByBMC extends Component {

  constructor (props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
    this.handleAddHost = this.handleAddHost.bind(this);
    this.driveDisplayText = this.driveDisplayText.bind(this);

    this.state = {
      errorMsg: "",
      discoveryWait: false,
      newhostdata: {
        bmcIPAddr: '',
        bmcUser: '',
        bmcPassword: '',
        confirmilopassword: '',
        hostName: '',
        ipAddr: '',
        passwordmatch: true,
        nic1: {index: -1, adapterId:0, portId:0, text:""},
        nic2: {index: -1, adapterId:0, portId:0, text:""},
        osDrive: {"displayText": "None"},
        ethPorts: [],
        osDrives: []
      }
    };

    this.getOVFields1 = this.getOVFields1.bind(this);
    this.getBMCFields1 = this.getBMCFields1.bind(this);
    this.getBMCFields2 = this.getBMCFields2.bind(this);
    this.onChildren = this.onChildren.bind(this);
    this.handleDiscover = this.handleDiscover.bind(this);
    this.handleMgmtNic = this.handleMgmtNic.bind(this);
    this.handleOSDrives = this.handleOSDrives.bind(this);
    this.handleQueryNICs = this.handleQueryNICs.bind(this);
    this.handleQueryDrives = this.handleQueryDrives.bind(this);
    this._handleHostDetailsChange = this._handleHostDetailsChange.bind(this);

  }

  handleAddHost(event){
    console.log("handleAddHost: this.state.newhostdata: ", this.state.newhostdata);
    this.props.handleAddHost(event, this.state.newhostdata);
  }

  handleCancelAddHost(event){
    this.props.handleCancelAddHost(event);
  }

  _handleHostDetailsChange(event) {
    // console.log("handleHostDetails: event.target: ", event.target.value)
    // console.log("handleHostDetails: event.target: ", event.target.id)
    let host = {...this.state.newhostdata};
    if (event.target.id === 'iloipaddr') {
      host.bmcIPAddr = event.target.value;
    }
    else if (event.target.id === 'ilouser') {
      host.bmcUser = event.target.value;
    }
    else if (event.target.id === 'ilopassword') {
      // console.log("handleHostDetails: host: ", host)
      // console.log("handleHostDetails: ilopassword: ", host.bmcPassword)
      // console.log("handleHostDetails: host.confirmilopassword: ", host.confirmilopassword)

      host.bmcPassword = event.target.value;

      if (host.confirmilopassword && host.confirmilopassword !== '') {
        if (host.bmcPassword === host.confirmilopassword) {
          host.passwordmatch = true;
        }
        else {
          host.passwordmatch = false;
        }
      }
      else {
        host.passwordmatch = true;
      }

    }
    else if (event.target.id === 'confirmilopassword') {
      host.confirmilopassword = event.target.value;

      if (host.confirmilopassword && host.confirmilopassword !== '') {
        if (host.bmcPassword === host.confirmilopassword) {
          host.passwordmatch = true;
        }
        else {
          host.passwordmatch = false;
        }
      }
      else {
        host.passwordmatch = true;
      }

    }
    else if (event.target.id === 'hostname') {
      host.hostName = event.target.value;
    }
    else if (event.target.id === 'ipaddr') {
      host.ipAddr = event.target.value;
    }
    else if (event.target.id === 'ovsp') {
      host.serverProfile = event.target.value;
    }

    // console.log("handleHostDetails: updating the host: ", host)
    this.setState({newhostdata: host});
  }

  handleDiscover(event, value) {
    this.handleQueryNICs();

    this.timerID = setInterval(
      () => this.handleQueryDrives(),
      3000
    );


  }

  handleMgmtNic(event, value) {
    let host = {...this.state.newhostdata};

    //console.log("handleMgmtNic: event: ",  event);
    //console.log("handleMgmtNic: value: ",  value);
    //console.log("handleMgmtNic: ",  event.option);

    if(event.target.name ==="nic1_select")
      host.nic1 = event.option;
    else if(event.target.name ==="nic2_select")
      host.nic2 = event.option;

    this.setState({newhostdata: host});
  }

  handleOSDrives(event, value) {
    let host = {...this.state.newhostdata};
    //console.log("handleOSDrives: ", event.option)

    if(event.option["displayText"] === "None")
      host.osDrive = {};
    else
      host.osDrive = event.option;

    host.osDrive['displayText'] = this.driveDisplayText(event.option)

    this.setState({newhostdata: host});
  }

  handleQueryNICs() {

    //console.log("handleQueryNICs: this.props.deployServerSettings: ", this.props.deployServerSettings);
    let host = {...this.state.newhostdata};

    host.ethPorts = [];
    // host.nic1 = "Wait!";
    // host.nic2 = "Wait!";


    this.setState({newhostdata: host});
    // Animate to indicate discovery is in progress
    this.setState({discoveryWait: true});

    let ilocreds = {"user": host.bmcUser, "password": host.bmcPassword};

    let body = {"iloip": host.bmcIPAddr, "ilocreds": ilocreds};

    // Gen9 changes
    if(this.props.deployServerSettings.deploymentMode === "hpeilo5"
      || this.props.deployServerSettings.deploymentMode === "redfishv1"){
      body['gen'] = 'Gen10'
      body['vendor'] = 'HPE'
      body['BMC'] = 'iLO5'
    }
    else if(this.props.deployServerSettings.deploymentMode === "hpeilo_gen9"){
      body['gen'] = 'Gen9'
      body['vendor'] = 'HPE'
      body['BMC'] = 'iLO4'
    }
    else if(this.props.deployServerSettings.deploymentMode === "dell_idrac9"){
      body['gen'] = 'Gen14'
      body['vendor'] = 'Dell'
      body['BMC'] = 'iDRAC9'
    }

    let url = '/rest/bmc/connections';
    // postRESTApi1(url, body).then(data => {
    postRESTApi(url, body).then(data => {

      //console.log("handleQueryNICs: result: ", JSON.stringify(data));

      // Stop spinner animation to indicate discovery is in over
      this.setState({discoveryWait: false});

      if (data.result.length === 0){
        //console.log("No result found and error message is: ", data.error.msg)
        //  Get the error message
        this.setState({"errorMsg": data.error.msg});
        return;
      }
      else
        this.setState({"errorMsg": ""});

      let host = {...this.state.newhostdata};
      // host.ethPorts = data.result;

      let ethPorts = data.result.map((item, index) => (
        {
          index: index,
          text: item.portName + " : " + item.macAddress + ((item.linkStatus === null) ? "" : " [" + item.linkStatus + "]"),
          adapterId: item.adapterId,
          portId: item.portId
        }
      ));
      host.ethPorts = [{index: -1, text: "Manual", adapterId: 0, portId: 0 }].concat(ethPorts);

      //console.log("postRESTApi: this.state.newhostdata: ", this.state.newhostdata);
      this.setState({newhostdata: host});
    });

  }

  handleQueryDrives() {
    //console.log("handleQueryDrives: START");
    clearInterval(this.timerID);
    let host = {...this.state.newhostdata};

    host.osDrives = [];
    host.osDrive = {};

    this.setState({newhostdata: host});

    // Animate to indicate discovery is in progress
    this.setState({discoveryWait: true});


    let ilocreds = {"user": host.bmcUser, "password": host.bmcPassword};

    let body = {"iloip": host.bmcIPAddr, "ilocreds": ilocreds};

    // Gen9 changes
    if(this.props.deployServerSettings.deploymentMode === "hpeilo5"
      || this.props.deployServerSettings.deploymentMode === "redfishv1"){
      body['gen'] = 'Gen10'
      body['vendor'] = 'HPE'
      body['BMC'] = 'iLO5'
    }
    else if(this.props.deployServerSettings.deploymentMode === "hpeilo_gen9"){
      body['gen'] = 'Gen9'
      body['vendor'] = 'HPE'
      body['BMC'] = 'iLO4'
    }
    else if(this.props.deployServerSettings.deploymentMode === "dell_idrac9"){
      body['gen'] = 'Gen14'
      body['vendor'] = 'Dell'
      body['BMC'] = 'iDRAC9'
    }

    let url = '/rest/bmc/storagedrives';
    // postRESTApi1(url, body).then(data => {
    postRESTApi(url, body).then(data => {
      //console.log("handleQueryDrives: result: ", JSON.stringify(data));

      // Stop spinner animation to indicate discovery is in over
      this.setState({discoveryWait: false});

      // Return in case of error
      if (data.result.length === 0){
        //console.log("No result found and error message is: ", data.error.msg)
        //  Get the error message
        this.setState({"errorMsg": data.error.msg});
        return;
      }
      else
        this.setState({"errorMsg": ""});

      let host = {...this.state.newhostdata};
      // TODO The below line is causing the error in browser console but no issues otherwise.
      // The error is "Warning: A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"
      // This need to be fixed.
      host.osDrives = [{"displayText": "None"}].concat(data.result);
      host.osDrive = {displayText: "Select"};
      //console.log("@######osDrives: ", host.osDrives)

      this.setState({newhostdata: host});
    });

  }


  _onSubmit () {
    const newhostdata = this.state.newhostdata;
    let errors = {};
    let noErrors = true;
    if (! newhostdata.iloIP) {
      errors.name = 'required';
      noErrors = false;
    }
    if (noErrors) {
      this.props.handleAddHost(newhostdata);
    } else {
      this.setState({errors: errors});
    }
  }

//   return value['driveType'] +
//   value['driveNumber'] + ":" +
//   Math.round(value['capacityGB']) + "GB:" +
//   value['mediaType'] + ":" +
// (('faultTolerance' in value)?value['faultTolerance']:"")

  driveDisplayText(value) {
    //console.log("driveDisplayText: ", value);
    if(value){
      if(value["displayText"] === "None")
        return "None"
      else
        return value['driveType'] +
            value['driveNumber'] + ":" +
            Math.round(value['capacityGB']) + "GB:" +
            value['mediaType']
    }
    else
      return "Select"
  }

  onChildren(datum, index, obj) {
    // console.log("onChildren: ", index);
    // console.log("onChildren: obj", obj);
    // console.log(datum);

    // {(option, index, options, { active, disabled, selected }) => { return option? (Math.round(option['capacityGB']) + "GB:" + option['mediaType'] + ":" + option['faultTolerance']):"Select"}}

    return this.driveDisplayText(datum)

    // return (
    //   <Box direction="row" background={{"color": "accent-4"}} pad={{between: 'small'}} align="center">
    //     <Text truncate={false} margin="small"> {datum.name}</Text>
    //   </Box>
    // );
  }

  getOVFields1(){

    return (
        <FormField label='Server Profile'>
          <TextInput
            id="ovsp"
            type="text"
            onChange={this._handleHostDetailsChange}
            value={this.state.newhostdata.serverProfile}
          />
        </FormField>
    );
  }

  getBMCFields1(){
    let bmcPasswordMismatch = "";

    let error_message = "";
    if (this.state.errorMsg) {
      //console.log("DeployServersILO: BMC password mismatch");

      error_message = (
        <Box
          direction="row"
          animation="fadeIn"
          background={{"color":"status-critical","opacity":"medium"}}
        >
          <StatusWarning/>
          <Text size="xsmall">{this.state.errorMsg}</Text>
        </Box>
      );
    }
    else error_message = "";

    if (this.state.newhostdata.passwordmatch === false) {
      //console.log("DeployServersILO: BMC password mismatch");

      bmcPasswordMismatch = (
        <Box
          direction="row"
          animation="fadeIn"
          background={{"color":"status-critical","opacity":"medium"}}
        >
          <StatusWarning/>
          <Text size="xsmall">Password mismatch!</Text>
        </Box>
      );
    }
    else bmcPasswordMismatch = "";

    return (
      <FormField>
        <Box justify='start' align='stretch' gap='medium' pad='small'>
        <FormField label='BMC IP Address'>
          <TextInput
            id="iloipaddr"
            type="text"
            onChange={this._handleHostDetailsChange}
            value={this.state.newhostdata.bmcIPAddr}
          />
        </FormField>
        <FormField label='BMC User'>
          <TextInput
            id="ilouser"
            type="text"
            onChange={this._handleHostDetailsChange}
            value={this.state.newhostdata.bmcUser}
          />
        </FormField>
        <FormField label='BMC Password'>
          <TextInput type="password"
                     id="ilopassword"
                     onChange={this._handleHostDetailsChange}
                     value={this.state.newhostdata.bmcPassword}
          />
        </FormField>
        <FormField label='Confirm BMC Password'>
          <TextInput type="password"
                     id="confirmilopassword"
                     onChange={this._handleHostDetailsChange}
                     value={this.state.newhostdata.confirmilopassword}
          />
        </FormField>
        {bmcPasswordMismatch}
          <Box direction="row" align='center' gap='small' justify='center' round='small'
               background={{'color': 'brand'}} onClick={this.handleDiscover}>
            {this.state.discoveryWait && (
              <Spinner size='small'
                       border={[
                         {side: 'all', color: 'white', size: 'medium'},
                         {side: 'right', color: 'brand', size: 'medium'},
                         {side: 'top', color: 'white', size: 'medium'},
                         {side: 'left', color: 'brand', size: 'medium'},
                       ]}
              />
            )}
            {!this.state.discoveryWait && (<Actions size='medium'/>)}
            <Text label='Discover' size='medium' weight='bold'
                  disabled={this.state.discoveryWait}
            >Discover</Text>
          </Box>
        {error_message}
        <br/>
        </Box>
      </FormField>
    );
  }

  getBMCFields2() {
    let ethPortsPlaceHolderText1 = "";
    let ethPortsPlaceHolderText2 = "";
    let drivesPlaceHolderText = "";

    ethPortsPlaceHolderText1 = (this.state.newhostdata.ethPorts.length >= 1) ? "Select NIC 1" : "None";
    ethPortsPlaceHolderText2 = (this.state.newhostdata.ethPorts.length >= 1) ? "Select NIC 2" : "None";

    drivesPlaceHolderText = (this.state.newhostdata.osDrives.length >= 1) ? "Select" : "None";

    return (
        <div>
        <FormField label='Management NIC 1'>
          <Box justify='start' align='stretch' gap='medium' pad='small' responsive wrap>
            <FormField label='Adapter/Port'>
              <Select placeHolder={ethPortsPlaceHolderText1}
                      options={this.state.newhostdata.ethPorts}
                      name="nic1_select"
                      value={this.state.newhostdata.nic1}
                      labelKey="text"
                      children={(option, index, options, { active, disabled, selected }) => { return option?option['text']:"Select"}}
                      onChange={this.handleMgmtNic}/>
            </FormField>
            < FormField label='Adapter Number'>
              { this.state.newhostdata.nic1.index === -1 && (
                <NumberInput
                  id="nic1_input1"
                  step={1}
                  value={this.state.newhostdata.nic1.adapterId}
                  onChange={this.handleMgmtNic}
                />
              )}
              { this.state.newhostdata.nic1.index != -1 && (
                <TextInput
                  id="nic1_input1"
                  value={String(this.state.newhostdata.nic1.adapterId)}
                />
              )}
            </FormField>
            < FormField label='Port Number'>
              { this.state.newhostdata.nic1.index === -1 && (
                <NumberInput
                  id="nic1_input2"
                  step={1}
                  value={this.state.newhostdata.nic1.portId}
                  onChange={this.handleMgmtNic}
                />
              )}
              { this.state.newhostdata.nic1.index != -1 && (
                <TextInput
                  id="nic1_input2"
                  value={this.state.newhostdata.nic1.portId}
                />
              )}
            </FormField>
          </Box>
        </FormField>
        < FormField label='Management NIC 2 (Optional)'>
          <Box justify='start' align='stretch' gap='medium' pad='small' responsive wrap>
            <FormField label='Adapter/Port'>
              <Select placeHolder={ethPortsPlaceHolderText2}
                      options={this.state.newhostdata.ethPorts}
                      name="nic2_select"
                      value={this.state.newhostdata.nic2}
                      labelKey="text"
                      children={(option, index, options, { active, disabled, selected }) => { return option['text']}}
                      onChange={this.handleMgmtNic}/>
            </FormField>

            < FormField label='Adapter Number'>
              { this.state.newhostdata.nic2.index === -1 && (
                <NumberInput
                  id="nic2_input1"
                  step={1}
                  value={this.state.newhostdata.nic2.adapterId}
                  onChange={this.handleMgmtNic}
                />
              )}
              { this.state.newhostdata.nic2.index != -1 && (
                <TextInput
                  id="nic2_input1"
                  value={this.state.newhostdata.nic2.adapterId}
                />
              )}
            </FormField>
            < FormField label='Port Number'>
              { this.state.newhostdata.nic2.index === -1 && (
                <NumberInput
                  id="nic2_input2"
                  step={1}
                  value={this.state.newhostdata.nic2.portId}
                  onChange={this.handleMgmtNic}
                />
              )}
              { this.state.newhostdata.nic2.index != -1 && (
                <TextInput
                  id="nic2_input2"
                  value={this.state.newhostdata.nic2.portId}
                />
              )}
            </FormField>
          </Box>
        </FormField>
        {!this.props.deployServerSettings['commonOSConfig']['createLocalRAID'] && (
          <FormField label='OS Drive'>
            <Select placeHolder={drivesPlaceHolderText}
                    name="osDrive"
                    placeholder="Select"
                    options={this.state.newhostdata.osDrives}
                    value={this.state.newhostdata.osDrive}
                    labelKey={this.driveDisplayText}
                    children={this.onChildren}
                    onChange={this.handleOSDrives}/>
          </FormField>
        )}
      </div>
    );
  }

  render () {

    //console.log("render: this.props: ", this.props);


    let bmc_fields1 = ""
    let bmc_fields2 = ""
    let ov_fields1 = ""
    if(this.props.deployServerSettings['deploymentMode'] === 'hpeilo5'
        || this.props.deployServerSettings['deploymentMode'] === 'hpeilo_gen9'
        || this.props.deployServerSettings['deploymentMode'] === 'dell_idrac9'
    ){
      bmc_fields1 = this.getBMCFields1();
      bmc_fields2 = this.getBMCFields2();
    }
    else if(this.props.deployServerSettings['deploymentMode'] === 'hpeoneview'){
      ov_fields1 = this.getOVFields1();

    }
    else if(this.props.deployServerSettings['deploymentMode'] === 'vmware'){

    }

    //console.log("DeployServersILO: 2: ", this.state.newhostdata);

    return (
      <LayerForm
        title={this.props.heading}
        titleTag={4}
        submitLabel="Submit "
        onClose={() => {}} onSubmit={this._onSubmit}
      >
          {bmc_fields1}
        {ov_fields1}
          <FormField label='Hostname'>
            <TextInput
              id="hostname"
              onChange={this._handleHostDetailsChange}
              value={this.state.newhostdata.hostName}
            />
          </FormField>
          <br/>
        {this.props.deployServerSettings['hostIPAssignmentMode'] === "Static" && (
          <FormField htmlFor="ipaddr" label='IP Address'>
            <IPAddressInput
              id="ipaddr"
              onChange={this._handleHostDetailsChange}
              value={this.state.newhostdata.ipAddr}
            />
          </FormField>
        )}
          <br/>
        {bmc_fields2}
          <br/>
          {/*< FormField >*/}
          {/*  <Button label='Get Ethernet Ports Details'*/}
          {/*          onClick={this.handleQueryNICs}*/}
          {/*  />*/}
          {/*  /!*<Status value='critical' /><Label size="small">RED Alert</Label>*!/*/}
          {/*</FormField>*/}
          {/*{!this.props.deployServerSettings['commonOSConfig']['createLocalRAID'] && (*/}
          {/*  <FormField >*/}
          {/*    <Button label='Get Drives Details'*/}
          {/*            onClick={this.handleQueryDrives}*/}
          {/*    />*/}
          {/*    /!*<Status value='critical' /><Label size="small">RED Alert</Label>*!/*/}
          {/*  </FormField>*/}
          {/*)}*/}

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

AddHostByBMC.defaultProps = {
  error: undefined,
  deployServerSettings: {},
};

AddHostByBMC.propTypes = {
  dispatch: PropTypes.func,
  handleAddHost: PropTypes.func.isRequired,
  handleCancelAddHost: PropTypes.func.isRequired,
  error: PropTypes.object,
  heading: PropTypes.string,
  deployServerSettings: PropTypes.object.isRequired,
};

AddHostByBMC.contextTypes = {
  intl: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  deployServerSettings: PropTypes.object,
  router: PropTypes.object
};

const select = state => ({ ...state.networks });

export default connect(select)(AddHostByBMC);
