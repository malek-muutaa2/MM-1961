import FormRecovery from "./FormRecovery";

export default async function RecoveryPage({

}) {
  // const Translation : Translation[] = await getDictTranslation()
  const dict = {
    "title": "Account Recovery",
    "description": "Set or recover your optivian account",
    "form": {
      "Email": "Email",
      "submitbutton": "Send reset email"
    },
    "formMessages": {
      "errorEmailnonexist": "Email not found!",
      "success": "Reset email sent!",
      "errorEmaildelete": "Email deleted!"
    }
  };
  return (
    <div>
      <FormRecovery ResetPasswordEmail={dict} />
    </div>
  );
}
