
import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-2xl">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Top directors in transport with 10+ years experience"
                className="w-full px-6 py-4 text-white rounded-l-lg glass-input focus:outline-none transition-shadow duration-300 placeholder-slate-400"
            />
            <button
                type="submit"
                className="px-6 py-4 text-white font-semibold rounded-r-lg transition-transform duration-300 transform hover:scale-105 glow-button"
            >
                Search
            </button>
        </form>
    );
};

export default SearchBar;