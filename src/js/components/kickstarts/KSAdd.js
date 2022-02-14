
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { addImage } from '../../actions/image';

const DEFAULT_IMAGE = {
  osType: "",
  file: "",
  name: ''
};

class KSAdd extends Component {

  constructor () {
    super(props);
    this._onSubmit = this._onSubmit.bind(this);
    this._onClose = this._onClose.bind(this);
  }

  _onSubmit (image, file) {
    const { router } = this.context;

    //console.log("ImageAdd _onSubmit: image: ", image);
    //console.log("ImageAdd _onSubmit: file: ", file);

    this.props.dispatch(addImage(image, file));
    // router.push({
    //   pathname: '/images',
    //   search: document.location.search
    // });
  }

  _onClose () {
    const { router } = this.context;

    //console.log("ImageAdd _onClose:");

    // router.push({
    //   pathname: '/images',
    // });
    window.location.href = '/ui/images';
  }

  render () {
    return (
      <div/>
    );
  }
}

KSAdd.propTypes = {
  changing: PropTypes.bool.isRequired
};

KSAdd.contextTypes = {
  router: PropTypes.object
};

let select = (state, props) => {
  return {
    changing: state.item.changing
  };
};

export default connect(select)(KSAdd);
