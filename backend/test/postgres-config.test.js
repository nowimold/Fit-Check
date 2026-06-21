import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePostgresConnectionString } from '../src/repositories/postgres-checklist-repository.js';

test('parsePostgresConnectionString extracts host and credentials from a database url', () => {
  const config = parsePostgresConnectionString(
    'postgresql://pgadmin:5d08d442306940fba6f7a20fAa1!@fitcheckpg5525.postgres.database.azure.com:5432/fit_check?sslmode=require'
  );

  assert.deepEqual(config, {
    host: 'fitcheckpg5525.postgres.database.azure.com',
    port: 5432,
    user: 'pgadmin',
    password: '5d08d442306940fba6f7a20fAa1!',
    database: 'fit_check',
    ssl: { rejectUnauthorized: false }
  });
});
