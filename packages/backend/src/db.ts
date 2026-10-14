import type { ExecuteValues } from 'mysql2'
import mysql from 'mysql2/promise'
import type { Pool, RowDataPacket } from 'mysql2/promise'
import { randomBytes } from 'node:crypto'

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

function templateThumbnail(template: {
  width: number
  height: number
  background: string
  elements: { type: string; data: Record<string, unknown> }[]
}): string {
  const elements = template.elements.map(({ type, data }) => {
    const x = Number(data.x ?? 0)
    const y = Number(data.y ?? 0)
    const width = Number(data.width ?? 0)
    const height = Number(data.height ?? 0)
    const fill = escapeXml(String(data.fill ?? '#151515'))
    if (type === 'shape') {
      if (data.shape === 'ellipse') {
        return `<ellipse cx="${x + width / 2}" cy="${y + height / 2}" rx="${width / 2}" ry="${height / 2}" fill="${fill}"/>`
      }
      return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${Number(data.cornerRadius ?? 0)}" fill="${fill}"/>`
    }
    if (type === 'text') {
      const fontSize = Number(data.fontSize ?? 32)
      const lines = String(data.text ?? '').split('\n')
      const spans = lines.map((line, index) => `<tspan x="${x}" dy="${index ? fontSize * 1.2 : 0}">${escapeXml(line)}</tspan>`).join('')
      return `<text x="${x}" y="${y + fontSize}" fill="${fill}" font-family="Arial,sans-serif" font-size="${fontSize}" font-weight="${Number(data.fontWeight ?? 400)}">${spans}</text>`
    }
    return ''
  }).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${template.width} ${template.height}"><rect width="100%" height="100%" fill="${escapeXml(template.background)}"/>${elements}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

async function seedTemplates() {
  const templates: {
    slug: string
    title: string
    tags: string
    width: number
    height: number
    background: string
    elements: { type: string; data: Record<string, unknown> }[]
  }[] = [
    {
      slug: 'instagram-post', title: 'Launch day', tags: 'launch,product,announcement', width: 1080, height: 1080, background: '#151515',
      elements: [
        { type: 'shape', data: { x: 0, y: 0, width: 1080, height: 1080, shape: 'rect', fill: '#151515' } },
        { type: 'shape', data: { x: 560, y: 70, width: 760, height: 760, shape: 'ellipse', fill: '#FF5A36' } },
        { type: 'shape', data: { x: 10, y: 700, width: 520, height: 520, shape: 'ellipse', fill: '#FFB547' } },
        { type: 'text', data: { x: 90, y: 330, width: 900, height: 180, text: 'We are live.', fontFamily: 'Bricolage Grotesque', fontSize: 150, fontWeight: 800, fill: '#F6F5F2', align: 'left' } },
        { type: 'text', data: { x: 90, y: 560, width: 720, height: 58, text: 'Our new collection is out today. Come take a look.', fontFamily: 'Inter Tight', fontSize: 48, fontWeight: 400, fill: '#F6F5F2', align: 'left' } },
      ],
    },
    {
      slug: 'instagram-post', title: 'Quote of the week', tags: 'quote,minimal,text', width: 1080, height: 1080, background: '#F2EFE6',
      elements: [
        { type: 'shape', data: { x: 60, y: 60, width: 960, height: 960, shape: 'rect', fill: '#F2EFE6' } },
        { type: 'shape', data: { x: 90, y: 90, width: 900, height: 900, shape: 'rect', fill: '#FFFFFF', cornerRadius: 28 } },
        { type: 'text', data: { x: 150, y: 330, width: 780, height: 110, text: 'Good design is as little design as possible.', fontFamily: 'Fraunces', fontSize: 84, fontWeight: 600, fill: '#151515', align: 'left' } },
        { type: 'text', data: { x: 150, y: 760, width: 600, height: 48, text: 'Dieter Rams', fontFamily: 'Inter Tight', fontSize: 40, fontWeight: 500, fill: '#FF5A36', align: 'left' } },
      ],
    },
    {
      slug: 'instagram-story', title: 'Sale ends tonight', tags: 'sale,promo,story', width: 1080, height: 1920, background: '#FF5A36',
      elements: [
        { type: 'shape', data: { x: 0, y: 0, width: 1080, height: 1920, shape: 'rect', fill: '#FF5A36' } },
        { type: 'shape', data: { x: 140, y: 520, width: 800, height: 800, shape: 'ellipse', fill: '#FFB547' } },
        { type: 'text', data: { x: 90, y: 200, width: 900, height: 72, text: '48 hours only', fontFamily: 'Inter Tight', fontSize: 60, fontWeight: 600, fill: '#FFFFFF', align: 'left' } },
        { type: 'text', data: { x: 90, y: 760, width: 900, height: 190, text: 'Up to 50% off', fontFamily: 'Anton', fontSize: 160, fontWeight: 400, fill: '#FFFFFF', align: 'left' } },
        { type: 'text', data: { x: 90, y: 1560, width: 900, height: 80, text: 'Shop the sale', fontFamily: 'Bricolage Grotesque', fontSize: 64, fontWeight: 700, fill: '#FFFFFF', align: 'left' } },
      ],
    },
    {
      slug: 'presentation', title: 'Quarterly review', tags: 'business,report,slides', width: 1920, height: 1080, background: '#F6F5F2',
      elements: [
        { type: 'shape', data: { x: 0, y: 0, width: 40, height: 1080, shape: 'rect', fill: '#FF5A36' } },
        { type: 'text', data: { x: 180, y: 360, width: 1400, height: 180, text: 'Quarterly review', fontFamily: 'Bricolage Grotesque', fontSize: 150, fontWeight: 800, fill: '#151515', align: 'left' } },
        { type: 'text', data: { x: 180, y: 560, width: 1200, height: 64, text: 'What shipped, what we learned, and what comes next', fontFamily: 'Inter Tight', fontSize: 56, fontWeight: 400, fill: '#4A4E57', align: 'left' } },
      ],
    },
    {
      slug: 'poster', title: 'Open studio night', tags: 'event,poster,art', width: 1587, height: 2245, background: '#FFB547',
      elements: [
        { type: 'shape', data: { x: 220, y: 420, width: 1150, height: 1150, shape: 'ellipse', fill: '#151515' } },
        { type: 'text', data: { x: 140, y: 1560, width: 1300, height: 230, text: 'Open studio', fontFamily: 'Anton', fontSize: 190, fontWeight: 400, fill: '#151515', align: 'left' } },
        { type: 'text', data: { x: 140, y: 1860, width: 1300, height: 80, text: 'Friday 7 pm · Free entry', fontFamily: 'Inter Tight', fontSize: 64, fontWeight: 600, fill: '#151515', align: 'left' } },
      ],
    },
    {
      slug: 'youtube-thumbnail', title: 'Big reveal', tags: 'video,thumbnail,bold', width: 1280, height: 720, background: '#FFB547',
      elements: [
        { type: 'shape', data: { x: 70, y: 70, width: 700, height: 580, shape: 'rect', fill: '#151515', cornerRadius: 24 } },
        { type: 'text', data: { x: 110, y: 140, width: 620, height: 120, text: 'I rebuilt my desk setup', fontFamily: 'Anton', fontSize: 96, fontWeight: 400, fill: '#FFFFFF', align: 'left' } },
        { type: 'text', data: { x: 110, y: 430, width: 620, height: 68, text: 'and it changed everything', fontFamily: 'Inter Tight', fontSize: 52, fontWeight: 600, fill: '#FFB547', align: 'left' } },
      ],
    },
    {
      slug: 'linkedin-banner', title: 'Hiring banner', tags: 'hiring,linkedin,business', width: 1584, height: 396, background: '#151515',
      elements: [
        { type: 'shape', data: { x: 1180, y: 0, width: 404, height: 396, shape: 'rect', fill: '#FF5A36' } },
        { type: 'text', data: { x: 80, y: 110, width: 1000, height: 110, text: 'We are hiring designers', fontFamily: 'Bricolage Grotesque', fontSize: 90, fontWeight: 800, fill: '#F6F5F2', align: 'left' } },
        { type: 'text', data: { x: 80, y: 240, width: 1000, height: 52, text: 'Join a small team building tools people love', fontFamily: 'Inter Tight', fontSize: 40, fontWeight: 400, fill: '#F6F5F2', align: 'left' } },
      ],
    },
    {
      slug: 'pinterest-pin', title: 'Weekly meal plan', tags: 'food,pin,lifestyle', width: 1000, height: 1500, background: '#F2EFE6',
      elements: [
        { type: 'shape', data: { x: 150, y: 120, width: 700, height: 700, shape: 'ellipse', fill: '#FFB547' } },
        { type: 'text', data: { x: 80, y: 900, width: 840, height: 130, text: 'A week of easy dinners', fontFamily: 'Fraunces', fontSize: 110, fontWeight: 700, fill: '#151515', align: 'left' } },
        { type: 'text', data: { x: 80, y: 1240, width: 840, height: 52, text: 'Plan once, cook calmly', fontFamily: 'Inter Tight', fontSize: 44, fontWeight: 500, fill: '#4A4E57', align: 'left' } },
      ],
    },
    {
      slug: 'a4-document', title: 'Modern resume', tags: 'resume,cv,career,professional', width: 1240, height: 1754, background: '#FFFFFF',
      elements: [
        { type: 'shape', data: { x: 0, y: 0, width: 360, height: 1754, shape: 'rect', fill: '#173B3F' } },
        { type: 'text', data: { x: 48, y: 130, width: 270, height: 110, text: 'YOUR NAME', fontFamily: 'Bricolage Grotesque', fontSize: 58, fontWeight: 800, fill: '#FFFFFF' } },
        { type: 'text', data: { x: 48, y: 290, width: 270, height: 56, text: 'CONTACT', fontFamily: 'Inter Tight', fontSize: 34, fontWeight: 700, fill: '#FFB547' } },
        { type: 'text', data: { x: 48, y: 360, width: 270, height: 200, text: ['email@example.com', '+1 555 0100', 'City, Country'].join('\n'), fontFamily: 'Inter Tight', fontSize: 27, fontWeight: 400, fill: '#FFFFFF' } },
        { type: 'text', data: { x: 420, y: 160, width: 740, height: 76, text: 'DESIGNER & CREATOR', fontFamily: 'Inter Tight', fontSize: 34, fontWeight: 700, fill: '#FF5A36' } },
        { type: 'text', data: { x: 420, y: 290, width: 740, height: 80, text: 'Profile', fontFamily: 'Bricolage Grotesque', fontSize: 60, fontWeight: 800, fill: '#173B3F' } },
        { type: 'text', data: { x: 420, y: 390, width: 740, height: 180, text: 'A short introduction about your experience, strengths and the work you love to do.', fontFamily: 'Inter Tight', fontSize: 30, fontWeight: 400, fill: '#424B50' } },
        { type: 'text', data: { x: 420, y: 680, width: 740, height: 80, text: 'Experience', fontFamily: 'Bricolage Grotesque', fontSize: 60, fontWeight: 800, fill: '#173B3F' } },
        { type: 'text', data: { x: 420, y: 790, width: 740, height: 200, text: ['ROLE · COMPANY', 'Add your achievements and impact here.', '', 'ROLE · COMPANY', 'Add another experience.'].join('\n'), fontFamily: 'Inter Tight', fontSize: 30, fontWeight: 500, fill: '#424B50' } },
      ],
    },
    {
      slug: 'a4-document', title: 'Clean business invoice', tags: 'invoice,business,finance,document', width: 1240, height: 1754, background: '#F6F5F2',
      elements: [
        { type: 'shape', data: { x: 70, y: 70, width: 1100, height: 260, shape: 'rect', fill: '#151515', cornerRadius: 28 } },
        { type: 'text', data: { x: 120, y: 105, width: 500, height: 80, text: 'YOUR STUDIO', fontFamily: 'Bricolage Grotesque', fontSize: 62, fontWeight: 800, fill: '#FFFFFF' } },
        { type: 'text', data: { x: 120, y: 205, width: 500, height: 44, text: 'INVOICE  #001  ·  DATE', fontFamily: 'Inter Tight', fontSize: 30, fontWeight: 500, fill: '#FFB547' } },
        { type: 'text', data: { x: 100, y: 430, width: 1000, height: 70, text: 'BILL TO', fontFamily: 'Inter Tight', fontSize: 34, fontWeight: 700, fill: '#FF5A36' } },
        { type: 'text', data: { x: 100, y: 495, width: 1000, height: 100, text: ['Client name', 'Company · Address · Email'].join('\n'), fontFamily: 'Inter Tight', fontSize: 32, fontWeight: 400, fill: '#151515' } },
        { type: 'shape', data: { x: 100, y: 680, width: 1040, height: 5, shape: 'rect', fill: '#FF5A36' } },
        { type: 'text', data: { x: 100, y: 730, width: 1040, height: 260, text: ['DESCRIPTION                         QTY       PRICE', 'Design services                         1       $0.00', 'Project expenses                       1       $0.00'].join('\n'), fontFamily: 'Inter Tight', fontSize: 30, fontWeight: 500, fill: '#151515' } },
        { type: 'text', data: { x: 700, y: 1100, width: 440, height: 100, text: 'TOTAL     $0.00', fontFamily: 'Bricolage Grotesque', fontSize: 48, fontWeight: 800, fill: '#173B3F' } },
        { type: 'text', data: { x: 100, y: 1480, width: 1000, height: 60, text: 'Thank you for your business.', fontFamily: 'Fraunces', fontSize: 38, fontWeight: 600, fill: '#424B50' } },
      ],
    },
    {
      slug: 'a4-document', title: 'Creative event flyer', tags: 'event,flyer,announcement,concert', width: 1240, height: 1754, background: '#F5EAD7',
      elements: [
        { type: 'shape', data: { x: 70, y: 70, width: 1100, height: 1614, shape: 'rect', fill: '#F5EAD7', cornerRadius: 40 } },
        { type: 'shape', data: { x: 650, y: 220, width: 500, height: 500, shape: 'ellipse', fill: '#FF5A36' } },
        { type: 'text', data: { x: 130, y: 150, width: 900, height: 68, text: 'YOU ARE INVITED', fontFamily: 'Inter Tight', fontSize: 42, fontWeight: 700, fill: '#173B3F' } },
        { type: 'text', data: { x: 130, y: 420, width: 940, height: 320, text: ['GOOD', 'VIBRATIONS'].join('\n'), fontFamily: 'Bricolage Grotesque', fontSize: 140, fontWeight: 800, fill: '#151515' } },
        { type: 'text', data: { x: 130, y: 920, width: 900, height: 160, text: ['MUSIC · ART · COMMUNITY', 'Saturday, 7 PM  |  Your City'].join('\n'), fontFamily: 'Inter Tight', fontSize: 42, fontWeight: 600, fill: '#173B3F' } },
        { type: 'shape', data: { x: 130, y: 1210, width: 370, height: 100, shape: 'rect', fill: '#173B3F', cornerRadius: 50 } },
        { type: 'text', data: { x: 180, y: 1230, width: 280, height: 52, text: 'GET TICKETS', fontFamily: 'Inter Tight', fontSize: 34, fontWeight: 700, fill: '#FFFFFF' } },
        { type: 'text', data: { x: 130, y: 1480, width: 900, height: 50, text: 'DETAILS  ·  ADDRESS  ·  WEBSITE', fontFamily: 'Inter Tight', fontSize: 28, fontWeight: 500, fill: '#424B50' } },
      ],
    },
    {
      slug: 'a4-document', title: 'Study notes', tags: 'education,school,study,worksheet', width: 1240, height: 1754, background: '#FFFFFF',
      elements: [
        { type: 'shape', data: { x: 0, y: 0, width: 1240, height: 250, shape: 'rect', fill: '#355CDE' } },
        { type: 'text', data: { x: 90, y: 75, width: 1050, height: 90, text: 'TODAY’S NOTES', fontFamily: 'Bricolage Grotesque', fontSize: 76, fontWeight: 800, fill: '#FFFFFF' } },
        { type: 'text', data: { x: 90, y: 170, width: 1050, height: 50, text: 'SUBJECT  ___________________     DATE  _______________', fontFamily: 'Inter Tight', fontSize: 28, fontWeight: 500, fill: '#FFFFFF' } },
        { type: 'text', data: { x: 100, y: 330, width: 1040, height: 80, text: 'KEY IDEA', fontFamily: 'Inter Tight', fontSize: 36, fontWeight: 700, fill: '#FF5A36' } },
        { type: 'text', data: { x: 100, y: 410, width: 1040, height: 180, text: 'Write the main concept in one or two sentences.', fontFamily: 'Fraunces', fontSize: 46, fontWeight: 500, fill: '#151515' } },
        { type: 'shape', data: { x: 100, y: 630, width: 1040, height: 4, shape: 'rect', fill: '#D8DDEB' } },
        { type: 'text', data: { x: 100, y: 700, width: 1040, height: 70, text: 'IMPORTANT DETAILS', fontFamily: 'Inter Tight', fontSize: 36, fontWeight: 700, fill: '#355CDE' } },
        { type: 'text', data: { x: 100, y: 790, width: 1040, height: 400, text: ['01  Add a definition or important fact.', '', '02  Summarize an example.', '', '03  Note a question to revisit.'].join('\n'), fontFamily: 'Inter Tight', fontSize: 34, fontWeight: 400, fill: '#424B50' } },
        { type: 'text', data: { x: 100, y: 1320, width: 1040, height: 70, text: 'REMEMBER', fontFamily: 'Inter Tight', fontSize: 36, fontWeight: 700, fill: '#FF5A36' } },
        { type: 'text', data: { x: 100, y: 1410, width: 1040, height: 140, text: 'A takeaway, formula or next step.', fontFamily: 'Fraunces', fontSize: 42, fontWeight: 500, fill: '#151515' } },
      ],
    },
  ]
  for (const template of templates) {
    const category = await db().query('SELECT id FROM categories WHERE slug = ? LIMIT 1', [template.slug])
    const categoryRows = category[0] as RowDataPacket[]
    const categoryId = Number(categoryRows[0]?.id)
    if (!categoryId) continue
    const existing = await db().query('SELECT id, thumbnail FROM templates WHERE category_id = ? AND title = ? LIMIT 1', [categoryId, template.title])
    const existingRow = (existing[0] as RowDataPacket[])[0] as { id: number; thumbnail: string | null } | undefined
    const thumbnail = templateThumbnail(template)
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
