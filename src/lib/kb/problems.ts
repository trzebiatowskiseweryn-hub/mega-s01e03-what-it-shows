// What #4471 really holds: one problem per fix. Counts follow the desk's own view (CauseTable):
// every report sits under its tenant's cause (causes.ts). The desk's notes (desk-notes.json) mark the
// reports whose words say something else, a one-day move, not a flip: their own problem, still
// counted where the desk files them.
import { groupByCause, readAs, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day' | 'unplaced';

export type ProblemGroup = { problem: Problem; reports: number; alsoIn?: Problem; tenants: number; firstSeen: string; lastSeen: string };

export function splitTicket(
  merged: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemGroup[] {
  const groups = groupByCause(merged, tenantOf);
  const rows: ProblemGroup[] = groups.map((g) => ({
    problem: g.cause,
    reports: g.reports.length,
    tenants: g.tenants,
    firstSeen: g.firstSeen,
    lastSeen: g.lastSeen,
  }));
  for (const g of groups) {
    if (!readAs(g, oneDayMove)) continue;
    const rs = g.reports.filter((r) => oneDayMove.includes(r.id));
    const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
    rows.push({ problem: 'one-day', reports: rs.length, alsoIn: g.cause, tenants: new Set(rs.map((r) => r.tenant)).size, firstSeen: days[0], lastSeen: days[days.length - 1] });
  }
  return rows;
}
