import * as React from 'react';

interface EmailTemplateProps {
  confirmLink: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  confirmLink,
}) => (
  <div>
    <p>Click to <a href={confirmLink}>confirm your email adress</a></p>
  </div>
);

export default EmailTemplate;
