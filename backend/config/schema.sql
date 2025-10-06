-- Drop existing tables if they exist
DROP TABLE IF EXISTS pdfs CASCADE;
DROP TABLE IF EXISTS web_links CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;

-- Create FAQs table
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(content, '')), 'B')
    ) STORED
);

-- Create Web Links table
CREATE TABLE web_links (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    title VARCHAR(500),
    description TEXT,
    content_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(content_text, '')), 'C')
    ) STORED
);

-- Create PDFs table
CREATE TABLE pdfs (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(500) NOT NULL,
    file_path TEXT NOT NULL,
    content_text TEXT,
    file_size BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(file_name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(content_text, '')), 'B')
    ) STORED
);

-- Create indexes for full-text search
CREATE INDEX idx_faqs_search ON faqs USING GIN(search_vector);
CREATE INDEX idx_web_links_search ON web_links USING GIN(search_vector);
CREATE INDEX idx_pdfs_search ON pdfs USING GIN(search_vector);

-- Create B-tree indexes for faster filtering
CREATE INDEX idx_faqs_created_at ON faqs(created_at DESC);
CREATE INDEX idx_web_links_created_at ON web_links(created_at DESC);
CREATE INDEX idx_pdfs_uploaded_at ON pdfs(uploaded_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_web_links_updated_at BEFORE UPDATE ON web_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
