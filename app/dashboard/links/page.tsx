'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Link as LinkType, LINK_ICONS, LINK_LABELS, LinkType as LType } from '@/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash2, GripVertical, ToggleLeft, ToggleRight, Pencil, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Sortable Link Card ─────────────────────────────────────
interface CardProps {
  link: LinkType
  onToggle: (id: string, val: boolean) => void
  onDelete: (id: string) => void
  onEdit: (link: LinkType) => void
  isDragging?: boolean
}

function SortableLinkCard({ link, onToggle, onDelete, onEdit }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <LinkCard
        link={link}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  )
}

// ─── The actual card UI (shared by sortable + drag overlay) ─
function LinkCard({
  link,
  onToggle,
  onDelete,
  onEdit,
  dragHandleProps,
  isDragging,
}: CardProps & { dragHandleProps?: object }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: isDragging ? 'var(--surface2)' : 'var(--surface)',
      border: `1px solid ${isDragging ? '#555' : 'var(--border)'}`,
      borderRadius: 14, padding: '14px 18px',
      opacity: link.is_active ? 1 : 0.45,
      transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
      boxShadow: isDragging ? '0 16px 40px rgba(0,0,0,0.4)' : 'none',
      userSelect: 'none',
    }}>
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          color: 'var(--muted)', flexShrink: 0,
          display: 'flex', alignItems: 'center', padding: '4px 2px',
          touchAction: 'none',
        }}>
        <GripVertical size={16} />
      </div>

      {/* Icon */}
      <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>
        {link.icon || LINK_ICONS[link.type as LType] || '🔗'}
      </span>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {link.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {link.url}
        </div>
        {link.subtitle && (
          <div style={{ fontSize: 11, color: 'var(--muted)', opacity: 0.6, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {link.subtitle}
          </div>
        )}
      </div>

      {/* Click count */}
      <div style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0, textAlign: 'right', minWidth: 48 }}>
        <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{link.click_count}</div>
        <div style={{ opacity: 0.6 }}>clicks</div>
      </div>

      {/* Edit */}
      <button
        onClick={() => onEdit(link)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px', borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <Pencil size={14} />
      </button>

      {/* Toggle */}
      <button
        onClick={() => onToggle(link.id, link.is_active)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', color: link.is_active ? 'var(--accent)' : 'var(--muted)' }}>
        {link.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(link.id)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', flexShrink: 0, padding: '4px', borderRadius: 6, display: 'flex', alignItems: 'center' }}>
        <Trash2 size={15} />
      </button>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
const LINK_TYPES = Object.entries(LINK_LABELS) as [LType, string][]

export default function LinksPage() {
  const [links, setLinks]           = useState<LinkType[]>([])
  const [showAddModal, setShowAdd]  = useState(false)
  const [editingLink, setEditing]   = useState<LinkType | null>(null)
  const [activeId, setActiveId]     = useState<string | null>(null)
  const [saving, setSaving]         = useState(false)
  const [plan, setPlan]             = useState<'free' | 'pro'>('free')
  const [newLink, setNewLink]       = useState({
    type: 'website' as LType, title: '', url: '', subtitle: '', icon: ''
  })
  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => { loadLinks() }, [])

  async function loadLinks() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: p } = await supabase.from('profiles').select('id, plan').eq('user_id', user.id).single()
    if (p) setPlan(p.plan)

    const res = await fetch('/api/links')
    const data = await res.json()
    if (data.links) setLinks(data.links)
  }

  // ── Drag handlers ──
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = links.findIndex(l => l.id === active.id)
    const newIndex = links.findIndex(l => l.id === over.id)
    const reordered = arrayMove(links, oldIndex, newIndex)

    // Optimistic update
    setLinks(reordered)

    // Persist new order
    const updates = reordered.map((l, i) => ({ id: l.id, sort_order: i }))
    await persistOrder(updates)
  }

  async function persistOrder(updates: { id: string; sort_order: number }[]) {
    // Batch PATCH via our API
    await Promise.all(
      updates.map(({ id, sort_order }) =>
        fetch('/api/links', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, sort_order }),
        })
      )
    )
  }

  // ── Toggle ──
  async function handleToggle(id: string, current: boolean) {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, is_active: !current } : l))
    const res = await fetch('/api/links', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !current }),
    })
    const data = await res.json()
    if (data.error) {
      setLinks(prev => prev.map(l => l.id === id ? { ...l, is_active: current } : l))
      toast.error(data.error)
    }
  }

  // ── Delete ──
  async function handleDelete(id: string) {
    if (!confirm('Delete this link?')) return
    setLinks(prev => prev.filter(l => l.id !== id))
    await fetch('/api/links', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    toast.success('Deleted')
  }

  // ── Add ──
  async function handleAdd() {
    if (!newLink.title.trim()) return toast.error('Title is required')
    if (!newLink.url.trim())   return toast.error('URL is required')
    setSaving(true)
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: newLink.type,
        title: newLink.title,
        url: newLink.url,
        subtitle: newLink.subtitle || null,
        icon: LINK_ICONS[newLink.type],
        sort_order: links.length,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (data.error) return toast.error(data.error)
    setLinks(prev => [...prev, data.link])
    setShowAdd(false)
    setNewLink({ type: 'website', title: '', url: '', subtitle: '', icon: '' })
    toast.success('Link added ✦')
  }

  // ── Save edit ──
  async function handleSaveEdit() {
    if (!editingLink) return
    setSaving(true)
    const res = await fetch('/api/links', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingLink.id,
        title: editingLink.title,
        url: editingLink.url,
        subtitle: editingLink.subtitle,
        icon: editingLink.icon,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (data.error) return toast.error(data.error)
    setLinks(prev => prev.map(l => l.id === data.link.id ? data.link : l))
    setEditing(null)
    toast.success('Saved!')
  }

  const activeLink = links.find(l => l.id === activeId)
  const activeLinks  = links.filter(l => l.is_active).length
  const inactiveLinks = links.filter(l => !l.is_active).length

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0a0a0a', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 14px', color: 'var(--text)',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  const modalOverlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
    backdropFilter: 'blur(8px)', zIndex: 200,
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  }

  const modal: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '24px 24px 0 0', padding: '32px 28px',
    width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 720 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Links</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            {activeLinks} active · {inactiveLinks} hidden · drag to reorder
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 100, background: 'var(--accent)',
          color: '#0a0a0a', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>
          <Plus size={16} /> Add link
        </button>
      </div>

      {/* Free plan limit */}
      {plan === 'free' && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', borderRadius: 10, marginBottom: 20, marginTop: 12,
          background: links.length >= 5 ? 'rgba(255,107,53,0.08)' : 'rgba(200,240,77,0.05)',
          border: `1px solid ${links.length >= 5 ? 'rgba(255,107,53,0.25)' : 'rgba(200,240,77,0.15)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 120, height: 5, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 100, transition: 'width 0.4s',
                background: links.length >= 5 ? '#ff6b35' : 'var(--accent)',
                width: `${Math.min((links.length / 5) * 100, 100)}%`,
              }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              {links.length}/5 links used
            </span>
          </div>
          {links.length >= 5 && (
            <a href="/dashboard/settings" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Upgrade for unlimited →
            </a>
          )}
        </div>
      )}

      {/* Drag & drop list */}
      {links.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(link => (
                <SortableLinkCard
                  key={link.id}
                  link={link}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={setEditing}
                />
              ))}
            </div>
          </SortableContext>

          {/* Floating drag overlay */}
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.35' } } }),
            }}
          >
            {activeLink && (
              <LinkCard
                link={activeLink}
                onToggle={() => {}}
                onDelete={() => {}}
                onEdit={() => {}}
                isDragging
              />
            )}
          </DragOverlay>
        </DndContext>
      ) : (
        <div style={{
          textAlign: 'center', padding: '64px 20px',
          background: 'var(--surface)', border: '1.5px dashed var(--border)', borderRadius: 16
        }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🔗</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No links yet</div>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
            Add your first link — socials, portfolio, shop, newsletter, anything.
          </p>
          <button onClick={() => setShowAdd(true)} style={{
            padding: '11px 28px', borderRadius: 100, background: 'var(--accent)',
            color: '#0a0a0a', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
          }}>
            Add your first link →
          </button>
        </div>
      )}

      {/* ── ADD MODAL ── */}
      {showAddModal && (
        <div style={modalOverlay} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Add a link</h2>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Choose a type and add your details</p>
              </div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Link type grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
              {LINK_TYPES.map(([type, label]) => {
                const active = newLink.type === type
                return (
                  <button key={type}
                    onClick={() => setNewLink(p => ({ ...p, type, title: p.title || label }))}
                    style={{
                      background: active ? 'rgba(200,240,77,0.08)' : 'var(--bg)',
                      border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 10, padding: '10px 6px', cursor: 'pointer',
                      textAlign: 'center', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}>
                    <span style={{ fontSize: 20, display: 'block', marginBottom: 4 }}>{LINK_ICONS[type]}</span>
                    <span style={{ fontSize: 10, color: active ? 'var(--text)' : 'var(--muted)' }}>{label}</span>
                  </button>
                )
              })}
            </div>

            {/* Fields */}
            {[
              { key: 'title',    label: 'TITLE',              ph: newLink.title || 'e.g. My Portfolio', type: 'text' },
              { key: 'url',      label: 'URL',                ph: 'https://...',                        type: 'url'  },
              { key: 'subtitle', label: 'SUBTITLE (optional)', ph: 'Short description',                  type: 'text' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type}
                  value={(newLink as Record<string, string>)[f.key]}
                  onChange={e => setNewLink(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.ph}
                  style={inputStyle}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowAdd(false)} style={{
                flex: 1, padding: '12px', borderRadius: 100, background: 'transparent',
                border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 14,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving} style={{
                flex: 2, padding: '12px', borderRadius: 100, background: 'var(--accent)',
                border: 'none', color: '#0a0a0a', fontSize: 14, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1,
              }}>{saving ? 'Adding...' : 'Add link ✦'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editingLink && (
        <div style={modalOverlay} onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div style={modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Edit link</h2>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Update your link details</p>
              </div>
              <button onClick={() => setEditing(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Icon picker row */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 8 }}>ICON</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.values(LINK_ICONS).filter((v, i, a) => a.indexOf(v) === i).map(icon => (
                  <button key={icon}
                    onClick={() => setEditing(p => p ? { ...p, icon } : p)}
                    style={{
                      width: 40, height: 40, borderRadius: 10, fontSize: 20,
                      background: editingLink.icon === icon ? 'rgba(200,240,77,0.1)' : 'var(--bg)',
                      border: `1.5px solid ${editingLink.icon === icon ? 'var(--accent)' : 'var(--border)'}`,
                      cursor: 'pointer',
                    }}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {[
              { key: 'title',    label: 'TITLE',              type: 'text' },
              { key: 'url',      label: 'URL',                type: 'url'  },
              { key: 'subtitle', label: 'SUBTITLE (optional)', type: 'text' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type}
                  value={(editingLink as Record<string, string | null>)[f.key] ?? ''}
                  onChange={e => setEditing(p => p ? { ...p, [f.key]: e.target.value } : p)}
                  style={inputStyle}
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setEditing(null)} style={{
                flex: 1, padding: '12px', borderRadius: 100, background: 'transparent',
                border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 14,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Cancel</button>
              <button onClick={handleSaveEdit} disabled={saving} style={{
                flex: 2, padding: '12px', borderRadius: 100, background: 'var(--accent)',
                border: 'none', color: '#0a0a0a', fontSize: 14, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1,
              }}>{saving ? 'Saving...' : 'Save changes ✦'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
