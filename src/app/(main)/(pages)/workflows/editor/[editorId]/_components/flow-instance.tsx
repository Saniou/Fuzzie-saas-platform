'use client'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import { onCreateNodesEdges, onFlowPublish } from '../_actions/workflow-connections'
import { toast } from 'sonner'

type Props = {
  children: React.ReactNode
  edges: any[]
  nodes: any[]
}

const FlowInstance = ({ children, edges, nodes }: Props) => {
  const pathname = usePathname()
  const editorId = useMemo(() => pathname.split('/').pop()!, [pathname])

  const isFlow = useMemo(() => {
    const targets = edges.map((e) => e.target)
    const list: string[] = []
    for (const t of targets) {
      const node = nodes.find((n) => n.id === t)
      if (node) list.push(node.type)
    }
    return list
  }, [edges, nodes])

  const onFlowAutomation = useCallback(async () => {
    const flow = await onCreateNodesEdges(
      editorId,
      JSON.stringify(nodes),
      JSON.stringify(edges),
      JSON.stringify(isFlow)
    )
    if (flow) toast.message(flow.message)
  }, [editorId, nodes, edges, isFlow])

  const onPublishWorkflow = useCallback(async () => {
    const response = await onFlowPublish(editorId, true)
    if (response) toast.message(response)
  }, [editorId])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button onClick={onFlowAutomation} disabled={isFlow.length < 1}>
          Save
        </Button>
        <Button onClick={onPublishWorkflow} disabled={isFlow.length < 1}>
          Publish
        </Button>
      </div>
      {children}
    </div>
  )
}

export default FlowInstance
