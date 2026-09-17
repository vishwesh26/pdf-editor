import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PDF_TOOLS, getToolBySlug } from '@/lib/tools-data';
import ToolWorkstation from '@/components/tools/ToolWorkstation';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return PDF_TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | PustakEdits',
    };
  }

  const baseUrl = 'https://pustakedit.vercel.app';
  const canonicalUrl = `${baseUrl}/tools/${tool.slug}`;

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: canonicalUrl,
      siteName: 'PustakEdits',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `PustakEdits ${tool.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.metaTitle,
      description: tool.metaDescription,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Related tools from the same category or popular tools
  const relatedTools = PDF_TOOLS.filter(
    (t) => t.slug !== tool.slug && (t.category === tool.category || t.badge === 'Popular')
  ).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `PustakEdits ${tool.title}`,
    url: `https://pustakedit.vercel.app/tools/${tool.slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    description: tool.metaDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolWorkstation tool={tool} relatedTools={relatedTools} />
    </>
  );
}
