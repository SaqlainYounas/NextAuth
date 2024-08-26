"use client";
import {useCallback, useEffect, useState} from "react";
import {CardWrapper} from "./CardWrapper";

import {BeatLoader} from "react-spinners";
import {useSearchParams} from "next/navigation";
import {newVerification} from "@/actions/NewVerificationAction";
import {FormError} from "../FormError";
import {FormSuccess} from "../FormSuccess";
export const NewVarificationForm: React.FunctionComponent = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  /* Use the Search params to find the token in the page - this page is opened by clicking link sent in the email */
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    //if there is already something in the success or erro then return
    if (success || error) return;
    //if there is no token in the params then set the Error.
    if (!token) {
      setError("Missing Token");
      return;
    }
    //verify the token received in the params using below server action
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch((error) => {
        setError("Something went wrong");
      });
  }, [token, success, error]);

  /* On page load run submit to verify the token. */
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verificiation"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
