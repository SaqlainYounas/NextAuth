//This component will become server or client based on its parent. e-g if the parent component is a server component this component will become a server component, however if the parent is client component this will become a client component as well.

import {ExtendedUser} from "../../next-auth";
import {Card, CardContent, CardHeader} from "./ui/card";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo: React.FunctionComponent<UserInfoProps> = ({
  user,
  label,
}) => {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
    </Card>
  );
};
