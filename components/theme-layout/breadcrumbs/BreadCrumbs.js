import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumb, Row, Col } from "antd";
import { useRouter } from "next/router";

const BreadCrumbs = () => {
  const router = useRouter();
  var pathname = router.asPath.split("/");

  let pathn = pathname.map((path, index) => {
    switch (index) {
      case 0:
        return (
          <Breadcrumb.Item key={index}>
            <a href={`/`}>Home</a>
          </Breadcrumb.Item>
        );
      //console.log("Home: / ", index);
      case 1:
        return (
          <Breadcrumb.Item key={index}>
            <a href={`/${path}`}>{path[0].toUpperCase() + path.substring(1)}</a>
          </Breadcrumb.Item>
        );
      //console.log("/", path, " ", index);
      case 2:
        return (
          <Breadcrumb.Item key={index}>
            <a href={`/${pathname[1]}/${pathname[2]}`}>
              {path[0].toUpperCase() + path.substring(1)}
            </a>
          </Breadcrumb.Item>
        );
      //console.log("/", pathname[1], "/", path, " ---", index);
      case 3:
        return (
          <Breadcrumb.Item key={index}>
            <a href={`/${pathname[1]}/${pathname[2]}/${pathname[3]}`}>
              {path[0].toUpperCase() + path.substring(1)}
            </a>
          </Breadcrumb.Item>
        );

      case 4:
        return null;
      /* return (
          <Breadcrumb.Item key={index}>
            <a
              href={`/${pathname[1]}/${pathname[2]}/${pathname[3]}/${pathname[4]}`}
            >
              {path}
            </a>
          </Breadcrumb.Item>
        ); 
        console.log(
          "/",
          pathname[1],
          "/",
          pathname[2],
          "/",
          pathname[3],
          "/",
          path,
          " ---",
          index
        );*/

      case 5:
        return (
          <Breadcrumb.Item key={index}>
            <a
              href={`/${pathname[1]}/${pathname[2]}/${pathname[3]}/${pathname[4]}/${pathname[5]}`}
            >
              {path[0].toUpperCase() + path.substring(1)}
            </a>
          </Breadcrumb.Item>
        );
        console.log(
          "/",
          pathname[1],
          "/",
          pathname[2],
          "/",
          pathname[3],
          "/",
          pathname[4],
          "/",
          path,
          " ---",
          index
        );

      case 6:
        return (
          <Breadcrumb.Item key={index}>
            <a
              href={`/${pathname[1]}/${pathname[2]}/${pathname[3]}/${pathname[4]}/${pathname[5]}/${pathname[6]}`}
            >
              {path[0].toUpperCase() + path.substring(1)}
            </a>
          </Breadcrumb.Item>
        );
      case 7:
        <Breadcrumb.Item key={index}>
          <a
            href={`/${pathname[1]}/${pathname[2]}/${pathname[3]}/${pathname[4]}/${pathname[5]}/${pathname[6]}/${pathname[7]}`}
          >
            {path[0].toUpperCase() + path.substring(1)}
          </a>
        </Breadcrumb.Item>;
      case 8:
        <Breadcrumb.Item key={index}>
          <a
            href={`/${pathname[1]}/${pathname[2]}/${pathname[3]}/${pathname[4]}/${pathname[5]}/${pathname[6]}/${pathname[7]}/${pathname[8]}`}
          >
            {path[0].toUpperCase() + path.substring(1)}
          </a>
        </Breadcrumb.Item>;
      default:
        break;
    }
  });

  //pathname = pathname.slice(1);
  /* pathname[0] == pathname[1] ? (pathname = pathname.slice(1)) : "";
  pathname = pathname.map((path, index) =>
    path == "" ? (
      <Breadcrumb.Item key={index}>
        <a href={`/`}>Home</a>
      </Breadcrumb.Item>
    ) : (
      <Breadcrumb.Item key={index}>
        <Link href={`/${path}/[CourseId]`} as={`/${path}`}>
          <a>{path}</a>
        </Link>
      </Breadcrumb.Item>
    )
  ); */
  return (
    <Row>
      <Col style={{ padding: "16px" }}>
        <Breadcrumb separator=">">{pathn}</Breadcrumb>
      </Col>
    </Row>
  );
};

export default BreadCrumbs;
