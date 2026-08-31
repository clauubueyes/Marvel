export function getTitleSaga(phase: string) {
  const phaseNumber = Number(phase.match(/\d+/)?.[0]);
  if (phaseNumber >= 1 && phaseNumber <= 3) return "SAGA DEL INFINITO";
  if (phaseNumber >= 4 && phaseNumber <= 6) return "SAGA DEL MULTIVERSO";
  return "OTRAS HISTORIAS";
}
