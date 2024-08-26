"use client";

import * as z from "zod";
import {useState, useTransition} from "react";
import {CardWrapper} from "@/components/auth/CardWrapper";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {NewPasswordSchema} from "@/../schemas/index";
import {Input} from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/FormError";
import {FormSuccess} from "@/components/FormSuccess";
import {useSearchParams} from "next/navigation";
import {newPassword} from "@/actions/NewPasswordAction";
export const NewPasswordForm: React.FunctionComponent = () => {
  /* Use the Search params to find the token in the page - this page is opened by clicking link sent in the email */
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    setError("");
    setSuccess("");
    startTransition(() => {
      newPassword(values, token ?? undefined).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  }

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="!text-gray-950">
                    Please enter your new password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Confirm Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
