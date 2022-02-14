/**
 * Created by avireddi on 12/18/2019.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Header,
    Heading,
    Form,
    FormField,
    Footer,
    Button,
    Box,
    TextInput,
    RadioButton,
    Main,
    Text,
    CheckBox, Spinner
} from 'grommet';
import {Actions, StatusWarning} from "grommet-icons";
import history from "../../history";
import {serverDiscovery} from "../../actions/pools";
import LayerForm from "../../components/LayerForm";

// import { getMessage } from 'grommet/utils/Intl';


const DEFAULT_FILE_INFO = {
    osType: "",
    file: "",
    name: ''
};


class ServerAdd extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errorMsg: "",
            fileInputDisable: false,
            discoveryOption: "manual",
            fileInfo: DEFAULT_FILE_INFO,
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

        this.handleDiscoveryOption = this.handleDiscoveryOption.bind(this);
        this._handleHostDetailsChange = this._handleHostDetailsChange.bind(this);
        this.handleDiscover = this.handleDiscover.bind(this);
        this._onFileChange = this._onFileChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        //console.log("ServerAdd: componentDidMount: ")
        // this.props.dispatch(loadDeployServers(this.initialState));
    }

    componentWillUnmount() {
        //console.log("ServerAdd: componentWillUnmount: ")
        // this.props.dispatch(unloadDeployServers());
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

    handleAdd() {
        // console.log('clicked');
        this.props.handleAddServer()
    }

    handleDiscover(event) {
        console.log("handleDiscover: ", this.state.refServerData)
        this.setState({discoveryWait: true});
        serverDiscovery(this.state.refServerData, (discoveredData) => {
            this.setState({'discoveredData': discoveredData, 'discoveryWait': false})
        });
    }

    handleDiscoveryOption(event) {
        //console.log("handleDiscoveryOption: ", event.target.name);
        // The below line gets a deep copy of the requested object instead of mutable object reference

        this.setState({"discoveryOption": event.target.name})

    }

    handleCancel() {
        history.goBack()
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
        console.log("render: ServerAdd: this.props: ", this.props);
        //console.log("render: ServerAdd: this.state: ", this.state);

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

        return (
            <LayerForm
                title="Add Server"
                titleTag={4}
                submitLabel="Submit "
                onClose={this.props.handleCancelAddServer}
                onSubmit={this.props.handleAddServer}
            >

            <Box id="top2" fill="vertical" overflow="auto" align="start" flex="grow"  justify="start" direction="column" pad="large"  >
              <Form  pad='large'>
                    <div>
                        {/*<Heading size="small" strong={false}  level="4" >Task Name</Heading>*/}
                        {/*<Heading tag="h4" strong={true} >Deployment Option</Heading>*/}
                        <FormField label="Options">
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
                                             disabled={true}
                                             onChange={this.handleDiscoveryOption} />
                                <RadioButton id='discover_json'
                                             name='discover_json'
                                             label='JSON'
                                             checked={this.state.discoveryOption === 'discover_json' ? true:false}
                                             disabled={true}
                                             onChange={this.handleDiscoveryOption} />
                            </Box>
                        </FormField>
                        {file_upload}

                        {(
                          <Box justify='start' direction='column'>
                              <Heading level={5}>Add Manually</Heading>
                          <Box justify='start' direction='column' align='stretch' gap='medium' pad='small' elevation='medium'
                               responsive wrap>
                              <FormField label='BMC IP Address'>
                                  <TextInput
                                    id="iloipaddr"
                                    type="text"
                                    onChange={this._handleHostDetailsChange}
                                    value={this.state.refServerData.bmcIPAddr}
                                  />

                              </FormField>
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
                            <Box direction="row" align='center' gap='small' justify='center' round='small'
                            background={{'color': 'brand'}} onClick={this.handleDiscover}>
                        {this.state.discoveryWait && (
                            <Spinner size='small'
                            border={[
                        {side: 'all', color: 'white', size: 'medium'},
                        {side: 'right', color: 'brand', size: 'medium'},
                        {side: 'top', color: 'white', size: 'medium'},
                        {side: 'left', color: 'brand', size: 'medium'},
                            ]}
                            />
                            )}
                        {!this.state.discoveryWait && (<Actions size='medium'/>)}
                            <Text label='Discover' size='medium' weight='bold'
                            disabled={this.state.discoveryWait}
                            >Discover</Text>
                            </Box>
                        {error_message}
                            <br/>
                          </Box>
                        )}


                    </div>
                    <Footer pad={{vertical: 'medium'}} justify="between">
                        <Button label='Add'
                                type='submit'
                                primary={true}
                                disabled={true}
                                onClick={this.handleAdd}
                        />
                        <Button label='Cancel'
                                type='reset'
                                primary={false}
                                disabled={false}
                                onClick={this.props.handleCancelAddServer}
                        />
                        {/*<Button label='Cancel'*/}
                        {/*primary={false}*/}
                        {/*onClick={this.handleClick}*/}
                        {/*/>*/}
                    </Footer>
                </Form>
          </Box>
            </LayerForm>
        );
    }
}

ServerAdd.defaultProps = {
    error: undefined,
};

ServerAdd.propTypes = {
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
};

ServerAdd.contextTypes = {
    intl: PropTypes.object
};

// const select = state => ({ ...state.deployservers });
const select = state => ({...state.pools});

export default connect(select)(ServerAdd);
