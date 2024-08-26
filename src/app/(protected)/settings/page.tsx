"use client";
import {logOut} from "@/actions/Logout";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {useState} from "react";
const Settings: React.FunctionComponent = () => {
  const [currentUser, setCurrentUser] = useState<any>();
  useCurrentUser().then((data) => {
    setCurrentUser(data);
  });

  const onClick = () => {
    logOut();
  };
  return (
    <div className="bg-white p-10 rounded-xl">
      <button onClick={onClick} type="submit">
        signout
      </button>
    </div>
  );
};

export default Settings;
