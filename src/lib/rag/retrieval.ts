import { buildKnowledgeCorpus, KnowledgeChunk } from './knowledgeBase';

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
  highlightSnippet: string;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'about', 'can', 'you', 'what', 'how', 'where', 'when', 'who', 'why', 'and', 'or', 'me',
  'i', 'we', 'your', 'please', 'tell', 'show', 'give', 'site', 'page', 'find', 'check'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length > 1 && !STOP_WORDS.has(term));
}

/**
 * Searches the site knowledge corpus using BM25-inspired term frequency and semantic field boosting.
 */
export async function searchKnowledgeBase(
  query: string,
  limit: number = 4
): Promise<SearchResult[]> {
  const corpus = await buildKnowledgeCorpus();
  const rawTokens = query.toLowerCase().trim();
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0 && rawTokens.length === 0) {
    return [];
  }

  // Regex check for batch numbers like "BL-2024-0101" or "BL20240101"
  const batchMatch = query.match(/BL-?\d{4}-?\d{3,4}/i);
  const normalizedBatchQuery = batchMatch ? batchMatch[0].toUpperCase().replace(/-/g, '') : null;

  const scored: SearchResult[] = corpus.map((chunk) => {
    let score = 0;
    const lowerTitle = chunk.title.toLowerCase();
    const lowerContent = chunk.content.toLowerCase();
    const lowerUrl = chunk.url.toLowerCase();

    // 1. Direct Batch Match Boost
    if (normalizedBatchQuery && chunk.category === 'batch') {
      const normalizedChunkBatch = chunk.title.toUpperCase().replace(/-/g, '');
      if (normalizedChunkBatch.includes(normalizedBatchQuery)) {
        score += 150;
      }
    }

    // 2. Exact Full Query match in title
    if (lowerTitle.includes(rawTokens)) {
      score += 50;
    }

    // 3. Exact Full Query in content
    if (lowerContent.includes(rawTokens)) {
      score += 25;
    }

    // 4. Token-by-token scoring with field weighting
    for (const token of queryTokens) {
      // Title match (Highest weight)
      if (lowerTitle.includes(token)) {
        score += 15;
      }

      // Keyword match
      if (chunk.keywords.some((kw) => kw.includes(token))) {
        score += 10;
      }

      // URL match
      if (lowerUrl.includes(token)) {
        score += 8;
      }

      // Content match (Frequency count)
      const matches = (lowerContent.match(new RegExp(`\\b${token}`, 'g')) || []).length;
      score += Math.min(matches * 3, 12);
    }

    // 5. Category-specific intent boosts
    if (
      (rawTokens.includes('contact') || rawTokens.includes('phone') || rawTokens.includes('helpline') || rawTokens.includes('call') || rawTokens.includes('whatsapp')) &&
      chunk.url === '/contact'
    ) {
      score += 40;
    }

    if (
      (rawTokens.includes('verify') || rawTokens.includes('batch') || rawTokens.includes('coa') || rawTokens.includes('traceability')) &&
      chunk.category === 'batch'
    ) {
      score += 20;
    }

    if (
      (rawTokens.includes('distributor') || rawTokens.includes('stockist') || rawTokens.includes('wholesale')) &&
      chunk.url === '/distributor-enquiry'
    ) {
      score += 35;
    }

    if (
      (rawTokens.includes('certificate') || rawTokens.includes('iso') || rawTokens.includes('gmp') || rawTokens.includes('license')) &&
      chunk.category === 'certification'
    ) {
      score += 30;
    }

    return {
      chunk,
      score,
      highlightSnippet: chunk.snippet,
    };
  });

  // Filter out non-matching results (score 0), sort descending by relevance
  const results = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}
