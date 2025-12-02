import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BrandsList } from '@/vibes/soul/sections/custom/brands-list';

import { getBrands } from './page-data';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Components.Header.Search' });

  return {
    title: t('brands'),
    description: 'Browse our favorite brands.',
  };
}

export default async function Brands({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Components.Header.Search');
  const brands = await getBrands();

  return (
    <BrandsList
      brands={brands}
      description="Explore the brands we love carrying in store."
      title={t('brands')}
    />
  );
}
