const numbers = /^(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?$/;

export function nextVersion(previous, kind) {
  const match = numbers.exec(previous);
  if (!match) throw new Error(`Versió anterior invàlida: ${previous}`);
  const [major, minor, patch] = [BigInt(match[1]), BigInt(match[2]), BigInt(match[3] ?? '0')];
  if (kind === 'patch') return [major, minor, patch + 1n].join('.');
  if (kind === 'minor') return [major, minor + 1n, 0n].join('.');
  if (kind === 'major') return [major + 1n, 0n, 0n].join('.');
  throw new Error(`Tipus de versió invàlid: ${kind}`);
}

export function checkVersion(previous, version, { kind, reason }) {
  const expected = nextVersion(previous, kind);
  if (version !== expected) throw new Error(`${previous} → ${version}: per a ${kind} correspon ${expected}.`);
  if (kind === 'major' && !reason?.trim()) throw new Error('Una versió major requereix un motiu i, si pertoca, un pla de migració.');
}
