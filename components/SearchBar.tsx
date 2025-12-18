
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useSearch, SearchResult } from '../hooks/useSearch';
import { DemoId } from '../types';

interface SearchBarProps {
    onResultClick: (moduleId: DemoId) => void;
    className?: string;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const SearchBar: React.FC<SearchBarProps> = ({ onResultClick, className }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const results = useSearch(debouncedQuery);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleResultClick = (moduleId: DemoId) => {
        onResultClick(moduleId);
        setQuery('');
        setIsFocused(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const showResults = isFocused && query.length > 0;

    return (
        <div className={`relative ${className ?? 'hidden md:block w-64'}`} ref={wrapperRef}>
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                    type="text"
                    placeholder="Search topics..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 w-full text-sm focus:ring-2 focus:ring-[#d4af37] focus:outline-none transition-all text-white placeholder-white/40"
                />
            </div>

            {showResults && (
                <div className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-50 scrollbar-thin scrollbar-thumb-white/20">
                    {results.length > 0 ? (
                        <ul>
                            {results.map(({ item, highlightedSnippet }) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleResultClick(item.id)}
                                        className="w-full text-left p-4 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl mt-1 filter drop-shadow-lg">{item.icon}</span>
                                            <div className="min-w-0">
                                                <p className="font-bold text-white text-sm group-hover:text-[var(--gold)] transition-colors truncate">{item.title}</p>
                                                <p
                                                    className="text-xs text-white/60 line-clamp-2 mt-1 leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: highlightedSnippet }}
                                                />
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-sm text-white/60">
                            No results found for "<span className="text-white">{query}</span>"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
