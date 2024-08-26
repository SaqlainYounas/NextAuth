"use client";

import * as z from "zod";
import {useState, useTransition} from "react";
import {CardWrapper} from "@/components/auth/CardWrapper";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema} from "../../../schemas";
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
import {Login} from "@/actions/Login";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
interface LoginFormProps {}

export const LoginForm: React.FunctionComponent<LoginFormProps> = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already linked with different service"
      : "";

  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTowFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        await Login(values).then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTowFactor(true);
          }
        });
      } catch (error) {
        setError("Something went wrongssssss!");
      }
    });
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="!text-gray-950">
                      Two Factor Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        disabled={isPending}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="!text-gray-950">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="!text-gray-950">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="******"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        size={"sm"}
                        variant={"link"}
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href={"/auth/reset"}>Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
