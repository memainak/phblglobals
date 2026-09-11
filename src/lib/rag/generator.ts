import { searchKnowledgeBase, SearchResult } from './retrieval';

export interface ChatbotResponse {
  answer: string;
  relevantPages: {
    title: string;
    url: string;
    category: string;
    snippet: string;
    ctaText: string;
  }[];
  suggestedQuestions: string[];
}

/**
 * Synthesizes grounded, regulatory-compliant answers from retrieved site chunks.
 */
export async function generateRagAnswer(
  query: string,
  history: { role: string; content: string }[] = []
): Promise<ChatbotResponse> {
  const searchResults: SearchResult[] = await searchKnowledgeBase(query, 4);

  // If Gemini API Key is configured, attempt full LLM generation
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey && searchResults.length > 0) {
    try {
      const llmResponse = await callGeminiApi(query, searchResults, history, geminiApiKey);
      if (llmResponse) {
        return {
          answer: llmResponse,
          relevantPages: searchResults.map((r) => ({
            title: r.chunk.title,
            url: r.chunk.url,
            category: r.chunk.category,
            snippet: r.chunk.snippet,
            ctaText: r.chunk.ctaText,
          })),
          suggestedQuestions: generateSuggestions(searchResults, query),
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to rule-based synthesis:', err);
    }
  }

  // Fallback / Standalone Grounded Clinical Synthesis Engine (Zero external API lock-in)
  return synthesizeGroundedAnswer(query, searchResults);
}

/**
 * Intelligent rule-based clinical synthesis grounded strictly in retrieved documents.
 */
function synthesizeGroundedAnswer(
  query: string,
  results: SearchResult[]
): ChatbotResponse {
  const lowerQuery = query.toLowerCase();

  // Case 1: No match found
  if (results.length === 0) {
    return {
      answer:
        "I couldn't find specific documentation for that query in our clinical formulations or batch database. You can reach our medical desk at **9800011545** or search our product catalog and batch verification portal.",
      relevantPages: [
        {
          title: 'Product Catalog',
          url: '/products',
          category: 'product',
          snippet: 'Explore pure mother tinctures, dilutions, and bio-chemic combinations.',
          ctaText: 'Browse Products →',
        },
        {
          title: 'Batch Traceability Portal',
          url: '/batches',
          category: 'batch',
          snippet: 'Verify carton batch number and 11 statutory points of compliance.',
          ctaText: 'Verify Batch →',
        },
        {
          title: 'Plant Contact & Helpline',
          url: '/contact',
          category: 'contact',
          snippet: 'Official factory helpline: 9800011545. Paschim Medinipur, West Bengal.',
          ctaText: 'Contact Us →',
        },
      ],
      suggestedQuestions: [
        'How do I verify a batch number?',
        'What are the indications for Arnica Montana Q?',
        'What are the factory helpline coordinates?',
      ],
    };
  }

  const topResult = results[0];
  let answer = '';

  // Case 2: Batch Verification Query
  if (topResult.chunk.category === 'batch' || lowerQuery.includes('batch') || lowerQuery.includes('verify')) {
    answer = `### Batch Traceability & Testing Details\n\n` +
      `Here is the verified analytical record for **${topResult.chunk.title}**:\n\n` +
      `* **Finished Analysis**: In-house quality testing and release standards confirmed.\n` +
      `* **Statutory Compliance**: Conforms to all 11 regulatory parameters under the Drugs & Cosmetics Rules 1945 (Schedule M-I).\n\n` +
      `You can inspect the full analytical monograph, organoleptic tests, alcohol percentage, and download the signed Certificate of Analysis on the dedicated batch page below.`;
  }
  // Case 3: Product Formulations & Indications
  else if (topResult.chunk.category === 'product') {
    answer = `### Formulation Overview: ${topResult.chunk.title}\n\n` +
      `* **Clinical Indications**: ${topResult.chunk.snippet}\n` +
      `* **Regulatory Standard**: Prepared in accordance with the Homoeopathic Pharmacopoeia of India (HPI) using authentic feedstock and extra neutral alcohol.\n` +
      `* **Dosage & Posology**: As prescribed by a registered homoeopathic physician.\n\n` +
      `*(Statutory Notice: Formulations are intended for registered physicians and informational reference under the Drugs & Magic Remedies Act 1954).*`;
  }
  // Case 4: Wholesale Distributorship & Stockist
  else if (topResult.chunk.url === '/distributor-enquiry' || lowerQuery.includes('distributor') || lowerQuery.includes('stockist') || lowerQuery.includes('wholesale')) {
    answer = `### Wholesale Distributorship & Institutional Supply\n\n` +
      `PHBL welcomes partnerships with licensed pharmaceutical distributors, institutional stockists, and retail pharmacies across India:\n\n` +
      `* **Eligibility Requirements**: Valid wholesale Drug License (**Form 20B / 21B**) and active GSTIN registration.\n` +
      `* **Logistics & Supply**: Dedicated bonded excise dispatch, statutory Batch Certificate of Analysis with every consignment, and temperature-controlled storage.\n` +
      `* **Trade Desk Contact**: Call our commercial desk at **9800011545** or message on WhatsApp.\n\n` +
      `You can submit your firm credentials and territory of interest on the official distributor portal below.`;
  }
  // Case 5: Contact & Factory Coordinates
  else if (topResult.chunk.category === 'contact' || lowerQuery.includes('phone') || lowerQuery.includes('number') || lowerQuery.includes('helpline') || lowerQuery.includes('whatsapp')) {
    answer = `### Purusottam Homoeo Bikash Laboratory (Bonded) — Coordinates\n\n` +
      `* **Helpline & Voice Calls**: **9800011545**\n` +
      `* **WhatsApp Trade Desk**: **+91 9800011545**\n` +
      `* **Plant Email**: **phblkn@gmail.com**\n` +
      `* **Manufacturing Facility**: Paschim Medinipur, West Bengal - 721101\n` +
      `* **Bonded Manufacturing License**: **HL-792 M** (Estd. 2003)\n\n` +
      `You can submit an instant clinical inquiry or wholesale order request directly on our contact page.`;
  }
  // Case 5: Quality Standards & Testing
  else if (topResult.chunk.category === 'quality' || lowerQuery.includes('quality') || lowerQuery.includes('testing') || lowerQuery.includes('hptlc')) {
    answer = `### Quality & Testing Excellence at PHBL\n\n` +
      `**${topResult.chunk.title}**\n\n` +
      `${topResult.chunk.snippet}\n\n` +
      `Every single manufacturing run at PHBL undergoes rigorous raw material chromatography (HPTLC), organoleptic profiling, and batch release protocols under Schedule M-I norms.`;
  }
  // Case 6: Certifications & Licenses
  else if (topResult.chunk.category === 'certification' || lowerQuery.includes('iso') || lowerQuery.includes('gmp') || lowerQuery.includes('license')) {
    answer = `### Regulatory Accreditations & Certifications\n\n` +
      `PHBL maintains full statutory credentials for bonded pharmaceutical manufacturing:\n\n` +
      `* **ISO 9001:2015**: Quality Management System Certification\n` +
      `* **GMP (Schedule M-I)**: Good Manufacturing Practices under Drugs & Cosmetics Rules 1945\n` +
      `* **HACCP**: Hazard Analysis Critical Control Point certified\n` +
      `* **Manufacturing License**: **HL-792 M**\n\n` +
      `You can review and inspect all active accreditation certificates on our certifications page.`;
  }
  // Default General Corporate Answer
  else {
    answer = `### ${topResult.chunk.title}\n\n` +
      `${topResult.chunk.snippet}\n\n` +
      `Founded in 2003 by Dr. Tarak Prasad Chatterjee under the guiding credo: *"Every physician should prepare his own medicine"*. Click below to visit the full page.`;
  }

  const relevantPages = results.map((r) => ({
    title: r.chunk.title,
    url: r.chunk.url,
    category: r.chunk.category,
    snippet: r.chunk.snippet,
    ctaText: r.chunk.ctaText,
  }));

  const suggestedQuestions = generateSuggestions(results, query);

  return {
    answer,
    relevantPages,
    suggestedQuestions,
  };
}

/**
 * Context-aware follow-up question generator.
 */
function generateSuggestions(results: SearchResult[], currentQuery: string): string[] {
  const suggestions: string[] = [];

  const hasProduct = results.some((r) => r.chunk.category === 'product');
  const hasBatch = results.some((r) => r.chunk.category === 'batch');
  const hasCert = results.some((r) => r.chunk.category === 'certification');

  if (hasProduct) {
    suggestions.push('How can I verify a batch Certificate of Analysis?');
    suggestions.push('What are the wholesale distributor requirements?');
  } else if (hasBatch) {
    suggestions.push('What is the helpline number for batch queries?');
    suggestions.push('Show ISO 9001 and GMP certifications');
  } else if (hasCert) {
    suggestions.push('What are the testing standards for Extra Neutral Alcohol?');
    suggestions.push('Download product catalog booklet');
  } else {
    suggestions.push('Verify batch BL-2024-0101');
    suggestions.push('Show Arnica Montana Q details');
    suggestions.push('Contact Paschim Medinipur factory');
  }

  return suggestions.slice(0, 3);
}

/**
 * Optional Gemini API caller when GEMINI_API_KEY is present in environment.
 */
async function callGeminiApi(
  query: string,
  results: SearchResult[],
  history: { role: string; content: string }[],
  apiKey: string
): Promise<string | null> {
  const contextText = results
    .map((r, i) => `[Source ${i + 1}] Title: ${r.chunk.title}\nURL: ${r.chunk.url}\nCategory: ${r.chunk.category}\nContent: ${r.chunk.content}`)
    .join('\n\n');

  const systemInstruction =
    `You are the official clinical & site navigator assistant for Purusottam Homoeo Bikash Laboratory (Bonded) (PHBL), established 2003 (Mfg Lic HL-792 M) in Paschim Medinipur, West Bengal.\n` +
    `Strict compliance: Drugs & Magic Remedies Act 1954. Never claim "cures" or "miracle treatments". Use "indicated in" or "clinical indications".\n` +
    `Plant Helpline: 9800011545. WhatsApp: 9800011545. Email: phblkn@gmail.com.\n` +
    `Answer factually and concisely based strictly on the provided sources. Format with clean markdown headers and bullet points.`;

  const prompt = `Context:\n${contextText}\n\nUser Question: ${query}\n\nProvide a helpful, regulatory-compliant response and highlight which page the user should visit:`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 600 },
      }),
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}
