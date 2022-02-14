import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from '../../history';
import {loadPool} from "../../actions/pools";

import {
    Box,
    Header,
    Heading,
    NameValueList,
    FormField,
    TextInput,
    Button,
    Spinner,
    Text,
    Footer,
    Select,
    DataTable, Meter, CheckBox, Grid, Stack, Card, CardHeader, CardBody, Distribution, NameValuePair
} from "grommet";
import {Search} from "grommet-icons";
import {DocumentDownload as ReportIcon, FormAdd as AddIcon, FormSubtract as DeleteIcon} from "grommet-icons/icons";
import ServerAdd from "./ServersAdd";
import ReactJson from "react-json-view";


class ResPoolView extends Component {

    constructor(props) {
        super(props);
        this.renderTable = this.renderTable.bind(this);
        this.onAddServers = this.onAddServers.bind(this);
        this.handleAddServers = this.handleAddServers.bind(this);
        this.handleCancelAddServers = this.handleCancelAddServers.bind(this);
        this._renderAddServer = this._renderAddServer.bind(this);

        this.state = {
            addServer: false,
            poolName: "",
            method: 'BMC - Redfish',
            checked: [],
            expanded: [],
            errorMsg: "",
            discoveryWait: false,
            discoveredData: {},
            refServerData: {
                bmcIPAddr: '',
                bmcUser: '',
                bmcPassword: '',
                confirmilopassword: '',
                passwordmatch: true,
                ethPorts: [],
                osDrives: []
            }
        };

    }

    componentDidMount() {
        console.log("componentDidMount: ")
        let pool_name = window.location.pathname.substr("/ui/respools/view/".length);
        console.log("componentDidMount: pool_name: ", pool_name)
        this.props.dispatch(loadPool(pool_name));
    }

    componentWillUnmount() {
        console.log("componentWillUnmount: ")
    }

    renderTable(servers){
        const columns = [
            {
                property: 'serialNumber',
                header: "Serial Number",
                primary: true,
                align: 'end',
            },
            {
                property: 'vendor',
                header: 'Vendor',
                align: 'end',
            },
            {
                property: 'model',
                header: 'Model',
                align: 'end',
            },
            {
                property: 'status',
                header: 'Status',
                align: 'end',
            }
        ];

        if(servers.length === 0){
            servers = [{
                "serialNumber": "1213",
                "vendor": "HPE",
                "model": "DL380 Gen10"
            }]
        }

        let DATA = servers.map(value => (
            {
                serialNumber: value['serialNumber'],
                vendor: value['vendor'],
                model: value['model'],
            }
        ));

        return (
            <DataTable
                columns={columns}
                data={DATA}
                step={100}
                pad={{ horizontal: 'small', vertical: 'xsmall' }}
                background={{
                    header: { color: 'dark-3', opacity: 'strong' },
                    body: ['light-1', 'light-3'],
                    footer: { color: 'dark-3', opacity: 'strong' },
                }}
                border={{ body: 'bottom' }}
            />
        );
    }

    onAddServers(event) {
        console.log("onAddServers: ");
        this.setState({addServer: true});
    }

    handleAddServers(event) {
        console.log("handleAddServers: ");
        this.setState({addServer: false});
    }

    handleCancelAddServers(event) {
        console.log("handleCancelAddServers: ");
        this.setState({addServer: false});
    }

    _renderAddServer(){

        if(this.state.addServer)
            return (
                <ServerAdd

                    handleAddServer={this.handleAddHost}
                    handleCancelAddServer={this.handleCancelAddServers}
                />
            );
        else
            return "";
    }


    render() {
        console.log("ResPoolView: render", this.props)
        const { error, currentItem } = this.props;

        let servers_table;
        let servers = []

        if (currentItem.hasOwnProperty("servers"))
            servers = currentItem["servers"]
        else
            servers = []

        servers_table = this.renderTable(servers)

        let server_add_control = this._renderAddServer()

        let addControl = "";
        addControl = (
            <Box direction="row-responsive" fill="horizontal" gap="small" wrap responsive>
                <Box>
                    <TextInput icon={<Search/>} reverse placeholder="search ..."/>
                </Box>
                <Button label={"Servers"} icon={<AddIcon/>} onClick={this.onAddServers} a11yTitle={`Add Servers`}/>
            </Box>
        );


        return (
            <Box id="top2" fill="vertical" overflow="auto" align="start" flex="grow" justify="start" direction="column"
                 pad="large">
                {server_add_control}
                <div>
                    <Header>
                        <Heading level={4} size="small" strong={true}>Server Pool - {currentItem["name"]} </Heading>
                    </Header>
                    {addControl}
                    <Grid id="grid" responsive={true} justify="stretch" pad='xsmall' fill='horizontal'
                          rows={['auto', 'fit', 'full']}
                          columns={['full']}
                          areas={[
                              { name: 'header', start: [0, 0], end: [0, 0] },
                              { name: 'dashboard', start: [0, 1], end: [0, 1] },
                              { name: 'servers_table', start: [0, 2], end: [0, 2] },
                          ]}
                    >
                        <Box gridArea="header" >
                        </Box>
                        <Box gap='xlarge' gridArea="dashboard" direction='row'>
                            <Box justify='top' align="center" direction='column'>
                                <NameValueList>
                                    <NameValuePair name="Name">
                                        <Text color="text-strong">{currentItem["name"]}</Text>
                                    </NameValuePair>
                                    <NameValuePair name="Method">
                                        <Text color="text-strong">{currentItem["method"]}</Text>
                                    </NameValuePair>
                                    <NameValuePair name="Servers Count">
                                        <Text color="text-strong">{servers.length}</Text>
                                    </NameValuePair>
                                    <NameValuePair name="Servers Profile Summary">
                                        <ReactJson
                                            src={currentItem.serverProfile}
                                            margin="small"
                                            collapsed={1}
                                            theme="summerfruit:inverted"
                                            displayDataTypes={false}
                                        />
                                    </NameValuePair>
                                </NameValueList>

                            </Box>

                            <Box justify='top' align="center" direction='column'>
                                <Header size="small" justify="center">
                                    <Heading level={5}>Servers by Vendors</Heading>
                                </Header>
                                <Stack anchor="center">
                                    <Meter
                                        type="pie"
                                        background="light-2"
                                        values={[
                                            {
                                                value: 50,
                                                onHover: (over) => {
                                                    this.setState({"active": over ? 50 : 0});
                                                    this.setState({"label": over ? 'in use' : undefined});
                                                },
                                            },
                                            {
                                                value: 50,
                                                onHover: (over) => {
                                                    this.setState({"active": over ? 50 : 0});
                                                    this.setState({"label": over ? 'available' : undefined});
                                                },
                                            },
                                        ]}
                                        max={100}
                                        size="small"
                                        thickness="medium"
                                    />
                                </Stack>
                            </Box>
                            <Box justify='top' align="center" direction='column'>
                                <Header size="small" justify="center">
                                    <Heading level={5}>Servers Status</Heading>
                                </Header>
                                <Stack anchor="center">
                                    <Meter
                                        type="bar"
                                        background="light-2"
                                        values={[
                                            {
                                                value: 70,
                                                color: "orange",
                                                onHover: (over) => {
                                                    this.setState({"active": over ? 70 : 0});
                                                    this.setState({"label": over ? 'in use' : undefined});
                                                },
                                            }
                                        ]}
                                        max={100}
                                        size="small"
                                        thickness="medium"
                                    />
                                    <Text>In-Use</Text>
                                </Stack>
                                <Stack anchor="center">
                                    <Meter
                                        type="bar"
                                        color="orange"
                                        background="light-2"
                                        values={[
                                            {
                                                value: 30,
                                                color: "green",
                                                onHover: (over) => {
                                                    this.setState({"active": over ? 30 : 0});
                                                    this.setState({"label": over ? 'in use' : undefined});
                                                },
                                            }
                                        ]}
                                        max={100}
                                        size="small"
                                        thickness="medium"
                                    />
                                    <Text>Free</Text>
                                </Stack>
                                <Stack anchor="center">
                                    <Meter
                                        type="bar"
                                        background="light-2"
                                        values={[
                                            {
                                                value: 10,
                                                color: "red",
                                                onHover: (over) => {
                                                    this.setState({"active": over ? 10 : 0});
                                                    this.setState({"label": over ? 'available' : undefined});
                                                },
                                            },
                                        ]}
                                        max={100}
                                        size="small"
                                        thickness="medium"
                                    />
                                    <Text>Errors</Text>
                                </Stack>
                            </Box>
                        </Box>

                        <Box gridArea="servers_table">
                            <Heading level={4}>Server Inventory</Heading>
                            {servers_table}
                        </Box>
                    </Grid>
                </div>
                <div>
                    <br/>
                    <Footer pad={{vertical: 'medium'}} justify="between">

                    </Footer>
                </div>
            </Box>
        )
    }
}

ResPoolView.defaultProps = {
    error: undefined,
    servers: {}
};

ResPoolView.propTypes = {
    dispatch: PropTypes.func,
    error: PropTypes.object,
    currentItem: PropTypes.object
};

ResPoolView.contextTypes = {
    intl: PropTypes.object,
    dispatch: PropTypes.func,
    error: PropTypes.object,
    currentItem: PropTypes.object,
    router: PropTypes.object
};

const select = state => ({...state.pools});

export default connect(select)(ResPoolView);
