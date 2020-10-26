import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumb } from "antd";
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
            <a href={`/${path}`}>{path}</a>
          </Breadcrumb.Item>
        );
      //console.log("/", path, " ", index);

      case 2:
        return (
          <Breadcrumb.Item key={index}>
            <a href={`/${pathname[1]}/${pathname[2]}`}>{path}</a>
          </Breadcrumb.Item>
        );
      //console.log("/", pathname[1], "/", path, " ---", index);

      case 3:
        return (
          <Breadcrumb.Item key={index}>
            <a href={`/${pathname[1]}/${pathname[2]}/${pathname[3]}`}>{path}</a>
          </Breadcrumb.Item>
        );
        console.log(
          pathname[0],
          "/",
          pathname[1],
          "/",
          pathname[2],
          "/",
          path,
          " ---",
          index
        );

      case 4:
        return (null);
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
              {path}
            </a>
          </Breadcrumb.Item>
        );
      case 7:
        <Breadcrumb.Item key={index}>
            <a
              href={`/${pathname[1]}/${pathname[2]}/${pathname[3]}/${pathname[4]}/${pathname[5]}/${pathname[6]}/${pathname[7]}`}
            >
              {path}
            </a>
          </Breadcrumb.Item>
      case 8:
        <Breadcrumb.Item key={index}>
            <a
              href={`/${pathname[1]}/${pathname[2]}/${pathname[3]}/${pathname[4]}/${pathname[5]}/${pathname[6]}/${pathname[7]}/${pathname[8]}`}
            >
              {path}
            </a>
          </Breadcrumb.Item>
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
    <Breadcrumb style={{ margin: "16px" }} separator=">">
      {pathn}
      {/* <div className="breadcrumbs">
      <div>{pathname}</div>
      <style jsx>{`
        .breadcrumbs ul {
          list-style: none;
          padding: 0;
          display: inline-flex;
        }
        .breadcrumbs ul li {
          display: inline-block;
          width: 27%;
          text-align: center;
        }
        .breadcrumbs ul li a,
        .breadcrumbs ul li a:active,
        .breadcrumbs ul li a:focus,
        .breadcrumbs ul li a:visited {
          color: #ffffff;
          text-decoration: underline;
        }
        .breadcrumbs ul li a:hover {
          color: #fdb813;
        }
      `}</style>
    </div> */}
    </Breadcrumb>
  );
};

export default BreadCrumbs;
