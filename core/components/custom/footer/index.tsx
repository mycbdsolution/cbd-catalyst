import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import {
  SiFacebook,
  SiInstagram,
  SiPinterest,
  SiX,
  SiYoutube,
} from '@icons-pack/react-simple-icons';
import { getTranslations } from 'next-intl/server';
import { cache, JSX } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { Footer as FooterSection } from '@/vibes/soul/sections/footer';
import { GetLinksAndSectionsQuery, LayoutQuery } from '~/app/[locale]/(default)/page-data';
import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { readFragment } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { CurrencyCode } from '~/components/header/fragment';
import { logoTransformer } from '~/data-transformers/logo-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { FooterFragment, FooterSectionsFragment } from './fragment';

import { GooglePayIcon } from './payment-icons/google-pay';
import { AmericanExpressIcon } from './payment-icons/american-express';
import { ApplePayIcon } from './payment-icons/apple-pay';
import { MastercardIcon } from './payment-icons/mastercard';
import { DiscoverIcon } from './payment-icons/discover';
import { VisaIcon } from './payment-icons/visa';


import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { Logo } from '@/vibes/soul/primitives/logo';
import { contentImageUrl } from '~/lib/store-assets';






const navigationCustom = {
  info: [
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Discount Codes', href: '/discount-codes' },
    { name: 'Shipping & Returns', href: '/shipping-returns' },
    { name: 'Terms & Conditions', href: '/terms-and-conditions' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
  ],
  shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'Brands', href: '/brands' },
    { name: 'Topicals', href: '/topicals/' },
    { name: 'Capsules', href: '/capsules/' },
    { name: 'Gummies', href: '/gummies/' },
    { name: 'Tinctures', href: '/tinctures/' },
  ],
  connect: [
    { name: 'Contact', href: '/contact', target: '_self' },
    { name: 'Blog', href: '/articles', target: '_self' },
    { name: 'Facebook', href: 'https://www.facebook.com/mycbdsolution', target: '_blank' },
    { name: 'Instagram', href: 'https://www.instagram.com/mycbdsolution/', target: '_blank' },
    { name: 'YouTube', href: 'https://www.youtube.com/@mycbdsolution', target: '_blank' },
  ],
}


const getFooterData = cache(async () => {
  const { data: response } = await client.fetch({
    document: LayoutQuery,
    fetchOptions: { next: { revalidate } },
  });

  return response;
});

export const FooterCustom = async () => {

 const data = await getFooterData();
 
   const logo = data.site?.settings ? logoTransformer(data.site.settings) : '';

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="relative bg-gradient-to-br from-amber-100 to-green-500">
        <div className="absolute inset-2 rounded-4xl bg-white/80"></div>
      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-12 lg:px-8 lg:pt-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="blake">
              <Image
              className="hidden"
        alt="My CBD Solution Logo"
        src={contentImageUrl('img/footer-logo.png')}
        width={200}
        height={200}
        />
<p className="text-3xl text-gray-300 leading-none mb-2 2xl:text-4xl">my<span className="text-primary font-black">CBD</span>solution</p>

            <p className="text-balance text-sm/6 text-gray-600 dark:text-gray-400">
              Premium nature-derived wellness products for pain relief, mood support, and whole-body balance. 
            </p>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
          
             <div className="flex-col mt-10 md:mt-0">
                <h3 className="text-sm/6 font-semibold text-primary">Info</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigationCustom.info.map((item) => (
                    <li key={item.name} className="leading-none">
                      <a
                        href={item.href}
                        className="text-xs text-gray-600 @2xl:text-sm"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

             <div className="flex-col mt-10 md:mt-0">
                <h3 className="text-sm/6 font-semibold text-primary">Shop</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigationCustom.shop.map((item) => (
                    <li key={item.name} className="leading-none">
                      <a
                        href={item.href}
                       className="text-xs text-gray-600 @2xl:text-sm"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
          
          
          
              <div className="flex-col mt-10 md:mt-0">
                <h3 className="text-sm/6 font-semibold text-primary">Connect</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigationCustom.connect.map((item) => (
                    <li key={item.name} className="leading-none">
                      <a
                        href={item.href}
                       className="text-xs text-gray-600 @2xl:text-sm"
                        target={item.target}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
           
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24 dark:border-white/10">
          <p className="text-xs/6 text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()}  My CBD Solution. All rights reserved.
          </p>
        </div>
      </div>
      </div>
    </footer>
  )
}
