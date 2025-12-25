'use client';

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
  const finalUrl = `${domain}${encodeURI(decodedPathname).toLowerCase()}`;
  const oldIdentifier =
    title === 'about'
      ? 'about/index.html'
      : decodedPathname.startsWith('/article/')
        ? decodedPathname.replace('/article/', '') + '/'
        : decodedPathname;

  const disqusConfig = {
    url: finalUrl,
    identifier: oldIdentifier,
    title: title,
  };

  return (
    <div className="mt-4">
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
}
