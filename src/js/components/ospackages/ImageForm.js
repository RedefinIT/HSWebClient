
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { loadImageOsTypes, unloadImage } from '../../actions/image';
import {
  Header,
  Heading,
  Anchor,
  Form,
  Footer,
  FormField,
  Button,
  Select,
  Box,
  Meter,
  Text,
  TextInput,
  Tip
} from 'grommet';
import {Value} from "grommet-controls"
import { Close as CloseIcon, Trash as TrashIcon } from 'grommet-icons';
import ImageRemove from './ImageRemove';
import Notification1 from '../Notification1';



class ImageForm extends Component {

  constructor (props) {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onFileChange = this._onFileChange.bind(this);
    this._onOsTypeSearch = this._onOsTypeSearch.bind(this);
    this._onOsTypeChange = this._onOsTypeChange.bind(this);
    this._onRemoveOpen = this._onRemoveOpen.bind(this);
    this._onRemoveClose = this._onRemoveClose.bind(this);

    this.state = {
      errors: {},
      image: { ...props.image },
      uploads: [],
      removing: false,
      uploading: false,
      closeOnSubmit: false,
      fileInputDisable: false
    };
  }

  componentDidMount () {
    this.setState({closeOnSubmit: false});
    this.props.dispatch(loadImageOsTypes());
  }

  componentWillUnmount() {
    this.setState({closeOnSubmit: false});
    this.props.dispatch(unloadImage());
  }

  _onClose(event) {
    //console.log("_onClose: ");

    this.props.onClose();
  }

  _onSubmit (event) {
    console.log("_onSubmit: ", this.state.image);
    // if(this.state.uploading === true)
    //   return

    event.preventDefault();
    let errors = {};
    let noErrors = true;
    console.log("before!")
    let file = this.refs.file.files[0];
    console.log("after!")
    if (! file) {
      errors.file = 'required';
      noErrors = false;
    }
    if (noErrors) {
      this.props.onSubmit(this.state.image, file);
      this.setState({ uploading: true, fileInputDisable: true });
    } else {
      this.setState({ errors: errors });
    }
  }

  _onChange (event) {
    var image = { ...this.state.image };
    var errors = { ...this.state.errors };
    const attribute = event.target.getAttribute('name');
    const value = event.target.value;
    image[attribute] = value;
    delete errors[attribute];
    this.setState({ image: image, errors: errors });
  }

  _onFileChange () {
    let file = this.refs.file.files[0];
    let name = this.refs.name.value;
    if (! name) {
      if (file) {
        let image = { ...this.state.image };
        image.name = file.name;
        image.file = file.name;
        this.setState({ image: image });
      }
    }
    this.setState({ fileName: file.name });
  }

  _onOsTypeSearch (event) {
    const osTypeSearchText = event.target.value;
    this.props.dispatch(loadImageOsTypes(osTypeSearchText));
  }

  _onOsTypeChange (pseudoEvent) {
    let image = { ...this.state.image };
    image.osType = pseudoEvent.option;
    this.setState({ image: image });
  }

  _onRemoveOpen () {
    this.setState({removing: true});
  }

  _onRemoveClose () {
    this.setState({removing: false});
  }

  render () {
    //console.log("render: ", this.props);
    //console.log("render: ", this.props.osTypes);
    let { image, fileName, errors } = this.state;
    let { osTypes, uploads } = this.props;
    const osType = image.osType || {};

    // osTypes.push("Firmware Bundle");

    // console.log("State: ", this.state);
    // console.log("Props: ", this.props);
    // console.log("Image: ", image);
    // console.log("osTypes: ", osTypes);
    // console.log("uploads: ", uploads);

    let osTypeField;
    // if (fileName && fileName.slice(-3).toLowerCase() === 'iso') {
    osTypeField = (
      <Tip content="Specify image type" dropProps={{ align: { left: 'right' } }}>
        <FormField htmlFor="osType" label="Image Type"
                   error={errors.osType}>
          <Select id="osType" name="osType"
                  value={image.osType}
                  options={osTypes}
                  onChange={this._onOsTypeChange}/>
        </FormField>
      </Tip>
    );
    // }

    let removeControl;
    if (this.props.removable) {
      removeControl = (
        <Button icon={<TrashIcon />} label="Remove" onClick={this._onRemoveOpen}
                a11yTitle={`Remove ${image.name} Image`} plain={true} />
      );
    }

    let removeConfirm;
    if (this.state.removing) {
      removeConfirm = (
        <ImageRemove image={image} onClose={this._onRemoveClose} />
      );
    }

    let progress = "";
    let notification = "";

    let screenButton = (<Button type="button" primary={true} label={this.props.submitLabel}
                                onClick={this._onSubmit} />);

    if (this.state.uploading) {
      // let uploadprogress = uploads.find( ({ file }) => file === this.state.image.name );
      let uploaditem = undefined;
      for (let i=0; i < uploads.length; i++) {
        // console.log("render: uploads[i]: ", uploads[i]);
        if (uploads[i].file === this.state.image.file) {
          // console.log("render: uploads[i]: found ", uploads[i]);
          uploaditem = uploads[i];
          break;
        }
      }
      //console.log("uploaditem: ", uploaditem);

      if(uploaditem) {
        if(uploaditem.state === "Uploaded"){
          screenButton = (<Button type="button" primary={true} label="Close"
                                  onClick={this._onClose} />);

          notification = (
              <Notification1 message='Uploaded successfully' status='ok'
              />
            );

          progress = (
            <Box  margin='medium' direction="column">
              <Value value={uploaditem.percent}
                     units='%'
                     size='small'
                     align='start' />
              <Meter color="status-ok" background="status-unknown" type="bar" value={uploaditem.percent} />
              <Text>{'Upload complete for the file ' + uploaditem.file}</Text>
            </Box>
          );

        }
        else if(uploaditem.state === "Uploading"){

          screenButton = (<Button type="button" primary={false} label={this.props.submitLabel}
          />);

          progress = (
            <Box  margin='medium' direction="column">
              <Value value={uploaditem.percent}
                     units='%'
                     size='small'
                     align='start' />
              <Meter color="status-ok" background="status-unknown" type="bar" value={uploaditem.percent} />
              <Text>{'Uploading the file ' + uploaditem.file}</Text>
            </Box>
          );

        }
        else if(uploaditem.state === "Failed"){

          //console.log("uploaditem:2 ", this.props.submitLabel);
          screenButton = (<Button type="button" primary={false} label={this.props.submitLabel}/>);

          notification = (<Notification1 status='critical' message={uploaditem.error}/>);

          progress = (
            <Box  margin='medium' direction="column">
              <Value value={uploaditem.percent}
                     units='%'
                     size='small'
                     align='start' />
              <Meter color="status-ok" background="status-unknown" type="bar" value={uploaditem.percent} />
              <Text>{'Failed to upload the file ' + uploaditem.file}</Text>
            </Box>
          );

        }
      }
      else {
        progress = (
          <Box  margin='medium' direction="column">
            <Value value={0}
                   units='%'
                   size='small'
                   align='start' />
            <Meter color="status-ok" background="status-unknown" type="bar" value={0} />
            <Text>{'Nothing to upload...'}</Text>
          </Box>
        );

      }
    }

    return (
      <Box id="top2" fill="vertical" overflow="auto" align="start" justify="start" direction="column" pad="large" margin='medium' >
        <Header fill='horizontal'>
          <Heading level={4} margin="none" strong={true}>
            {this.props.heading}
          </Heading>
          <Button onClick={this._onClose} icon={<CloseIcon />}
                  a11yTitle={`Close ${this.props.heading} Form`}/>
        </Header>
        {notification}
        <br/>
        <div>
          <FormField htmlFor="name" label="Image Name" error={errors.name}
                     help="(If not specified, the file name will be used.)">
            <TextInput ref="name" id="name" name="name" type="text"
                       value={image.name || ''} onChange={this._onChange} />
          </FormField>
          <Tip content="Select image file for upload" dropProps={{ align: { left: 'right' } }}>
            <FormField label="Image (ISO format)" htmlFor="file" error={errors.file}>
              <Box pad="small">
                <input ref="file" id="file" name="file" type="file" disabled={this.state.fileInputDisable}
                       onChange={this._onFileChange} />
              </Box>
              {progress}
            </FormField>
          </Tip>
          {osTypeField}
        </div>
        <Footer pad={{vertical: 'medium'}} justify="between">
          {screenButton}
          {removeControl}
        </Footer>
        {removeConfirm}
      </Box>
    );
  }
}

ImageForm.contextTypes = {
  router: PropTypes.object
};

ImageForm.propTypes = {
  busyMessage: PropTypes.string,
  heading: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  removable: PropTypes.bool,
  uploads: PropTypes.arrayOf(PropTypes.object),
  submitLabel: PropTypes.string.isRequired,
  osTypes: PropTypes.arrayOf(PropTypes.string)
};

let select = (state, props) => {
  // console.log("ImageForm select: state: ", state);
  // console.log("ImageForm select: props: ", props);
  return {
    uploads: state.image.uploads,
    osTypes: state.image.osTypes
  };
};

export default connect(select)(ImageForm);
