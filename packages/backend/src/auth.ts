import bcrypt from 'bcryptjs'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { one, run } from './db.js'
import type { RowDataPacket } from 'mysql2/promise'

export interface AuthUser {
  id: number
  email: string
  name: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

const secret = process.env.JWT_SECRET ?? 'designhub-dev-only-secret-change-me-please-0123456789abcdef'
const expiryHours = Number(process.env.JWT_EXPIRY_HOURS ?? 168)
const allowedDomains = (process.env.ALLOWED_EMAIL_DOMAINS ?? 'cutmap.ac.in,cutm.ac.in,thegttech.com')
  .split(',')
  .map((domain) => domain.trim().toLowerCase())
  .filter(Boolean)

export function issueToken(user: AuthUser) {
  return jwt.sign({ email: user.email, name: user.name, role: user.role }, secret, {
    subject: String(user.id),
    expiresIn: `${expiryHours}h`,
  })
}

export function parseToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, secret)
    if (typeof payload === 'string' || !payload.sub) return null
    const id = Number(payload.sub)
    if (!Number.isSafeInteger(id)) return null
    return {
      id,
      email: String(payload.email ?? ''),
      name: String(payload.name ?? ''),
      role: String(payload.role ?? 'USER'),
    }
  } catch {
    return null
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization') ?? ''
  const user = header.startsWith('Bearer ') ? parseToken(header.slice(7)) : null
  if (!user) {
    res.status(401).json({ message: 'Sign in again to continue.' })
    return
  }
  req.user = user
  next()
}

export async function registerUser(name: string, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw Object.assign(new Error('Enter a valid email address.'), { status: 400 })
  }
  assertAllowedEmail(normalizedEmail)
  if (name.trim().length < 1 || password.length < 8) {
    throw Object.assign(new Error('Enter a name and a password of at least 8 characters.'), { status: 400 })
  }
  const existing = await one<RowDataPacket & { id: number }>('SELECT id FROM users WHERE email = ?', [normalizedEmail])
  if (existing) throw Object.assign(new Error('An account with this email already exists. Sign in instead.'), { status: 409 })
  const passwordHash = await bcrypt.hash(password, 11)
  const result = await run('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', [normalizedEmail, passwordHash, name.trim()])
  const insertId = Number((result as { insertId: number }).insertId)
  const freePlan = await one<RowDataPacket & { id: number }>('SELECT id FROM plans WHERE code = ?', ['free'])
  if (freePlan) await run(
    'INSERT INTO subscriptions (user_id, plan_id, current_period_end) VALUES (?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY))',
    [insertId, freePlan.id],
  )
  await run('INSERT INTO activities (actor_id, type, meta) VALUES (?, ?, ?)', [insertId, 'account.created', null])
  return one<RowDataPacket & AuthUser>('SELECT id, email, name, avatar_url AS avatarUrl, role FROM users WHERE id = ?', [insertId])
}

export async function authenticateUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  assertAllowedEmail(normalizedEmail)
  const user = await one<RowDataPacket & AuthUser & { password_hash: string }>(
    'SELECT id, email, name, role, password_hash FROM users WHERE email = ?',
    [normalizedEmail],
  )
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw Object.assign(new Error('Email or password is incorrect'), { status: 401 })
  }
  return user
}

export function assertAllowedEmail(email: string) {
  if (allowedDomains.length === 0) return
  const domain = email.split('@').at(-1)?.toLowerCase() ?? ''
  if (!domain || !allowedDomains.some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`))) {
    throw Object.assign(new Error(`Registration is only available to: ${allowedDomains.join(', ')}`), { status: 403 })
  }
}

export function emailDomains() {
  return allowedDomains
}
