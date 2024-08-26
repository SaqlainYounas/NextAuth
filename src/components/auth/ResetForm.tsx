"use client";

import * as z from "zod";
import {useState, useTransition} from "react";
import {CardWrapper} from "@/components/auth/CardWrapper";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ResetSchema} from "../../../schemas";
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
import {Reset} from "@/actions/Reset";

export const ResetForm: React.FunctionComponent = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof ResetSchema>) {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        const result = await Reset(values);
        setError(result?.error);
        setSuccess(result?.success);
      } catch (error) {}
    });
  }

  return (
    <CardWrapper
      headerLabel="Reset Password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Send Reset Email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
