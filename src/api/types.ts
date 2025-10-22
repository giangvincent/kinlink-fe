export interface ApiSuccessResponse<Data, Meta extends Record<string, unknown> = Record<string, unknown>> {
  data: Data
  meta: Meta
  errors: unknown[]
}

export interface ApiResult<Data, Meta extends Record<string, unknown> = Record<string, unknown>> {
  data: Data
  meta: Meta
}

export type FamilyRole = 'owner' | 'elder' | 'member' | 'guest'

export interface Family {
  id: number
  name: string
  slug: string
  locale: string | null
  billing_plan: string | null
  settings: Record<string, unknown>
  owner_user_id: number | null
  role?: FamilyRole | null
  created_at?: string | null
  updated_at?: string | null
}

export interface Membership {
  family_id: number
  family_name: string
  family_slug: string
  role: FamilyRole | null
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string | null
  locale?: string | null
  time_zone?: string | null
  email_verified_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type PersonGender = 'female' | 'male' | 'non_binary' | 'other' | 'unknown'
export type PersonVisibility = 'private' | 'family' | 'guests'

export interface Relationship {
  id: number
  family_id: number
  person_id_a: number
  person_id_b: number
  type: 'PARENT' | 'SPOUSE' | 'CHILD' | 'OTHER'
  certainty: number | null
  source: string | null
  notes: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface Person {
  id: number
  family_id: number
  given_name: string
  middle_name: string | null
  surname: string
  display_name: string | null
  gender: PersonGender | string | null
  birth_date: string | null
  death_date: string | null
  visibility: PersonVisibility | string | null
  meta: Record<string, unknown> | null
  relationships: Relationship[]
  created_at?: string | null
  updated_at?: string | null
}

export type RelationshipType = Relationship['type']

export interface PersonListPayload {
  items: Person[]
  pagination: {
    current_page: number
    per_page: number
    total: number
    has_more: boolean
    next_cursor: string | null
  }
}

export type EventType = 'BIRTH' | 'DEATH' | 'MARRIAGE' | 'ANNIV' | 'ANCESTOR_DAY'

export interface EventItem {
  id: number
  family_id: number
  person_id: number | null
  type: EventType | string
  date_exact: string | null
  date_range: Record<string, unknown> | null
  lunar: boolean
  place: string | null
  notes: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type PostVisibility = 'family' | 'guests'

export interface PostItem {
  id: number
  family_id: number
  author_user_id: number
  body: string
  visibility: PostVisibility | string
  pinned: boolean
  author?: User | null
  created_at?: string | null
  updated_at?: string | null
}

export interface PostListPayload {
  items: PostItem[]
  pagination: {
    next_cursor: string | null
    previous_cursor: string | null
    per_page: number
  }
}

export type InvitationRole = FamilyRole

export interface Invitation {
  id: number
  family_id: number
  email: string
  role: InvitationRole | null
  token: string
  expires_at: string | null
  accepted_at: string | null
  created_at?: string | null
}

export interface InvitationLookupPayload {
  invitation: Invitation
  family: Family
}

export interface InvitationAcceptPayload {
  invitation: Invitation
  user: User
}

export interface MediaItem {
  uuid: string
  id: number
  model_type: string
  model_id: number
  collection_name: string
  name: string
  file_name: string
  mime_type: string | null
  disk: string
  size: number
  custom_properties: Record<string, unknown>
  generated_conversions: Record<string, unknown>
  created_at?: string | null
  updated_at?: string | null
}

export interface UploadSignature {
  url: string
  headers: Record<string, string>
  method: string
  expires_at: string
  path: string
  disk: string
}

export interface KinshipPathSegment {
  person_id: number
  via_relationship_id: number | null
}

export interface KinshipPathPayload {
  path: KinshipPathSegment[]
  label: string | null
}

export interface BillingPlanSummary {
  current_plan: string | null
  subscription: null | {
    provider: string | null
    status: string | null
    current_period_end: string | null
    seats: number | null
    storage_quota_mb: number | null
  }
}

export interface BillingCheckoutPayload {
  checkout_url: string
  session_id: string
}

export interface BillingUsagePayload {
  members_count: number
  storage_bytes: number
  storage_quota_mb: number
}

export interface RealtimeAuthPayload {
  auth: string
  channel_data?: string
  shared_secret?: string
}

export interface ExportJob {
  id: number
  status: string
  path: string | null
  disk: string | null
  meta: Record<string, unknown> | null
  created_at?: string | null
  updated_at?: string | null
}

export interface ExportCreatePayload {
  job_id: number
  status: string
}
