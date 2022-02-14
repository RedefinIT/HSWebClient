import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import { Anchor } from 'grommet';
// import Article from 'grommet/components/Article';
import {
  Box, Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader, DataTable,
  Distribution,
  Grid,
  Header,
  Heading,
  Meter,
  Stack,
  Text
} from 'grommet';
// import Header from 'grommet/components/Header';
// import Heading from 'grommet/components/Heading';
// import Label from 'grommet/components/Label';
// import List from 'grommet/components/List';
// import ListItem from 'grommet/components/ListItem';
// import Notification from 'grommet/components/Notification';
// import Paragraph from 'grommet/components/Paragraph';
// import Value from 'grommet/components/Value';
// import Meter from 'grommet/components/Meter';
// import Section from 'grommet/components/Section';
// import Tiles from 'grommet/components/Tiles';
// import Tile from 'grommet/components/Tile';
// import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';
// import { Meter} from 'grommet-controls';
// import { getMessage } from 'grommet/utils/Intl';

import NavControl from '../components/NavControl';
import {
  loadDashboard, unloadDashboard
} from '../actions/dashboard';

import { pageLoaded } from './utils';
import {Edit, View} from "grommet-icons";
import history from "../history";
import ActivityIndex from "../components/activity/ActivityIndex";

class Dashboard extends Component {
  constructor (props) {
    super(props);

    // const total = 100;
    // const [active, setActive] = useState(0);
    // const [label, setLabel] = useState('');
    // const [highlight, setHighlight] = useState(false);

    // this._onClickTitle = this._onClickTitle.bind(this);
    // this._onCloseNav = this._onCloseNav.bind(this);
    // this._onSearchChange = this._onSearchChange.bind(this);
    // this._onSearchSelect = this._onSearchSelect.bind(this);
    // this._onClickUtilization = this._onClickUtilization.bind(this);
    // this._onGraphicSize = this._onGraphicSize.bind(this);
    //
    // this._setDocumentTitle(props);
    this.state = {
      graphicSize: 'small',
      cpuIndex: 0,
      memoryIndex: 0,
      storageIndex: 0,
      highlight: true,
      active: 0,
      total: 0,
      label: ""
    };
  }


  componentDidMount() {
    pageLoaded('Dashboard');
    console.log("Dashboard: componentDidMount");
    this.props.dispatch(loadDashboard());
  }

  componentWillUnmount() {
    // this.props.dispatch(unloadDashboard());
  }

  render() {
    const { error, data } = this.props;
    //console.log("Dashboard: render(): this.props: ", this.props);
    console.log("Dashboard: render(): data: ", data);
    const { intl } = this.context;

    const {active, total, label} = this.state;

    let ovTargets = [
      {value: data.ovCount, label: 'Available', color: 'status-ok'},
      {value: 0, label: 'Offline', color: 'status-critical'}
    ];

    let osPackages = [{value: 0, label: "None", color: 'unset'}];

    if(data.osPackages.stats.length > 0) {
      osPackages = data.osPackages.stats.map((item, index) => (
        {value: item.count, label: item.osType, color: 'graph-'.concat(index)}
      ));
    }

    let storageData = [
      {value: 427, label: 'In use', colorIndex: 'accent-1'},
      {value: 573, label: 'Available', colorIndex: 'unset'}
    ];


    return (
      <Box id="top2" fill="vertical" overflow="auto" align="start"  justify="start" direction="column" pad="medium" fill responsive wrap >
        <Header direction="row" justify="between" size="large"
                pad={{ horizontal: 'medium', between: 'small' }}>
          <NavControl />
        </Header>
        <Grid id="grid" responsive={true} justify="stretch" pad='xsmall' fill='horizontal'
              rows={['auto', 'fit', 'full']}
              columns={['full']}
              areas={[
                { name: 'header', start: [0, 0], end: [0, 0] },
                { name: 'dashboard', start: [0, 1], end: [0, 1] },
                { name: 'dashboard_table', start: [0, 2], end: [0, 2] },
              ]}
        >
          <Box gridArea="header" >
            <Header justify="between">
              <Heading level={4} margin="none">Dashboard</Heading>
            </Header>
          </Box>
          <Box gap='xlarge' gridArea="dashboard" direction='row'>
            <Box justify='top' align="center" direction='column'>
              <Header size="small" justify="center">
                <Heading level={5}>Images</Heading>
              </Header>
              <Stack anchor="center">
                <Meter type="circle" thickness="medium" max={data.osPackages.total}
                       size={this.state.graphicSize} values={osPackages} />
                <Box align="center">
                  <Box direction="column" align="center" pad={{ bottom: 'xsmall' }}>
                    <Text size="large" weight="bold">
                      {data.osPackages.total}
                    </Text>
                    <Text>Total</Text>
                  </Box>
                </Box>
                <Box align="center">
                  <Box direction="column" align="center" pad={{ bottom: 'xsmall' }}>
                    <Text size="large" weight="bold">
                      {data.osPackages.total}
                    </Text>
                    <Text>Total</Text>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Box justify='top' align="center" direction='column'>
              <Header size="small" justify="center">
                <Heading level={5}>Servers</Heading>
              </Header>
              <Stack anchor="center">
                <Meter
                  type="circle"
                  background="light-2"
                  values={[
                    {
                      value: 70,
                      onHover: (over) => {
                        this.setState({"active": over ? 70 : 0});
                        this.setState({"label": over ? 'in use' : undefined});
                      },
                      onClick: () => {
                        this.setState({
                          highlight: !highlight
                        });
                      },
                    },
                    {
                      value: 30,
                      onHover: (over) => {
                        this.setState({"active": over ? 30 : 0});
                        this.setState({"label": over ? 'available' : undefined});
                      },
                    },
                  ]}
                  max={100}
                  size="small"
                  thickness="medium"
                />
                <Box align="center">
                  <Box direction="row" align="center" pad={{ bottom: 'xsmall' }}>
                    <Text size="xxlarge" weight="bold">
                      {active || total}
                    </Text>
                  </Box>
                  <Text>{label || 'total'}</Text>
                </Box>
              </Stack>
            </Box>
            <Box align="center" justify="top">
              <Header size="small" justify="center">
                <Heading level={5}>Pools</Heading>
              </Header>
              <Card pad="medium" background={{"color":"background-contrast"}} >
                <CardHeader pad="small">
                </CardHeader>
                <CardBody pad="small">
                  <Text weight={"bold"}>Pools: 50</Text>
                  <Text weight={"bold"}>Total Servers: 50</Text>
                  <Text weight={"bold"}>Free Servers: 50</Text>
                  <Text weight={"bold"}>Unassigned Servers: 50</Text>
                </CardBody>
              </Card>
            </Box>
            <Box justify='top' direction='column'>
              <Heading level={5}>Tasks Summary</Heading>
              <Distribution
                fill
                basis='small'
                values={[
                  { label: "Failed", value: 2, color: 'status-critical' },
                  { label: "Completed", value: 2, color: 'status-ok'},
                  { label: "Running", value: 1, color: 'status-warning' },
                ]}
              >
                {value => (
                  <Box pad="small" background={value.color} fill>
                    <Text size="xsmall">{value.value} {value.label}</Text>
                  </Box>
                )}
              </Distribution>
            </Box>
          </Box>

          <Box gridArea="dashboard_table">
            <Heading level={4}>Running Tasks</Heading>
            <ActivityIndex tableOnly={true}/>
          </Box>
        </Grid>
      </Box>
    );
  }
}

Dashboard.defaultProps = {
  error: undefined,
  dashboardData: {}
};

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  dashboardData: PropTypes.object
};

Dashboard.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.dashboard });

export default connect(select)(Dashboard);
