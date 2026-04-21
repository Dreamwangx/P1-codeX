import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'apps/web/src/bridge/client.ts',
  'apps/web/src/bridge/plugins/push.ts',
  'apps/web/src/bridge/plugins/ble.ts',
  'apps/web/src/services/auth/authService.ts',
  'apps/web/src/services/http/httpClient.ts',
  'docs/release/runbook.md',
  'docs/next-phase-plan.md',
];

test('week3-8 required files exist', () => {
  requiredFiles.forEach((file) => {
    assert.equal(existsSync(file), true, `missing file: ${file}`);
  });
});

test('bridge client includes timeout and unsupported handling', () => {
  const content = readFileSync('apps/web/src/bridge/client.ts', 'utf8');
  assert.match(content, /BRIDGE_UNSUPPORTED/);
  assert.match(content, /BRIDGE_TIMEOUT/);
});

test('auth service has single-flight refresh protection', () => {
  const content = readFileSync('apps/web/src/services/auth/authService.ts', 'utf8');
  assert.match(content, /inflightRefresh/);
});
