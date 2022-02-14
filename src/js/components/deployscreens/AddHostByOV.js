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
import {discoverRMResource} from "../../actions/deployservers";

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

class AddHostOV extends Component {

  constructor (props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
    this.handleAddHost = this.handleAddHost.bind(this);
    this.driveDisplayText = this.driveDisplayText.bind(this);
    this.handleServerProfileSelection = this.handleServerProfileSelection.bind(this);

    this.state = {
      errorMsg: "",
      discoverData: {},
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
        osDrives: [],
        serverProfiles: []
      }
    };

    this.discover = this.discover.bind(this);
    this.getOVFields1 = this.getOVFields1.bind(this);
    this.onChildren = this.onChildren.bind(this);
    this.handleDiscover = this.handleDiscover.bind(this);
    this.handleMgmtNic = this.handleMgmtNic.bind(this);
    this.handleOSDrives = this.handleOSDrives.bind(this);
    this._handleHostDetailsChange = this._handleHostDetailsChange.bind(this);

  }

  handleAddHost(event){
    console.log("handleAddHost: this.state.newhostdata: ", this.state.newhostdata);
    this.props.handleAddHost(event, this.state.newhostdata);
  }

  handleCancelAddHost(event){
    this.props.handleCancelAddHost(event);
  }

  handleServerProfileSelection(event){
    console.log("handleServerProfileSelection: value", event.option);
    let host = {...this.state.newhostdata};
    host['serverProfile'] = event.option;
    this.setState({newhostdata: host});
    this.discover(host);

  }

  discover(host) {
    console.log("discover: host: ", host);

    //console.log("handleQueryNICs: this.props.deployServerSettings: ", this.props.deployServerSettings);

    host.ethPorts = [];
    // host.nic1 = "Wait!";
    // host.nic2 = "Wait!";


    this.setState({newhostdata: host});
    // Animate to indicate discovery is in progress
    this.setState({discoveryWait: true});
    console.log("HOST: ", host)

    let url = '/rest/rm/discover?ovname=' + this.props.deployServerSettings.rmDetails.rmAlias + '&sp=' + host.serverProfile;
    discoverRMResource(this.props.deployServerSettings.rmDetails.rmAlias, host.serverProfile, (data) => {
      this.setState({"discoverData": data})

    })


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

    if(this.props.deployServerSettings.createServerProfile) {
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
    else {
      let serverProfilesPlaceHolderText = "";

      serverProfilesPlaceHolderText = (this.state.newhostdata.serverProfiles.length >= 1) ? "Select Server Profile" : "None";
      return (
          <FormField label='Server Profile'>
            <Select placeHolder={serverProfilesPlaceHolderText}
                    name="serverProfile"
                    placeholder="Select"
                    options={this.props.serverProfiles}
                    onChange={this.handleServerProfileSelection}
                    value={this.state.newhostdata.serverProfile}
            />
          </FormField>
      );

    }
  }

  render() {

    console.log("render: this.props: ", this.props);
    console.log("render: this.state: ", this.state);

    let bmc_fields1 = ""
    let bmc_fields2 = ""
    let ov_fields1 = ""
    ov_fields1 = this.getOVFields1();

    //console.log("DeployServersILO: 2: ", this.state.newhostdata);

    return (
      <LayerForm
        title="Add Host - HPE OneView"
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

AddHostOV.defaultProps = {
  error: undefined,
  deployServerSettings: {},
};

AddHostOV.propTypes = {
  dispatch: PropTypes.func,
  handleAddHost: PropTypes.func.isRequired,
  handleCancelAddHost: PropTypes.func.isRequired,
  error: PropTypes.object,
  heading: PropTypes.string,
  deployServerSettings: PropTypes.object.isRequired,
};

AddHostOV.contextTypes = {
  intl: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  deployServerSettings: PropTypes.object,
  router: PropTypes.object
};

const select = state => ({ ...state.networks });

export default connect(select)(AddHostOV);
