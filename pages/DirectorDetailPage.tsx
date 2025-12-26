
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Director } from '../types';

interface DirectorDetailPageProps {
  director: Director;
  onBack: () => void;
}

const DirectorDetailPage: React.FC<DirectorDetailPageProps> = ({
  director,
  onBack,
}) => {
  // Fix: Cast motion components to any to bypass environment-specific type errors for motion props
  const MotionDiv = motion.div as any;
  const MotionImg = motion.img as any;

  useEffect(() => {
    if (director) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [director]);

  if (!director) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="container mx-auto px-6 py-12 max-w-screen-2xl"
    >
      <button
        onClick={onBack}
        className="mb-8 text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-2"
      >
        <span className="text-lg">←</span> Back to Directory
      </button>

      <div className="glass-card rounded-xl p-8 backdrop-blur-xl border-teal-500/20 bg-gradient-to-br from-slate-800/60 to-slate-900/80 text-white">
        <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
          <MotionImg
            src={director.logoUrl}
            alt={`${director.name} profile photo`}
            className="w-32 h-32 rounded-full border-4 border-teal-400/50 bg-white object-contain shadow-md"
            whileHover={{ rotate: 5 }}
            transition={{ type: 'spring', stiffness: 150 }}
          />
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{director.name}</h1>
            <p className="text-teal-400 font-semibold">{director.industry}</p>
          </div>
        </div>

        {/* --- About --- */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">About</h3>
            <p>{director.description || 'No description available.'}</p>
          </div>
        </div>
        
        {/* --- Professional Details --- */}
        <div className="mt-6 pt-6 border-t border-teal-500/20">
          <h3 className="text-xl font-bold text-white mb-4">Professional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm">
              {director.dinNumber && <div><p className="font-semibold text-teal-300">DIN Number</p><p>{director.dinNumber}</p></div>}
              {director.age && <div><p className="font-semibold text-teal-300">Age</p><p>{director.age}</p></div>}
              {director.yearsOfExperience !== undefined && <div><p className="font-semibold text-teal-300">Total ID Experience</p><p>{director.yearsOfExperience} years</p></div>}
              {director.isCurrentDirector !== undefined && <div><p className="font-semibold text-teal-300">Currently Serving as ID</p><p>{director.isCurrentDirector ? 'Yes' : 'No'}</p></div>}
              {director.isIODCertified !== undefined && <div><p className="font-semibold text-teal-300">IOD Certified</p><p>{director.isIODCertified ? 'Yes' : 'No'}</p></div>}
              {director.committeeCount !== undefined && <div><p className="font-semibold text-teal-300">Committee Memberships</p><p>{director.committeeCount}</p></div>}
              {director.subCommitteeCount !== undefined && <div><p className="font-semibold text-teal-300">Sub-Committee Memberships</p><p>{director.subCommitteeCount}</p></div>}
              {director.iodCertificateUrl && (
                  <div>
                      <p className="font-semibold text-teal-300">IOD Certificate</p> 
                      <a href={director.iodCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Certificate</a>
                  </div>
              )}
              {director.sectorsServed && director.sectorsServed.length > 0 && (
                  <div className="md:col-span-2 lg:col-span-3"><p className="font-semibold text-teal-300">Sectors Served</p><p>{director.sectorsServed.join(', ')}</p></div>
              )}
              {director.currentSectors && director.currentSectors.length > 0 && (
                <div className="md:col-span-2 lg:col-span-3"><p className="font-semibold text-teal-300">Current Sectors Serving</p><p>{director.currentSectors.join(', ')}</p></div>
              )}
              {director.internationalBoards && director.internationalBoards.length > 0 && (
                  <div className="md:col-span-2 lg:col-span-3"><p className="font-semibold text-teal-300">On Board of International Companies</p><p>{director.internationalBoards.join(', ')}</p></div>
              )}
              {director.litigationDetails && <div className="md:col-span-2 lg:col-span-3"><p className="font-semibold text-teal-300">Litigation/Governance Enquiries</p><p>{director.litigationDetails}</p></div>}
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

export default DirectorDetailPage;
