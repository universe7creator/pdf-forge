module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-License-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, file } = req.body;
  const licenseKey = req.headers['x-license-key'];

  // Quick validation
  if (!action) {
    return res.status(400).json({ error: 'Action required' });
  }

  // License check for non-preview actions
  if (!licenseKey && action !== 'preview' && action !== 'health') {
    return res.status(401).json({
      error: 'License required',
      message: 'Please provide a valid license key'
    });
  }

  // File size check
  if (file && file.length > 5000000) {
    return res.status(413).json({
      error: 'File too large',
      message: 'Max file size: 5MB'
    });
  }

  try {
    let result;

    switch (action) {
      case 'extract-text':
        result = await extractText(file);
        break;
      case 'extract-json':
        result = await extractJSON(file);
        break;
      case 'extract-images':
        result = await extractImages(file);
        break;
      case 'extract-metadata':
        result = await extractMetadata(file);
        break;
      case 'preview':
        result = await generatePreview(file);
        break;
      case 'health':
        result = { status: 'healthy', service: 'pdf-forge', timestamp: new Date().toISOString() };
        break;
      default:
        return res.status(400).json({
          error: 'Invalid action',
          validActions: ['extract-text', 'extract-json', 'extract-images', 'extract-metadata', 'preview', 'health']
        });
    }

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[PDF Forge] Processing error:', error);
    return res.status(500).json({
      error: 'Processing failed',
      message: error.message
    });
  }
};

async function extractText(file) {
  // Simulate processing with minimal delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    action: 'extract-text',
    text: `Sample extracted text from PDF...`,
    pages: 1,
    characters: 215
  };
}

async function extractJSON(file) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    action: 'extract-json',
    data: {
      title: "Sample Document",
      author: "Unknown",
      pages: 1,
      content: [{ page: 1, text: "Lorem ipsum..." }]
    },
    format: 'json'
  };
}

async function extractImages(file) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    action: 'extract-images',
    images: [{ page: 1, url: 'https://via.placeholder.com/800x1100.png', format: 'png' }],
    totalImages: 1
  };
}

async function extractMetadata(file) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    action: 'extract-metadata',
    metadata: {
      title: "Sample PDF",
      author: "Unknown",
      pageCount: 1,
      creationDate: new Date().toISOString()
    }
  };
}

async function generatePreview(file) {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    action: 'preview',
    preview: { pageCount: 1, status: 'ready' },
    message: 'Preview generated. Full extraction requires license.'
  };
}
