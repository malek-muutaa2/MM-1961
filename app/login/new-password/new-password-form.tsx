"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardDescription, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/Form-error";
import { FormSuccess } from "@/components/Form-success";

import { newPassword } from "@/lib/new-password";
import { useTheme } from "next-themes";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ResetPasswordProps } from "@/lib/audit";

function redirectToLogin() {
  window.location.href = "/login";
}
function redirectToLoginAfterDelay() {
  setTimeout(redirectToLogin, 2000);
}
export const NewPasswordForm = ({ ResetPassword }: ResetPasswordProps) => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const renewpassword = searchParams.get("renewpassword");

  const NewPasswordSchema = z.object({
    password: z
      .string()
      .min(12, {
        message: `${ResetPassword.passwordValidation.minLength}`,
      })
      .regex(/[a-zA-Z]/, {
        message: `${ResetPassword.passwordValidation.mustIncludeLetters}`,
      })
      .regex(/[A-Z]/, {
        message: `${ResetPassword.passwordValidation.mustIncludeUppercase}`,
      }) // Ligne ajoutée
      .regex(/\d/, {
        message: `${ResetPassword.passwordValidation.mustIncludeNumbers}`,
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: `${ResetPassword.passwordValidation.mustIncludeSpecialChar}`,
      }),
  });
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, ResetPassword.formMessages, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        if (data?.success) {
          redirectToLoginAfterDelay();
        }
      });
    });
  };

  const { resolvedTheme } = useTheme();
  const [logo, setLogo] = useState("/images/muutaa-logo.png");

  useEffect(() => {
    setLogo(
     "/images/muutaa-logo.png"
    );
  }, [resolvedTheme]);

  return (
    <div className="w-full m-auto lg:grid">
      <div className="flex items-center justify-center py-4 lg:items-start">
        <div className="mx-auto grid mt-36">
          <div className=" w-[410px] ">
            <img
              src={logo}
              alt={"logo"}
              width={200}
              height={200}
              className={"m-auto"}
            />
            {/* <Image className={'m-auto'} src={'/images/logo-muutaa.png'} alt={''} height={122} width={300}  /> */}
            <CardTitle className="mt-4 mb-5 flex text-xl justify-center">
              {ResetPassword.title}
            </CardTitle>

            {renewpassword ? (
              <CardDescription className="flex justify-center text-xl mb-10 text-center	 ">
                {ResetPassword.renew}
              </CardDescription>
            ) : (
              <CardDescription className="flex justify-center text-xl mb-10	 ">
                {ResetPassword.description}
              </CardDescription>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {ResetPassword.form.passwordLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="******"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button disabled={isPending} type="submit" className="w-full">
                  {ResetPassword.form.resetButton}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
