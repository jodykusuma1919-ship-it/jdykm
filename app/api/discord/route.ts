import { NextResponse } from 'next/server'

interface EventPayload {
  name: string
  type: string
  date: string
  time: string
  details: string
  dkpReward: number
  maxAttendance: number
  webhookUrl?: string // Optional - can be passed from client settings
}

export async function POST(request: Request) {
  try {
    const event: EventPayload = await request.json()
    
    // Use webhook URL from request body or fall back to env variable
    const webhookUrl = event.webhookUrl || process.env.DISCORD_WEBHOOK_URL || ''

    // Format the date nicely
    const eventDate = new Date(event.date)
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    // Create Discord embed
    const embed = {
      title: `📅 New Event: ${event.name}`,
      color: event.type === 'RAID' ? 0xef4444 : event.type === 'PVP' ? 0xf59e0b : event.type === 'MEETING' ? 0x3b82f6 : 0x6b7280,
      fields: [
        {
          name: '📋 Type',
          value: event.type,
          inline: true,
        },
        {
          name: '📆 Date',
          value: formattedDate,
          inline: true,
        },
        {
          name: '⏰ Time',
          value: event.time,
          inline: true,
        },
        {
          name: '👥 Max Attendance',
          value: `${event.maxAttendance} members`,
          inline: true,
        },
        {
          name: '💎 DKP Reward',
          value: event.dkpReward > 0 ? `+${event.dkpReward} DKP` : 'No DKP reward',
          inline: true,
        },
        {
          name: '📝 Details',
          value: event.details || 'No details provided',
          inline: false,
        },
      ],
      footer: {
        text: 'Prosgard Guild DKP System',
      },
      timestamp: new Date().toISOString(),
    }

    // Send to Discord webhook if configured
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [embed],
        }),
      })

      if (!response.ok) {
        console.error('Discord webhook failed:', await response.text())
        return NextResponse.json({ success: false, error: 'Discord webhook failed' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error posting to Discord:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
