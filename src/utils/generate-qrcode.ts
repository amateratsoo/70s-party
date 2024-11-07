import qrcode from 'qrcode'
import colors from 'tailwindcss/colors'

export async function generateQrCode(text: string) {
  return qrcode.toDataURL(text, {
    color: {
      dark: colors.slate[200],
      light: colors.blue[500]
    }
  })
}
