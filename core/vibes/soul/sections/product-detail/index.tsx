import { ReactNode } from 'react';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';

import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import { Rating } from '@/vibes/soul/primitives/rating';
import * as Skeleton from '@/vibes/soul/primitives/skeleton';
import { type Breadcrumb, Breadcrumbs } from '@/vibes/soul/sections/breadcrumbs';
import { ProductGallery } from '@/vibes/soul/sections/product-detail/product-gallery';

import { ProductDetailForm, ProductDetailFormAction } from './product-detail-form';
import { Field } from './schema';

import { Link } from '~/components/link';

interface ProductDetailProduct {
  id: string;
  title: string;
  href: string;
  images: Streamable<Array<{ src: string; alt: string }>>;
  price?: Streamable<Price | null>;
  subtitle?: string;
  brandPath?: string;
  reviewsCount?: number;
  badge?: string;
  rating?: Streamable<number | null>;
  summary?: Streamable<string>;
  bullets?: Streamable<string | ReactNode | null>;
  description?: Streamable<string | ReactNode | null>;
  accordions?: Streamable<
    Array<{
      title: string;
      content: ReactNode;
    }>
  >;
  minQuantity?: Streamable<number | null>;
  maxQuantity?: Streamable<number | null>;
  stockLevelMessage?: Streamable<string | null>;
}

export interface ProductDetailProps<F extends Field> {
  breadcrumbs?: Streamable<Breadcrumb[]>;
  product: Streamable<ProductDetailProduct | null>;
  action: ProductDetailFormAction<F>;
  fields: Streamable<F[]>;
  quantityLabel?: string;
  incrementLabel?: string;
  decrementLabel?: string;
  emptySelectPlaceholder?: string;
  ctaLabel?: Streamable<string | null>;
  ctaDisabled?: Streamable<boolean | null>;
  prefetch?: boolean;
  thumbnailLabel?: string;
  additionalInformationTitle?: string;
  additionalActions?: ReactNode;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --product-detail-border: hsl(var(--contrast-100));
 *   --product-detail-subtitle-font-family: var(--font-family-mono);
 *   --product-detail-title-font-family: var(--font-family-heading);
 *   --product-detail-primary-text: hsl(var(--foreground));
 *   --product-detail-secondary-text:  hsl(var(--contrast-500));
 * }
 * ```
 */
export function ProductDetail<F extends Field>({
  product: streamableProduct,
  action,
  fields: streamableFields,
  breadcrumbs,
  quantityLabel,
  incrementLabel,
  decrementLabel,
  emptySelectPlaceholder,
  ctaLabel: streamableCtaLabel,
  ctaDisabled: streamableCtaDisabled,
  prefetch,
  thumbnailLabel,
  additionalInformationTitle = 'Additional information',
  additionalActions,
}: ProductDetailProps<F>) {
  return (
    <section className="@container">
      <div className="group/product-detail mx-auto w-full max-w-screen-xl px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20">
        {breadcrumbs && (
          <div className="group/breadcrumbs mb-6">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        )}
        <Stream fallback={<ProductDetailSkeleton />} value={streamableProduct}>
          {(product) =>
            product && (
                  <div>
              <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-8 @2xl:grid-cols-2 @5xl:gap-x-12">
                <div className="group/product-gallery hiddsen @2xl:block">
                  <Stream fallback={<ProductGallerySkeleton />} value={product.images}>
                    {(images) => <ProductGallery images={images} />}
                  </Stream>
                </div>
                {/* Product Details */}
                <div className="text-[var(--product-detail-primary-text,hsl(var(--foreground)))]">
                    {Boolean(product.subtitle) && product.brandPath && (
                    <Link href={product.brandPath} className="text-gray-300">
                      <p className="font-[family-name:var(--product-detail-subtitle-font-family,var(--font-family-mono))] text-sm text-gray-500 uppercase underline">
                        {product.subtitle}
                      </p>
                    </Link>
                  )}


                  <h1 className="mt-2 font-[family-name:var(--product-detail-title-font-family,var(--font-family-heading))] text-2xl font-semibold tracking-tighter leading-none text-primary @xl:text-4xl @4xl:text-5xl">
                    {product.title}
                  </h1>
                  <div className="flex leading-none items-center mt-2">
                      <div className="group/product-price">
                    <Stream fallback={<PriceLabelSkeleton />} value={product.price}>
                      {(price) => (
                        <PriceLabel className="my-3 text-base @xl:text-base" price={price ?? ''} />
                      )}
                    </Stream>
                  </div>
                  <div className="group/product-rating ml-4 border-l border-gray-300 pl-4">
                    <Stream fallback={<RatingSkeleton />} value={product.rating}>
                      {(rating) => <Rating rating={rating ?? 0} />}
                      
                    </Stream>
                    
                  </div>
                <span className="text-sm text-gray-300 ml-2">&#40;{product.reviewsCount} reviews&#41;</span>
                  </div>
                  <div className="group/product-stock-level mb-8 sm:mb-2 md:mb-0">
                    <Stream fallback={<ProductStockSkeleton />} value={product.stockLevelMessage}>
                      {(stockLevelMessage) =>
                        Boolean(stockLevelMessage) && (
                          <p className="text-sm text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                            {stockLevelMessage}
                          </p>
                        )
                      }
                    </Stream>
                  </div>
           
                  <div className="group/product-summary">
                    <Stream fallback={<ProductSummarySkeleton />} value={product.summary}>
                      {(summary) =>
                        Boolean(summary) && (
                          <p className="text-[var(--product-detail-secondary-text,hsl(var(--contrast-500)))]">
                            {summary}
                          </p>
                        )
                      }
                    </Stream>
                  </div>

                      <div className="group/product-bullets">
                    <Stream fallback={<ProductBulletsSkeleton />} value={product.bullets}>
                      {(bullets) =>
                        Boolean(bullets) && (
                          <div className="prose prose-ul:mt-0 prose-ul:mb-1 prose-ul:border-t prose-ul:border-b prose-ul:pt-4 prose-ul:pb-1 prose-ul:pl-0 prose-li:mt-0 prose-li:mb-0 text-gray-900">
                            {bullets}
                          </div>
                        )
                      }
                    </Stream>

                  </div>

                  <div className="group/product-detail-form">
                    <Stream
                      fallback={<ProductDetailFormSkeleton />}
                      value={Streamable.all([
                        streamableFields,
                        streamableCtaLabel,
                        streamableCtaDisabled,
                        product.minQuantity,
                        product.maxQuantity,
                      ])}
                    >
                      {([fields, ctaLabel, ctaDisabled, minQuantity, maxQuantity]) => (
                        <ProductDetailForm
                          action={action}
                          additionalActions={additionalActions}
                          ctaDisabled={ctaDisabled ?? undefined}
                          ctaLabel={ctaLabel ?? undefined}
                          decrementLabel={decrementLabel}
                          emptySelectPlaceholder={emptySelectPlaceholder}
                          fields={fields}
                          incrementLabel={incrementLabel}
                          maxQuantity={maxQuantity ?? undefined}
                          minQuantity={minQuantity ?? undefined}
                          prefetch={prefetch}
                          productId={product.id}
                          quantityLabel={quantityLabel}
                        />
                      )}
                    </Stream>
                  </div>
                
                  <h2 className="sr-only">{additionalInformationTitle}</h2>
          
                </div>
              </div>

        <div className="mx-auto px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-4 @4xl:py-20 max-w-7xl">
              <div className="group/product-description">
              <h2 className="text-2xl font-bold leading-none tracking-tighter text-primary @2xl:text-3xl @4xl:text-5xl">Product Info</h2>
                    <Stream fallback={<ProductDescriptionSkeleton />} value={product.description}>
                      {(description) =>
                        Boolean(description) && (
                          <div className="prose max-w-none border-t border-[var(--product-detail-border,hsl(var(--contrast-100)))] py-8 [&>div>*:first-child]:mt-0 [&>div>*:last-child]:mb-0 2xl:prose-lg">
                            {description}
                          </div>
                        )
                      }
                    </Stream>
                  </div>

              
                 <div className="group/product-accordion">
                    <h4 className="font-bold xl:text-lg">Specifications</h4>
                    <Stream fallback={<ProductAccordionsSkeleton />} value={product.accordions}>
                      {(accordions) =>
                        accordions && (
                          <div>
                            {accordions.map((accordion, index) => (
                            <div key={index}>
                                {accordion.content}
                              </div>
                            ))}
                          </div>
                        )
                      }

         
                    </Stream>
                  </div>
           </div>


        </div>
              
            )
          }
        </Stream>
      </div>
    </section>

    
  );
}

function ProductGallerySkeleton() {
  return (
    <Skeleton.Root className="group-has-[[data-pending]]/product-gallery:animate-pulse" pending>
      <div className="w-full overflow-hidden rounded-xl @xl:rounded-2xl">
        <div className="flex">
          <Skeleton.Box className="aspect-[4/5] h-full w-full shrink-0 grow-0 basis-full" />
        </div>
      </div>
      <div className="mt-2 flex max-w-full gap-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton.Box className="h-12 w-12 shrink-0 rounded-lg @md:h-16 @md:w-16" key={idx} />
        ))}
      </div>
    </Skeleton.Root>
  );
}

function PriceLabelSkeleton() {
  return <Skeleton.Box className="my-5 h-4 w-20 rounded-md" />;
}

function ProductStockSkeleton() {
  return <Skeleton.Box className="my-3 h-2 w-20 rounded-md" />;
}

function RatingSkeleton() {
  return (
    <Skeleton.Root
      className="flex w-[136px] items-center gap-1 group-has-[[data-pending]]/product-rating:animate-pulse"
      pending
    >
      <Skeleton.Box className="h-4 w-[100px] rounded-md" />
      <Skeleton.Box className="h-6 w-8 rounded-xl" />
    </Skeleton.Root>
  );
}

function ProductSummarySkeleton() {
  return (
    <Skeleton.Root
      className="flex w-full flex-col gap-3.5 pb-6 group-has-[[data-pending]]/product-summary:animate-pulse"
      pending
    >
      {Array.from({ length: 3 }).map((_, idx) => (
        <Skeleton.Box className="h-2.5 w-full" key={idx} />
      ))}
    </Skeleton.Root>
  );
}


function ProductBulletsSkeleton() {
  return (
    <Skeleton.Root
      className="flex w-full flex-col gap-3.5 pb-6 group-has-[[data-pending]]/product-bullets:animate-pulse"
      pending
    >
      {Array.from({ length: 2 }).map((_, idx) => (
        <Skeleton.Box className="h-2.5 w-full" key={idx} />
      ))}
      <Skeleton.Box className="h-2.5 w-3/4" />
    </Skeleton.Root>
  );
}

function ProductDescriptionSkeleton() {
  return (
    <Skeleton.Root
      className="flex w-full flex-col gap-3.5 pb-6 group-has-[[data-pending]]/product-description:animate-pulse"
      pending
    >
      {Array.from({ length: 2 }).map((_, idx) => (
        <Skeleton.Box className="h-2.5 w-full" key={idx} />
      ))}
      <Skeleton.Box className="h-2.5 w-3/4" />
    </Skeleton.Root>
  );
}

function ProductDetailFormSkeleton() {
  return (
    <Skeleton.Root
      className="flex flex-col gap-8 py-8 group-has-[[data-pending]]/product-detail-form:animate-pulse"
      pending
    >
      <div className="flex flex-col gap-5">
        <Skeleton.Box className="h-2 w-10 rounded-md" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton.Box className="h-11 w-[72px] rounded-full" key={idx} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton.Box className="h-3 w-16 rounded-md" />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton.Box className="h-10 w-10 rounded-full" key={idx} />
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton.Box className="h-12 w-[120px] rounded-lg" />
        <Skeleton.Box className="h-12 w-[216px] rounded-full" />
      </div>
    </Skeleton.Root>
  );
}

function ProductAccordionsSkeleton() {
  return (
    <Skeleton.Root
      className="flex h-[600px] w-full flex-col gap-8 pt-4 group-has-[[data-pending]]/product-accordion:animate-pulse"
      pending
    >
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-20 rounded-sm" />
        <Skeleton.Box className="h-3 w-3 rounded-sm" />
      </div>
      <div className="mb-1 flex flex-col gap-4">
        <Skeleton.Box className="h-3 w-full rounded-sm" />
        <Skeleton.Box className="h-3 w-full rounded-sm" />
        <Skeleton.Box className="h-3 w-3/5 rounded-sm" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-24 rounded-sm" />
        <Skeleton.Box className="h-3 w-3 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-20 rounded-sm" />
        <Skeleton.Box className="h-3 w-3 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton.Box className="h-2 w-32 rounded-sm" />
        <Skeleton.Box className="h-3 w-3 rounded-full" />
      </div>
    </Skeleton.Root>
  );
}

export function ProductDetailSkeleton() {
  return (
    <Skeleton.Root
      className="grid grid-cols-1 items-stretch gap-x-6 gap-y-8 group-has-[[data-pending]]/product-detail:animate-pulse @2xl:grid-cols-2 @5xl:gap-x-12"
      pending
    >
      <div className="hidden @2xl:block">
        <ProductGallerySkeleton />
      </div>
      <div>
        <Skeleton.Box className="mb-6 h-4 w-20 rounded-lg" />
        <Skeleton.Box className="mb-6 h-6 w-72 rounded-lg" />
        <RatingSkeleton />
        <PriceLabelSkeleton />
        <ProductSummarySkeleton />
        <div className="mb-8 @2xl:hidden">
          <ProductGallerySkeleton />
        </div>
        <ProductDetailFormSkeleton />
      </div>
    </Skeleton.Root>
  );
}
