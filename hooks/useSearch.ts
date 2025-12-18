
import { useState, useEffect } from 'react';
import { searchIndex } from '../lib/searchIndex';
import { DemoId } from '../types';

export interface SearchIndexItem {
    id: DemoId;
    title: string;
    icon: string;
    content: string;
}

export interface SearchResult {
    item: SearchIndexItem;
    snippet: string;
    highlightedSnippet: string;
}

const createSnippet = (text: string, query: string): { snippet: string, highlightedSnippet: string } => {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);

    if (index === -1) {
        const shortText = text.length > 100 ? text.substring(0, 100) + '...' : text;
        return { snippet: shortText, highlightedSnippet: shortText };
    }
    
    // Snippet extraction
    const SNIPPET_RADIUS = 40;
    const start = Math.max(0, index - SNIPPET_RADIUS);
    const end = Math.min(text.length, index + query.length + SNIPPET_RADIUS);

    let fullSnippet = text.substring(start, end);
    
    // Add ellipsis
    const snippetWithEllipsis = (start > 0 ? '...' : '') + fullSnippet + (end < text.length ? '...' : '');

    // Escape special characters for regex
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Highlight matches
    const highlightedSnippet = snippetWithEllipsis.replace(
        new RegExp(`(${escapedQuery})`, 'gi'),
        '<strong class="bg-[#d4af37]/20 text-[#d4af37] rounded px-0.5 font-bold">$1</strong>'
    );

    return { snippet: snippetWithEllipsis, highlightedSnippet };
};

export const useSearch = (query: string): SearchResult[] => {
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const queryLower = query.toLowerCase();
        const searchResults = searchIndex
            .filter(item => item.content.toLowerCase().includes(queryLower))
            .map(item => {
                const { snippet, highlightedSnippet } = createSnippet(item.content, query);
                return { item, snippet, highlightedSnippet };
            });

        setResults(searchResults);

    }, [query]);

    return results;
};
