'use server';
/**
 * @fileOverview An AI agent that categorizes client inquiries and determines their urgency.
 *
 * - categorizeInquiry - A function that handles the inquiry categorization process.
 * - InquiryCategorizerInput - The input type for the categorizeInquiry function.
 * - InquiryCategorizerOutput - The return type for the categorizeInquiry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InquiryCategorizerInputSchema = z.object({
  message: z.string().describe('The client\'s message or description of their legal matter.'),
});
export type InquiryCategorizerInput = z.infer<typeof InquiryCategorizerInputSchema>;

const InquiryCategorizerOutputSchema = z.object({
  suggestedCategories: z.array(z.string()).describe(
    'An array of suggested legal service categories relevant to the inquiry. Possible categories include: Small Claims Court, Landlord & Tenant Disputes, Traffic Violations, Other Legal Matter.'
  ),
  isUrgent: z
    .boolean()
    .describe('True if the inquiry suggests a need for immediate attention or has a tight deadline, false otherwise.'),
  reasoning: z.string().describe('Brief explanation for the suggested categories and urgency determination.'),
});
export type InquiryCategorizerOutput = z.infer<typeof InquiryCategorizerOutputSchema>;

export async function categorizeInquiry(input: InquiryCategorizerInput): Promise<InquiryCategorizerOutput> {
  return inquiryCategorizerFlow(input);
}

const inquiryCategorizerPrompt = ai.definePrompt({
  name: 'inquiryCategorizerPrompt',
  input: {schema: InquiryCategorizerInputSchema},
  output: {schema: InquiryCategorizerOutputSchema},
  prompt: `You are an AI assistant for Mafhh Legal, a paralegal service.
Your task is to analyze incoming client inquiries and provide:
1. Suggested legal service categories based on the content.
2. A determination of whether the inquiry is urgent.

Use the following service categories:
- Small Claims Court: For disputes up to $35,000, including contract issues, debt collection, property damage.
- Landlord & Tenant Disputes: For evictions, rent disputes, maintenance issues, lease agreements, LTB hearings.
- Traffic Violations: For speeding tickets, careless driving, license suspensions.
- Other Legal Matter: For anything not fitting the above categories.

Highlight urgency if the client expresses a need for immediate action, mentions an upcoming deadline (e.g., court date, eviction notice), or describes a critical situation.

Client Inquiry: """{{{message}}}"""

Provide the output in JSON format, strictly adhering to the output schema.`, 
  config: {
    temperature: 0.2
  }
});

const inquiryCategorizerFlow = ai.defineFlow(
  {
    name: 'inquiryCategorizerFlow',
    inputSchema: InquiryCategorizerInputSchema,
    outputSchema: InquiryCategorizerOutputSchema,
  },
  async input => {
    const {output} = await inquiryCategorizerPrompt(input);
    return output!;
  }
);
