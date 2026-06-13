import { EditorCanvasDefaultCardTypes } from '@/lib/constant'
import type { EditorCanvasTypes, EditorNodeType } from '@/lib/types'

export type WorkflowTemplate = {
  id: string
  name: string
  description: string
  category: string
  /** Шляхи до іконок інтеграцій для прев'ю картки */
  icons: string[]
  /** Типи дій (для бейджів + дефолтних шаблонів повідомлень) */
  actions: ('Discord' | 'Slack' | 'Notion' | 'Wait')[]
  /** Дефолтне повідомлення, яким наповнюються Discord/Slack/Notion */
  message: string
  nodes: EditorNodeType[]
  edges: { id: string; source: string; target: string }[]
  flowPath: string[]
}

const ICONS: Record<string, string> = {
  'Google Drive': '/googleDrive.png',
  Discord: '/discord.png',
  Slack: '/slack.png',
  Notion: '/notion.png',
}

/** Створює вузол у форматі редактора (як onDrop у editor-canvas). */
const node = (
  id: string,
  type: EditorCanvasTypes,
  y: number
): EditorNodeType => ({
  id,
  type,
  position: { x: 300, y },
  data: {
    title: type,
    description: EditorCanvasDefaultCardTypes[type].description,
    completed: false,
    current: false,
    metadata: {},
    type,
  },
})

/**
 * Будує шаблон як лінійний ланцюжок: Google Drive (тригер) → дії по черзі.
 * flowPath = типи дій у порядку виконання (як рахує FlowInstance).
 */
const buildChain = (
  meta: Omit<WorkflowTemplate, 'nodes' | 'edges' | 'flowPath' | 'icons'>
): WorkflowTemplate => {
  const steps: EditorCanvasTypes[] = ['Google Drive', ...meta.actions]
  const nodes = steps.map((type, i) => node(`${meta.id}-${i}`, type, 100 + i * 160))
  const edges = steps.slice(1).map((_, i) => ({
    id: `${meta.id}-e${i}`,
    source: `${meta.id}-${i}`,
    target: `${meta.id}-${i + 1}`,
  }))
  return {
    ...meta,
    icons: steps.map((s) => ICONS[s]).filter(Boolean),
    nodes,
    edges,
    flowPath: [...meta.actions],
  }
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  buildChain({
    id: 'drive-discord',
    name: 'Drive → Discord alerts',
    description:
      'Post a Discord message whenever a file changes in your Google Drive.',
    category: 'Notifications',
    actions: ['Discord'],
    message: '📂 A file just changed in your Google Drive.',
  }),
  buildChain({
    id: 'drive-slack',
    name: 'Drive → Slack alerts',
    description: 'Notify a Slack channel on every Google Drive change.',
    category: 'Notifications',
    actions: ['Slack'],
    message: '📂 A file just changed in your Google Drive.',
  }),
  buildChain({
    id: 'drive-notion',
    name: 'Log Drive changes to Notion',
    description: 'Create a Notion entry each time your Drive updates.',
    category: 'Productivity',
    actions: ['Notion'],
    message: 'Google Drive change logged automatically.',
  }),
  buildChain({
    id: 'drive-slack-discord',
    name: 'Broadcast to Slack & Discord',
    description: 'Fan out a Drive change to both Slack and Discord in sequence.',
    category: 'Notifications',
    actions: ['Slack', 'Discord'],
    message: '📣 Drive update — broadcasting to the team.',
  }),
  buildChain({
    id: 'drive-wait-discord',
    name: 'Delayed Discord ping',
    description:
      'Wait a beat after a Drive change, then send a Discord reminder.',
    category: 'Scheduling',
    actions: ['Wait', 'Discord'],
    message: '⏰ Reminder: a Drive file changed a moment ago.',
  }),
]

export const getTemplateById = (id: string) =>
  WORKFLOW_TEMPLATES.find((t) => t.id === id)
