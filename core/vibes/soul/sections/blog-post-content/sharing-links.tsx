'use client';

import { SiFacebook, SiPinterest, SiX } from '@icons-pack/react-simple-icons';
import { MailIcon, PrinterIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  emailLabel: string;
  path: string;
  printLabel: string;
  shareLabel: string;
  title: string;
}

const buttonClassName =
  'flex size-10 items-center justify-center rounded-full border border-contrast-200 text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [&_svg]:size-4';

export function SharingLinks({ emailLabel, path, printLabel, shareLabel, title }: Props) {
  const [url, setUrl] = useState(path);

  useEffect(() => {
    setUrl(new URL(path, window.location.origin).toString());
  }, [path]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="my-8 flex flex-wrap items-center gap-3 border-y border-contrast-200 py-4">
      <a
        aria-label="Share on Facebook"
        className={buttonClassName}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <SiFacebook aria-hidden="true" />
      </a>
      <a
        aria-label="Share on X"
        className={buttonClassName}
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <SiX aria-hidden="true" />
      </a>
      <a
        aria-label="Share on Pinterest"
        className={buttonClassName}
        href={`https://www.pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <SiPinterest aria-hidden="true" />
      </a>
      <a
        aria-label={emailLabel}
        className={buttonClassName}
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
      >
        <MailIcon aria-hidden="true" />
      </a>
      <button
        aria-label={printLabel}
        className={buttonClassName}
        onClick={() => window.print()}
        type="button"
      >
        <PrinterIcon aria-hidden="true" />
      </button>
    </div>
  );
}
