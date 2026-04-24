import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'apps/mobile-rn/src/app/bootstrap.ts',
  'apps/mobile-rn/src/app/context.ts',
  'apps/mobile-rn/src/bridge/client.ts',
  'apps/mobile-rn/src/bridge/plugins/push.ts',
  'apps/mobile-rn/src/bridge/plugins/ble.ts',
  'apps/mobile-rn/src/services/http/httpClient.ts',
  'apps/mobile-rn/src/services/auth/authService.ts',
  'docs/rn/local-dev-debug-rn.md',
];

test('RN scaffold required files exist', () => {
  requiredFiles.forEach((file) => {
    assert.equal(existsSync(file), true, `missing file: ${file}`);
  });
});

test('RN bridge client contains timeout and unsupported handling', () => {
  const content = readFileSync('apps/mobile-rn/src/bridge/client.ts', 'utf8');
  assert.match(content, /BRIDGE_UNSUPPORTED/);
  assert.match(content, /BRIDGE_TIMEOUT/);
});

test('RN auth service keeps single-flight refresh pattern', () => {
  const content = readFileSync('apps/mobile-rn/src/services/auth/authService.ts', 'utf8');
  assert.match(content, /inflightRefresh/);
});
