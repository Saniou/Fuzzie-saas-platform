import { NextResponse } from 'next/server'
async function getGoogleAccessTokenForUser() {
  return process.env.GOOGLE_ACCESS_TOKEN || ''
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') ?? '10')

    const accessToken = await getGoogleAccessTokenForUser()
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not connected to Google Drive', files: [] },
        { status: 401 }
      )
    }

    const r = await fetch(
      `https://www.googleapis.com/drive/v3/files?pageSize=${limit}&fields=files(id,name,mimeType,iconLink,webViewLink,modifiedTime,owners)`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!r.ok) {
      const text = await r.text()
      return NextResponse.json({ error: text, files: [] }, { status: r.status })
    }

    const data = await r.json()
    return NextResponse.json({ files: data.files ?? [] }, { status: 200 })
  } catch (e: any) {
    console.error('API /api/drive failed:', e)
    return NextResponse.json({ error: e?.message ?? 'Server error', files: [] }, { status: 500 })
  }
}
