
import React from 'react';
import { Director } from '../types';

interface DirectorCardProps {
    director: Director;
    onSelect: (id: string) => void;
}

const DirectorCard: React.FC<DirectorCardProps> = ({ director, onSelect }) => {
    return (
        <div 
            className="glass-card rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
            onClick={() => onSelect(director.id)}
            role="button"
            aria-label={`View details for ${director.name}`}
        >
            {/* Director Logo/Photo */}
            {director.logoUrl && (
                <img 
                    src={director.logoUrl} 
                    alt={`${director.name} profile photo`} 
                    className="w-28 h-28 rounded-full mb-4 border-2 border-teal-400/50 object-cover bg-white"
                />
            )}

            {/* Basic Info */}
            <h3 className="text-2xl font-bold text-white mb-1">{director.name}</h3>
            <p className="text-teal-400 text-sm font-semibold mb-2">{director.industry}</p>
            <p className="text-white text-sm mb-4 line-clamp-3 flex-grow">{director.description}</p>
            
            {/* Professional Details Section */}
            <div className="w-full text-left text-white space-y-2 text-sm mt-4 pt-4 border-t border-teal-400/20">
                {director.dinNumber && <p><span className="font-semibold text-teal-300">DIN:</span> {director.dinNumber}</p>}
                {director.age && <p><span className="font-semibold text-teal-300">Age:</span> {director.age}</p>}
                {director.yearsOfExperience !== undefined && <p><span className="font-semibold text-teal-300">Total Experience:</span> {director.yearsOfExperience} years</p>}
                {director.isCurrentDirector !== undefined && <p><span className="font-semibold text-teal-300">Currently Serving:</span> {director.isCurrentDirector ? 'Yes' : 'No'}</p>}
                {director.isIODCertified !== undefined && <p><span className="font-semibold text-teal-300">IOD Certified:</span> {director.isIODCertified ? 'Yes' : 'No'}</p>}
            </div>

            <button
                onClick={() => onSelect(director.id)}
                className="mt-6 inline-block bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
            >
                View Details
            </button>
        </div>
    );
};

export default DirectorCard;
