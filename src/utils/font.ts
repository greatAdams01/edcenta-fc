import { Inter, Manrope, Dosis } from 'next/font/google';
 
export const inter = Inter({ subsets: ['latin'] });

export const manrope = Manrope({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-manrope',
  })
  
  export const dosis = Dosis({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-dosis',
  })