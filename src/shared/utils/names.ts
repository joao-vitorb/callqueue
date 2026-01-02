import namesData from "../data/names.json";

export type FullName = {
  firstName: string;
  lastName: string;
};

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function generateUniqueName(existing: FullName[]): FullName {
  const existingKey = new Set(
    existing.map(
      (n) => `${n.firstName.toLowerCase()}|${n.lastName.toLowerCase()}`
    )
  );

  const firstNames = namesData.firstNames;
  const lastNames = namesData.lastNames;

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const candidate: FullName = {
      firstName: firstNames[randomInt(firstNames.length)],
      lastName: lastNames[randomInt(lastNames.length)],
    };

    const key = `${candidate.firstName.toLowerCase()}|${candidate.lastName.toLowerCase()}`;
    if (!existingKey.has(key)) return candidate;
  }

  return {
    firstName: "Atendente",
    lastName: String(existing.length + 1),
  };
}
