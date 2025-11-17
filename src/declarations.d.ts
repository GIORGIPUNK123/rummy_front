import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'playing-card': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        rank?: string;
        suit?: string;
        className?: string;
      };
    }
  }
}
