/**
 * Created by avireddi on 12/18/2019.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import {
  Meter,
  Paragraph,
  Box,
  Button,
  Footer,
  Form,
  Header,
  Heading,
  Text,
  DataTable
} from 'grommet';
import { Notification, Value } from 'grommet-controls';
// import { getMessage } from 'grommet/utils/Intl';
import { FileSaver } from 'file-saver';

import Notification1 from '../components/Notification1'

import {
  saveDeploymentSettings, performDeployServers, unloadDeployServers
} from '../actions/deployservers';

import { loadTask } from '../actions/tasks';

import { pageLoaded } from './utils';
// import DocumentCsvIcon from 'grommet/components/icons/base/DocumentCsv';
import { saveAs } from 'file-saver';
import {More} from "grommet-icons";
import history from '../history';

class TaskDetails extends Component {

  constructor(props) {

    super(props);

    this.state = {
      activeState: 5,
      submitted: false,
  };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleBack= this.handleBack.bind(this);
  }

  componentDidMount() {
    pageLoaded('TaskDetails');
    console.log("TaskDetails: componentWillMount: ", this.props)
    //console.log("TaskDetails: window.location.pathname: ", window.location.pathname)
    let tasknumber = this.props.location.pathname.substr("/ui/taskdetails/".length);
    this.props.dispatch(loadTask(tasknumber));
    this.timerID = setInterval(
      () => this.props.dispatch(loadTask(tasknumber)),
      30000
    );
    // this.props.dispatch(loadDeployServers());
  }

  componentWillUnmount() {
    console.log("TaskDetails: componentWillUnmount: ");
    clearInterval(this.timerID);
    // this.props.dispatch(unloadDeployServers());
  }

  handleClick() {
    history.push({
      pathname: '/ui/activity'
    });
    // window.location.href = '/ui/activity';

  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({isFail: false, isSuccess: false});
  }

  findEthPort(nic) {

  }

  handleBack() {
    //console.log("TaskDetails: handleBack: this.state.activeState: ", this.state.activeState);

    // This will navigate the page to previous page
    this.props.onBack(this.state.activeState);
  }

  onChildren(datum, index) {
    //console.log("onChildren: ", index);
    //console.log(datum);
    return (<Box direction="row" background={{"color": "accent-4"}} pad={{between: 'small'}} align="center">
      <Text truncate={false} margin="small"> {datum.bmcIPAddr}</Text>
      <Text truncate={false} margin="small">{datum.bmcUser}</Text>
      <Text truncate={false} margin="small">{datum.hostName}</Text>
      <Text truncate={false} margin="small">{datum['networks'][0].ipAddr}</Text>
      <Text truncate={false} margin="small"  weight="bold">{datum.progress * 10}% </Text>
      <Text truncate={false} margin="small">{datum.status}</Text>
      <Text truncate={false} margin="small">{datum.message}</Text>
    </Box>);
  }

  render() {
    // console.log("render: TaskDetails: this.props: ", this.props);
    // console.log("render: TaskDetails: this.props.currentTask: ", this.props.currentTask);

    const { error, currentTask } = this.props;
    const { intl, router } = this.context;

    //console.log("TaskDetails: render: currentTask: ", currentTask)

    // skip render if current task is null
    if(!currentTask)
      return (<Box></Box>);

    let overallProgress = 0;
    let completedTasks = 0;
    let failedTasks = 0;
    let completedTasksStr = "";


    let notification;

    if(currentTask.status === "Error" || currentTask.status === "Failed") {
      notification = (<Notification1 status='error'
                                    message={currentTask['errorMsg']}
      />);
    }

    if(failedTasks > 0) {
      notification = (<Notification1 status='error'
                                    message="One or more hosts deployment failed"
      />);
    }

    console.log(currentTask)

    return (
      <Box id="top2" fill="vertical" overflow="auto" align="start" flex="grow"  justify="start" direction="column" pad="large"  >
      <Form pad="large" >
          <Header >
                <Heading strong={true} level={3}>Task Details</Heading>
          </Header>
          {notification}
          <div>
            <Paragraph>
              <b>Image Name:</b> <i>{currentTask['data']['data']['name']}</i>
            </Paragraph>
            <Paragraph>
              <b>File Name:</b> <i>{currentTask['data']['data']['file']}</i>
            </Paragraph>
            <Paragraph>
              <b>Image Type:</b> <i>{currentTask['data']['data']['osType']}</i>
            </Paragraph>
            <Paragraph>
              <b>Start Time:</b> <i>{new Date(currentTask.startTime).toISOString()}</i>
            </Paragraph>
            <div>
              <b>Overall Progress: </b>
              <Box>
                <Value value={currentTask.progress * 10}
                     units='%'
                     size='small'
                     align='start' />
              <Meter size='small'
                     color="green"
                     background="status-unknown"
                     type="bar"
                     value={currentTask.progress * 10}
                     a11yTitle="Progress"
                      />
            </Box>
            </div>

          </div>
          <Footer pad={{vertical: 'medium'}} justify="between">
            <Button label='Close'
                    primary={true}
                    onClick={this.handleClick}
            />
          </Footer>
        </Form>
      </Box>
    );
  }
}

TaskDetails.defaultProps = {
  error: undefined,
  url: undefined
};

TaskDetails.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  url: PropTypes.object
};

TaskDetails.contextTypes = {
  router: PropTypes.object
};

const select = state => ({ ...state.tasks });
// let select = (state, props) => {
//   console.log("TaskDetails select: state: ", state);
//   console.log("TaskDetails select: props: ", props);
//   return {
//     uri: props.location.pathname.substr("/deployprogress/".length)
//   };
// };

export default connect(select)(TaskDetails);

