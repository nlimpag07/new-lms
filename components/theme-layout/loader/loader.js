import React, { Component } from "react";
import styled from "styled-components";

const loader = (
  <div className="mesh-loader">
    <div className="set-one">
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
    <div className="set-two">
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
  </div>
);

export default class Loader extends Component {
  render() {
    const { loading, children } = this.props;

    return (
      <div timeout={1000} className="fade">
        {loading ? loader : children}
        <style jsx global>{`
          .mesh-loader {
            overflow: hidden;
            height: 100%;
            width: 100%;
          }

          .mesh-loader .circle {
            width: 25px;
            height: 25px;
            position: absolute;
            /* background: #03A9F4; */
            border-radius: 50%;
            margin: -12.5px;
            -webkit-animation: mesh 2s ease-in-out infinite;
            animation: mesh 2s ease-in-out infinite -1s;
          }

          .mesh-loader > div .circle:last-child {
            -webkit-animation-delay: 0s;
            animation-delay: 0s;
          }
          
          .set-two .circle:first-child {
            background: #03A9F4;
          }
          .set-two .circle:last-child {
            background: #f4037d;
          }
          .set-one .circle:first-child {
            background: #f48803;
          }
          .set-one .circle:last-child {
            background: #f40303;
          }

          .mesh-loader > div {
            position: absolute;
            top: 50%;
            left: 50%;
          }

          .mesh-loader > div:last-child {
            -webkit-transform: rotate(90deg);
            transform: rotate(90deg);
          }

          @-webkit-keyframes mesh {
            0% {
              -webkit-transform-origin: 50% -100%;
              transform-origin: 50% -100%;
              -webkit-transform: rotate(0);
              transform: rotate(0);
            }
            50% {
              -webkit-transform-origin: 50% -100%;
              transform-origin: 50% -100%;
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
            }
            50.00001% {
              -webkit-transform-origin: 50% 200%;
              transform-origin: 50% 200%;
              -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
            }
            100% {
              -webkit-transform-origin: 50% 200%;
              transform-origin: 50% 200%;
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
            }
          }
          @keyframes mesh {
            0% {
              -webkit-transform-origin: 50% -100%;
              transform-origin: 50% -100%;
              -webkit-transform: rotate(0);
              transform: rotate(0);
            }
            50% {
              -webkit-transform-origin: 50% -100%;
              transform-origin: 50% -100%;
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
            }
            50.00001% {
              -webkit-transform-origin: 50% 200%;
              transform-origin: 50% 200%;
              -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
            }
            100% {
              -webkit-transform-origin: 50% 200%;
              transform-origin: 50% 200%;
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }
}
