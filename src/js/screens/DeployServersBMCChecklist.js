  /**
   * Created by avireddi on 12/18/2019.
   */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Box, Button, CheckBox, Footer, Form, Header, Heading, Select } from 'grommet';
// import { getMessage } from 'grommet/utils/Intl';
import { pageLoaded } from './utils';

class DeployServersBMCChecklist extends Component {

  constructor(props) {

    super(props);

    this.state = {
      activeState: 3,
      deployServerSettings: {},
      screenData: {},
      errors: {},
      isbulk: false,
      addhost: false,
      iLOChecklist: [
        {"Id": 1, "Msg": "All servers are of same model and identical hardware configuration", "Check": false},
        {"Id": 2, "Msg": "The servers are in Power-Off state", "Check": false},
        {"Id": 3, "Msg": "All servers are in healthy state without any hardware errors", "Check": false}
        // {"Id": 5, "Msg": "Logical drive created with local drives for OS volume", "Check": false}
      ],
      password: "",
      passwordconfirm: "",
      passwordmatch: true,
      deleteHostConfirmDlg: false
    };

    this.handleNext = this.handleNext.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleBack= this.handleBack.bind(this);
    this._handleCheckListChanges = this._handleCheckListChanges.bind(this);

  }

  componentDidMount() {
    pageLoaded('DeployServersILOChecklist');
    //console.log("DeployServersILOChecklist: componentWillMount: ")
    // this.props.dispatch(loadDeployServers());
  }

  componentWillUnmount() {
    //console.log("DeployServersILOChecklist: componentWillUnmount: ")
    // this.props.dispatch(unloadDeployServers());
  }

  _handleCheckListChanges(event) {
    //console.log('_handleCheckListChanges: event: ', event.target.getAttribute('id'));
    const id = event.target.getAttribute('id');

    //console.log('_handleCheckListChanges: this.state.iLOChecklist[id]: ', this.state.iLOChecklist[id]);

    let iLOChecklist = { ...this.state.iLOChecklist };

    if(iLOChecklist[id].Check === true){
      iLOChecklist[id].Check = false;
    }
    else{
      iLOChecklist[id].Check = true;
    }

    this.setState({iloChecklist: {iLOChecklist}})


  }

  handleNext() {

    // Allow next only when every checklist item is answered by the user
    if(this.state.iLOChecklist.every((item) => {
      //console.log("handleNext: iLOChecklist: ", item);
      return item.Check;
    })){
      this.props.onNext(this.state.activeState);
    }

  }

  handleBack() {
    // This will navigate the page to previous page
    this.props.onBack(this.state.activeState);
  }

  handleCancel() {
    this.props.onCancel();
  }

  render() {
    //console.log("render: DeployServersILOChecklist: this.props: ", this.props);

    const { error, deployServerSettings } = this.props;
    const { intl } = this.context;

    // console.log("render: DeployServersILOChecklist: ", deployServerSettings);
    // console.log("render: DeployServersILOChecklist: this.state: ", this.state);

    let checklist = this.state.iLOChecklist.map((item, index) => (
        <CheckBox pad='small' key={index} id={String(index)} checked={item.Check} label={item.Msg}
                  onChange={this._handleCheckListChanges} />
    ));

    return (
        <Form pad='large'>
          <Header>
                <Heading level={4} size="small" strong={true} >Server Deployment using Redfish</Heading>
          </Header>
          <div>
          <Heading level={5} size="small" strong={true} >Deployment Checklist</Heading>
          </div>
              {checklist}
          <Footer pad={{vertical: 'medium'}} justify="between">
            <Button label='Next'
                    type='button'
                    primary={true}
                    onClick={this.handleNext}
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
    );
  }
}

DeployServersBMCChecklist.defaultProps = {
  error: undefined,
  deployServerSettings: {},
  screenData: {}
};

DeployServersBMCChecklist.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  deployServerSettings: PropTypes.object,
  screenData: PropTypes.object
};

DeployServersBMCChecklist.contextTypes = {
  intl: PropTypes.object
};

// const select = state => ({ ...state.deployservers });
const select = state => ({ deployServerSettings: state.deployservers.deployServerSettings, screenData: state.deployservers.screenData });

export default connect(select)(DeployServersBMCChecklist);
