import React from 'react';

export const TooltipProvider = ({ children }: any) => <>{children}</>;
export const Tooltip = ({ children }: any) => <>{children}</>;
export const TooltipTrigger = ({ children, asChild, ...props }: any) => (
  <span {...props}>{children}</span>
);
export const TooltipContent = ({ children, className = '', ...props }: any) => (
  <div className={`hidden ${className}`} {...props}>
    {children}
  </div>
);
