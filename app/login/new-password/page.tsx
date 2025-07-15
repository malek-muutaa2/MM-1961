import { Suspense } from "react";
import { NewPasswordForm } from "./new-password-form";


export default async function NewPasswordpage() {
  // const Translation : Translation[] = await getDictTranslation()
  const dict = {
    "title": "Enter a new password",
    "description": "Set or recover your Optivian account",
    "renew": " Your password expired have been expired and need to be changed ",
    "form": {
      "passwordLabel": "Password",
      "passwordPlaceholder": "******", //NOSONAR
      "resetButton": "Reset Password", //NOSONAR
    },
    "formMessages": {
      "error": "Error during reset",
      "success": "Reset successful",
      "userNotFound": "Email does not exist!",
      "UpdatePass": "Password updated!"
    },
    "passwordValidation": {
      "minLength": "Password must be at least 12 characters long",
      "mustIncludeLetters": "Password must include letters",
      "mustIncludeUppercase": "Password must include at least one uppercase letter",
      "mustIncludeNumbers": "Password must include numbers",
      "mustIncludeSpecialChar": "Password must include a special character"
    }
  };
  return (
    <Suspense>
      <NewPasswordForm ResetPassword={dict} />
    </Suspense>
  );
}
