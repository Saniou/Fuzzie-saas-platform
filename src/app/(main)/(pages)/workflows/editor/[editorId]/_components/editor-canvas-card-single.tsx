import { EditorCanvasCardType } from '@/lib/types'
import { useEditor } from '@/providers/editor-provider'
import React, { useMemo, memo } from 'react'
import { Position, useNodeId } from 'reactflow'
import EditorCanvasIconHelper from './editor-canvas-card-icon-hepler'
import CustomHandle from './custom-handle'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import clsx from 'clsx'

type Props = {}

const hashStr = (s: string) => {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i)
  return Math.abs(h)
}

const EditorCanvasCardSingle = ({ data }: { data: EditorCanvasCardType }) => {
  const { dispatch, state } = useEditor()
  const nodeId = useNodeId()

  const logo = useMemo(() => <EditorCanvasIconHelper type={data.type} />, [data])

  /** Стабільний статус індикатора:
   *  1) якщо є data.metadata.status ∈ {'ok','warn','error'} — беремо його
   *  2) якщо є data.completed === true/false → ok/error
   *  3) інакше робимо детермінований статус з nodeId (хеш)
   */
  const status: 'ok' | 'warn' | 'error' = useMemo(() => {
    const metaStatus = (data?.metadata as any)?.status as
      | 'ok'
      | 'warn'
      | 'error'
      | undefined
    if (metaStatus) return metaStatus

    if (typeof data.completed === 'boolean') {
      return data.completed ? 'ok' : 'error'
    }

    const id = nodeId ?? ''
    const h = hashStr(String(id))
    const mod = h % 10
    if (mod <= 6) return 'ok'
    if (mod <= 8) return 'warn'
    return 'error'
  }, [data?.metadata, data?.completed, nodeId])

  const dotColor =
    status === 'ok'
      ? 'bg-green-500 shadow-[0_0_0_2px_rgba(16,185,129,.35),0_0_8px_rgba(16,185,129,.45)]'
      : status === 'warn'
      ? 'bg-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,.30),0_0_8px_rgba(249,115,22,.45)]'
      : 'bg-red-500 shadow-[0_0_0_2px_rgba(239,68,68,.30),0_0_8px_rgba(239,68,68,.45)]'

  return (
    <>
      {data.type !== 'Trigger' && data.type !== 'Google Drive' && (
        <CustomHandle type="target" position={Position.Top} style={{ zIndex: 100 }} />
      )}

      <Card
        onClick={(e) => {
          e.stopPropagation()
          const val = state.editor.elements.find((n) => n.id === nodeId)
          if (val)
            dispatch({
              type: 'SELECTED_ELEMENT',
              payload: { element: val },
            })
        }}
        className="relative max-w-[400px] dark:border-muted-foreground/70 transition-[box-shadow,transform] hover:shadow-lg"
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <div>{logo}</div>
          <div>
            <CardTitle className="text-md">{data.title}</CardTitle>
            <CardDescription>
              <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {nodeId}
              </p>
              <p>{data.description}</p>
            </CardDescription>
          </div>
        </CardHeader>

        <Badge variant="secondary" className="absolute right-2 top-2">
          {data.type}
        </Badge>

        {/* anti-flicker LED */}
        <div
          className={clsx(
            'absolute left-3 top-4 h-2 w-2 rounded-full',
            dotColor,
            'pointer-events-none select-none',
            '[transform:translateZ(0)] [backface-visibility:hidden] will-change-[transform,opacity]'
          )}
        />
      </Card>

      <CustomHandle type="source" position={Position.Bottom} id="a" />
    </>
  )
}

/** Мемо — аби не перемальовуватись без змін важливих полів */
function areEqual(
  prev: { data: EditorCanvasCardType },
  next: { data: EditorCanvasCardType }
) {
  return (
    prev.data.type === next.data.type &&
    prev.data.title === next.data.title &&
    prev.data.description === next.data.description &&
    prev.data.completed === next.data.completed &&
    prev.data.current === next.data.current &&
    JSON.stringify(prev.data.metadata) === JSON.stringify(next.data.metadata)
  )
}

export default memo(EditorCanvasCardSingle, areEqual)
