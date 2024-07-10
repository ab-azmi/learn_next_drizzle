import * as React from 'react';

interface EmailTemplateProps {
  confirmLink: string;
}

export const VerifyEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  confirmLink,
}) => (
  <div>
    <p>Click to <a href={confirmLink}>confirm your email adress</a></p>
  </div>
);

export const ResetPasswordEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  confirmLink,
}) => (
  <div>
    <p>Click to <a href={confirmLink}>reset your password</a></p>
  </div>
);

