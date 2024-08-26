import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* Use Resend to send the verification email along with the token created while Registering */
export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}.</p>`,
  });
};

/* Use Resend to send the verification email along with the token created while Registering */
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-varification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email. You have 1 hour before this link expires.</p>`,
  });
};

/* Use Resend to send the verification email along with the token created while Registering */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
  });
};
