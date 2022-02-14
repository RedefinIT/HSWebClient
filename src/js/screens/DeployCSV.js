/**
 * Created by avireddi on 12/18/2019.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Heading, FormField, Footer, Button, Box, Paragraph } from 'grommet';
import { pageLoaded } from './utils';
import JSONTree from 'react-json-tree'

import {
  saveDeploymentSettings, performDeployServers, unloadDeployServers
} from '../actions/deployservers';


class DeployCSV extends Component {

  constructor(props) {

    super(props);

    this.state = {
      activeState: 7,
      submitted: false,
      fileReader: undefined,
      deployJSONFile: {},
      deployCSV: {
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
    pageLoaded('DeployCSV');
    //console.log("DeployCSV: componentWillMount: ")
  }

  componentWillUnmount() {
    //console.log("DeployCSV: componentWillUnmount: ")
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
    //console.log("DeployCSV: handlleJSONLoad: this.state.deployJSONFile: ", this.state.deployJSONFile);

    this.fileReader = new FileReader();

    var data = "";

    this.fileReader.onload = (event) => {
      // The file's text will be printed here
      //console.log(event.target.result)
      this.setState({"deployCSV": JSON.parse(event.target.result)});
    };

    this.fileReader.readAsText(this.state.deployJSONFile.file);

  }

  handleSubmit() {
    //console.log("DeployCSV: handleSubmit: : ");

    this.state.submitted = true;
    this.props.dispatch(performDeployServers(this.state.deployCSV))


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
    //console.log("DeployCSV: handleBack: this.state.activeState: ", this.state.activeState);

    // This will navigate the page to previous page
    this.props.onBack(this.state.activeState);
  }
  handleCancel() {
    this.props.onCancel();
  }


  render() {
    //console.log("render: DeployCSV: this.state: ", this.state);

    const { intl, router } = this.context;

    var notification;

    return (
      <div>
        {notification}
        <Form pad="large" >
          <Header >
            <Heading strong={true} level={3}> Deploy Servers </Heading>
          </Header>

            <Heading strong={true} level={4}>
              Bulk Deployment using CSV
            </Heading>

            <FormField label='Choose the deployment CSV file'>
              <input ref="file" id="file" name="file" type="file"
                     onChange={this._onFileChange} />
              <Button label='Load CSV'
                      primary={true}
                      onClick={this._handleJSONLoad}/>
            </FormField>
            <br/>

            <br/>
            <Paragraph>
              { Object.keys(this.state.deployCSV).length !== 0 && (
                <JSONTree data={this.state.deployCSV} />
                )}

            </Paragraph>


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
        </Form>

      </div>
    );
  }
}

DeployCSV.defaultProps = {
  error: undefined,
};

DeployCSV.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
};

DeployCSV.contextTypes = {
  router: PropTypes.object
};

const select = state => ({ ...state.deployservers });

export default connect(select)(DeployCSV);

