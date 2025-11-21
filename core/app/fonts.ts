import { DM_Sans, Space_Mono } from 'next/font/google';


const dmSansBody = DM_Sans({
  display: 'swap',
  subsets: ['latin'],
  weight: '400',
  variable: '--font-family-body',
});

const dmSansHeading = DM_Sans({
  display: 'swap',
  subsets: ['latin'],
  weight: '900',
  variable: '--font-family-heading',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-family-mono',
});



export const fonts = [dmSansBody, dmSansHeading, spaceMono];
