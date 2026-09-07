import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/log'],
        disallow: [
          '/experience',
          '/correction',
          '/withdraw',
          '/invoice',
          '/marketing',
          '/privacy',
          '/tos',
          '/verify',
          '/login/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
