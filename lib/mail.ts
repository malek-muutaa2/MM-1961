import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXTAUTH_URL;

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  lang: string,
) => {
  if(!domain) {
    throw new Error("NEXTAUTH_URL is not defined in environment variables");
  }
  const resetLink = `${domain}/login/new-password?token=${token}`;
  const emailContentEn = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
  
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
  
      h1 {
        color: #333;
        margin-top: 20px;
      }
  
      h2 {
        color: #3481ee;
        margin-top: 10px;
      }
  
      p {
        color: #555;
        margin-top: 10px;
      }
  
      .button {
        display: inline-block;
        background-color: #4c6d91;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        margin-top: 20px;
      }
  
      .logo {
        max-width: 200px;
        height: auto;
        margin-bottom: 20px;
      }
    </style>
  </head>
  

  <body>
    <div class="container">
      <img class="logo" src="https://i2.wp.com/muutaa.com/wp-content/uploads/2021/03/Final-Logo-1.png?fit=2033%2C614&ssl=1" alt="Muutaa Logo">
      <h1>Reset your optivian password again</h1>
      <h2>It seems that you have requested to reset your password again.</h2>
      <p>Simply click on the link below to set a new password. This link will expire in 24 hours for your security: <a href="${resetLink}">Click here</a></p>

      <p>If you did not request a password reset, please ignore this email or contact our support team if you have any concerns about the security of your account.</p>
      <p>Visit our site: <a href="${process.env.NEXTAUTH_URL}">${process.env.NEXTAUTH_URL}</a></p>
    </div>
  </body>
  
  </html>`;
  const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
    
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    
        h1 {
          color: #333;
          margin-top: 20px;
        }
    
        h2 {
          color: #3481ee;
          margin-top: 10px;
        }
    
        p {
          color: #555;
          margin-top: 10px;
        }
    
        .button {
          display: inline-block;
          background-color: #4c6d91;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          margin-top: 20px;
        }
    
        .logo {
          max-width: 200px;
          height: auto;
          margin-bottom: 20px;
        }
      </style>
    </head>
    

    <body>
      <div class="container">
        <img class="logo" src="https://i2.wp.com/muutaa.com/wp-content/uploads/2021/03/Final-Logo-1.png?fit=2033%2C614&ssl=1" alt="Muutaa Logo">
        <h1>Réinitialisez votre mot de passe Optivian à nouveau</h1>
        <h2>Il semble que vous ayez demandé à réinitialiser votre mot de passe à nouveau.</h2>
        <p>Cliquez simplement sur le lien ci-dessous pour définir un nouveau mot de passe. Ce lien expirera dans 24 heures pour votre sécurité: <a href="${resetLink}">Cliquez ici</a></p>

        <p>Si vous n'avez pas demandé la réinitialisation de votre mot de passe, veuillez ignorer cet e-mail ou contacter notre équipe d'assistance si vous avez des préoccupations concernant la sécurité de votre compte.</p>
        <p>Visitez notre site : <a href="${process.env.NEXTAUTH_URL}">${process.env.NEXTAUTH_URL}</a></p>
      </div>
    </body>
    
    </html>`;
  const content = lang === "en" ? emailContentEn : emailContent;
  const subject =
    lang === "en"
      ? "Reset your Optivian password again"
      : "Réinitialisez votre mot de passe Optivian à nouveau";
  const emailres = await resend.emails.send({
    from: "Muutaa Inc. Optivian <muutaa@no-reply.demandamp.plus>",
    to: email,
    subject: subject,
    html: content,
  });
  return emailres;
};
export const sendInvationResetEmail = async (
  email: string,
  token: string,
  lang: string,
) => {
  const resetLink = `${domain}/login/new-password?token=${token}`;
  const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <title>Your Data Request</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
    
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    
        h1 {
          color: #333;
          margin-top: 20px;
        }
    
        h2 {
          color: #3481ee;
          margin-top: 10px;
        }
    
        p {
          color: #555;
          margin-top: 10px;
        }
    
        .button {
          display: inline-block;
          background-color: #4c6d91;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          margin-top: 20px;
        }
    
        .logo {
          max-width: 200px;
          height: auto;
          margin-bottom: 20px;
        }
      </style>
    </head>
    

    <body>
      <div class="container">
        <h4>Bonjour </h4>

        <h5>Vous avez reçu une invitation pour accéder à l'application Optivian : <a href="${process.env.NEXTAUTH_URL}">${process.env.NEXTAUTH_URL}</a></p> </h5>

        <p>Cliquez simplement sur le lien ci-dessous pour créer votre mot de passe. Ce lien expirera dans 24 heures pour votre sécurité: <a href="${resetLink}">Cliquez ici</a></p>

   
      </div>
    </body>
    
    </html>`;
  const emailContentEn = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <title>Your Data Request</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
    
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    
        h1 {
          color: #333;
          margin-top: 20px;
        }
    
        h2 {
          color: #3481ee;
          margin-top: 10px;
        }
    
        p {
          color: #555;
          margin-top: 10px;
        }
    
        .button {
          display: inline-block;
          background-color: #4c6d91;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          margin-top: 20px;
        }
    
        .logo {
          max-width: 200px;
          height: auto;
          margin-bottom: 20px;
        }
      </style>
    </head>
    

    <body>
      <div class="container">
        <h4>Hello</h4>

        <h5>You have received an invitation to access the Optivian application: <a href="${process.env.NEXTAUTH_URL}">${process.env.NEXTAUTH_URL}</a></p> </h5>

        <p>Simply click on the link below to create your password. This link will expire in 24 hours for your security: <a href="${resetLink}">Click here</a></p>

   
      </div>
    </body>
    
    </html>`;
  const content = lang === "en" ? emailContentEn : emailContent;
  const subject =
    lang === "en"
      ? "Reset your Optivian password again"
      : "Réinitialisez votre mot de passe Optivian à nouveau";
  const emailres = await resend.emails.send({
    from: "Muutaa Inc. Optivian <muutaa@no-reply.demandamp.plus>",
    to: email,
    subject: subject,
    html: content,
  });
  return emailres;
};
export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string,
  lang: string,
) => {
  const emailContent = `
        <p>Bonjour</p>
        <p>Pour compléter la procédure de vérification en deux étapes de votre compte, veuillez saisir le code de sécurité suivant lorsque vous y serez invité :</p>
        <p><strong>Code de vérification : ${token}</strong></p>
        <p>Ce code est valide pendant 60 minutes et ne doit être partagé avec personne.</p>
        <p>Si vous n'avez pas tenté de vous connecter, veuillez ignorer ce message ou nous contacter immédiatement pour sécuriser votre compte.</p>
        <p>Cordialement,</p>
   
        `;
  const emailContentEn = `
        <p>Hello,</p>
        <p>To complete the two-step verification procedure for your account, please enter the following security code when prompted:</p>
        <p><strong>Verification Code: ${token}</strong></p>
        <p>This code is valid for 60 minutes and should not be shared with anyone.</p>
        <p>If you did not attempt to log in, please ignore this message or contact us immediately to secure your account.</p>
        <p>Sincerely,</p>
    `;

  const content = lang === "en" ? emailContentEn : emailContent;
  const subject =
    lang === "en" ? "Code verification 2FA" : "Code de vérification 2FA";
  const res = await resend.emails.send({
    from: "Muutaa Inc. Optivian <muutaa@no-reply.demandamp.plus>",
    to: email,
    subject: subject,
    html: content,
  });
  console.log("res", res);

  return res;
};
