import { type AnchorHTMLAttributes, type HTMLAttributes } from 'react';

interface DisclaimerProps extends HTMLAttributes<HTMLParagraphElement> {}

export const Disclaimer = ({ children, ...rest }: DisclaimerProps) => (
  <p
    {...rest}
    className="mx-auto mb-2 w-[80%] text-center font-mono text-xs leading-[1.1] text-slate-500 md:text-sm"
  >
    {children}
  </p>
);

interface DisclaimerLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const DisclaimerLink = ({ children, ...rest }: DisclaimerLinkProps) => (
  <a {...rest} className="font-mono text-indigo-600">
    {children}
  </a>
);
