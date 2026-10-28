<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket, type Problem } from '#lib/kb/problems';

  // issues: problem → its own ticket (an issue in this repo).
  let { ticket, issues }: { ticket: number; issues: Partial<Record<Problem, string>> } = $props();

  const raw = (reports as Report[]).length;
  const unique = uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket).length;
  const groups = splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove);
</script>

<p class="sum">
  <strong>{unique}</strong> reports merged into #{ticket} ({raw} rows in the export, {raw - unique} of them repeats) ·
  <strong>{groups.length}</strong> problems
</p>

<table>
  <thead><tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr></thead>
  <tbody>
    {#each groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if issues[g.problem]}<a href={issues[g.problem]}>{issues[g.problem]?.split('/').slice(-3).join('/').replace('/issues/', '#')}</a>{:else}none yet{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
</style>
