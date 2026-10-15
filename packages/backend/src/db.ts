import type { ExecuteValues } from 'mysql2'
import mysql from 'mysql2/promise'
import type { Pool, RowDataPacket } from 'mysql2/promise'
import { randomBytes } from 'node:crypto'
import { libraryTemplates } from './templates/library/index.js'
import { thumbnailFor } from './templates/library/thumbnail.js'

const database = process.env.DB_NAME ?? 'designhub'
if (!/^[A-Za-z0-9_$-]+$/.test(database)) throw new Error('DB_NAME contains invalid characters.')
const connectionOptions = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  charset: 'utf8mb4',
  timezone: 'Z',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

let pool: Pool

export function sqlValues(values: unknown[]): ExecuteValues[] {
  return values.map((value) => {
    if (value === undefined) return null
    if (
      value === null || typeof value === 'string' || typeof value === 'number' ||
      typeof value === 'bigint' || typeof value === 'boolean' || value instanceof Date ||
      Buffer.isBuffer(value) || value instanceof Uint8Array
    ) return value
    if (Array.isArray(value)) return sqlValues(value)
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  })
}

export async function connectDatabase() {
  const bootstrap = await mysql.createConnection(connectionOptions)
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${database.replaceAll('`', '')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  await bootstrap.end()

  pool = mysql.createPool({ ...connectionOptions, database })
  await pool.query('SELECT 1')
  await createMissingTables()
}

export function db() {
  if (!pool) throw new Error('Database has not been initialized')
  return pool
}

export async function rows<T extends RowDataPacket>(sql: string, values: unknown[] = []): Promise<T[]> {
  const [result] = await db().execute<T[]>(sql, sqlValues(values))
  return result
}

export async function one<T extends RowDataPacket>(sql: string, values: unknown[] = []): Promise<T | undefined> {
  return (await rows<T>(sql, values))[0]
}

export async function run(sql: string, values: unknown[] = []) {
  const [result] = await db().execute(sql, sqlValues(values))
  return result
}

async function createMissingTables() {
  const schema = [
    `CREATE TABLE IF NOT EXISTS users (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      email VARCHAR(190) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, name VARCHAR(120) NOT NULL,
      avatar_url TEXT NULL, role VARCHAR(16) NOT NULL DEFAULT 'USER'
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS projects (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      owner_id BIGINT NOT NULL, team_id BIGINT NULL, folder_id BIGINT NULL, title VARCHAR(200) NOT NULL,
      width INT NOT NULL DEFAULT 1080, height INT NOT NULL DEFAULT 1080, thumbnail MEDIUMTEXT NULL,
      deleted_at TIMESTAMP NULL, revision BIGINT NOT NULL DEFAULT 0, INDEX(owner_id, deleted_at), INDEX(team_id)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS folders (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      owner_id BIGINT NOT NULL, name VARCHAR(120) NOT NULL, INDEX(owner_id)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS favorites (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id BIGINT NOT NULL, project_id BIGINT NOT NULL, UNIQUE KEY uq_favorite(user_id, project_id)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS pages (
      id VARCHAR(36) NOT NULL PRIMARY KEY, project_id BIGINT NOT NULL, position INT NOT NULL,
      name VARCHAR(120) NULL, background TEXT NULL, duration_seconds DOUBLE NULL, notes TEXT NULL,
      INDEX(project_id, position)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS elements (
      id VARCHAR(36) NOT NULL PRIMARY KEY, page_id VARCHAR(36) NOT NULL, type VARCHAR(24) NOT NULL,
      z_index INT NOT NULL, data LONGTEXT NOT NULL, INDEX(page_id)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS versions (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      project_id BIGINT NOT NULL, author_id BIGINT NULL, label VARCHAR(160) NULL, auto BOOLEAN NOT NULL DEFAULT FALSE,
      snapshot LONGTEXT NOT NULL, thumbnail MEDIUMTEXT NULL, INDEX(project_id, created_at)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS collaborators (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      project_id BIGINT NOT NULL, user_id BIGINT NOT NULL, role VARCHAR(16) NOT NULL DEFAULT 'MAKER',
      UNIQUE KEY uq_collaborator(project_id, user_id)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS share_links (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      project_id BIGINT NOT NULL, token VARCHAR(64) NOT NULL UNIQUE, role VARCHAR(16) NOT NULL DEFAULT 'VIEWER',
      expires_at TIMESTAMP NULL, revoked BOOLEAN NOT NULL DEFAULT FALSE
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS comments (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      project_id BIGINT NOT NULL, author_id BIGINT NOT NULL, parent_id BIGINT NULL, page_id VARCHAR(36) NULL,
      element_id VARCHAR(36) NULL, x DOUBLE NULL, y DOUBLE NULL, body TEXT NOT NULL, mentions TEXT NULL,
      resolved BOOLEAN NOT NULL DEFAULT FALSE, INDEX(project_id, created_at)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS preferences (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id BIGINT NOT NULL, pref_key VARCHAR(80) NOT NULL, pref_value TEXT NULL, UNIQUE KEY uq_preference(user_id, pref_key)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS email_settings (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id BIGINT NOT NULL UNIQUE, comments BOOLEAN NOT NULL DEFAULT TRUE, mentions BOOLEAN NOT NULL DEFAULT TRUE,
      invitations BOOLEAN NOT NULL DEFAULT TRUE, approvals BOOLEAN NOT NULL DEFAULT TRUE, product_updates BOOLEAN NOT NULL DEFAULT TRUE
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id BIGINT NOT NULL, type VARCHAR(32) NOT NULL, message VARCHAR(300) NOT NULL,
      link VARCHAR(300) NULL, read_at TIMESTAMP NULL, INDEX(user_id, created_at)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS activities (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      actor_id BIGINT NULL, project_id BIGINT NULL, type VARCHAR(48) NOT NULL, meta TEXT NULL, INDEX(project_id, created_at)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS teams (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      name VARCHAR(120) NOT NULL, owner_id BIGINT NOT NULL
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS team_members (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      team_id BIGINT NOT NULL, user_id BIGINT NOT NULL, role VARCHAR(16) NOT NULL DEFAULT 'MAKER',
      UNIQUE KEY uq_team_member(team_id, user_id)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS brand_kits (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      owner_id BIGINT NOT NULL, team_id BIGINT NULL, name VARCHAR(120) NOT NULL,
      colors TEXT NULL, fonts TEXT NULL, guidelines TEXT NULL
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS assets (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      owner_id BIGINT NOT NULL, brand_kit_id BIGINT NULL, kind VARCHAR(24) NOT NULL, file_name VARCHAR(255) NOT NULL,
      stored_name VARCHAR(255) NOT NULL, mime_type VARCHAR(120) NULL, size_bytes BIGINT NOT NULL DEFAULT 0,
      width INT NULL, height INT NULL, INDEX(owner_id, created_at)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS categories (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      name VARCHAR(80) NOT NULL, slug VARCHAR(80) NOT NULL UNIQUE, width INT NOT NULL DEFAULT 1080,
      height INT NOT NULL DEFAULT 1080, sort_order INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS templates (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      category_id BIGINT NULL, author_id BIGINT NULL, title VARCHAR(160) NOT NULL, width INT NOT NULL,
      height INT NOT NULL, thumbnail MEDIUMTEXT NULL, design LONGTEXT NOT NULL, tags VARCHAR(300) NULL,
      published BOOLEAN NOT NULL DEFAULT TRUE, INDEX(category_id, published)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS product_updates (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      title VARCHAR(160) NOT NULL, body TEXT NOT NULL
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS exports (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id BIGINT NOT NULL, project_id BIGINT NULL, format VARCHAR(16) NOT NULL,
      size_bytes BIGINT NOT NULL DEFAULT 0, page_count INT NOT NULL DEFAULT 1
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS plans (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, code VARCHAR(32) NOT NULL UNIQUE, name VARCHAR(80) NOT NULL,
      price_cents INT NOT NULL DEFAULT 0, max_projects INT NOT NULL DEFAULT 3, storage_bytes BIGINT NOT NULL DEFAULT 0,
      ai_requests_per_month INT NOT NULL DEFAULT 0, exports_per_month INT NOT NULL DEFAULT 0, team_seats INT NOT NULL DEFAULT 1
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS subscriptions (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id BIGINT NOT NULL, plan_id BIGINT NOT NULL, status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
      current_period_end TIMESTAMP NULL
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS billing_records (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id BIGINT NOT NULL, description VARCHAR(80) NOT NULL, amount_cents INT NOT NULL DEFAULT 0, status VARCHAR(24) NOT NULL
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS ai_settings (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id BIGINT NOT NULL, provider VARCHAR(32) NOT NULL, encrypted_key TEXT NOT NULL, text_model VARCHAR(120) NULL,
      image_model VARCHAR(120) NULL, base_url VARCHAR(300) NULL, active BOOLEAN NOT NULL DEFAULT TRUE,
      UNIQUE KEY uq_ai_setting(user_id, provider)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS ai_usage (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id BIGINT NOT NULL, provider VARCHAR(32) NOT NULL, kind VARCHAR(32) NOT NULL, model VARCHAR(120) NULL,
      prompt_chars INT NOT NULL DEFAULT 0, output_chars INT NOT NULL DEFAULT 0, success BOOLEAN NOT NULL DEFAULT FALSE,
      latency_ms BIGINT NOT NULL DEFAULT 0, INDEX(user_id, created_at)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS design_approvals (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      project_id BIGINT NOT NULL, requested_by_id BIGINT NOT NULL, status VARCHAR(24) NOT NULL DEFAULT 'PENDING',
      message TEXT NULL, feedback TEXT NULL, caption TEXT NULL, decided_by_id BIGINT NULL, decided_at TIMESTAMP NULL,
      approved_revision BIGINT NULL, INDEX(project_id, created_at)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS social_accounts (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      user_id BIGINT NOT NULL, platform VARCHAR(24) NOT NULL, external_id VARCHAR(120) NULL, display_name VARCHAR(160) NULL,
      encrypted_access_token TEXT NULL, encrypted_refresh_token TEXT NULL, token_expires_at TIMESTAMP NULL,
      INDEX(user_id, platform)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS social_posts (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      author_id BIGINT NOT NULL, account_id BIGINT NOT NULL, project_id BIGINT NULL, reviewer_id BIGINT NULL,
      caption TEXT NULL, media_url VARCHAR(400) NULL, status VARCHAR(24) NOT NULL DEFAULT 'DRAFT',
      scheduled_at TIMESTAMP NULL, published_at TIMESTAMP NULL, external_post_id VARCHAR(200) NULL,
      feedback TEXT NULL, error TEXT NULL, INDEX(status, scheduled_at), INDEX(author_id)
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS oauth_states (
      state VARCHAR(80) NOT NULL PRIMARY KEY, user_id BIGINT NOT NULL, platform VARCHAR(24) NOT NULL,
      verifier VARCHAR(100) NOT NULL, expires_at TIMESTAMP NOT NULL
    ) ENGINE=InnoDB`,
    `CREATE TABLE IF NOT EXISTS oauth_pending_accounts (
      ticket VARCHAR(80) NOT NULL PRIMARY KEY, user_id BIGINT NOT NULL, platform VARCHAR(24) NOT NULL,
      page_data LONGTEXT NOT NULL, expires_at TIMESTAMP NOT NULL, INDEX(user_id, expires_at)
    ) ENGINE=InnoDB`,
  ]

  for (const statement of schema) await db().query(statement)
  await addMissingColumns('social_accounts', [
    ['facebook_login_id', 'VARCHAR(120) NULL'],
    ['facebook_login_name', 'VARCHAR(160) NULL'],
  ])
  await db().query(
    `INSERT IGNORE INTO plans (code, name, price_cents, max_projects, storage_bytes, ai_requests_per_month, exports_per_month, team_seats)
     VALUES ('free', 'Free', 0, 10, 1073741824, 20, 30, 1),
       ('pro', 'Pro', 1200, 500, 53687091200, 500, 1000, 5),
       ('team', 'Team', 2900, 5000, 536870912000, 5000, 10000, 50)`,
  )
  await db().query(
    `INSERT IGNORE INTO categories (name, slug, width, height, sort_order) VALUES
     ('Instagram post', 'instagram-post', 1080, 1080, 0),
     ('Instagram story', 'instagram-story', 1080, 1920, 1),
     ('Presentation', 'presentation', 1920, 1080, 2),
     ('Poster', 'poster', 1587, 2245, 3),
     ('YouTube thumbnail', 'youtube-thumbnail', 1280, 720, 4),
     ('Facebook cover', 'facebook-cover', 1640, 624, 5),
     ('LinkedIn banner', 'linkedin-banner', 1584, 396, 6),
     ('Pinterest pin', 'pinterest-pin', 1000, 1500, 7),
     ('A4 document', 'a4-document', 1240, 1754, 8)`,
  )
  const update = await db().query('SELECT id FROM product_updates LIMIT 1')
  if ((update[0] as RowDataPacket[]).length === 0) {
    await db().query(
      'INSERT INTO product_updates (title, body) VALUES (?, ?)',
      ['Welcome to DesignHub', 'Design together in real time, keep every version, and publish straight to your social accounts.'],
    )
  }
  await seedTemplates()
}

async function addMissingColumns(table: string, columns: [string, string][]) {
  const [existing] = await db().query<RowDataPacket[]>(
    'SELECT COLUMN_NAME AS name FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
    [database, table],
  )
  const present = new Set((existing as RowDataPacket[]).map((row) => String(row.name)))
  for (const [name, definition] of columns) {
    if (!present.has(name)) await db().query(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${definition}`)
  }
}

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!)
}


async function seedTemplates() {
  for (const template of libraryTemplates) {
    const category = await db().query('SELECT id FROM categories WHERE slug = ? LIMIT 1', [template.slug])
    const categoryRows = category[0] as RowDataPacket[]
    const categoryId = Number(categoryRows[0]?.id)
    if (!categoryId) continue
    const existing = await db().query('SELECT id, thumbnail FROM templates WHERE category_id = ? AND title = ? LIMIT 1', [categoryId, template.title])
    const existingRow = (existing[0] as RowDataPacket[])[0] as { id: number; thumbnail: string | null } | undefined
    const thumbnail = thumbnailFor(template)
    if (existingRow) {
      if (!existingRow.thumbnail) await db().query('UPDATE templates SET thumbnail = ? WHERE id = ?', [thumbnail, existingRow.id])
      continue
    }
    const design = {
      projectId: null, revision: 0, width: template.width, height: template.height,
      pages: [{
        id: randomBytes(18).toString('hex'), name: 'Page 1', background: template.background, durationSeconds: null,
        position: 0, notes: null,
        elements: template.elements.map((element, zIndex) => ({
          id: randomBytes(18).toString('hex'), type: element.type, zIndex,
          data: { ...element.data, rotation: 0, opacity: 1 },
        })),
      }],
    }
    await db().query(
      `INSERT INTO templates (created_at, category_id, title, width, height, thumbnail, design, tags, published)
       VALUES (CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [categoryId, template.title, template.width, template.height, thumbnail, JSON.stringify(design), template.tags],
    )
  }
}
