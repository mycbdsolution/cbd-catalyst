import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren } from 'react';

import { FooterCustom } from '~/components/custom/footer';
import FooterFeatures from '~/components/custom/footer/footer-features';
import { Header } from '~/components/header';

interface Props extends PropsWithChildren {
  params: Promise<{ locale: string }>;
}

export default async function DefaultLayout({ params, children }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <>
      <Header />

      <main>{children}</main>

      <FooterFeatures />
      <FooterCustom />
    </>
  );
}
