import { ReactNode } from 'react';

import { SectionLayout } from '@/vibes/soul/sections/section-layout';

export interface BrandDescriptionProps {
  title: string;
  name: string;
  description?: ReactNode;
}


const brandDescriptions = [
  {
    name: 'CBD Clinic',
    description: `<p>CBD Clinic offers advanced topical solutions that redefine non-prescription pain relief. Developed in a cGMP-audited manufacturing facility, each product undergoes rigorous quality control to ensure safety, consistency, and maximum effectiveness.</p>
    <p>Combining pharmaceutical-grade active ingredients with CBD-rich broad-spectrum hemp extract and soothing natural emollients, CBD Clinic’s creams, ointments, and massage oils are designed to increase blood flow, interrupt pain signaling, and promote recovery.

</p>
    <p>Whether you’re dealing with sore muscles, stiff joints, or everyday discomfort, CBD Clinic’s cutting-edge formulations provide targeted relief to keep you active and feeling your best.</p>`,
  },
  {
    name: 'CryoFreeze CBD',
    description: 'this is brand description for cryofreeze cbd.',
  },
];

export function BrandDescription({
  title,
  name,
  description,
}: BrandDescriptionProps) {
  const normalizedName = name.trim().toLowerCase();
  const matchedDescription =
    brandDescriptions.find(
      (brandDescription) => brandDescription.name.toLowerCase() === normalizedName,
    )?.description ?? description;

  if (!matchedDescription) {
    return null;
  }

  return (
    <SectionLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold leading-none tracking-tight text-primary @2xl:text-3xl @4xl:text-5xl">
          {title}
        </h2>
        {typeof matchedDescription === 'string' ? (
          <div
            className="prose max-w-none border-t border-[var(--product-detail-border,hsl(var(--contrast-100)))] py-8 [&>div>*:first-child]:mt-0 [&>div>*:last-child]:mb-0 2xl:prose-lg"
            dangerouslySetInnerHTML={{ __html: matchedDescription }}
          />
        ) : (
          <div className="prose max-w-none border-t border-[var(--product-detail-border,hsl(var(--contrast-100)))] py-8 [&>div>*:first-child]:mt-0 [&>div>*:last-child]:mb-0 2xl:prose-lg">
            {matchedDescription}
          </div>
        )}
      </div>
    </SectionLayout>
  );
}
