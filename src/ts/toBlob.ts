export const toBlob = (base64: string) => {
  const decodedData = atob(
    base64.replace(/^.*,/, '')
  )
  const buffers = new Uint8Array(
    decodedData.length
  )
  for (
    let i = 0;
    i < decodedData.length;
    i += 1
  ) {
    buffers[i] = decodedData.charCodeAt(i)
  }
  try {
    const blob = new Blob([buffers.buffer], {
      type: 'image/png',
    })
    return blob
  } catch (e) {
    return null
  }
}
