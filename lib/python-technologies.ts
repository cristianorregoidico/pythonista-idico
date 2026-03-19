export function serializePythonTechnologies(values: string[]) {
  return JSON.stringify(values);
}

export function parsePythonTechnologies(value: string | null | undefined) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    return [];
  }
}
