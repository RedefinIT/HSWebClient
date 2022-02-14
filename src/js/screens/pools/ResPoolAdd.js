import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from '../../history';

import {
    Box,
    Header,
    Heading,
    Form,
    FormField,
    TextInput,
    Button,
    Spinner,
    Text,
    Footer,
    Select,
    DataTable, Meter, CheckBox
} from "grommet";
import {Actions, StatusWarning} from "grommet-icons";
import {serverDiscovery} from "../../actions/pools";
import ReactJson from "react-json-view";
// import CheckboxTree from 'react-checkbox-tree';
import CheckBoxTreeTable from "../../components/CheckBoxTreeTable";
import {postRESTApi} from "../../api/server-rest";

class ResPoolAdd extends Component {

    constructor(props) {
        super(props);
        this._handleHostDetailsChange = this._handleHostDetailsChange.bind(this);
        this.handleDiscover = this.handleDiscover.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onCreatePool = this.onCreatePool.bind(this);
        this.onSelectMethod = this.onSelectMethod.bind(this);

        this.state = {
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
    }

    componentWillUnmount() {
        console.log("componentWillUnmount: ")
    }

    handleCancel() {
        history.push({pathname: "/ui/respools"});
    }

    onCreatePool() {
        let pool_obj = {
            "name": this.state.poolName,
            "method": this.state.method,
            "serverProfile": {rules: [], serverData: this.state.discoveredData},
            "users": ["admin"]
        };

        let url = '/rest/respools/create';
        postRESTApi(url, pool_obj)
            .then((response) => {
                console.log("Pool created: ", response);
                history.push({
                    pathname: "/ui/respools"
                });
            })
            .catch((err) => {
                console.log("Pools creation failed with error: ", err);
            })
    }

    onSelectMethod(event) {
        this.setState({"method": event.option});
    }

    _handleHostDetailsChange(event) {
        // console.log("handleHostDetails: event.target: ", event.target.value)
        // console.log("handleHostDetails: event.target: ", event.target.id)
        let host = {...this.state.refServerData};
        if (event.target.id === 'iloipaddr') {
            host.bmcIPAddr = event.target.value;
        } else if (event.target.id === 'ilouser') {
            host.bmcUser = event.target.value;
        } else if (event.target.id === 'ilopassword') {
            // console.log("handleHostDetails: host: ", host)
            // console.log("handleHostDetails: ilopassword: ", host.bmcPassword)
            // console.log("handleHostDetails: host.confirmilopassword: ", host.confirmilopassword)

            host.bmcPassword = event.target.value;

            if (host.confirmilopassword && host.confirmilopassword !== '') {
                if (host.bmcPassword === host.confirmilopassword) {
                    host.passwordmatch = true;
                } else {
                    host.passwordmatch = false;
                }
            } else {
                host.passwordmatch = true;
            }
        } else if (event.target.id === 'confirmilopassword') {
            host.confirmilopassword = event.target.value;

            if (host.confirmilopassword && host.confirmilopassword !== '') {
                if (host.bmcPassword === host.confirmilopassword) {
                    host.passwordmatch = true;
                } else {
                    host.passwordmatch = false;
                }
            } else {
                host.passwordmatch = true;
            }

        } else if (event.target.id === 'hostname') {
            host.hostName = event.target.value;
        } else if (event.target.id === 'ipaddr') {
            host.ipAddr = event.target.value;
        } else if (event.target.id === 'ovsp') {
            host.serverProfile = event.target.value;
        }

        // console.log("handleHostDetails: updating the host: ", host)
        this.setState({refServerData: host});
    }

    handleDiscover(event) {
        console.log("handleDiscover: ", this.state.refServerData)
        this.setState({discoveryWait: true});
        serverDiscovery(this.state.refServerData, true, (discoveredData) => {
            this.setState({'discoveredData': discoveredData, 'discoveryWait': false})
        });
    }


    render() {
        console.log("ResPoolsAdd: render", this.state)

        let error_message = "";
        if (this.state.errorMsg) {
            //console.log("DeployServersILO: BMC password mismatch");

            error_message = (
                <Box
                    direction="row"
                    animation="fadeIn"
                    background={{"color": "status-critical", "opacity": "medium"}}
                >
                    <StatusWarning/>
                    <Text size="xsmall">{this.state.errorMsg}</Text>
                </Box>
            );
        } else error_message = "";

        let bmcPasswordMismatch = "";
        if (this.state.passwordmatch === false) {
            //console.log("DeployServersILO: BMC password mismatch");

            bmcPasswordMismatch = (
                <Box
                    direction="row"
                    animation="fadeIn"
                    background={{"color": "status-critical", "opacity": "medium"}}
                >
                    <StatusWarning/>
                    <Text size="xsmall">Password mismatch!</Text>
                </Box>
            );
        } else bmcPasswordMismatch = "";

        let nodes = [{
            value: 'mars',
            label: 'Mars',
            children: [
                {value: 'phobos', label: 'Phobos'},
                {value: 'deimos', label: 'Deimos'},
            ],
        }];

        if (this.state.discoveredData.hasOwnProperty('result')) {
            nodes = [this.state.discoveredData['result']]
        }

        return (
            <Box id="top2" fill="vertical" overflow="auto" align="start" flex="grow" justify="start" direction="column"
                 pad="large">
                <div>
                    <Header>
                        <Heading level={4} size="small" strong={true}>Create Server Pool</Heading>
                    </Header>
                    <Box justify='start' direction='column' align='stretch' gap='medium' pad='small' elevation='medium'
                         responsive wrap>
                        <FormField label="Name">
                            <TextInput id="name"
                                       onChange={(event) => {
                                           this.setState({"poolName": event.target.value})
                                       }}
                            />
                        </FormField>
                        <FormField label="Method">
                            <Select
                                id="select"
                                name="select"
                                placeholder="Select"
                                value={this.state.method}
                                options={['BMC - Redfish', 'HPE OneView', 'Dell OpenManage']}
                                onChange={this.onSelectMethod}
                            />
                        </FormField>
                    </Box>
                    <Header>
                        <Heading level={4} size="small" strong={true}>Reference Server</Heading>
                    </Header>
                    <Box justify='start' direction='column' align='stretch' gap='medium' pad='small' elevation='medium'
                         responsive wrap>
                        <Box direction="row" responsive wrap align="center">
                            <FormField label='BMC IP Address'>
                                <TextInput
                                    id="iloipaddr"
                                    type="text"
                                    onChange={this._handleHostDetailsChange}
                                    value={this.state.refServerData.bmcIPAddr}
                                />
                            </FormField>
                            <CheckBox label="Add to Pool" checked={false}></CheckBox>
                        </Box>
                        <FormField label='BMC User'>
                            <TextInput
                                id="ilouser"
                                type="text"
                                onChange={this._handleHostDetailsChange}
                                value={this.state.refServerData.bmcUser}
                            />
                        </FormField>
                        <FormField label='BMC Password'>
                            <TextInput type="password"
                                       id="ilopassword"
                                       onChange={this._handleHostDetailsChange}
                                       value={this.state.refServerData.bmcPassword}
                            />
                        </FormField>
                        <FormField label='Confirm BMC Password'>
                            <TextInput type="password"
                                       id="confirmilopassword"
                                       onChange={this._handleHostDetailsChange}
                                       value={this.state.refServerData.confirmilopassword}
                            />
                        </FormField>
                        {bmcPasswordMismatch}
                    </Box>
                    <br/>
                    <Box direction="row" align='center' gap='small' justify='center' round='small' pad={'xsmall'}
                         background={{'color': 'brand'}} onClick={this.handleDiscover}>
                        {this.state.discoveryWait && (
                            <Spinner
                                border={[
                                    {side: 'all', color: 'white', size: 'medium'},
                                    {side: 'right', color: 'brand', size: 'medium'},
                                    {side: 'top', color: 'white', size: 'medium'},
                                    {side: 'left', color: 'brand', size: 'medium'},
                                ]}
                            />
                        )}
                        {!this.state.discoveryWait && (<Actions size={'medium'}/>)}
                        <Text label='Discover' size='medium' weight='bold' margin="xsmall"
                              disabled={this.state.discoveryWait}
                        >Discover</Text>
                    </Box>
                    {error_message}
                    <br/>
                </div>
                <div>
                    <Heading level={4} size="small" strong={true}>Matching Rules</Heading>
                    <Box justify='start' direction='column' align='start' gap='medium' pad='small' elevation='medium'
                         responsive wrap>
                        <ReactJson
                            src={this.state.discoveredData}
                            margin="small"
                            collapsed={1}
                            theme="summerfruit:inverted"
                            displayDataTypes={false}
                        />
                    </Box>
                    {error_message}
                    <br/>
                    <Footer pad={{vertical: 'medium'}} justify="between">
                        <Button label='Create'
                                primary={true}
                                onClick={this.onCreatePool}
                        />
                        <Button label='Cancel'
                                primary={false}
                                onClick={this.handleCancel}
                        />
                    </Footer>
                </div>
            </Box>
        )
    }
}

ResPoolAdd.defaultProps = {
    error: undefined,
    servers: {}
};

ResPoolAdd.propTypes = {
    dispatch: PropTypes.func,
    error: PropTypes.object,
    pools: PropTypes.object
};

ResPoolAdd.contextTypes = {
    intl: PropTypes.object,
    dispatch: PropTypes.func,
    error: PropTypes.object,
    pools: PropTypes.object,
    router: PropTypes.object
};

const select = state => ({...state.pools});

export default connect(select)(ResPoolAdd);
