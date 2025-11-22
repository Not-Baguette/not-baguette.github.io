/**
 * Blog utilities for fetching blog posts from Google Sheets
 */

export interface BlogPost {
  timestamp: string;
  email: string;
  image: string;
  content: string;
  tags: string[];
  id: string;
}

/**
 * Converts Google Drive file ID to direct image URL
 */
const convertGoogleDriveUrl = (driveUrl: string): string => {
  if (!driveUrl || !driveUrl.includes('drive.google.com')) {
    return driveUrl;
  }
  
  // Handle different Google Drive URL formats
  let fileId = '';
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = driveUrl.match(/[?&]id=([^&]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/uc?export=view&id=FILE_ID (already converted)
  const ucMatch = driveUrl.match(/uc\?export=view&id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    // Use the direct image proxy URL that works for publicly shared images
    return `https://lh3.googleusercontent.com/d/${fileId}=w400`;
  }
  
  return driveUrl;
};

/**
 * Sanitizes text content to prevent XSS
 */
export const sanitizeText = (text: string): string => {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Formats timestamp to readable date
 */
export const formatBlogDate = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Failed to format date:', error);
    return timestamp;
  }
};

/**
 * Proper CSV parser that handles quoted multi-line content
 */
const parseCSV = (csvText: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  let i = 0;

  while (i < csvText.length) {
    const char = csvText[i];

    if (char === '"') {
      if (insideQuotes && csvText[i + 1] === '"') {
        // Handle escaped quotes ("" inside quoted field)
        currentField += '"';
        i += 2;
        continue;
      }
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      // End of row
      if (currentField.trim() || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      }
    } else {
      currentField += char;
    }
    i++;
  }

  // Handle last field/row
  if (currentField.trim() || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
};

/**
 * Fetches blog posts from Google Sheets
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // Google Sheets CSV export URL
    const sheetId = '1dS04-EE3GRof2LGvXWQ3MsnnJ5PSXSjR3_Ci_d49u2Q';
    const gid = '1565577532';
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    
    const response = await fetch(csvUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    // Skip header row
    const dataRows = rows.slice(1);
    
    const posts: BlogPost[] = dataRows.map((row, index) => {
      if (row.length < 5) {
        console.warn('Invalid blog post format - insufficient columns:', row);
        return null;
      }

      const [timestamp, email, image, content, tagsString] = row;

      // Parse tags
      const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];

      return {
        id: `post-${index}-${Date.now()}`,
        timestamp: timestamp.trim(),
        email: email.trim(),
        image: image ? convertGoogleDriveUrl(image.trim()) : '',
        content: content.trim(),
        tags
      };
    }).filter(post => post !== null) as BlogPost[];

    // Sort by timestamp (most recent first)
    return posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

/**
 * Gets author name from email (first part before @)
 */
export const getAuthorName = (email: string): string => {
  return email.split('@')[0];
};

/**
 * Truncates content for preview
 */
export const truncateContent = (content: string, maxLength: number = 150): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};