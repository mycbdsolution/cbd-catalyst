import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { SearchParams } from 'nuqs/server';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { FeaturedProductList } from '@/vibes/soul/sections/featured-product-list';
import { ProductDetail } from '@/vibes/soul/sections/product-detail';
import { BrandDescription } from '@/vibes/soul/sections/custom/brand-description';
import { getSessionCustomerAccessToken } from '~/auth';
import { pricesTransformer } from '~/data-transformers/prices-transformer';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { productOptionsTransformer } from '~/data-transformers/product-options-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { addToCart } from './_actions/add-to-cart';
import { ProductAnalyticsProvider } from './_components/product-analytics-provider';
import { ProductSchema } from './_components/product-schema';
import { ProductViewed } from './_components/product-viewed';
import { Reviews } from './_components/reviews';
import {
  getInventorySettingsQuery,
  getProduct,
  getProductPageMetadata,
  getProductPricingAndRelatedProducts,
  getStreamableProduct,
} from './page-data';

// BLAKE CUSTOM - NEXT 3 LINES
import { Link } from '~/components/link';
import {contentAssetUrl} from '~/lib/store-assets';
import { ExternalLink } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const customerAccessToken = await getSessionCustomerAccessToken();

  const productId = Number(slug);

  const product = await getProductPageMetadata(productId, customerAccessToken);

  if (!product) {
    return notFound();
  }

  const { pageTitle, metaDescription, metaKeywords } = product.seo;
  const { url, altText: alt } = product.defaultImage || {};

  return {
    title: pageTitle || product.name,
    description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    openGraph: url
      ? {
          images: [
            {
              url,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function Product({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const customerAccessToken = await getSessionCustomerAccessToken();


  setRequestLocale(locale);

  const t = await getTranslations('Product');
  const format = await getFormatter();

  const productId = Number(slug);

  const baseProduct = await getProduct(productId, customerAccessToken);

  if (!baseProduct) {
    return notFound();
  }


// BLAKE CUSTOM - NEXT 2 LINES
      const customFields = removeEdgesAndNodes(baseProduct.customFields);
      const productDisplayName = customFields.slice(0, 1).map((customField) => customField.value);

// END BLAKE CUSTOM

  const streamableProduct = Streamable.from(async () => {
    const options = await searchParams;

    const optionValueIds = Object.keys(options)
      .map((option) => ({
        optionEntityId: Number(option),
        valueEntityId: Number(options[option]),
      }))
      .filter(
        (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
      );

    const variables = {
      entityId: Number(productId),
      optionValueIds,
      useDefaultOptionSelections: true,
    };

    const product = await getStreamableProduct(variables, customerAccessToken);

    if (!product) {
      return notFound();
    }

    return product;
  });

  const streamableProductSku = Streamable.from(async () => (await streamableProduct).sku);

  const streamableProductPricingAndRelatedProducts = Streamable.from(async () => {
    const options = await searchParams;

    const optionValueIds = Object.keys(options)
      .map((option) => ({
        optionEntityId: Number(option),
        valueEntityId: Number(options[option]),
      }))
      .filter(
        (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
      );

    const currencyCode = await getPreferredCurrencyCode();

    const variables = {
      entityId: Number(productId),
      optionValueIds,
      useDefaultOptionSelections: true,
      currencyCode,
    };

    return await getProductPricingAndRelatedProducts(variables, customerAccessToken);
  });

  const streamablePrices = Streamable.from(async () => {
    const product = await streamableProductPricingAndRelatedProducts;

    if (!product) {
      return null;
    }

    return pricesTransformer(product.prices, format) ?? null;
  });

  const streamableImages = Streamable.from(async () => {
    const product = await streamableProduct;

    // BLAKE TEMP FIX - USED SLICE METHOD ON IMAGES TO REMOVE THUMBNAIL
    const images = removeEdgesAndNodes(product.images).slice(1)
      .filter((image) => image.url !== product.defaultImage?.url)
      .map((image) => ({
        src: image.url,
        alt: image.altText,
      }));

    return product.defaultImage
      ? [{ src: product.defaultImage.url, alt: product.defaultImage.altText }, ...images]
      : images;
  });

  const streameableCtaLabel = Streamable.from(async () => {
    const product = await streamableProduct;

    if (product.availabilityV2.status === 'Unavailable') {
      return t('ProductDetails.Submit.unavailable');
    }

    if (product.availabilityV2.status === 'Preorder') {
      return t('ProductDetails.Submit.preorder');
    }

    if (!product.inventory.isInStock) {
      return t('ProductDetails.Submit.outOfStock');
    }

    return t('ProductDetails.Submit.addToCart');
  });

  const streameableCtaDisabled = Streamable.from(async () => {
    const product = await streamableProduct;

    if (product.availabilityV2.status === 'Unavailable') {
      return true;
    }

    if (product.availabilityV2.status === 'Preorder') {
      return false;
    }

    if (!product.inventory.isInStock) {
      return true;
    }

    return false;
  });

  const streamableStockLevelMessage = Streamable.from(async () => {
    const inventorySetting = await getInventorySettingsQuery(customerAccessToken);

    if (!inventorySetting) {
      return null;
    }

    const { showOutOfStockMessage, stockLevelDisplay, defaultOutOfStockMessage } = inventorySetting;

    const product = await streamableProduct;

    if (!product.inventory.isInStock) {
      return showOutOfStockMessage ? defaultOutOfStockMessage : null;
    }

    if (stockLevelDisplay === 'DONT_SHOW') {
      return null;
    }

    const { availableToSell, warningLevel } = product.inventory.aggregated ?? {};

    // availableToSell can be 0 while the product is in stock if backorderLimit is UNLIMITED
    if (!availableToSell) {
      return null;
    }

    if (stockLevelDisplay === 'SHOW_WHEN_LOW') {
      if (!warningLevel) {
        return null;
      }

      if (availableToSell && availableToSell > warningLevel) {
        return null;
      }
    }

    return t('ProductDetails.currentStock', {
      quantity: availableToSell,
    });
  });

  const streameableAccordions = Streamable.from(async () => {
    const product = await streamableProduct;

    const customFields = removeEdgesAndNodes(product.customFields);
     const labResults = customFields.slice(-1).map((customField) => customField.value).join('');

     const bullets = product.warranty ? product.warranty.split('\n').filter((line) => line.trim() !== '') : [];

    const specifications = [
        {
        name: 'UPC',
        value: product.upc,
      },
         {
        name: 'SKU',
        value: product.sku,
      },
       ...customFields.slice(1,-1).map((field) => ({
        name: field.name,
        value: field.value,
      })),
        {
              name: 'Lab Results',
               value: <Link href={contentAssetUrl(labResults)}
               target="_blank"
              >
                View certificate of analysis <ArrowUpRight className="inline h-5" /></Link>,
            },
    ];

    return [
        ...(specifications.length
        ? [
            {
              title: t('ProductDetails.Accordions.specifications'),
              content: (
                <div className="@container">
                  <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 sm:gap-y-12 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
                    {specifications.map((field, index) => (
                      <div className="border-t border-gray-200 pt-4" key={index}>
                        <dt className="font-semibold font-mono text-gray-500 uppercase text-sm [word-spacing:-0.16rem]">{field.name}</dt>
                        <dd className="mt-2">{field.value}</dd>
                        </div>
                    ))}
                  </dl>
                </div>
              ),
            },
          ]
        : []),

    ];
  });

  const streameableRelatedProducts = Streamable.from(async () => {
    const product = await streamableProductPricingAndRelatedProducts;

    if (!product) {
      return [];
    }

    const relatedProducts = removeEdgesAndNodes(product.relatedProducts);

    return productCardTransformer(relatedProducts, format);
  });

  const streamableMinQuantity = Streamable.from(async () => {
    const product = await streamableProduct;

    return product.minPurchaseQuantity;
  });

  const streamableMaxQuantity = Streamable.from(async () => {
    const product = await streamableProduct;

    return product.maxPurchaseQuantity;
  });

  const streamableAnalyticsData = Streamable.from(async () => {
    const [extendedProduct, pricingProduct] = await Streamable.all([
      streamableProduct,
      streamableProductPricingAndRelatedProducts,
    ]);

    return {
      id: extendedProduct.entityId,
      name: extendedProduct.name,
      sku: extendedProduct.sku,
      upc: extendedProduct.upc,
      brand: extendedProduct.brand?.name ?? '',
      brandPath: extendedProduct.brand?.path ?? '',
      reviewsCount: extendedProduct.reviewSummary.numberOfReviews,
      bullets: extendedProduct.warranty ? extendedProduct.warranty.split('\n').filter((line) => line.trim() !== '') : [],
      price: pricingProduct?.prices?.price.value ?? 0,
      currency: pricingProduct?.prices?.price.currencyCode ?? '',
    };
  });

  return (
    <>
      <ProductAnalyticsProvider data={streamableAnalyticsData}>
        <ProductDetail
          action={addToCart}
  
          additionalInformationTitle={t('ProductDetails.additionalInformation')}
          ctaDisabled={streameableCtaDisabled}
          ctaLabel={streameableCtaLabel}
          decrementLabel={t('ProductDetails.decreaseQuantity')}
          emptySelectPlaceholder={t('ProductDetails.emptySelectPlaceholder')}
          fields={productOptionsTransformer(baseProduct.productOptions)}
          incrementLabel={t('ProductDetails.increaseQuantity')}
          prefetch={true}
          product={{
            id: baseProduct.entityId.toString(),
            title: productDisplayName.toString(),
            bullets: <div dangerouslySetInnerHTML={{ __html: baseProduct.warranty }} />,
            description: <div dangerouslySetInnerHTML={{ __html: baseProduct.description }} />,
            href: baseProduct.path,
            images: streamableImages,
            price: streamablePrices,
            subtitle: baseProduct.brand?.name,
            brandPath: baseProduct.brand?.path,
            rating: baseProduct.reviewSummary.averageRating,
            reviewsCount: baseProduct.reviewSummary.numberOfReviews,
            accordions: streameableAccordions,
            minQuantity: streamableMinQuantity,
            maxQuantity: streamableMaxQuantity,
            stockLevelMessage: streamableStockLevelMessage,
          }}
          quantityLabel={t('ProductDetails.quantity')}
          thumbnailLabel={t('ProductDetails.thumbnail')}
        />
      </ProductAnalyticsProvider>

          <BrandDescription
              title="Brand Info"
              name={baseProduct.brand?.name ?? ''}
            />

         <FeaturedProductList
              cta={{ label: t('RelatedProducts.cta'), href: '/shop-all' }}
              emptyStateSubtitle={t('RelatedProducts.browseCatalog')}
              emptyStateTitle={t('RelatedProducts.noRelatedProducts')}
              products={streameableRelatedProducts}
              title={t('RelatedProducts.title')}
            />

      <Reviews
        productId={productId}
        searchParams={searchParams}
        streamableImages={streamableImages}
        streamableProduct={streamableProduct}
      />

      <Stream
        fallback={null}
        value={Streamable.from(async () =>
          Streamable.all([streamableProduct, streamableProductPricingAndRelatedProducts]),
        )}
      >
        {([extendedProduct, pricingProduct]) => (
          <>
            <ProductSchema
              product={{ ...extendedProduct, prices: pricingProduct?.prices ?? null }}
            />
            <ProductViewed
              product={{ ...extendedProduct, prices: pricingProduct?.prices ?? null }}
            />
          </>
        )}
      </Stream>


    </>
  );
}
