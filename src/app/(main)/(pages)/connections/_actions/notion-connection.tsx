'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { Client } from '@notionhq/client'

export const onNotionConnect = async (
  access_token: string,
  workspace_id: string,
  workspace_icon: string,
  workspace_name: string,
  database_id: string,
  id: string
) => {
  'use server'
  if (access_token) {
    //check if notion is connected
    const notion_connected = await db.notion.findFirst({
      where: {
        accessToken: access_token,
      },
      include: {
        connections: {
          select: {
            type: true,
          },
        },
      },
    })

    if (!notion_connected) {
      //create connection
      await db.notion.create({
        data: {
          userId: id,
          workspaceIcon: workspace_icon!,
          accessToken: access_token,
          workspaceId: workspace_id!,
          workspaceName: workspace_name!,
          databaseId: database_id,
          connections: {
            create: {
              userId: id,
              type: 'Notion',
            },
          },
        },
      })
    }
  }
}
export const getNotionConnection = async () => {
  const user = await currentUser()
  if (user) {
    const connection = await db.notion.findFirst({
      where: {
        userId: user.id,
      },
    })
    if (connection) {
      return connection
    }
  }
}

export const getNotionDatabase = async (
  databaseId: string,
  accessToken: string
) => {
  const notion = new Client({
    auth: accessToken,
  })
  const response = await notion.databases.retrieve({ database_id: databaseId })
  return response
}

export const onCreateNewPageInDatabase = async (
  databaseId: string,
  accessToken: string,
  content: string
) => {
  const notion = new Client({
    auth: accessToken,
  })

  try {
    // Retrieve DB to find the title property key dynamically
    const dbMeta = await notion.databases.retrieve({ database_id: databaseId })
    const props = (dbMeta as any).properties as Record<string, any>
    const titleEntry = Object.entries(props).find(([, v]) => v?.type === 'title')
    if (!titleEntry) {
      return { success: false, message: 'No title property found in Notion database.' }
    }
    const [titlePropName] = titleEntry

    const created = await notion.pages.create({
      parent: { type: 'database_id', database_id: databaseId },
      properties: {
        [titlePropName]: {
          title: [
            {
              text: { content: content || 'Untitled' },
            },
          ],
        },
      },
    })

    return { success: true, message: 'Page created', id: (created as any).id }
  } catch (e: any) {
    console.error('Notion page create failed', e)
    return { success: false, message: e?.message ?? 'Failed to create Notion page' }
  }
}