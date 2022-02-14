import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Box, Form, FormField, Header, Heading, Footer, Button, Layer, Text} from 'grommet';
import {EmptyCircle as BusyIcon, StatusCritical, StatusGood} from 'grommet-icons';

export default class Notification1 extends Component {

  constructor (props) {
    super(props);
  }



  render () {
    const { message, status, state, timeStamp, sizeLevel, margin } = this.props;

    //console.log("Notification1 render: ", this.props)

    let background = "";
    let icon = "";
    let message1 = "";
    if(status === "ok"){
      background={"color":"status-ok"};
      icon = <StatusGood></StatusGood>;
      message1 = "Image uploaded successfully!";
    }
    else if(status === "error"){
      background={"color":"status-critical"};
      icon = <StatusCritical></StatusCritical>;
      message1 = "Image upload failed!";
    }
    else if(status === "critical"){
      background={"color":"status-critical"};
      icon = <StatusCritical></StatusCritical>;
      message1 = "Image upload failed!";
    }

    const content = (
      <Box flex="grow" fill='horizontal' pad="small" background={background} >
          <Box direction="row" align="center" gap="small">
            {icon}
            <Text>{message}</Text>
          </Box>
      </Box>
    );

    return (
        <Box direction="row" fill="horizontal" >

          {content}
        </Box>
    );
  }
};

Notification1.propTypes = {
  compact: PropTypes.bool,
  onClose: PropTypes.func,
  secondaryControl: PropTypes.node,
};

Notification1.defaultProps = {
};
