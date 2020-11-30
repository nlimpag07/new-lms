import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, notification, Divider, List } from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import DateFormatter from "../../dateFormatter/DateFormatter";
const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const Notifications = () => {
  const [notifCount, setNotifCount] = useState(0);
  const [notiList, setNotiList] = useState([]);

  useEffect(() => {
    var config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    axios.get(apiBaseUrl + "/Dashboard/Notifications", config).then((res) => {
      var _res = res.data;

      if (_res.result.length) {
        setNotifCount(_res.totalRecords);
        console.log("res", _res);

        let ddata = _res.result
          ? _res.result.map((noti, index) => {
              let notifData = {
                key: index,
                id: noti.id,
                userId: noti.userId,
                isOpen: noti.isOpen,
                createdAt: noti.createdAt,
                auditTrailId: noti.auditTrailId,
                auditTrailAction: noti.auditTrail.action,
                auditTrailDescription: noti.auditTrail.description,
              };
              return notifData;
            })
          : [];
        //console.log("new Data", ddata);
        setNotiList(ddata);
      }
    });
    /* async function fetchData(config) {
      try {
        const response = await axios(config);
        if (response) {
          //setOutcomeList(response.data.result);
          let theRes = response.data.result;
          console.log("Notification Response", response.data);
          // wait for response if the verification is true
          if (theRes) {
            //console.log(theRes)

            
          } else {
            
          }
        }
      } catch (error) {
        const { response } = error;
        //const { data } = response; // take everything but 'request'

        console.log("Error Response", response);

        Modal.error({
          title: "Error: Unable to Retrieve data",
          content: response + " Please contact Technical Support",
          centered: true,
          width: 450,
          onOk: () => {
            //setdrawerVisible(false);
            visible: false;
          },
        });
      }
      //setLoading(false);
    }
    fetchData(config); */
  }, []);

  const openNotification = (e) => {
    e.preventDefault();

    const desc = (
      <div>
        <Divider style={{ marginTop: "0", marginBottom: "0" }} />
        <div className="Listcontainer">
          <List
            size="small"
            itemLayout="horizontal"
            dataSource={notiList}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Badge
                      status={
                        item.auditTrailAction == "Add"
                          ? "success"
                          : item.auditTrailAction == "Delete"
                          ? "error"
                          : "default"
                      }
                      text={DateFormatter(item.createdAt)}
                    />
                  }
                  /* title={item.auditTrailDescription} */
                  description={item.auditTrailDescription}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    );
    const args = {
      message: <h4>Notifications ({notifCount})</h4>,
      description: desc,
      duration: 0,
    };
    notification.open(args);
  };

  return (
    <>
      <Link href="#">
        <a onClick={openNotification}>
          <Badge size="small" count={notifCount} overflowCount={99}>
            <FontAwesomeIcon icon={["fas", "bell"]} size="lg" />
          </Badge>
        </a>
      </Link>

      <style jsx global>{`
        .ant-layout-header {
          color: #ffffff;
        }
        .header-nav-top .nav-top-right ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .ant-layout-header .header-nav-top {
          text-align: center;
        }
        .header-nav-top .nav-top-right ul li {
          display: inline-block;
          width: 27%;
          text-align: center;
        }
        .header-nav-top .nav-top-right ul li a,
        .header-nav-top .nav-top-right ul li a:active,
        .header-nav-top .nav-top-right ul li a:focus,
        .header-nav-top .nav-top-right ul li a:visited {
          color: #ffffff;
          text-decoration: none;
        }
        .header-nav-top .nav-top-right ul li a:hover {
          color: #fdb813;
        }
        .ant-layout-header .header-nav-bot .nav-bot-left {
          padding: 0 15px;
        }
        .ant-layout-header .header-nav-bot .nav-bot-right .right-shape {
          color: #000000;
          padding: 0 15px;
        }
        .ant-badge {
          display: inline;
        }
        .ant-badge-dot {
          box-shadow: none;
        }
        .ant-badge-count {
          font-size: 8px;
          line-height: 16px;
          height: 16px;
          padding: 0 3px;
        }
        .Listcontainer {
          height: 60vh;
          overflow: auto;
        }
        .Listcontainer .ant-list-item {
          padding: 8px 0;
        }
      `}</style>
    </>
  );
};

export default Notifications;
