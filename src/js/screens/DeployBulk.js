/**
 * Created by avireddi on 12/18/2019.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import {Form, Header, Heading, FormField, Footer, Button, Box, Paragraph, Grid} from 'grommet';
import { pageLoaded } from './utils';
import ReactJson from 'react-json-view';

import {
  saveDeploymentSettings, performDeployServers, unloadDeployServers
} from '../actions/deployservers';

class DeployBulk extends Component {

  constructor(props) {

    super(props);

    this.state = {
      activeState: 7,
      submitted: false,
      fileReader: undefined,
      deployJSONFile: {},
      deployJSON: {
      }
    };

    this._handleJSONLoad = this._handleJSONLoad.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleBack= this.handleBack.bind(this);
    this._onFileChange = this._onFileChange.bind(this);

  }

  componentDidMount() {
    pageLoaded('DeployBulk');
    //console.log("DeployBulk: componentDidMount: ")
  }

  componentWillUnmount() {
    //console.log("DeployBulk: componentWillUnmount: ")
  }


  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({isFail: false, isSuccess: false});
  }

  findEthPort(nic) {

  }

  _handleJSONLoad(){
    //console.log("DeployBulk: handlleJSONLoad: this.state.deployJSONFile: ", this.state.deployJSONFile);

    // if file property is missing from deployJSONFile JSON then exit the function
    if ('file' in this.state.deployJSONFile === false)
      return;

    this.fileReader = new FileReader();

    let data = "";

    this.fileReader.onload = (event) => {
      // The file's text will be printed here
      //console.log(event.target.result)
      this.setState({"deployJSON": JSON.parse(event.target.result)});
    };

    this.fileReader.readAsText(this.state.deployJSONFile.file);

  }

  handleSubmit() {
    //console.log("DeployBulk: handleSubmit: : ");

    this.state.submitted = true;
    this.props.dispatch(performDeployServers(this.state.deployJSON))


    // alert("This functionality not implemented yet!");

    // this.props.dispatch(saveDeploymentSettings(deplSettings));
    // Set the submitted state parameter to true
    // this.props.dispatch(performDeployServers(this.state.deployCSV))


    // const { router } = this.context;
    // router.push({
    //   pathname: '/activity'
    // });

  }

  _onFileChange () {
    let file = this.refs.file.files[0];
    //console.log("_onFileChange: selected filename: ", file);

    if (! name) {
      if (file) {
        let deployJSONFile = { ...this.state.deployJSONFile};
        deployJSONFile.name = file.name;
        deployJSONFile.file = file;
        this.setState({ deployJSONFile: deployJSONFile });
      }
    }
  }

  handleBack() {
    //console.log("DeployBulk: handleBack: this.state.activeState: ", this.state.activeState);

    // This will navigate the page to previous page
    this.props.onBack(this.state.activeState);
  }
  handleCancel() {
    this.props.onCancel();
  }

  render() {
    //console.log("render: DeployBulk: this.state: ", this.state);

    const { intl, router } = this.context;

    let notification = "";

    return (
        <Grid id="bmc" responsive={true} justify="stretch"
              rows={['auto', 'auto', 'auto', 'auto']}
              columns={['auto', 'auto']}
              areas={[
                { name: 'header', start: [0, 0], end: [1, 0] },
                { name: 'fields', start: [0, 1], end: [0, 1] },
                { name: 'hosts', start: [0, 2], end: [1, 2] },
                { name: 'footer', start: [0, 3], end: [1, 3] },
              ]}
        >
          {notification}
          <Box gridArea="header">
            <Header >
              <Heading level={4} size="small" strong={true}>Bulk Server Deployment</Heading>
            </Header>
          </Box>
          <Box gridArea='fields' justify='start'>
            <Form>
              <Header>
                <Heading size="small" strong={true} level={5}>
                  Bulk Deployment using JSON
                </Heading>
              </Header>
              <FormField label='Choose the deployment JSON file'>
                <Box pad="small" align="start">
                  <input ref="file" id="file" name="file" type="file"
                         onChange={this._onFileChange} />
                </Box>
              </FormField>
              <Button label='Load JSON' alignSelf="start"
                      primary
                      onClick={this._handleJSONLoad}/>
              <br/>
              <br/>
              { Object.keys(this.state.deployJSON).length !== 0 && (
                  <Box size="small" border={{"style":"ridge","size":"medium"}}>

                    <ReactJson
                        src={this.state.deployJSON}
                        margin="small"
                        collapsed={1}
                        theme="summerfruit:inverted"
                        displayDataTypes={false}
                    />

                  </Box>)}
            </Form>
          </Box>
          <Box gridArea='footer'>
            <Form>
              <Footer pad={{vertical: 'medium'}} justify="between">
                <Button label='Deploy'
                        primary
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
            </Form>
          </Box>
        </Grid>
    );
  }
}

DeployBulk.defaultProps = {
  error: undefined,
};

DeployBulk.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
};

DeployBulk.contextTypes = {
  router: PropTypes.object
};

const select = state => ({ ...state.deployservers });

export default connect(select)(DeployBulk);

