
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { loadItem } from '../../actions/item';
import { updateImage } from '../../actions/ospackages';
import {Form, Footer, Header, Heading, Anchor, TextInput, FormField, Button, Box, Tip} from 'grommet';
import { Close as CloseIcon, Trash as TrashIcon } from 'grommet-icons';
import ImageRemove from './ImageRemove';
import { deleteImage } from '../../actions/image';
import { useHistory } from "react-router-dom";
import history from '../../history';

class ImageEdit extends Component {

  constructor (props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this._onRemove = this._onRemove.bind(this);
    this._onRemoveOpen = this._onRemoveOpen.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onRemoveClose = this._onRemoveClose.bind(this);
    this._onSubmit = this._onSubmit.bind(this);

    this.state = {
      errors: {},
      removing: false
    };
  }

  onClose() {
    //console.log("onClose: ")

    //console.log("history.location: ", history)

    history.push({
      pathname: '/ui/images'
    });
  }
  _onRemoveOpen () {
    this.setState({removing: true});
  }

  _onRemoveClose () {
    this.setState({removing: false});
  }

  _onRemove(){
    //console.log("ImageEdit: _onRemove")
    this.props.dispatch(deleteImage({ category: 'ospackage', sort: 'name:asc' }, file));
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

  componentDidMount () {
    //console.log("ImageEdit componentDidMount: ", this.props.uri);
    //console.log("ImageEdit componentDidMount: props: ", this.props);

    this.props.dispatch(loadItem("/rest/ospackage/" + this.props.uri, false));
  }

  componentWillUnmount () {
    // this.props.dispatch(unloadItem(this.props.image, false));
  }

  _onSubmit (image, file) {
    // let history = useHistory();
    // this.props.dispatch(updateImage(image, file));
    history.push({
      pathname: '/ui/images',
    });
    // window.location.href = '/ui/images';
  }

  render () {
    const { item, image} = this.props;
    //console.log("ImageEdit render: image: ", image);
    let removeControl;
    // if (this.props.removable) {
    if (true) {
      removeControl = (
        <Button icon={<TrashIcon />} label="Remove" onClick={this._onRemoveOpen}
                a11yTitle={`Remove ${image.name} Image`} plain={true} />
      );
    }
    let removeConfirm;
    if (this.state.removing) {
      removeConfirm = (
        <ImageRemove image={image} onClose={this._onRemoveClose} onSubmit={this._onRemove} />
      );
    }

    return (
      <Box id="top2" fill="vertical" overflow="auto" align="start" flex="grow"  justify="start" direction="column" pad="large"  >
        <Form onSubmit={this._onSubmit}>
          <Header size="large" justify="between" pad="none">
            <Heading level={4} margin="none" strong={true}>
              Edit Image Details
            </Heading>
            <Anchor onClick={this.onClose} icon={<CloseIcon />}
                    a11yTitle={`Close ${image.package} Form`}/>
          </Header>
          <div>
            <Tip content={image['package'] || ''} dropProps={{ align: { left: 'right' } }}>
              <FormField htmlFor="name" label="Image Name">

                  <TextInput ref="name" id="name" name="name" type="text"
                             value={image['package'] || ''} onChange={this._onChange} />
              </FormField>
            </Tip>
            <FormField htmlFor="ostype" label="Image Type">
                <TextInput ref="ostype" id="ostype" name="ostype" type="text"
                       value={image['osType'] || ''} onChange={this._onChange} />
              </FormField>
            <Tip content={image['ISO_http_path'] || ''} dropProps={{ align: { left: 'right' } }}>
              <FormField htmlFor="isopath" label="Image File (ISO format) ">
                <TextInput readOnly ref="ostype" id="ostype" name="ostype" type="text"
                           value={image['ISO_http_path'] || ''}  />
              </FormField>
            </Tip>
          </div>
          <Footer pad={{vertical: 'medium'}} justify="between">
            <Button primary={true} label="Save"/>
            {removeControl}
          </Footer>
        </Form>
        {removeConfirm}
      </Box>
    );
  }
}

ImageEdit.propTypes = {
  changing: PropTypes.bool.isRequired,
  image: PropTypes.object,
  uri: PropTypes.string
};

ImageEdit.contextTypes = {
  router: PropTypes.object
};

let select = (state, props) => {
  //console.log("ImageEdit select: state: ", state);
  //console.log("ImageEdit select: props: ", props);
  //console.log("ImageEdit select: props: ", window.location.pathname);
  //console.log("ImageEdit select: props uri: ", window.location.pathname.substr("/ui/images/edit/".length));
  return {
    changing: state.item.changing,
    image: state.item.item || {},
    uri: window.location.pathname.substr("/ui/images/edit/".length)
  };
};

export default connect(select)(ImageEdit);
