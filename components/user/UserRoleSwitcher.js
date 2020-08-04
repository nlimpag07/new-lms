import React, { useState, useEffect } from "react";
import { Radio, Form, Modal } from "antd";

import { useAuth } from "../../providers/Auth";

const UserRoleSwitcher = ({ visible, onCancel }) => {
  const { isUsertype, setUsertype, userDetails } = useAuth();
  const { isAdministrator, isInstructor } = userDetails;
  const [value, setValue] = useState(isUsertype);
  const [form] = Form.useForm();

  
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    onCancel()
  };

  var curRole;

  useEffect(() => {
    //console.log(isUsertype);
    const { isAdministrator, isInstructor } = userDetails;
    //console.log(isAdministrator);
  }, []);

  return (
    <Modal
      id="switchview-modal"
      title="Switch View"
      centered
      visible={visible}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      onCancel={onCancel}
      maskClosable={false}
      destroyOnClose={true}
      width={450}
    >
      <Form
        form={form}
        layout="vertical"
        name="switchRoleForm"
        initialValues={{
          switchrole: value,
        }}
      >
        <Form.Item
          name="switchrole"
          className="collection-create-form_last-form-item"
        >
          <Radio.Group>
            <Radio value="learner">
              Learner{isUsertype == "learner" ? " (current)" : ""}
            </Radio>
            <Radio value="instructor">
              Instructor{isUsertype == "instructor" ? " (current)" : ""}
            </Radio>
            {isAdministrator == 1 ? (

               <Radio value="admin">
              Admin{isUsertype == "admin" ? " (current)" : ""}
            </Radio>
            ):(
              <></>
            )}
           
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default UserRoleSwitcher;
