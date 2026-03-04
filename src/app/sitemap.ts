import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/topup`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/log`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];
}
