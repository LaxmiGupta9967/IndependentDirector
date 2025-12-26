
import { GoogleGenAI, Type } from "@google/genai";
import { Director, ChatMessage } from "../types";

// AI Smart Search: Processes natural language query to filter directors
export const processSearchQuery = async (query: string, directors: Director[]): Promise<Director[]> => {
    // Fix: Always use named parameter { apiKey: process.env.API_KEY } as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const directorDataForPrompt = directors.map(d => 
            `ID: ${d.id}, Name: ${d.name}, Industry: ${d.industry}, Description: ${d.description}, Age: ${d.age}, DIN: ${d.dinNumber}, Currently Serving: ${d.isCurrentDirector}, Years of Experience: ${d.yearsOfExperience}, IOD Certified: ${d.isIODCertified}, Sectors Served: ${d.sectorsServed?.join(', ')}`
        ).join('\n');

        const prompt = `
            You are an expert director search assistant. A user is searching for independent directors with the query: "${query}".
            Analyze the following list of directors and return a JSON array of director IDs that best match the user's query, ranked by relevance.
            The list of directors is:
            ${directorDataForPrompt}

            Consider all aspects of the query, such as industry, experience (total 'Years of Experience'), age, DIN, certification status, sectors served, and keywords.
            If the query is "Top directors in transport with 10+ years experience", you should look for directors with experience in the 'Transport' industry or 'Sectors Served' and 'Years of Experience' greater than 10.
            Return only a JSON array of strings, where each string is a matching director ID. For example: ["3", "2"].
        `;

        // Fix: Use gemini-3-pro-preview for complex reasoning tasks
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });

        const rankedIds: string[] = JSON.parse(response.text || '[]');
        
        if (!Array.isArray(rankedIds)) {
            console.error("Gemini did not return a valid array of IDs");
            return [];
        }

        // Return directors in the order provided by Gemini
        const rankedDirectors = rankedIds
            .map(id => directors.find(d => d.id === id))
            .filter((d): d is Director => d !== undefined);

        return rankedDirectors;
    } catch (error) {
        console.error("Error processing search query with Gemini:", error);
        throw error;
    }
};

// AI Director Summary Generator
export const generateDirectorSummary = async (director: Director): Promise<string> => {
    // Fix: Always use named parameter { apiKey: process.env.API_KEY } as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const prompt = `
            Generate a concise, professional summary for the following independent director. Highlight their expertise, experience, and key skills based on the provided data.
            The summary should be about 2-3 sentences long.

            Full Name: ${director.name}
            Age: ${director.age || 'N/A'}
            DIN Number: ${director.dinNumber || 'N/A'}
            Industry Focus: ${director.industry}
            Bio: ${director.description}
            Total Years of Experience as ID: ${director.yearsOfExperience ? director.yearsOfExperience + ' years' : 'N/A'}
            Currently Serving as ID: ${director.isCurrentDirector !== undefined ? (director.isCurrentDirector ? 'Yes' : 'No') : 'N/A'}
            IOD Certified: ${director.isIODCertified !== undefined ? (director.isIODCertified ? 'Yes' : 'No') : 'N/A'}
            Sectors Served: ${director.sectorsServed?.join(', ') || 'N/A'}
            Current Sectors Serving: ${director.currentSectors?.join(', ') || 'N/A'}
            International Boards: ${director.internationalBoards?.join(', ') || 'N/A'}
            Committee Memberships: ${director.committeeCount || 'N/A'}
        `;

        // Fix: Use gemini-3-flash-preview for basic text tasks
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        return response.text?.trim() || "Summary not available.";
    } catch (error) {
        console.error("Error generating director summary:", error);
        return "Could not generate AI summary at this time.";
    }
};

// AI Similar Directors Recommender
export const getSimilarDirectors = async (currentDirector: Director, allDirectors: Director[]): Promise<Director[]> => {
    // Fix: Always use named parameter { apiKey: process.env.API_KEY } as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const otherDirectors = allDirectors.filter(d => d.id !== currentDirector.id);
        const directorDataForPrompt = otherDirectors.map(d => 
            `ID: ${d.id}, Name: ${d.name}, Industry: ${d.industry}, Description: ${d.description}, Sectors Served: ${d.sectorsServed?.join(', ')}, Years of Experience: ${d.yearsOfExperience}`
        ).join('\n');

        const prompt = `
            You are a professional network analyst. The user is currently viewing the profile for "${currentDirector.name}", a director with experience in the "${currentDirector.industry}" industry who has also served in sectors like "${currentDirector.sectorsServed?.join(', ')}".
            Based on this, recommend up to 3 similar directors from the following list. Prioritize directors in the same industry, with overlapping sectors served, or a similar number of years of experience.
            
            List of available directors:
            ${directorDataForPrompt}

            Return a JSON array of the recommended director IDs. For example: ["4", "1"]. Do not include the current director's ID (${currentDirector.id}).
        `;

        // Fix: Use gemini-3-pro-preview for similarity analysis
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
             config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });

        const recommendedIds: string[] = JSON.parse(response.text || '[]');

        if (!Array.isArray(recommendedIds)) {
            return [];
        }

        return recommendedIds
            .map(id => allDirectors.find(d => d.id === id))
            .filter((d): d is Director => d !== undefined);

    } catch (error) {
        console.error("Error getting similar directors:", error);
        return [];
    }
};

// AI Chatbot Assistant
export const getChatbotResponse = async (history: ChatMessage[], newMessage: string, directors: Director[]): Promise<string> => {
    // Fix: Always use named parameter { apiKey: process.env.API_KEY } as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const directorDataForContext = directors.map(d => 
            `ID: ${d.id}, Name: ${d.name}, Industry: ${d.industry}, Description: ${d.description}, Age: ${d.age}, DIN Number: ${d.dinNumber}, Currently Serving as Independent Director: ${d.isCurrentDirector}, Total Years of Experience: ${d.yearsOfExperience} years, Sectors Served: ${d.sectorsServed?.join(', ')}, IOD Certified: ${d.isIODCertified}, International Boards: ${d.internationalBoards?.join(', ')}`
        ).join('\n---\n');

        const systemInstruction = `You are a helpful chatbot assistant for an Independent Director directory. Your goal is to help users find independent directors based on their criteria.
        You have access to the following director data:
        ${directorDataForContext}

        Answer the user's questions based on this data. If a user asks "Show me directors with healthcare experience and over 15 years experience," identify the matching directors and present them clearly. Be friendly and concise.`;

        const contents = history.map(h => ({
            role: h.role,
            parts: [{text: h.parts}]
        }));
        contents.push({ role: 'user', parts: [{ text: newMessage }] });

        // Fix: Use gemini-3-flash-preview for real-time chatbot interaction
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text?.trim() || "I'm sorry, I couldn't process your request.";
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    }
};
