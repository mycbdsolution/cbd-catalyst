import { SectionLayout } from '@/vibes/soul/sections/section-layout';
import { Image } from '~/components/image';
import { Link } from '~/components/link';

export type BrandCard = {
  entityId: number;
  name: string;
  path: string;
  imageUrl: string | null;
};

interface Props {
  title: string;
  description?: string;
  brands: BrandCard[];
}

export function BrandsList({ title, description, brands }: Props) {
  const hasValidImage = (src: string | null): src is string =>
    !!src && (/^https?:\/\//.test(src) || src.startsWith('/'));

  return (
    <SectionLayout>
      <div className="pt-6">
        <h1 className="mb-3 font-heading text-4xl font-medium leading-none text-foreground @xl:text-5xl @4xl:text-6xl">
          {title}
        </h1>

        {description != null && description !== '' && (
          <p className="max-w-lg text-lg text-contrast-500">{description}</p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-5 @md:grid-cols-3 @xl:grid-cols-4 @4xl:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.entityId}
              href={brand.path}
              className="group block rounded-2xl border border-contrast-100 bg-contrast-50/40 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white">
                {hasValidImage(brand.imageUrl) ? (
                  <Image
                    fill
                    alt={brand.name}
                    className="object-contain p-3 transition duration-300 group-hover:scale-105"
                    sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
                    src={brand.imageUrl}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-contrast-400">
                    {brand.name}
                  </div>
                )}



              </div>

              <p className="mt-3 text-center text-sm font-normal text-gray-500 transition group-hover:text-primary">
                {brand.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
