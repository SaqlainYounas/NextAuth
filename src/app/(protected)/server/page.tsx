import {UserInfo} from "@/components/UserInfo";
import {currentUser} from "../../../../lib/auth";

const Server: React.FunctionComponent = async () => {
  const user = await currentUser();
  return <UserInfo user={user} label="Server Component" />;
};

export default Server;
