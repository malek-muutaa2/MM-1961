"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import {  useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { LoginSchema, LoginSchemaEn } from "@/lib/zodschema";
import { DisabledUserAction } from "@/lib/login";
import { FormError } from "@/components/Form-error";
import { FormSuccess } from "@/components/Form-success";

import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";


import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { Login2fa2 } from "./login2fa";

interface QrcodeType {
  qrCodeUrl: string;
  base32: string;
  ascii: string;
}

interface FailedAttemptInfo {
  attempts: number;
  password: string;
}

// This defines an object where each key is a string (email in your case) and maps to FailedAttemptInfo
interface FailedAttemptsState {
  [email: string]: FailedAttemptInfo;
}

export const LoginForm2fa = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";
  const [failedAttemptsInfo, setFailedAttemptsInfo] =
    useState<FailedAttemptsState>({});
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [hidelogin, sethidelogin] = useState("false");

  const [error, setError] = useState<string | undefined | null>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
 
  const [loginCredentials, setLoginCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const lang = "en";
  const loginschemaform = lang === "en" ? LoginSchemaEn : LoginSchema;
  const form = useForm<z.infer<typeof loginschemaform>>({
    resolver: zodResolver(loginschemaform),
    defaultValues: {
      email: "",
      password: "",
    },
  });
 async function handleLoginError(values: any, errorMsg: string) {
  setError(errorMsg);
  sethidelogin("false");

  setFailedAttemptsInfo((prev) => {
    const currentAttempts = (prev[values.email]?.attempts || 0) + 1;
    return {
      ...prev,
      [values.email]: {
        attempts: currentAttempts,
        password: values.password,
      },
    };
  });

  const attempts = failedAttemptsInfo[values.email]?.attempts || 0;

  if (attempts + 1 >= 5) {
    try {
      const disableResponse = await DisabledUserAction(values.email);
      if (disableResponse?.error) {
        console.error("Error disabling user:", disableResponse.error);
      } else if (disableResponse?.success) {
        console.log("User disabled successfully:", disableResponse.success);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("Something went wrong");
    }
  }
}

async function handleSuccessfulLogin(values: any) {
  setSuccess("User authenticated successfully");
  const result = await signIn("credentials", {
    redirect: false,
    email: values.email,
    password: values.password,
    callbackUrl: "/",
  });
  form.reset();
  setError(null);

  if (result?.error) {
    setError(result.error);
  } else {
    window.location.href = result?.url ?? "/dashboard";
  }
}

function redirectToPasswordReset(token: string) {
  window.location.href = `/login/new-password?token=${token}&renewpassword=true`;
}

function promptTwoFactor(values: any) {
  setShowTwoFactor(true);
  setLoginCredentials({
    email: values.email,
    password: values.password,
  });
}

const onSubmitcode2fa = async (values: z.infer<typeof loginschemaform>) => {
  setError("");
  setSuccess("");

  startTransition(() => {
    Login2fa2(values)
      .then(async (data) => {
        if (data?.error) {
          await handleLoginError(values, data.error);
          return;
        }

        if (data?.success) {
          await handleSuccessfulLogin(values);
          return;
        }

        if (data?.isexpired && data?.passwordResetToken) {
          redirectToPasswordReset(data.passwordResetToken);
          return;
        }

        if (data?.twoFactor) {
          promptTwoFactor(values);
        }
      })
      .catch(() => setError("Something went wrong!"));
  });
};


 console.log("hidelogin", hidelogin);
 
  const handleSubmitResend = async () => {
    console.log("loginCredentials", loginCredentials);

    if (loginCredentials) {
      const res = await fetch("/api/resendemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginCredentials?.email }),
      });
      const newTask = await res.json();
      console.log(newTask);
    }
  };
  return (
    <div>
      {!showTwoFactor && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitcode2fa)}
            className="space-y-6"
          >
            <div className=" justify-center  space-y-4">
              <div className={"grid gap-2 text-center"}>
                <p className="text-balance text-muted-foreground">
                Enter your email below to log in to your account
                </p>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">{lang === "en" ? "Email Address" : "Adresse e-mail"}</Label>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        disabled={isPending}
                        placeholder=""
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">
                      {lang === "en" ? "Password" : "Mot de passe"}
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        disabled={isPending}
                        placeholder=""
                        type="password"
                      />
                    </FormControl>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href="/recovery">
                        {lang === "en" ? "Forgot Password?" : "Mot de passe oublié ?"}
                      </Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error ?? urlError} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full">
              {showTwoFactor
                ? `confirm`
                : `login`}
            </Button>
          </form>
        </Form>
      )}

      {showTwoFactor && (
        <div className="">
          <div className="flex justify-center  mt-5">
            <Label
              htmlFor="email"
              className=" text-sm font-medium leading-6 text-gray-900"
            >
              {lang === "en"
                ? "Two-Factor Authentication"
                : "Authentification à Deux Facteurs"}
            </Label>
          </div>

          <p className="mt-1 text-sm text-gray-600"></p>
          <div></div>
          <div className="mt-2 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitcode2fa)}
                className="space-y-6"
              >
                <div className="space-y-4 flex w-full justify-center">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex justify-center">
                          {lang === "en"
                            ? "Enter the 2FA code"
                            : "Saisissez le code 2FA"}
                        </FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />

                              <InputOTPSeparator />

                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormError message={error} />
                <FormSuccess message={success} />

                <Button disabled={isPending} type="submit" className="w-full">
                  {lang === "en" ? "Confirm" : "Confirmer"}
                </Button>
              </form>
            </Form>
          </div>
          <div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleSubmitResend();
              }}
              className="w-full mt-4"
              variant="link"
              type="button"
            >
              {lang === "en"
                ? "Resend Email code"
                : "Renvoyer le code par email"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
