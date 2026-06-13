import axios from 'axios'
import { NextResponse, NextRequest } from 'next/server'
import url from 'url'

const appUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (code) {
    const data = new url.URLSearchParams()
    data.append('client_id', process.env.DISCORD_CLIENT_ID!)
    data.append('client_secret', process.env.DISCORD_CLIENT_SECRET!)
    data.append('grant_type', 'authorization_code')
    data.append('redirect_uri', `${appUrl}/api/auth/callback/discord`)
    data.append('code', code.toString())

    const output = await axios.post(
      'https://discord.com/api/oauth2/token',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    if (output.data) {
      const access = output.data.access_token
      const webhook = output.data.webhook

      // Назва сервера — лише для відображення. Якщо токен не має scope `guilds`
      // (flow webhook.incoming), запит впаде з 401 — не валимо весь callback,
      // а використовуємо guild_id як фолбек.
      let guildName: string = webhook.guild_id
      try {
        const UserGuilds: any = await axios.get(
          `https://discord.com/api/users/@me/guilds`,
          { headers: { Authorization: `Bearer ${access}` } }
        )
        const match = UserGuilds.data.find(
          (guild: any) => guild.id === webhook.guild_id
        )
        if (match?.name) guildName = match.name
      } catch (e) {
        console.warn('Discord: could not fetch guild name, using guild_id')
      }

      return NextResponse.redirect(
        `${appUrl}/connections?webhook_id=${webhook.id}&webhook_url=${webhook.url}&webhook_name=${webhook.name}&guild_id=${webhook.guild_id}&guild_name=${encodeURIComponent(
          guildName
        )}&channel_id=${webhook.channel_id}`
      )
    }

    return NextResponse.redirect(`${appUrl}/connections`)
  }
}
