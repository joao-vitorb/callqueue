import names from '../data/names.json';

type ExistingName = { firstName: string; lastName: string };

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateUniqueName(existing: ExistingName[]): ExistingName {
  for (let i = 0; i < 200; i++) {
    const firstName = pick(names.firstNames);
    const lastName = pick(names.lastNames);

    const alreadyUsed = existing.some(
      (n) => n.firstName === firstName && n.lastName === lastName,
    );

    if (!alreadyUsed) return { firstName, lastName };
  }

  return { firstName: pick(names.firstNames), lastName: pick(names.lastNames) };
}
