"use client";
import {logOut} from "@/actions/Logout";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton: React.FunctionComponent<LogoutButtonProps> = ({
  children,
}) => {
  function onClick() {
    logOut();
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
