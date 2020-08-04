import { Layout} from "antd";

import withAuth from '../hocs/withAuth';
import withoutAuth from '../hocs/withoutAuth';

export default withoutAuth(function Profile() {
  return (
    <Layout>
      <h1>Profile</h1>
    </Layout>
  );
});
