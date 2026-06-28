// FLAT·SIX 981 knowledge base — public API.
// Loads the JSON data + markdown articles and exposes typed getters plus a
// dependency-free full-text search used by the RAG assistant and MCP tools.

import faultCodesJson from './fault-codes.json';
import specsJson from './specs.json';
import maintenanceJson from './maintenance.json';
import knownIssuesJson from './known-issues.json';
import { ARTICLES } from './articles';
import type {
  FaultCode,
  Spec,
  MaintenanceItem,
  KnownIssue,
  KnowledgeArticle,
  KnowledgeChunk,
  KnowledgeKind,
} from './types';

export * from './types';

// ---- Typed getters -------------------------------------------------------

export function getFaultCodes(): FaultCode[] {
  return faultCodesJson as FaultCode[];
}

export function getSpecs(): Spec[] {
  return specsJson as Spec[];
}

export function getMaintenance(): MaintenanceItem[] {
  return maintenanceJson as MaintenanceItem[];
}

export function getKnownIssues(): KnownIssue[] {
  return knownIssuesJson as KnownIssue[];
}

export function getArticles(): KnowledgeArticle[] {
  return ARTICLES;
}

// ---- Chunk index ---------------------------------------------------------

const WORD_RE = /[a-z0-9]+/gi;
const CODE_RE = /^[pbcu]\d{4}$/i; // OBD-II style code, e.g. P0301

function joinList(label: string, items?: string[]): string {
  if (!items || items.length === 0) return '';
  return `${label}: ${items.join('; ')}.`;
}

/** Split a long article body into ~200-word chunks for retrieval. */
function chunkArticleBody(body: string, wordsPerChunk = 200): string[] {
  const words = body.split(/\s+/).filter(Boolean);
  if (words.length <= wordsPerChunk) return [body];
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
  }
  return chunks;
}

let CHUNK_CACHE: KnowledgeChunk[] | null = null;

/** Build (and memoize) one searchable chunk per knowledge item. */
function buildChunks(): KnowledgeChunk[] {
  if (CHUNK_CACHE) return CHUNK_CACHE;
  const chunks: KnowledgeChunk[] = [];

  for (const f of getFaultCodes()) {
    const text = [
      `${f.code} ${f.title}`,
      `System: ${f.system}. Severity: ${f.severity}.`,
      f.description,
      joinList('Symptoms', f.symptoms),
      joinList('Causes', f.causes),
      joinList('Diagnosis', f.diagnosis),
      joinList('Related parts', f.relatedParts),
      f.appliesTo ? `Applies to: ${f.appliesTo.join(', ')}.` : '',
    ].filter(Boolean).join(' ');
    chunks.push({ id: `fault:${f.code}`, source: f.code, kind: 'fault', title: `${f.code} — ${f.title}`, text });
  }

  for (const s of getSpecs()) {
    const text = [
      `${s.name}: ${s.value}.`,
      `Category: ${s.category}.`,
      s.notes ?? '',
      s.appliesTo ? `Applies to: ${s.appliesTo.join(', ')}.` : '',
    ].filter(Boolean).join(' ');
    chunks.push({ id: `spec:${s.id}`, source: s.id, kind: 'spec', title: s.name, text });
  }

  for (const m of getMaintenance()) {
    const interval = [
      m.intervalMiles ? `${m.intervalMiles.toLocaleString()} mi` : '',
      m.intervalMonths ? `${m.intervalMonths} months` : '',
    ].filter(Boolean).join(' / ');
    const text = [
      `${m.task}.`,
      interval ? `Interval: ${interval}.` : '',
      `System: ${m.system}.`,
      m.notes ?? '',
    ].filter(Boolean).join(' ');
    chunks.push({ id: `maint:${m.id}`, source: m.id, kind: 'maintenance', title: m.task, text });
  }

  for (const k of getKnownIssues()) {
    const text = [
      `${k.title}.`,
      `System: ${k.system}. Severity: ${k.severity}. Affected: ${k.affected}.`,
      k.description,
      joinList('Symptoms', k.symptoms),
      `Fix: ${k.fix}.`,
      k.estCost ? `Estimated cost: ${k.estCost}.` : '',
    ].filter(Boolean).join(' ');
    chunks.push({ id: `issue:${k.id}`, source: k.id, kind: 'issue', title: k.title, text });
  }

  for (const a of getArticles()) {
    const parts = chunkArticleBody(a.body);
    parts.forEach((part, i) => {
      chunks.push({
        id: parts.length > 1 ? `article:${a.id}#${i}` : `article:${a.id}`,
        source: a.id,
        kind: 'article',
        title: parts.length > 1 ? `${a.title} (part ${i + 1})` : a.title,
        text: `${a.title}. Tags: ${a.tags.join(', ')}. ${part}`,
      });
    });
  }

  CHUNK_CACHE = chunks;
  return chunks;
}

// ---- Search --------------------------------------------------------------

function tokenize(s: string): string[] {
  return (s.toLowerCase().match(WORD_RE) ?? []);
}

/**
 * Dependency-free retrieval over all knowledge sources.
 * Scoring: term frequency across title+text, with a boost for title matches
 * and a strong boost for exact OBD-II code matches (which rank first).
 */
export function searchKnowledge(
  query: string,
  opts?: { limit?: number; kinds?: KnowledgeKind[] }
): KnowledgeChunk[] {
  const limit = opts?.limit ?? 8;
  const kinds = opts?.kinds;
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  // Detect a fault-code-looking query (e.g. "P0301", "p0420").
  const codeTerms = query
    .toUpperCase()
    .match(/[PBCU]\d{4}/g)
    ?.map((c) => c.toUpperCase()) ?? [];

  let chunks = buildChunks();
  if (kinds && kinds.length > 0) {
    chunks = chunks.filter((c) => kinds.includes(c.kind));
  }

  const scored = chunks.map((c) => {
    const titleTokens = tokenize(c.title);
    const textTokens = tokenize(c.text);
    let score = 0;

    for (const term of terms) {
      const inTitle = titleTokens.filter((t) => t === term).length;
      const inText = textTokens.filter((t) => t === term).length;
      score += inText + inTitle * 3; // title matches weigh more
    }

    // Exact OBD-II code match dominates the ranking.
    if (codeTerms.length > 0 && c.kind === 'fault') {
      const codeUpper = c.source.toUpperCase();
      if (codeTerms.includes(codeUpper)) score += 1000;
    }

    return { ...c, score };
  });

  return scored
    .filter((c) => (c.score ?? 0) > 0)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);
}

// ---- Source manifest (for UI / status display) --------------------------

export const KNOWLEDGE_SOURCES: { name: string; kind: KnowledgeKind; count: number; statusLabel: string }[] = [
  { name: 'Fault Codes', kind: 'fault', count: getFaultCodes().length, statusLabel: 'INDEXED' },
  { name: 'Specifications', kind: 'spec', count: getSpecs().length, statusLabel: 'INDEXED' },
  { name: 'Maintenance Schedule', kind: 'maintenance', count: getMaintenance().length, statusLabel: 'INDEXED' },
  { name: 'Known Issues', kind: 'issue', count: getKnownIssues().length, statusLabel: 'INDEXED' },
  { name: 'Reference Articles', kind: 'article', count: getArticles().length, statusLabel: 'INDEXED' },
];
