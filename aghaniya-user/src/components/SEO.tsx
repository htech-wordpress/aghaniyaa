import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogUrl?: string;
}

export function SEO({ title, description, keywords, ogImage, ogUrl }: SEOProps) {
    useEffect(() => {
        // Update Document Title
        const baseTitle = 'Aghaniya Enterprises LLP';
        document.title = `${title} | ${baseTitle}`;

        // Update Meta Description
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', description);

            // Also update OG and Twitter descriptions
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
            document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', description);
        }

        // Update Meta Keywords
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.setAttribute('name', 'keywords');
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute('content', keywords);
        }

        // Update OG Title
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${title} | ${baseTitle}`);
        document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', `${title} | ${baseTitle}`);

        // Update OG Image
        if (ogImage) {
            document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogImage);
            document.querySelector('meta[property="twitter:image"]')?.setAttribute('content', ogImage);
        }

        // Update OG URL
        if (ogUrl) {
            document.querySelector('meta[property="og:url"]')?.setAttribute('content', ogUrl);
            document.querySelector('meta[property="twitter:url"]')?.setAttribute('content', ogUrl);
        }

        // Optional: Reset on unmount
        return () => {
            // We could reset to defaults here, but often SPA users prefer 
            // the last set tags until the next page sets them.
        };
    }, [title, description, keywords, ogImage, ogUrl]);

    return null;
}
