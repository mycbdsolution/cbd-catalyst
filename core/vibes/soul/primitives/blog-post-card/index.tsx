import { clsx } from 'clsx';

import { Image } from '~/components/image';
import { Link } from '~/components/link';

export interface BlogPostCardBlogPost {
  id: string;
  author?: string | null;
  content: string;
  date: string;
  image?: {
    src: string;
    alt: string;
  };
  href: string;
  title: string;
}

interface Props {
  blogPost: BlogPostCardBlogPost;
  className?: string;
}

export function BlogPostCard({ blogPost, className }: Props) {
  const { author, content, date, href, image, title } = blogPost;

  return (

            
<article className="relative isolate flex flex-col gap-8 lg:flex-row">
                <div className="relative aspect-[1/1] overflow-hidden  lg:w-64 lg:shrink-0">
 
                {image?.src != null && image.src !== '' ? (
                        <Image
                          alt={image.alt}
                          className="absolute object-cover inset-0 size-full rounded-2xl"
                          fill
                          sizes="(min-width: 80rem) 25vw, (min-width: 56rem) 33vw, (min-width: 28rem) 50vw, 100vw"
                          src={image.src}
                        />
                      ) : (
                      <Image
                          alt="laceholder image"
                          className="absolute object-cover inset-0 size-full rounded-2xl"
                          fill
                          sizes="(min-width: 80rem) 25vw, (min-width: 56rem) 33vw, (min-width: 28rem) 50vw, 100vw"
                          src="https://placehold.co/400"
                        />
                      )}
      
                  <div className="absolute inset-0 rounded-2xl shadow-md" />
                </div>
                <div>
                  <div className="flex items-center gap-x-4 text-xs">


                        <time dateTime={date} className="text-green-400">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        {date !== '' && author != null && author !== '' && (
          <span className="after:mx-2 after:content-['•']" />
        )}
              

                  </div>
                  <div className="group relative max-w-xl">
                    <h3 className="text-2xl font-bold leading-none tracking-tighter xl:text-5xl">
                        <Link href={href}>
                        <span className="absolute inset-0" />
                                {title}
                        </Link>
                    </h3>
                    <p className="truncat mt-5 text-sm/6 text-gray-600 dark:text-gray-400">{content}...</p>
                  </div>
                  <div className="mt-6 flex border-t border-gray-900/5 pt-6 dark:border-white/10">
                    <div className="relative flex items-center gap-x-4">
                   
                      <div className="text-sm/6">
                           <Link href={href} className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800">
                category here
                </Link>
                      </div>

                    </div>
                  </div>
                </div>
              </article>


  );
}

export function BlogPostCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('flex max-w-md animate-pulse flex-col gap-2 rounded-xl', className)}>
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-contrast-100" />

      {/* Title */}
      <div className="h-4 w-24 rounded-lg bg-contrast-100" />

      {/* Content */}
      <div className="h-3 w-full rounded-lg bg-contrast-100" />
      <div className="h-3 w-full rounded-lg bg-contrast-100" />
      <div className="h-3 w-1/2 rounded-lg bg-contrast-100" />

      <div className="flex flex-wrap items-center">
        {/* Date */}
        <div className="h-4 w-16 rounded-lg bg-contrast-100" />
        <span className="after:mx-2 after:text-contrast-100 after:content-['•']" />
        {/* Author */}
        <div className="h-4 w-20 rounded-lg bg-contrast-100" />
      </div>
    </div>
  );
}
