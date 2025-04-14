// components/functions/sendWhatsAppMessage.ts
export const sendWhatsAppMessage = async ({
    to,
    message,
  }: {
    to: string // phone number in international format e.g. "27123456789"
    message: string
  }) => {
    const url = `https://graph.facebook.com/v18.0/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_ID}/messages`
  
    const body = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    }
  
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  
    const data = await res.json()
    return data
  }
  