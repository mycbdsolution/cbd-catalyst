import { Streamable } from '@/vibes/soul/lib/streamable';
import { ButtonLink } from '@/vibes/soul/primitives/button-link';
import { Product } from '@/vibes/soul/primitives/product-card';
import { ProductList } from '@/vibes/soul/sections/product-list';
import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Link } from '~/components/link';
import { ArrowRight } from 'lucide-react';

interface Link {
  label: string;
  href: string;
}

export interface FeaturedProductsListProps {
  title: string;
  description?: string;
  cta?: Link;
  products: Streamable<Product[]>;
  emptyStateTitle?: Streamable<string>;
  emptyStateSubtitle?: Streamable<string>;
  placeholderCount?: number;
}

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --featured-product-list-font-family: var(--font-family-body);
 *   --featured-product-list-title-font-family: var(--font-family-heading);
 *   --featured-product-list-title: hsl(var(--foreground));
 *   --featured-product-list-description: hsl(var(--contrast-500));
 * }
 * ```
 */
export function FeaturedProductList({
  title,
  description,
  cta,
  products,
  emptyStateTitle,
  emptyStateSubtitle,
  placeholderCount,
}: FeaturedProductsListProps) {
  return (
    
   <SectionLayout>

<header className="font-[family-name:var(--featured-product-list-font-family,var(--font-family-body))]">
    
      <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold leading-none tracking-tighter text-gray-900 @2xl:text-3xl @4xl:text-5xl"> {title}</h2>
            {cta?.href != null && cta.href !== '' && cta.label !== '' && (
           <Link href={cta.href} className="text-sm font-medium text-primary @2xl:text-lg">
              {cta.label}
              <ArrowRight className="ml-1 inline-block h-4 w-4" />
            </Link>
          )}
        </div>
        
        </header>


       

      <div className="group/product-list flex-1">
        <ProductList className='@3xl:grid-cols-4'
          emptyStateSubtitle={emptyStateSubtitle}
          emptyStateTitle={emptyStateTitle}
          placeholderCount={placeholderCount}
          products={products}
          showCompare={false}

        />
      </div>
      </SectionLayout>
  
  );
}
