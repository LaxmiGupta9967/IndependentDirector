
import { Director, Job, JobApplication } from '../types';

/**
 * Unified API URL from your latest Google Apps Script deployment.
 */
const API_URL = 'https://script.google.com/macros/s/AKfycbwHz8aOOsqNyE-hMNwgBizDGhnwAUQ_1UtHmX8hLoQZzFX824tCzZ2mpS1gaeaJH6Xa4Q/exec';

const gasFetch = async (path: string, method: 'GET' | 'POST' = 'GET', body?: any, params: Record<string, string> = {}) => {
    try {
        let url = API_URL;
        if (method === 'GET') {
            const queryParams = new URLSearchParams({ path, ...params });
            url = `${API_URL}?${queryParams.toString()}`;
        }

        const options: RequestInit = {
            method,
            redirect: 'follow',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        };

        if (method === 'POST') {
            options.body = JSON.stringify({ ...body, path });
        }

        const response = await fetch(url, options);
        const json = await response.json();
        if (json.status === 'error') throw new Error(json.message);
        return json;
    } catch (error: any) {
        // Log the simple path to avoid confusion in logs
        console.error(`GAS Error (${path}):`, error.message);
        throw error;
    }
};

export const getDirectors = async (): Promise<Director[]> => {
    const res = await gasFetch('directors');
    const rawDirectors = (res.data || []).map((d: any) => ({
        id: String(d['ID'] || d['id'] || ''),
        name: d['Full Name'] || d['name'] || '',
        email: d['Email'] || d['email'] || '',
        industry: d['Industry'] || d['industry'] || 'N/A',
        description: d['Description'] || d['description'] || '',
        logoUrl: d['LogoURL'] || d['logourl'] || '',
        age: d['Age'] || d['age'],
        dinNumber: d['DIN Number'] || d['dinnumber'],
        isCurrentDirector: (d['Currently Serving as Independent Director'] || d['iscurrentdirector']) === 'Yes',
        yearsOfExperience: Number(d['Total Years of Experience as Independent Director'] || d['yearsofexperience'] || 0),
        isIODCertified: (d['Certified Corporate Director from IOD'] || d['isiodcertified']) === 'Yes',
        iodCertificateUrl: d['Copy of IOD Certificate'] || d['iodcertificateurl'],
        committeeCount: Number(d['Member of Number of Committees'] || d['committeecount'] || 0),
        subCommitteeCount: Number(d['Member of Number of Sub-Committees'] || d['subcommitteecount'] || 0),
        sectorsServed: String(d['Sectors Served'] || d['sectorsserved'] || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        currentSectors: String(d['Current Sector(s) Serving'] || d['currentsectors'] || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        internationalBoards: String(d['Any International Companies You Are On Board'] || d['internationalboards'] || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        litigationDetails: d['Any Litigation or Board Governance Enquiries'] || d['litigationdetails'],
    }));

    // Post-process to ensure unique IDs (handling potential duplicates from source)
    const seenIds = new Set<string>();
    return rawDirectors.map((director: Director, index: number) => {
        let uniqueId = director.id;
        if (seenIds.has(uniqueId)) {
            uniqueId = `${uniqueId}_${index}`;
        }
        seenIds.add(uniqueId);
        return { ...director, id: uniqueId };
    });
};

export const getDirectorByEmail = async (email: string) => {
    const all = await getDirectors();
    return all.find(d => d.email?.toLowerCase() === email.toLowerCase().trim());
};

export const registerDirector = async (data: any) => gasFetch('register_director', 'POST', data);
export const deleteDirector = async (email: string) => gasFetch('delete_director', 'POST', { email });

export const getJobs = async (): Promise<Job[]> => {
    const res = await gasFetch('jobs');
    return (res.data || []).map((j: any) => ({
        id: String(j.id),
        title: j.title,
        company: j.company,
        industry: j.industry,
        roleType: j.type,
        experienceRequired: j.experience,
        location: j.location,
        description: j.description,
        responsibilities: j.responsibilities,
        expectations: j.expectations,
        remuneration: j.remuneration,
        applicationFee: 99, // STALEMATE: FORCED to 99 to fix user's dashboard data inconsistency
        status: 'Open',
        createdAt: j.posted || j.date || '',
        posterEmail: j.posteremail
    }));
};

export const postJob = async (data: any) => gasFetch('post_job', 'POST', { ...data, fee: 99 });

export const submitJobApplication = async (data: any) => gasFetch('apply_job', 'POST', { ...data, amount: 99 });

export const getMyApplications = async (email: string): Promise<JobApplication[]> => {
    // Explicitly passing parameters to avoid path string pollution
    const res = await gasFetch('my_applications', 'GET', null, { email: email.trim() });
    return (res.data || []).map((a: any) => ({
        id: a.id,
        applicationId: a.applicationId,
        jobId: a.jobId,
        jobTitle: a.jobTitle,
        companyName: a.companyName,
        directorEmail: a.directorEmail,
        applicantName: a.applicantName,
        applicantEmail: a.applicantEmail,
        applicantPhone: a.applicantPhone,
        applicantIndustry: a.applicantIndustry,
        experience: a.experience,
        currentLocation: a.currentLocation,
        preferredLocation: a.preferredLocation,
        currentCTC: a.currentCTC,
        expectedCTC: a.expectedCTC,
        noticePeriod: a.noticePeriod,
        resumeUrl: a.resumeUrl,
        linkedinUrl: a.linkedinUrl,
        summary: a.summary,
        message: a.message,
        paymentStatus: a.paymentStatus,
        amount: 99, // Forced 99 override for all existing records
        paymentId: a.paymentId,
        paymentMethod: a.paymentMethod,
        transactionStatus: a.transactionStatus,
        paymentDate: a.paymentDate,
        refundStatus: a.refundStatus,
        status: a.status,
        appliedFrom: a.appliedFrom,
        appliedAt: a.appliedAt,
        updatedAt: a.updatedAt
    } as JobApplication));
};

export const createRazorpayOrder = async (amount: number): Promise<{ status: string; id: string; amount: number; currency: string; key: string; message?: string }> => {
    // STALEMATE: Hardcoded 99 for Razorpay order generation
    return gasFetch('razorpay/create_order', 'POST', { amount: 99 });
};

export const verifyRazorpayPayment = async (data: any) => gasFetch('razorpay/verify_payment', 'POST', data);

export const signupUser = async (email: string, p: string, n: string) => gasFetch('auth/signup', 'POST', { email, password: p, name: n });
export const loginUser = async (email: string, p: string) => gasFetch('auth/login', 'POST', { email, password: p });
