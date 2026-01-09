
export interface Director {
    id: string;
    name: string; 
    email?: string; 
    industry: string;
    description: string;
    logoUrl: string;
    age?: number;
    dinNumber?: string;
    isCurrentDirector?: boolean;
    yearsOfExperience?: number; 
    sectorsServed?: string[];
    currentSectors?: string[];
    committeeCount?: number; 
    subCommitteeCount?: number; 
    isIODCertified?: boolean; 
    iodCertificateUrl?: string; 
    internationalBoards?: string[]; 
    litigationDetails?: string; 
}

export interface Job {
    id: string;
    title: string;
    company: string;
    industry: string;
    roleType: 'Independent' | 'Advisory' | 'Mentor';
    experienceRequired: string;
    location: string;
    description: string;
    responsibilities: string;
    expectations: string;
    remuneration?: string;
    applicationFee: number;
    status: 'Open' | 'Closed';
    createdAt: string;
    posterEmail?: string;
}

export interface CertificationApplication {
    fullName: string;
    email: string;
    mobile: string;
    cityCountry: string;
    yearsOfExperience: string;
    designation: string;
    industryExpertise: string;
    functionalExpertise: string;
    priorBoardExperience: string;
    interestedRole: string;
    areasOfInterest: string;
    din: string;
    pan: string;
    mcaRegistered: string;
    willingToTest: string;
    cvUrl: string;
    interestStatement: string;
    paymentId?: string; // Track the transaction
}

export interface JobApplication {
    id: string;                // Col A
    applicationId: string;     // Col B
    jobId: string;             // Col C
    jobTitle: string;          // Col D
    companyName: string;       // Col E
    directorEmail: string;     // Col F (Job Poster)
    applicantName: string;     // Col G
    applicantEmail: string;    // Col H
    applicantPhone: string;    // Col I
    applicantIndustry: string; // Col J
    experience: string;        // Col K
    currentLocation: string;   // Col L
    preferredLocation: string; // Col M
    currentCTC: string;        // Col N
    expectedCTC: string;       // Col O
    noticePeriod: string;      // Col P
    resumeUrl: string;         // Col Q
    linkedinUrl: string;       // Col R
    summary: string;           // Col S
    message: string;           // Col T
    paymentStatus: string;     // Col U
    amount: number;            // Col V
    paymentId: string;         // Col W
    paymentMethod: string;     // Col X
    transactionStatus: string; // Col Y
    paymentDate: string;       // Col Z
    refundStatus: string;      // Col AA
    status: string;            // Col AB (Mapping to 'status' field in second getApps function)
    appliedFrom: string;       // Col AC
    appliedAt: string;         // Col AD
    updatedAt: string;         // Col AE
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
}
