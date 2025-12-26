
import React from 'react';
import { Director } from '../types';
import DirectorCard from '../components/DirectorCard';
import SearchBar from '../components/SearchBar';

interface DirectoryPageProps {
    directors: Director[];
    onSelectDirector: (id: string) => void;
    onSearch: (query: string) => void;
}

const DirectoryPage: React.FC<DirectoryPageProps> = ({ directors, onSelectDirector, onSearch }) => {
    return (
        <div className="container mx-auto px-6 py-12 max-w-screen-2xl">
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Director Directory</h1>
                <p className="text-white mb-6 max-w-2xl text-center">
                    Browse verified independent directors or use our AI-powered search to find exactly what you're looking for.
                </p>
                <div className="w-full max-w-2xl">
                    <SearchBar onSearch={onSearch} />
                </div>
            </div>

            {directors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {directors.map(director => (
                        <DirectorCard key={director.id} director={director} onSelect={onSelectDirector} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl text-white">No Directors Found</h2>
                    <p className="text-white mt-2">Try adjusting your search query.</p>
                </div>
            )}
        </div>
    );
};

export default DirectoryPage;