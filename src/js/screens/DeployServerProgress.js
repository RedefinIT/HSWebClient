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

class DeployServerProgress extends Component {

  constructor(props) {

    super(props);

    this.state = {
      activeState: 5,
      submitted: false,
      deployJSON: {
        "hosts": [],
        "osPackage": "",
        "deploymentMode": "",
        "rmDetails": {}
      }
  };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleBack= this.handleBack.bind(this);
    this._handleDownloadJSON = this._handleDownloadJSON.bind(this);

  }

  componentDidMount() {
    pageLoaded('DeployServerProgress');
    console.log("DeployServerProgress: componentWillMount: ", this.props)
    //console.log("DeployServerProgress: window.location.pathname: ", window.location.pathname)
    let tasknumber = this.props.location.pathname.substr("/ui/deployprogress/".length);
    this.props.dispatch(loadTask(tasknumber));
    this.timerID = setInterval(
      () => this.props.dispatch(loadTask(tasknumber)),
      30000
    );
    // this.props.dispatch(loadDeployServers());
  }

  componentWillUnmount() {
    console.log("DeployServerProgress: componentWillUnmount: ");
    clearInterval(this.timerID);
    // this.props.dispatch(unloadDeployServers());
  }

  _handleDownloadJSON(){
    //console.log(JSON.stringify(this.state.deployCSV, null, 2));


    var jsondata = JSON.stringify(this.state.deployCSV, null, 2);

    var jsonblob = new Blob([jsondata], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(jsonblob, "deploy.json");

  }

  // loadOSPackages() {
  //   var url = '/rest/ospackage/list';
  //   restGet(url).then(data => {
  //     this.setState({
  //       OSPackages: data['result']
  //     });
  //   });
  // }

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
    //console.log("DeployServerProgress: handleBack: this.state.activeState: ", this.state.activeState);

    // This will navigate the page to previous page
    this.props.onBack(this.state.activeState);
  }

  onChildren(datum, index) {
    //console.log("onChildren: ", index);
    //console.log(datum);
    return (<Box direction="row" background={{"color": "accent-4"}} pad={{between: 'small'}} align="center">
      <Text truncate={false} margin="small">{datum.hostName}</Text>
      <Text truncate={false} margin="small">{datum['data']['networks'][0].ipAddr}</Text>
      <Text truncate={false} margin="small"  weight="bold">{datum.progress * 10}% </Text>
      <Text truncate={false} margin="small">{datum.status}</Text>
      <Text truncate={false} margin="small">{datum.message}</Text>
    </Box>);
    // return (<Box direction="row" background={{"color": "accent-4"}} pad={{between: 'small'}} align="center">
    //   <Text truncate={false} margin="small"> {datum.bmcIPAddr}</Text>
    //   <Text truncate={false} margin="small">{datum.bmcUser}</Text>
    //   <Text truncate={false} margin="small">{datum.hostName}</Text>
    //   <Text truncate={false} margin="small">{datum['networks'][0].ipAddr}</Text>
    //   <Text truncate={false} margin="small"  weight="bold">{datum.progress * 10}% </Text>
    //   <Text truncate={false} margin="small">{datum.status}</Text>
    //   <Text truncate={false} margin="small">{datum.message}</Text>
    // </Box>);
  }

  render() {
    // //console.log("render: DeployServerProgress: this.props: ", this.props);
    // //console.log("render: DeployServerProgress: this.props.currentTask: ", this.props.currentTask);

    const { error, currentTask } = this.props;
    const { intl, router } = this.context;

    let test1 = {};

    //console.log("Size of test1: ", Object.keys(test1).length)

    //console.log("render: currentTask: ", currentTask)

    // skip render if current task is null
    if(!currentTask)
      return (<Box></Box>);
    if(Object.keys(currentTask).length === 0)
      return (<Box></Box>);
    // //console.log("render: currentTask['data'].deploymentMode: ", currentTask['data']['deployData'].deploymentMode)

    if(this.state.submitted === true){
      //console.log("render: DeployServerProgress: currentTask.status.error: ", Object.keys(currentTask.status.error));

      // If the status has error: {} then deploy must be successful
      if(Object.keys(currentTask.status.error).length === 0){
        //console.log("render: DeployServerProgress: currentTask.status.error: ", currentTask.status.error);
        // router.push({
        //   pathname: '/activity'
        // });
        window.location.href = '/ui/activity'
      }
      else {
        // There must be some error so display the error in this screen
        notification = (<Notification1 status='critical'
                      message={currentTask.status.error.message}
                      />);
        // reset the submit flag to false to allow the user to try submit again
        this.state.submitted = false;
      }
    }

    // let hoststablerows = [];
    // let hostsTable = [];
    let hostsList = "";

    console.log(currentTask)

    if(currentTask['data']['deployData'].deploymentMode === "vm") {
      let data = currentTask['subTasks'].map((item, index) => (
          {
            hostName: item['data']['host'].hostName,
            ipAddr: item['data']['host']['networks'][0].ipAddr,
            progress: item.progress * 10,
            status: item.status,
            message: item.message
          }
      ));

      let columns=([
        {"header":"Hostname","property":"hostName"},
        {"header":"Host IP","property":"ipAddr"},
        {"header":"Progress","property":"progress"},
        {"header":"Status","property":"status"},
        {"header":"Message","property":"message"}
      ]);
      hostsList = (<DataTable
          columns={columns}
          gap="xsmall"
          pad="xsmall"
          data={data}
          children={this.onChildren}
      />);

    }
    else if(currentTask['data']['deployData'].deploymentMode === "hpeoneview") {
      let data = currentTask['subTasks'].map((item, index) => (
        {
          serverProfile: item.serverProfile,
          hostName: item.hostName,
          progress: item.progress * 10,
          status: item.status,
          message: item.message
        }
      ));
      let columns=([
        {"header":"Server Profile","property":"serverProfile","primary":true},
        {"header":"Hostname","property":"hostName"},
        {"header":"Host IP","property":"ipAddr"},
        {"header":"Progress","property":"progress"},
        {"header":"Status","property":"status"},
        {"header":"Message","property":"message"}
      ]);
      hostsList = (<DataTable
        columns={columns}
        gap="xsmall"
        pad="xsmall"
        data={data}
        children={this.onChildren}
      />);

    }
    // else if(currentTask.deploymentMode === "hpeilo5" || currentTask.deploymentMode === "hpeilo_gen9") {
    else if(["hpeilo5", "hpeilo_gen9", "dell_idrac9"].indexOf(currentTask['data']['deployData'].deploymentMode) >= 0) {
      //console.log("generating hosts table..")

      let data = currentTask['subTasks'].map((item, index) => (
        {
          bmcIPAddr: item['data']['host'].bmcIPAddr,
          bmcUser: item['data']['host'].bmcUser,
          hostName: item['data']['host'].hostName,
          ipAddr: item['data']['host']['networks'][0].ipAddr,
          progress: item.progress * 10,
          status: item.status,
          message: item.message
        }
      ));
      let columns=([
        {"header":"BMC IP","property":"bmcIPAddr","primary":true},
        {"header":"BMC User","property":"bmcUser"},
        {"header":"Hostname","property":"hostName"},
        {"header":"Host IP","property":"ipAddr"},
        {"header":"Progress","property":"progress"},
        {"header":"Status","property":"status"},
        {"header":"Message","property":"message"}
      ]);
      hostsList = (<DataTable
        columns={columns}
        align="center"
        gap="xsmall"
        pad="xsmall"
        data={data}
      />);
    }

    let overallProgress = 0;
    let completedTasks = 0;
    let failedTasks = 0;
    let completedTasksStr = "";

    let item;
    if(currentTask && currentTask['subTasks']){
      for (item of currentTask['subTasks']) {
        overallProgress += item.progress;
        if(item.status === "Complete")
          completedTasks += 1;
        else if(item.status === "Error" || item.status === "Fail")
          failedTasks += 1;
      }

      let totalTasks = currentTask['subTasks'].length;

      // if (totalTasks > 0) {
      //   // Calculate average progress
      //   overallProgress = overallProgress * 10 / totalTasks;
      // }

      completedTasksStr = (completedTasks) + " of " + (totalTasks);

    }

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


    return (
      <Box id="top2" fill="vertical" overflow="auto" align="start" flex="grow"  justify="start" direction="column" pad="large"  >
      <Form pad="large" >
          <Header >
                <Heading strong={true} level={4}>Server Deployment Progress</Heading>
          </Header>
          {notification}
          <Text color="dark-3">
            <b>Note:</b> The root user password for the installed servers will be <b>Welcome#123</b>.
          </Text>
          <div>
            <Paragraph>
              <b>Task ID:</b> <i>{currentTask.taskId}</i>
            </Paragraph>
            <Paragraph>
              <b>Task Name:</b> <i>{currentTask.name}</i>
            </Paragraph>
            <Paragraph>
              <b>Deployment Type:</b> <i>{currentTask['data']['deployData'].deploymentMode}</i>
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
                     color="graph-0"
                     background="status-unknown"
                     type="bar"
                     value={currentTask.progress * 10}
                     a11yTitle="Progress"
                      />
                <Box tag='label' size="small"><b>Completed: </b> <i>{completedTasksStr}</i></Box>
            </Box>
            </div>

            <Heading strong={true} level={4}>
              Hosts
            </Heading>
            {hostsList}
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

DeployServerProgress.defaultProps = {
  error: undefined,
  url: undefined
};

DeployServerProgress.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  url: PropTypes.object
};

DeployServerProgress.contextTypes = {
  router: PropTypes.object
};

const select = state => ({ ...state.tasks });
// let select = (state, props) => {
//   console.log("DeployServerProgress select: state: ", state);
//   console.log("DeployServerProgress select: props: ", props);
//   return {
//     uri: props.location.pathname.substr("/deployprogress/".length)
//   };
// };

export default connect(select)(DeployServerProgress);

