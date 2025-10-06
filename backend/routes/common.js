export const healthCheck = (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
};

export const apiInfo = (req, res) => {
    res.json({
        name: 'Document Search & Management System',
        version: '1.0.0',
        description: 'A high-performance Node.js backend API for managing and searching PDFs, web links, and FAQs with full-text search capabilities.',
        author: 'GreenHacker',
        license: 'MIT',
        endpoints: [
            { method: 'GET', path: '/health', description: 'Health check' },
            { method: 'GET', path: '/', description: 'API information' },
            { method: 'POST', path: '/api/faqs', description: 'Create new FAQ' },
            { method: 'GET', path: '/api/faqs', description: 'Get all FAQs' },
            { method: 'GET', path: '/api/faqs/:id', description: 'Get FAQ by ID' },
            { method: 'PUT', path: '/api/faqs/:id', description: 'Update FAQ' },
            { method: 'DELETE', path: '/api/faqs/:id', description: 'Delete FAQ' },
            { method: 'POST', path: '/api/links', description: 'Create new web link' },
            { method: 'GET', path: '/api/links', description: 'Get all web links' },
            { method: 'GET', path: '/api/links/:id', description: 'Get web link by ID' },
            { method: 'PUT', path: '/api/links/:id', description: 'Update web link' },
            { method: 'DELETE', path: '/api/links/:id', description: 'Delete web link' },
            { method: 'POST', path: '/api/pdfs', description: 'Upload PDF' },
            { method: 'GET', path: '/api/pdfs', description: 'Get all PDFs' },
            { method: 'GET', path: '/api/pdfs/:id', description: 'Get PDF by ID' },
            { method: 'DELETE', path: '/api/pdfs/:id', description: 'Delete PDF' },
            { method: 'GET', path: '/api/search', description: 'Search across all content' },
        ]
    });
};

export const notFound = (req, res) => {
    res.status(404).json({ message: 'Not Found' });
};

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // multer errors handler
    if (err && err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Max size is 10MB' });
        }
        return res.status(400).json({ error: err.message });
    }

    res.status(err && err.status ? err.status : 500).json({
        error: err && err.message ? err.message : 'Internal server error',
    });
};