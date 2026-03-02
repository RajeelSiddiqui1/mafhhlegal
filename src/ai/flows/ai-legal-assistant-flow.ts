'use server';
/**
 * @fileOverview An AI legal assistant that answers questions about general legal procedures, definitions of legal terms, and Mafhh Legal services.
 *
 * - aiLegalAssistant - A function that handles the AI legal assistant queries.
 * - AILegalAssistantInput - The input type for the aiLegalAssistant function.
 * - AILegalAssistantOutput - The return type for the aiLegalAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AILegalAssistantInputSchema = z.object({
  question: z.string().describe("The user's legal question."),
});
export type AILegalAssistantInput = z.infer<typeof AILegalAssistantInputSchema>;

const AILegalAssistantOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the legal question."),
});
export type AILegalAssistantOutput = z.infer<typeof AILegalAssistantOutputSchema>;

export async function aiLegalAssistant(input: AILegalAssistantInput): Promise<AILegalAssistantOutput> {
  return aiLegalAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiLegalAssistantPrompt',
  input: {schema: AILegalAssistantInputSchema},
  output: {schema: AILegalAssistantOutputSchema},
  prompt: `You are an AI-powered legal assistant for Mafhh Legal, a paralegal services professional corporation in Ontario.
Your purpose is to provide general information about legal procedures, define legal terms, and describe the services offered by Mafhh Legal.
You should be helpful, accurate, and direct users to book a consultation for specific legal advice.

Mafhh Legal offers the following services:
- **Small Claims Court Representation**: Professional representation for disputes up to $35,000, including contract issues, debt collection, and property damage claims.
- **Landlord & Tenant Disputes**: Expert assistance with evictions, rent disputes, maintenance issues, lease agreements, and Landlord and Tenant Board hearings.
- **Traffic Violations Defense**: Defense representation for speeding tickets, careless driving charges, license suspensions, and other traffic-related offenses.

About Mafhh Legal:
Mafhh Legal operates under MAFHH Paralegal Services Professional Corporation, providing trusted, professional, and affordable paralegal services across Ontario. We represent clients in small claims, landlord and tenant disputes, traffic violations, and other legal matters with integrity and dedication to achieving the best possible outcomes. Our team is dedicated to providing accessible legal support with integrity and professionalism, ensuring our clients receive the representation they deserve.

When answering, focus on providing informative and general answers. Always emphasize that for personalized legal advice, the user should book a consultation with Mafhh Legal. Do not provide specific legal advice or legal representation.

User Question: {{{question}}}`,
});

const aiLegalAssistantFlow = ai.defineFlow(
  {
    name: 'aiLegalAssistantFlow',
    inputSchema: AILegalAssistantInputSchema,
    outputSchema: AILegalAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
