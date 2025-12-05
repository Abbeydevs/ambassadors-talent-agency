import { resend } from "@/lib/resend";

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "ambassadors@thesoftwarehub.tech",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "ambassadors@thesoftwarehub.tech",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

export const sendNewApplicationEmail = async (
  employerEmail: string,
  jobTitle: string,
  talentName: string
) => {
  await resend.emails.send({
    from: "notifications@thesoftwarehub.tech",
    to: employerEmail,
    subject: `New Candidate for ${jobTitle}`,
    html: `<p><strong>${talentName}</strong> has applied for <strong>${jobTitle}</strong>.</p><p>Log in to your dashboard to review their application.</p>`,
  });
};

export const sendApplicationConfirmationEmail = async (
  talentEmail: string,
  jobTitle: string
) => {
  await resend.emails.send({
    from: "notifications@thesoftwarehub.tech",
    to: talentEmail,
    subject: `Application Received: ${jobTitle}`,
    html: `<p>Your application for <strong>${jobTitle}</strong> has been sent successfully.</p>`,
  });
};
