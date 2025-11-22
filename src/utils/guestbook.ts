// Guestbook utility reading from Google Sheets

// Google Sheets CSV export URL
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1dS04-EE3GRof2LGvXWQ3MsnnJ5PSXSjR3_Ci_d49u2Q/export?format=csv&id=1dS04-EE3GRof2LGvXWQ3MsnnJ5PSXSjR3_Ci_d49u2Q&gid=1552359528';

export interface GuestbookEntry {
  timestamp: string;
  email: string;
  comment: string;
}

// Google Form URL for new submissions
export const GOOGLE_FORM_URL = 'https://forms.gle/nPSg36mZ9EMkEDcv9';

/**
 * Fetch guestbook entries from Google Sheets
 */
export const fetchGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  try {
    console.log('Fetching guestbook entries from Google Sheets...');
    
    // Try direct access first
    let response = await fetch(SHEETS_CSV_URL);
    
    // If direct access fails due to CORS, try with CORS proxy
    if (!response.ok) {
      console.log('Direct access failed, trying with CORS proxy...');
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(SHEETS_CSV_URL)}`;
      response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return parseCSV(data.contents);
    } else {
      const csvText = await response.text();
      return parseCSV(csvText);
    }
    
  } catch (error) {
    console.error('Error fetching guestbook entries:', error);
    console.log('Make sure your Google Sheet is publicly accessible (Anyone with the link can view)');
    // Return empty array on error
    return [];
  }
};

/**
 * Parse CSV text into guestbook entries
 */
const parseCSV = (csvText: string): GuestbookEntry[] => {
  const lines = csvText.split('\n');
  
  // Skip header row and parse CSV
  const entries: GuestbookEntry[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing (handles basic cases)
    const columns = line.split(',').map(col => col.replace(/^"|"$/g, '').trim());
    
    if (columns.length >= 3) {
      entries.push({
        timestamp: columns[0] || '',
        email: columns[1] || '',
        comment: columns[2] || ''
      });
    }
  }
  
  // Return newest entries first
  return entries.reverse();
};



/**
 * Sanitize text to prevent XSS and remove dangerous content
 */
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script content
    .replace(/javascript:/gi, '')
    // Remove dangerous characters
    .replace(/[<>"'&]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match] || match;
    })
    // Limit length to prevent overflow
    .substring(0, 200)
    .trim();
};

/**
 * Format timestamp for display (without year)
 */
export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return timestamp;
  }
};