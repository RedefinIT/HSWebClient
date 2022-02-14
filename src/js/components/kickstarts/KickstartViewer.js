
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
// import { refresh } from '../../actions/ospackages';
import { loadImageOsTypes} from '../../actions/image';
import {Box, Header, Anchor, Heading, Select, Main, Grid, Button, RadioButtonGroup} from 'grommet';
import AddIcon from 'grommet-icons/icons/Add';
import SyntaxHighlighter from 'react-syntax-highlighter';

import {loadScripts, clearKickstarts} from '../../actions/deployservers';
import {ClearOption, DocumentDownload, Upload} from "grommet-icons";
import {downloadFile} from "../../api/server-rest";
import {saveAs as FileSaveAs} from 'file-saver';

class KickstartViewer extends Component {

  constructor (props) {
    super(props);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.onScriptTypeChange = this.onScriptTypeChange.bind(this);
    this.handleFileDownload = this.handleFileDownload.bind(this);
    this.onSelectScript = this.onSelectScript.bind(this);
    this.onOSTypeChange = this.onOSTypeChange.bind(this);
    this.handleClearSelection = this.handleClearSelection.bind(this);
    this.state = { osType: "", scriptType: 'kickstart', script: "", postscript: '', scriptText: "" };
    this.script_types = [{label: 'Kickstart', value: 'kickstart'}, {label: 'Firstboot', value: 'firstboot'}];
  }

  componentDidMount () {
    this.props.dispatch(loadImageOsTypes());
  }

  onOSTypeChange(event) {
    //console.log("onOSTypeChange: ", event);
    this.setState({"osType": event.option, "script": "", "scriptText": ""})
    this.props.dispatch(clearKickstarts())
    this.props.dispatch(loadScripts(event.option));
  }

  onScriptTypeChange(event){
    //console.log("onScriptTypeChange: event.target: ")
    console.log("onScriptTypeChange: event.target: ", event.target)

    this.setState({"postscript": "", "script": "", "osType": "", "scriptText": ""})
    this.props.dispatch(clearKickstarts())

    this.setState({scriptType: event.target.value})
  }

  handleClearSelection(event) {
    this.setState({"script": "", "osType": "", "scriptText": ""})
    this.props.dispatch(clearKickstarts())
  }

  onSelectScript(event) {
    console.log("onSelectScript: ", event.option)

    this.setState({"script": event.option})
    //console.log(this.state)
    let url = '/rest/scripts/file/' + this.state.osType + "?file=" + event.option + "&type=" + this.state.scriptType;
    downloadFile(url, "text/plain")
      .then((response) => response.blob())
      .then((blob) => {
        blob.text().then(text => {
          this.setState({scriptText: text})
        })
      })
      .catch((err) => {
        //console.log("onKickstartSelect: err: ", err);
      })
  }

  handleFileUpload(){

  }

  handleFileDownload() {
    let ks_download_url = '/rest/scripts/file/' + this.state.osType + "?file=" + this.state.script;

    downloadFile(ks_download_url, "text/plain")
      .then((response) => response.blob())
      .then((blob) => {
        blob.text().then(text => {
          //console.log(text)
          // this.setState({scriptText: text})
          let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
          FileSaveAs(blob, this.state.script);
        })
      })
      .catch((err) => {
        //console.log("onKickstartSelect: err: ", err);
      })
  }

  _render_ks() {

    let {osTypes, screenData} = this.props;

    let scripts = [];

    if (this.state.scriptType === 'kickstart'){
      if (screenData.scripts && screenData.scripts['kickStarts']) {
        scripts = screenData['scripts']['kickStarts'];
      }
    }
    else if (this.state.scriptType === 'firstboot'){
      if (screenData.scripts && screenData.scripts['firstBoot']) {
        scripts = screenData['scripts']['firstBoot'];
      }
    }

    let ostPlaceHolderText = "Select OS Type";
    let ksPlaceHolderText = "Select Script";
    return (
      <Box gridArea="controls" direction="row" align="start" gap="small" round="xsmall" >
        <Header align="stretch" direction="row" justify="start" gap="xsmall" fill="horizontal" pad="xsmall" border={{"color": "background-contrast","style": "outset", "side": "horizontal"}} >
          <Select placeholder={ostPlaceHolderText}
                  plain
                  options={osTypes}
                  value={this.state.osType}
                  onChange={this.onOSTypeChange}
          />
          <Select placeholder={ksPlaceHolderText}
                  plain
                  options={scripts}
                  value={this.state.script}
                  onChange={this.onSelectScript}
          />
          <Button tip="Clear Selection" type="reset" icon={<ClearOption />} active onClick={this.handleClearSelection}/>
          <Button tip="Download Script" type="button" icon={<DocumentDownload />} disabled={this.state.scriptText?false:true} active onClick={this.handleFileDownload}/>
          <br/>
          <Button tip="Add Script" type="button" icon={<Upload />} active onClick={this.handleFileUpload}/>
        </Header>
      </Box>
    )
  }

  render () {
    console.log("KSIndex: this.props: ", this.props);
    //console.log("KSIndex: this.state: ", this.state);
    let {screenData} = this.props;

    //console.log("render: ", screenData['kickstarts']);

    let body = this._render_ks();

    return (
      <Box id="kv" fill="vertical" overflow="auto" align="start" flex="grow" justify="start" direction="column"
           pad="small">
        <Header pad={{"horizontal":"large"}}>
          <Heading level={3} size="small" strong={true}>Scripts</Heading>
        </Header>
        <Grid id="kvgrid" responsive={true} justify="stretch" fill
              rows={['auto','auto', 'flex']}
              columns={['full']}
              gap="small"
              areas={[
                { name: 'selection', start: [0, 0], end: [0, 0] },
                { name: 'controls', start: [0, 1], end: [0, 1] },
                { name: 'content', start: [0, 2], end: [0, 2] },
              ]}
        >
          <Box gridArea="selection" pad={{"horizontal":"large"}}>
            <RadioButtonGroup
              name="Script Type"
              options={this.script_types}
              value={this.state.scriptType}
              onChange={this.onScriptTypeChange}
            />
          </Box>
          {body}
          <Box gridArea="content" border={{"color": "background-contrast", "style":"inset","size":"xsmall"} } pad="small" fill>
            { this.state.scriptText && (
              <SyntaxHighlighter language="bash" showLineNumbers >
                {this.state.scriptText}
              </SyntaxHighlighter>
            )}
          </Box>
        </Grid>
      </Box>
    );
  }
}

KickstartViewer.defaultProps = {
  error: undefined,
  osTypes: []
};

KickstartViewer.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.object,
  osTypes: PropTypes.arrayOf(PropTypes.string)
};

KickstartViewer.contextTypes = {
  intl: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  osTypes: PropTypes.arrayOf(PropTypes.string)
};

// const select = state => ({ ...state.images });
let select = (state, props) => {
  //console.log("select state: ", state);
  return {
    deployServerSettings: state.deployservers.deployServerSettings,
    screenData: state.deployservers.screenData,
    osTypes: state.image.osTypes
  };
};

export default connect(select)(KickstartViewer);
