import React from "react";
import { Row, Col } from "antd";
import ReactDOM from "react-dom";
import "@progress/kendo-react-charts";
import "@progress/kendo-react-popup";
import { ComboBox, DropDownList } from "@progress/kendo-react-dropdowns";
import "@progress/kendo-react-inputs";
import "@progress/kendo-react-intl";
import "@progress/kendo-data-query";
import "@progress/kendo-drawing";
import "@progress/kendo-file-saver";
import {
  Chart,
  ChartTitle,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
} from "@progress/kendo-react-charts";

const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const Graph = () => {
  return (
    <Col
      className="gutter-row widget-holder-col"
      xs={24}
      sm={24}
      md={16}
      lg={16}
    >
      <Row className="widget-header-row" justify="start">
        <Col xs={23}>
          <h3 className="widget-title">Graph</h3>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ padding: "10px 0" }}>
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
          <Chart>
            <ChartTitle text="Student's Data" />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem
                title={{ text: "Months" }}
                categories={categories}
              />
            </ChartCategoryAxis>
            <ChartSeries>
              <ChartSeriesItem
                type="line"
                data={[123, 276, 310, 212, 240, 156, 98]}
              />
              <ChartSeriesItem
                type="line"
                data={[165, 210, 287, 144, 190, 167, 212]}
              />
              <ChartSeriesItem
                type="line"
                data={[56, 140, 195, 46, 123, 78, 95]}
              />
            </ChartSeries>
          </Chart>
        </Col>
      </Row>
      <style jsx global>{`
        .example-wrapper {
          min-height: 280px;
          align-content: flex-start;
        }
        .example-wrapper p,
        .example-col p {
          margin: 20px 0 10px;
        }
        .example-wrapper p:first-child,
        .example-col p:first-child {
          margin-top: 0;
        }
        .example-col {
          display: inline-block;
          vertical-align: top;
          padding-right: 20px;
          padding-bottom: 20px;
        }
        .example-config {
          margin: 0 0 20px;
          padding: 20px;
          background-color: rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .event-log {
          margin: 0;
          padding: 0;
          max-height: 100px;
          overflow-y: auto;
          list-style-type: none;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background-color: white;
        }
        .event-log li {
          margin: 0;
          padding: 0.3em;
          line-height: 1.2em;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        .event-log li:last-child {
          margin-bottom: -1px;
        }
      `}</style>
    </Col>
  );
};

export default Graph;
