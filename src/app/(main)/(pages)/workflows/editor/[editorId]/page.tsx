import { ConnectionsProvider } from '@/providers/connections-provider'
import EditorProvider from '@/providers/editor-provider'
import React from 'react'
import EditorCanvas from './_components/editor-canvas'
import EditorGate from './_components/editor-gate'

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="h-full">
      <EditorGate>
        <EditorProvider>
          <ConnectionsProvider>
            <EditorCanvas />
          </ConnectionsProvider>
        </EditorProvider>
      </EditorGate>
    </div>
  )
}

export default Page