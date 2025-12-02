import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

const BrandsPageQuery = graphql(`
  query BrandsPageQuery {
    site {
      brands(first: 30) {
        edges {
          node {
            entityId
            name
            path
            defaultImage {
             url: urlTemplate(lossy: true)
              altText
            }
          }
        }
      }
    }
  }
`);

export type Brand = {
  entityId: number;
  name: string;
  path: string;
  imageUrl: string | null;
};

export const getBrands = cache(async (): Promise<Brand[]> => {
  const response = await client.fetch({
    document: BrandsPageQuery,
    fetchOptions: { next: { revalidate } },
  });

  const brands = removeEdgesAndNodes(response.data.site?.brands) ?? [];

  const normalizeUrl = (url?: string | null) => {
    if (!url) return null;

    if (url.startsWith('//')) {
      return `https:${url}`;
    }

    return url;
  };

  return brands.map((brand) => ({
    entityId: brand.entityId,
    name: brand.name,
    path: brand.path,
    imageUrl: normalizeUrl(brand.defaultImage?.url),
  }));
});
