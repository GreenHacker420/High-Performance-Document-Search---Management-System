import { PdfModel } from '../models/pdf.model.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import fs from 'fs';
import path from 'path';

export const PdfController = {
  // GET /api/pdfs
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await PdfModel.getAll(page, limit);
      res.json(result);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      res.status(500).json({ error: 'Failed to fetch PDFs' });
    }
  },

  // GET /api/pdfs/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const pdf = await PdfModel.getById(id);
      
      if (!pdf) {
        return res.status(404).json({ error: 'PDF not found' });
      }
      
      res.json(pdf);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      res.status(500).json({ error: 'Failed to fetch PDF' });
    }
  },

  // POST /api/pdfs (with file upload)
  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const { filename, path: filePath, size } = req.file;
      
      // Extract text from PDF
      let contentText = '';
      try {
        contentText = await extractTextFromPDF(filePath);
      } catch (extractError) {
        console.error('PDF text extraction failed:', extractError);
        // Continue without text content
      }
      
      const pdf = await PdfModel.create({
        file_name: filename,
        file_path: filePath,
        content_text: contentText,
        file_size: size,
      });
      
      res.status(201).json(pdf);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      
      // Clean up uploaded file on error
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ error: 'Failed to upload PDF' });
    }
  },

  // DELETE /api/pdfs/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const pdf = await PdfModel.delete(id);
      
      if (!pdf) {
        return res.status(404).json({ error: 'PDF not found' });
      }
      
      // Delete the physical file
      if (pdf.file_path && fs.existsSync(pdf.file_path)) {
        fs.unlinkSync(pdf.file_path);
      }
      
      res.json({ message: 'PDF deleted successfully', id: pdf.id });
    } catch (error) {
      console.error('Error deleting PDF:', error);
      res.status(500).json({ error: 'Failed to delete PDF' });
    }
  },

  // GET /api/pdfs/:id/download
  async download(req, res) {
    try {
      const { id } = req.params;
      const pdf = await PdfModel.getById(id);
      
      if (!pdf) {
        return res.status(404).json({ error: 'PDF not found' });
      }
      
      if (!fs.existsSync(pdf.file_path)) {
        return res.status(404).json({ error: 'PDF file not found on server' });
      }
      
      res.download(pdf.file_path, pdf.file_name);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      res.status(500).json({ error: 'Failed to download PDF' });
    }
  },
};
