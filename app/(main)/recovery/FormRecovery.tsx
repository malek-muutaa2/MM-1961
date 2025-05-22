"use client";
import { FormError } from "@/components/Form-error";
import { FormSuccess } from "@/components/Form-success";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { reset } from "@/lib/reset";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export const ResetSchema = z.object({
  email: z.string().email({
    message: "L'email est requis",
  }),
});
interface Formtype {
  Email: string;
  submitbutton: string;
}

export interface FormMessages {
  errorEmailnonexist: string;
  success: string;
  errorEmaildelete: string;
}

interface ResetPasswordEmail {
  title: string;
  description: string;
  form: Formtype;
  formMessages: FormMessages;
}
interface FormRecoveryProps {
  ResetPasswordEmail: ResetPasswordEmail;
}
// mar the
export default function FormRecovery({
  ResetPasswordEmail,
}: Readonly<FormRecoveryProps>) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const lang = "en";
  const { resolvedTheme } = useTheme();
  const [logo, setLogo] = useState("/muutaa-logo.png");
  useEffect(() => {
    setLogo(
      resolvedTheme === "light" ? "/muutaa-logo.png" : "/muutaa-logo.png",
    );
  }, [resolvedTheme]);

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values).then((data) => {
        console.log("data", data);
        if (data?.error) {
          setError(data?.error);
        }
        if (data?.success) {
          setSuccess(data?.success);
        }
      });
    });
  };

  return (
    <div className="w-full lg:grid lg:min-h-[800px]">
      <div className="flex items-center justify-center py-4 lg:items-start">
        <div className="">
          <div className="mx-auto grid mt-36 w-[410px] ">
            <img
              src={logo}
              alt={"logo"}
              width={200}
              height={200}
              className={"m-auto"}
            />
            <CardTitle className="mt-4 mb-5 flex text-xl justify-center">
              {ResetPasswordEmail.title}
            </CardTitle>
            <CardDescription className="flex justify-center text-xl mb-10	 ">
              {ResetPasswordEmail.description}
            </CardDescription>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{ResetPasswordEmail.form.Email}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder=""
                            type="email"
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
                  {ResetPasswordEmail.form.submitbutton}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
   
    </div>
  );
}
