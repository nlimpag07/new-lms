import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, notification, Divider, List, Avatar } from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import DateFormatter from "../../dateFormatter/DateFormatter";
const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");
const CancelToken = axios.CancelToken;
let cancel;

const Notifications = () => {
  const [notifCount, setNotifCount] = useState(0);
  const [notiList, setNotiList] = useState("");

  useEffect(() => {
    if (cancel !== undefined) {
      cancel();
    }
    var config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    };
    axios
      .get(apiBaseUrl + "/Dashboard/Notifications", config)
      .then((res) => {
        var _res = res.data;
        if (_res.result.length) {
          setNotifCount(_res.totalRecords);
          //console.log("res", _res);

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
      })
      .catch(function (error) {
        if (axios.isCancel(error)) {
          console.log("Request Cancelled by User");
        }
        console.error(error);
      });
  }, []);

  const openNotification = (e) => {
    e.preventDefault();

    const desc = (
      <div className="">
        <Divider style={{ marginTop: "0", marginBottom: "0" }} />
        <div className="notiListHolder">
          <List
            className="Listcontainer"
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
                  description={<a>{item.auditTrailDescription}</a>}
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
            <Avatar
              icon={<FontAwesomeIcon icon={["far", "bell"]} size="1x" />}
              style={{
                color: "#ebebeb",
                backgroundColor: "#707070",
              }}
            />
            {/* <FontAwesomeIcon icon={["fas", "bell"]} size="lg" /> */}
          </Badge>
        </a>
      </Link>

      <style jsx global>{`
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
        .notiListHolder {
          height: auto;
          overflow: hidden;
        }
        .Listcontainer {
          height: auto;
          overflow: auto;
        }
        .Listcontainer .ant-list-item {
          padding: 8px 0;
        }
        .Listcontainer .ant-list-item span {
          font-size: 10px;
        }
      `}</style>
    </>
  );
};

export default Notifications;
