import type { AxisLetters, AxisScoresRecord, DiagnosisResult, ScoreBand } from "./scoring";

export const resultStorageKey = "academic_ai_radicality_results";
const maxStoredResults = 100;
const sharedEndpoint = import.meta.env.VITE_RESULTS_ENDPOINT?.trim();

export type ResultRecord = {
  completedAt: string;
  overallScore: number;
  typeCode: string;
  axisScores: AxisScoresRecord;
  axisLetters: AxisLetters;
  scoreBand: ScoreBand;
};

export type ResultsStorageMode = "shared" | "local";

export function getResultsStorageMode(): ResultsStorageMode {
  return sharedEndpoint ? "shared" : "local";
}

export async function readResultRecords(): Promise<ResultRecord[]> {
  if (sharedEndpoint) {
    const sharedRecords = await readSharedResultRecords();

    if (sharedRecords) {
      return sharedRecords;
    }
  }

  return readLocalResultRecords();
}

export async function appendResultRecord(result: DiagnosisResult): Promise<ResultRecord[]> {
  const record = createResultRecord(result);
  const localRecords = appendLocalResultRecord(record);

  if (!sharedEndpoint) {
    return localRecords;
  }

  const saved = await appendSharedResultRecord(record);

  if (!saved) {
    return localRecords;
  }

  return (await readSharedResultRecords()) ?? localRecords;
}

export function clearResultRecords(): void {
  window.localStorage.removeItem(resultStorageKey);
}

function createResultRecord(result: DiagnosisResult): ResultRecord {
  return {
    completedAt: new Date().toISOString(),
    overallScore: result.totalScore,
    typeCode: result.typeCode,
    axisScores: result.axisScoreRecord,
    axisLetters: result.axisLetters,
    scoreBand: result.scoreBand,
  };
}

function readLocalResultRecords(): ResultRecord[] {
  try {
    const raw = window.localStorage.getItem(resultStorageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    if (!parsed.every(isResultRecord)) {
      return [];
    }

    return parsed.slice(0, maxStoredResults);
  } catch {
    return [];
  }
}

function appendLocalResultRecord(record: ResultRecord): ResultRecord[] {
  const nextRecords = [record, ...readLocalResultRecords()].slice(0, maxStoredResults);
  writeResultRecords(nextRecords);
  return nextRecords;
}

async function readSharedResultRecords(): Promise<ResultRecord[] | null> {
  if (!sharedEndpoint) {
    return null;
  }

  try {
    const response = await fetch(sharedEndpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload: unknown = await response.json();
    const records = normalizeSharedRecords(payload);

    return records ? records.slice(0, maxStoredResults) : null;
  } catch {
    return null;
  }
}

async function appendSharedResultRecord(record: ResultRecord): Promise<boolean> {
  if (!sharedEndpoint) {
    return false;
  }

  try {
    const response = await fetch(sharedEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    return response.ok;
  } catch {
    return false;
  }
}

function normalizeSharedRecords(payload: unknown): ResultRecord[] | null {
  const candidate =
    Array.isArray(payload) || payload === null || typeof payload !== "object"
      ? payload
      : (payload as { results?: unknown }).results;

  if (!Array.isArray(candidate) || !candidate.every(isResultRecord)) {
    return null;
  }

  return candidate;
}

function writeResultRecords(records: ResultRecord[]): void {
  try {
    window.localStorage.setItem(resultStorageKey, JSON.stringify(records.slice(0, maxStoredResults)));
  } catch {
    // 保存領域が使えない場合も、診断自体は継続できるようにします。
  }
}

function isResultRecord(value: unknown): value is ResultRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as ResultRecord;
  return (
    typeof record.completedAt === "string" &&
    typeof record.overallScore === "number" &&
    typeof record.typeCode === "string" &&
    isAxisScores(record.axisScores) &&
    isAxisLetters(record.axisLetters) &&
    isScoreBand(record.scoreBand)
  );
}

function isAxisScores(value: unknown): value is AxisScoresRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const scores = value as AxisScoresRecord;
  return ["CA", "TN", "HD", "PR"].every((axis) => typeof scores[axis as keyof AxisScoresRecord] === "number");
}

function isAxisLetters(value: unknown): value is AxisLetters {
  if (!value || typeof value !== "object") {
    return false;
  }

  const letters = value as AxisLetters;
  return (
    ["C", "A"].includes(letters.CA) &&
    ["T", "N"].includes(letters.TN) &&
    ["H", "D"].includes(letters.HD) &&
    ["P", "R"].includes(letters.PR)
  );
}

function isScoreBand(value: unknown): value is ScoreBand {
  return ["0-20", "21-40", "41-60", "61-80", "81-100"].includes(String(value));
}
