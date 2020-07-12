import { Layout, Row, Col, Form, Input, Button, Checkbox } from "antd";

import withoutAuth from "../hocs/withoutAuth";
import { useAuth } from "../providers/Auth";

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

export default withoutAuth(function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { setAuthenticated } = useAuth();
  const submitHandler = async () => {
    //event.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.status === 200) {
      setAuthenticated(true);
    } else {
      console.error("Login error", response);
    }
  };
  const onFinish = (values) => {
    submitHandler(values);
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
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
                name="basic"
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
                    <Input />
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
                    <Input.Password />
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
              </Form>
            </div>
            {/* <form onSubmit={submitHandler} >
              <div>
                <label>
                  Username{" "}
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Password{" "}
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>
              <button type="submit">Login</button>
            </form> */}
          </div>
        </Col>
      </Row>
      <style jsx global>{``}</style>
    </Layout>
  );
});
