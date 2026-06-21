import pg from 'pg';
import { randomUUID } from 'node:crypto';
import { createDefaultChecklistItems } from '../lib/default-checklist.js';

const { Pool } = pg;

export function parsePostgresConnectionString(connectionString) {
  const url = new URL(connectionString);
  const database = url.pathname.replace(/^\//, '');
  const sslmode = url.searchParams.get('sslmode');

  return {
    host: url.hostname,
    port: Number(url.port || 5432),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(database),
    ssl: sslmode === 'require' ? { rejectUnauthorized: false } : false
  };
}

export function createPostgresChecklistRepository({
  connectionString = process.env.DATABASE_URL
} = {}) {
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const pool = new Pool(parsePostgresConnectionString(connectionString));

  return {
    async ensureUser(userId) {
      await pool.query(
        'insert into users (id) values ($1) on conflict (id) do nothing',
        [userId]
      );

      const countResult = await pool.query(
        'select count(*)::int as count from checklist_items where user_id = $1',
        [userId]
      );

      if (countResult.rows[0].count > 0) {
        return;
      }

      const seedItems = createDefaultChecklistItems(userId, randomUUID);

      for (const item of seedItems) {
        await pool.query(
          `
          insert into checklist_items (id, user_id, item_text, sort_order, is_active, created_at, updated_at)
          values ($1, $2, $3, $4, true, now(), now())
          `,
          [item.id, item.userId, item.itemText, item.sortOrder]
        );
      }
    },

    async listActiveChecklistItems(userId) {
      const result = await pool.query(
        `
        select id, item_text as "itemText", sort_order as "sortOrder"
        from checklist_items
        where user_id = $1 and is_active = true
        order by sort_order asc, created_at asc
        `,
        [userId]
      );

      return result.rows;
    },

    async listDailyChecklistRecords(userId, fromDate, toDate) {
      const result = await pool.query(
        `
        select
          record_date as "recordDate",
          checklist_item_id as "checklistItemId",
          is_done as "isDone"
        from daily_checklist_records
        where user_id = $1
          and record_date between $2::date and $3::date
        order by record_date asc, checklist_item_id asc
        `,
        [userId, fromDate, toDate]
      );

      return result.rows;
    },

    async getChecklistItemText(userId, itemId) {
      const result = await pool.query(
        `
        select item_text as "itemText"
        from checklist_items
        where user_id = $1 and id = $2 and is_active = true
        limit 1
        `,
        [userId, itemId]
      );

      return result.rows[0]?.itemText ?? null;
    },

    async upsertDailyChecklistRecord({ userId, itemId, date, itemText, isDone }) {
      const result = await pool.query(
        `
        insert into daily_checklist_records (
          user_id, record_date, checklist_item_id, item_text, is_done, updated_at
        )
        values ($1, $2::date, $3, $4, $5, now())
        on conflict (user_id, record_date, checklist_item_id)
        do update set
          item_text = excluded.item_text,
          is_done = excluded.is_done,
          updated_at = now()
        returning
          record_date as "recordDate",
          checklist_item_id as "checklistItemId",
          item_text as "itemText",
          is_done as "isDone",
          updated_at as "updatedAt"
        `,
        [userId, date, itemId, itemText, isDone]
      );

      return result.rows[0];
    }
  };
}
