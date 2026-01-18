
export const INDEX_MATRIX = [...Array(50).keys()].map((_, i) => {
  const indices: number[] = [];
  for (let x = 0; x < 15; x++) indices.push((i + x) % 19);
  return indices.sort((a, b) => a - b);
});

export const generateGamesFromBase = (base: number[]): number[][] => {
  if (base.length !== 19) return [];
  const sortedBase = [...base].sort((a, b) => a - b);
  return INDEX_MATRIX.map(indices => indices.map(idx => sortedBase[idx]).sort((a, b) => a - b));
};
