import {Header} from "./Header";
import {BackButton} from "./BackButton";
import {Card, CardFooter, CardHeader} from "../ui/card";

interface ErrorCardProps {}

export const ErrorCard: React.FunctionComponent<ErrorCardProps> = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oops! Something went wrong!" />
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to login" href="/auth/login" />
      </CardFooter>
    </Card>
  );
};
