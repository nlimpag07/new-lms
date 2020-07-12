import React, { Component } from "react";
import { CSSTransition } from "react-transition-group";
import Lottie from 'react-lottie';
import animationData from "./animations/blocks.json";
import styled from "styled-components";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;

const loader = (
  <Wrapper>
    
    <Lottie options={defaultOptions} width={250} isClickToPauseDisabled={true} /><h5 style={{ margin: '0' }}>Loading</h5>
  </Wrapper>
);

export default class Loader extends Component {
  render() {
    const { loading, children } = this.props;

    return (
      <CSSTransition timeout={1000} classNames="fade">
        {loading ? loader : children}
      </CSSTransition>
    );
  }
}
