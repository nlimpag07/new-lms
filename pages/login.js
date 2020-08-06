import { Layout, Row, Col, Form, Input, Button, Checkbox, Select } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import withoutAuth from "../hocs/withoutAuth";
import { useAuth } from "../providers/Auth";
import Loader from "../components/theme-layout/loader/loader";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 0,
    span: 24,
  },
};

const apiBaseUrl = process.env.apiBaseUrl;

export default withoutAuth(function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuthenticated, setUsertype, setUserDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const submitHandler = async (values) => {
    //event.preventDefault();

    /*const userType =
       values.username == "admin"
        ? "admin"
        : values.username == "instructor"
        ? "instructor"
        : "learner";
    console.log(values) */

    axios
      .post(apiBaseUrl + "/auth/authenticate", values)
      .then((result) => {
        var _result = result.data;
        //console.log(_result)
        if (_result) {
          var userType;
          if (_result.isAdministrator == 1) {
            userType = "admin";
          } else if (_result.isInstructor == 1) {
            userType = "instructor";
          } else {
            userType = "learner";
          }

          var params = {
            userType: userType,
            token: _result.token,
          };
          Cookies.set("session", "1", {
            expires: 7,
            path: "/",
            SameSite: "lax",
          });
          Cookies.set("usertype", userType, {
            expires: 7,
            path: "/",
            SameSite: "lax",
          });
          Cookies.set("token", _result.token, {
            expires: 7,
            path: "/",
            SameSite: "lax",
          });
          setAuthenticated(true);
          setUsertype(userType);
          setUserDetails(_result);
          //console.log(params)
          /* axios.post("/api/login", params).then((res) => {
            var _res = res.data;
            //console.log(_res)
            if (_res.status === 200) {
              setAuthenticated(true);
              setUsertype(userType);
              setUserDetails(_result);
            }
          }); */
        } else {
          onFinishFailed(values);
          setError(
            "Login Failed: Please make sure to input the correct login details."
          );
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error.response.data);
        setError("Login Failed: " + error.response.data.message);
        //form.resetFields();
      });
    /* const response = await fetch("/api/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, userType }),
    });
    
    if (response.status === 200) {
      setAuthenticated(true);
      setUsertype(userType);

    } else {
      console.error("Login error", response);
    } */
  };
  const onFinish = (values) => {
    submitHandler(values);
    //console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  function onFocus() {
    setError("");
  }
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <Loader loading={loading}>
      <Layout className="login" style={{ minHeight: "100vh" }}>
        <Row style={{ minHeight: "100vh" }}>
          <Col className="logo-container" xs={24} sm={12} md={12}>
            <div className="logo-holder">
              <img
                id="left-logo"
                src="/images/fsxonline-logo.svg"
                alt="Fastrax Logo"
              />
            </div>
          </Col>
          <Col className="loginform-container" xs={24} sm={12} md={12}>
            <div className="loginform-banner">
              <img src="/images/fsxonline-logo.svg" alt="Fastrax Logo" />
            </div>
            <div className="loginform-holder">
              <div className="loginform-form">
                <h1>Login</h1>
                <Form
                  {...layout}
                  form={form}
                  name="basicLogin"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item>
                    <label className="login-label">Username</label>
                    <Form.Item
                      name="username"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input onChange={onFocus} />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item>
                    <label className="login-label">Password</label>
                    <Form.Item
                      noStyle
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password onChange={onFocus} />
                    </Form.Item>
                  </Form.Item>

                  <Form.Item
                    {...tailLayout}
                    name="remember"
                    valuePropName="checked"
                  >
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>

                  <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <div className="ant-form-item-has-error">
                      <div
                        className="ant-form-item-explain"
                        style={{
                          textAlign: "center",
                          textTransform: "capitalize",
                        }}
                      >
                        {error}
                      </div>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
        <style jsx global>{``}</style>
      </Layout>
    </Loader>
  );
});
