import { useEffect } from 'react';

export function usePageMeta({ title, description }) {
    useEffect(() => {
        const baseTitle = 'JOSEPH.DEV — Software Engineering & IoT Portfolio';
        document.title = title ? `${title} | JOSEPH.DEV` : baseTitle;

        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', description);
        }
    }, [title, description]);
}