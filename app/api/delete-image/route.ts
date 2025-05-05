export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get('fileId')
  if (!fileId) {
    return Response.json({ error: 'File ID is required' }, { status: 400 })
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  if (!privateKey) {
    return Response.json({ error: 'Private key is not set' }, { status: 500 })
  }

  const base64PrivateKey = Buffer.from(privateKey + ':').toString('base64')

  console.log('private key', {
    privateKey,
    base64PrivateKey
  })

  try {
    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${base64PrivateKey}`
      }
    })

    if (response.ok) {
      return Response.json({ message: 'Image deleted successfully' })
    } else {
      const errorData = await response.json()
      return Response.json({ error: errorData.message }, { status: response.status })
    }
  } catch (error) {
    return Response.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
