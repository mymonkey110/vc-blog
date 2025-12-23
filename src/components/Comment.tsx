'use client';

import { toSlug } from '@/utils/slug';
import dayjs from 'dayjs';
import { DiscussionEmbed } from 'disqus-react';
import { usePathname } from 'next/navigation';

interface CommentProps {
  title: string;
}

export default function Comment({ title }: CommentProps) {
  const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const pathname = usePathname();

  if (!disqusShortname || !domain) {
    return (
      <div className="text-sm font-ui text-secondary-text italic">
        Disqus configuration is missing. Please set NEXT_PUBLIC_DISQUS_SHORTNAME and
        NEXT_PUBLIC_DOMAIN in .env file.
      </div>
    );
  }

  const decodedPathname = decodeURI(pathname || '');
  const finalUrl = `http://${domain}${encodeURI(decodedPathname).toLowerCase()}`;
  //const finalIdentifier = decodedPathname.startsWith('/') ? decodedPathname.slice(1) : decodedPathname;

  const disqusConfig = {
    url: finalUrl,
    identifier: decodedPathname,
    title: title,
  };

  console.log('disqusConfig', disqusConfig);
  return (
    <div className="mt-4">
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
}
