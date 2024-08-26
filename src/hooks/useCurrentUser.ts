import {useSession} from "next-auth/react";

export const useCurrentUser = async () => {
  const session = useSession({required: true});
  if (session.status === "authenticated") {
    return session.data?.user;
  } else {
    return null;
  }
};
