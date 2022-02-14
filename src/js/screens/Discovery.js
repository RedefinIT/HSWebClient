/**
 * Created by avireddi on 12/18/2019.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Header, Heading, Form, FormField, Footer, Button, Box, TextInput, RadioButton, Main, Text} from 'grommet';

// import { getMessage } from 'grommet/utils/Intl';
import DiscoverySynergy from "./DeployServersOneView";
import DeployServersPage3 from "./DeployVM";
import DeployServerSubmit from "./DeployServerSubmit";
import DeployServersBMC from "./DeployServersBMC";
import DeployBulk from "./DeployBulk";
import DeployCSV from "./DeployCSV";
import DeployServersILOChecklist from "./DeployServersBMCChecklist";

import {
  loadDeployServers, saveDeploymentSettings, unloadDeployServers
} from '../actions/deployservers';

import { pageLoaded } from './utils';

const DEFAULT_FILE_INFO = {
  osType: "",
  file: "",
  name: ''
};


class Discovery extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeState: 0,
      origin: 3,
      deployServerSettings: {},
      fileInputDisable: false,
      discoveryOption: "discover_csv",
      fileInfo: DEFAULT_FILE_INFO,
      reportName: ""
    };

    this.handleDiscoveryOption = this.handleDiscoveryOption.bind(this);
    this._onFileChange = this._onFileChange.bind(this);
    this._onNameChange = this._onNameChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.handleNext= this.handleNext.bind(this);

  }

  componentDidMount() {
    pageLoaded('Discovery');
    //console.log("Discovery: componentDidMount: ")
    this.props.dispatch(loadDeployServers(this.initialState));
  }

  componentWillUnmount() {
    //console.log("Discovery: componentWillUnmount: ")
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
    let nextState = 0;

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
    let nextState = 0;
    if(activeState === 1 || activeState === 2){
      nextState = 4;
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

  handleDiscoveryOption(event) {
    //console.log("handleDiscoveryOption: ", event.target.name);
    // The below line gets a deep copy of the requested object instead of mutable object reference

    this.setState({"discoveryOption": event.target.name})

  }

  handleNext() {

  }

  _onFileChange (event) {
    //console.log(event.target)
    //console.log(event.target.files)
    //console.log(event.target.name)
    let file = event.target.files[0];
    let name = file.name;
    if ( !name ) {
      if (file) {
          let file_info = { ...this.state.fileInfo };
          file_info.name = file.name;
          file_info.file = file.name;
          this.setState({ fileInfo: file_info });
        }
    }
    this.setState({ fileName: file.name });
  }

  render() {
    //console.log("render: Discovery: this.props: ", this.props);
    //console.log("render: Discovery: this.state: ", this.state);

    const { error, deployServerSettings } = this.props;
    const { intl } = this.context;

    let file_upload = ""
    if (this.state.discoveryOption === "manual") {
      file_upload = "";
    }
    else if (this.state.discoveryOption === "discover_csv") {
      file_upload = (
        <div>
          <br/>
          <FormField label="Upload CSV file" htmlFor="file" >
            <Box pad='small'>
              <input ref="file" id="file" name="file" type="file" disabled={this.state.fileInputDisable}
                   onChange={this._onFileChange} />
            </Box>
          </FormField>
        </div>
      )
    }
    else if (this.state.discoveryOption === "discover_json"){
      file_upload = (
        <div>
          <br/>
          <FormField label="Upload JSON file" htmlFor="file" >
            <input ref="file" id="file" name="file" type="file" disabled={this.state.fileInputDisable}
                   onChange={this._onFileChange} />
          </FormField>
        </div>
      )
    }

    return (
      <Box id="top2" fill="vertical" overflow="auto" align="start" flex="grow"  justify="start" direction="column" pad="large"  >
        { deployServerSettings.activeState === 0 && (
          <Form  pad='large'>
            <Header>
              <Heading level={4} size="small"  strong={true} >Discover Servers</Heading>
            </Header>
            <div>
              {/*<Heading size="small" strong={false}  level="4" >Task Name</Heading>*/}
              <FormField label="Report Name">
                <TextInput id="reportName" value={deployServerSettings.name } onChange={this._onNameChange}/>
              </FormField>
              <br/>

              {/*<Heading tag="h4" strong={true} >Deployment Option</Heading>*/}
              <FormField label="Discovery Options">
                <Box margin="small">
                <RadioButton id='manual'
                             name='manual'
                             label='Manual'
                             checked={this.state.discoveryOption === 'manual' ? true:false}
                             disabled={false}
                             onChange={this.handleDiscoveryOption} />
                <RadioButton id='discover_csv'
                             name='discover_csv'
                             label='CSV'
                             checked={this.state.discoveryOption === 'discover_csv' ? true:false}
                             onChange={this.handleDiscoveryOption} />
                <RadioButton id='discover_json'
                             name='discover_json'
                             label='JSON'
                             checked={this.state.discoveryOption === 'discover_json' ? true:false}
                             onChange={this.handleDiscoveryOption} />
                </Box>
              </FormField>
              {file_upload}

            </div>
            <Footer pad={{vertical: 'medium'}} justify="between">
              <Button label='Next'
                      type='submit'
                      primary={true}
                      disabled={true}
                      onClick={this.handleNext}
              />
              <Text color="status-critical" >This feature not available in this version!</Text>
              {/*<Button label='Cancel'*/}
              {/*primary={false}*/}
              {/*onClick={this.handleClick}*/}
              {/*/>*/}
            </Footer>
          </Form>
        )}

        { this.state.activeState === 1 && (
          <div><DeployServersSynergy
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { this.state.activeState === 3 && (
          <div><DeployServersILOChecklist
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel} /></div>
        )}
        { this.state.activeState === 6 && (
          <div><DeployServersBMC
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { this.state.activeState === 4 && (
          <div><DeployServersPage3
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { this.state.activeState === 5 && (
          <div><DeployServerSubmit
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { this.state.activeState === 7  && (
          <div><DeployBulk
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}
        { this.state.activeState === 8  && (
          <div><DeployCSV
            onNext={this.onNext} onBack={this.onBack} onCancel={this.onCancel}/></div>
        )}


      </Box>
    );
  }
}

Discovery.defaultProps = {
  error: undefined,
  deployServerSettings: {}
};

Discovery.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  deployServerSettings: PropTypes.object
};

Discovery.contextTypes = {
  intl: PropTypes.object
};

// const select = state => ({ ...state.deployservers });
const select = state => ({ deployServerSettings: state.deployservers.deployServerSettings});

export default connect(select)(Discovery);
