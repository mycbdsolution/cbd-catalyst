import { Leaf, Truck, Fingerprint, Undo2 } from 'lucide-react';

const perks = [
  { name: 'Premium products', description: 'Curated for quality & efficacy.', icon: Leaf },
  { name: 'Free shipping', description: 'All orders. No minimums.', icon: Truck },
   { name: 'Easy returns', description: 'Send it back for free', icon: Undo2 },
]

export default function FooterFeatures() {
  return (
    <section className="bg-gray-100">
      <h2 className="sr-only">Our perks</h2>
      <div className="mx-auto max-w-7xl divide-y divide-gray-200 lg:flex lg:justify-center lg:divide-x lg:divide-y-0 lg:py-12">
        {perks.map((perk, perkIdx) => (
          <div key={perkIdx} className="py-8 lg:w-1/3 lg:flex-none lg:py-0">
            <div className="mx-auto flex max-w-xs items-center px-4 lg:max-w-none lg:px-8">
              <perk.icon aria-hidden="true" className="size-8 shrink-0 text-primary" />
              <div className="ml-4 flex flex-auto flex-col-reverse">
                <h3 className="font-medium text-gray-900">{perk.name}</h3>
                <p className="text-sm text-gray-500">{perk.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
