import React from "react";
import ReactDOM from "react-dom";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  ButtonGroup,
  DropDownButton,
  DropDownButtonItem,
  SplitButton,
  SplitButtonItem,
  Toolbar,
  ToolbarItem,
} from "@progress/kendo-react-buttons";
import { Carousel } from "antd";

const Banner = () => {
  return (
    <div className="banner">
      <div>
        <div>
          <Carousel>
            <div>
              <h3>1</h3>
            </div>
            <div>
              <h3>2</h3>
            </div>
            <div>
              <h3>3</h3>
            </div>
            <div>
              <h3>4</h3>
            </div>
          </Carousel>
        </div>
        <div>
          <Button primary={true}>My Button with KendoReact styles</Button>
        </div>
      </div>
      <style jsx global>{`
        .banner {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          position:absolute;
          height:200px;
        }
        .ant-carousel .slick-slide {
          text-align: center;
          height: 160px;
          line-height: 160px;
          background: #364d79;
          overflow: hidden;
        }

        .ant-carousel .slick-slide h3 {
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Banner;
