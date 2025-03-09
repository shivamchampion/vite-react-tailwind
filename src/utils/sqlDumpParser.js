// src/utils/sqlDumpParser.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse SQL CREATE TABLE statements to understand table structure
 * @param {string} sqlContent - SQL content
 * @returns {Object} - Map of table names to their column definitions
 */
function parseTableStructures(sqlContent) {
  const tableStructures = {};
  
  // Regex to extract CREATE TABLE statements
  const createTableRegex = /CREATE\s+TABLE\s+`([^`]+)`\s*\(([\s\S]*?)(?:\)\s*ENGINE|;)/gim;
  let match;
  
  while ((match = createTableRegex.exec(sqlContent)) !== null) {
    const tableName = match[1];
    const columnsDefinition = match[2];
    
    // Extract column names and types
    const columnRegex = /`([^`]+)`\s+([^,\n(]+)(?:\([^)]*\))?/g;
    const columns = {};
    let colMatch;
    
    while ((colMatch = columnRegex.exec(columnsDefinition)) !== null) {
      const columnName = colMatch[1];
      const columnType = colMatch[2].trim();
      columns[columnName] = columnType;
    }
    
    tableStructures[tableName] = columns;
  }
  
  return tableStructures;
}

/**
 * Extract data from SQL INSERT statements
 * @param {string} sqlContent - SQL content
 * @param {Object} tableStructures - Table structures for type conversion
 * @returns {Object} - Extracted data by table
 */
function extractDataFromInserts(sqlContent, tableStructures) {
  const extractedData = {};
  
  // Regex to extract INSERT statements
  const insertRegex = /INSERT\s+INTO\s+`([^`]+)`\s+(?:\(([^)]+)\))?\s+VALUES\s+((?:\([^;]+\)[,;])+)/gim;
  let match;
  
  while ((match = insertRegex.exec(sqlContent)) !== null) {
    const tableName = match[1];
    let columns = [];
    
    // Parse columns if explicitly specified
    if (match[2]) {
      columns = match[2].split(',').map(col => col.trim().replace(/`/g, ''));
    } else if (tableStructures[tableName]) {
      // Use all columns from table structure if not specified
      columns = Object.keys(tableStructures[tableName]);
    }
    
    // Extract values
    const valuesBlock = match[3];
    const valuesRegex = /\(([^)]+)\)[,;]/g;
    let valuesMatch;
    const rows = [];
    
    while ((valuesMatch = valuesRegex.exec(valuesBlock)) !== null) {
      const values = parseValuesString(valuesMatch[1]);
      
      // Create object by mapping columns to values
      const rowObj = {};
      for (let i = 0; i < columns.length && i < values.length; i++) {
        rowObj[columns[i]] = values[i];
      }
      
      rows.push(rowObj);
    }
    
    if (!extractedData[tableName]) {
      extractedData[tableName] = [];
    }
    
    extractedData[tableName].push(...rows);
  }
  
  return extractedData;
}

/**
 * Parse a comma-separated list of SQL values, handling quotes and special values
 * @param {string} valuesString - String containing SQL values
 * @returns {Array} - Array of parsed values
 */
function parseValuesString(valuesString) {
  const result = [];
  let current = '';
  let inQuote = false;
  let escaping = false;
  
  for (let i = 0; i < valuesString.length; i++) {
    const char = valuesString[i];
    
    if (escaping) {
      current += char;
      escaping = false;
      continue;
    }
    
    if (char === '\\') {
      escaping = true;
      continue;
    }
    
    if (char === "'" && !inQuote) {
      inQuote = true;
      continue;
    }
    
    if (char === "'" && inQuote) {
      if (i + 1 < valuesString.length && valuesString[i + 1] === "'") {
        // Double single quote is an escape for single quote
        current += "'";
        i++; // Skip the next quote
      } else {
        inQuote = false;
      }
      continue;
    }
    
    if (char === ',' && !inQuote) {
      // Process the value before adding it
      result.push(processValue(current.trim()));
      current = '';
      continue;
    }
    
    current += char;
  }
  
  // Add the last value
  if (current.trim()) {
    result.push(processValue(current.trim()));
  }
  
  return result;
}

/**
 * Process an SQL value, converting it to appropriate type
 * @param {string} value - SQL value string
 * @returns {*} - Converted value
 */
function processValue(value) {
  // Handle NULL
  if (value.toUpperCase() === 'NULL') {
    return null;
  }
  
  // Handle numbers
  if (/^-?\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  
  if (/^-?\d+\.\d+$/.test(value)) {
    return parseFloat(value);
  }
  
  // Handle booleans
  if (value.toUpperCase() === 'TRUE') {
    return true;
  }
  
  if (value.toUpperCase() === 'FALSE') {
    return false;
  }
  
  // Default: return as string
  return value;
}

/**
 * Map extracted data to the structure expected by migration functions
 * @param {Object} data - Extracted data
 * @returns {Object} - Mapped data
 */
function mapDataToMigrationFormat(data) {
  const mappedData = {
    users: data.users || [],
    businesses: data.businesses || [],
    business_media: data.business_media || [],
    franchise: data.franchise || [],
    franchise_media: data.franchise_media || [],
    franchise_formats: data.franchise_formats || [],
    franchise_locations: data.franchise_locations || [],
    investors: data.investors || [],
    investor_sub_industries: data.investor_sub_industries || [],
    investor_location_preference: data.investor_location_preference || [],
    industries: data.industries || [],
    sub_industries: data.sub_industries || [],
    states: data.states || [],
    cities: data.cities || [],
    plans: data.plans || [],
    plan_features: data.plan_features || [],
    user_plans: data.user_plans || [],
    userchat: data.userchat || [],
    userchat_msg: data.userchat_msg || [],
    chat_files: data.chat_files || []
  };
  
  return mappedData;
}

/**
 * Parse a phpMyAdmin SQL dump file
 * @param {string} sqlFilePath - Path to SQL dump file
 * @param {string} outputPath - Path to write the extracted JSON data
 * @returns {Object} - Extracted data
 */
export function parseSqlDump(sqlFilePath, outputPath = null) {
  try {
    console.log(`Parsing SQL dump file: ${sqlFilePath}`);
    
    // Read the SQL file
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Parse table structures
    const tableStructures = parseTableStructures(sqlContent);
    console.log(`Found ${Object.keys(tableStructures).length} table definitions`);
    
    // Extract data from INSERT statements
    const extractedData = extractDataFromInserts(sqlContent, tableStructures);
    
    // Map to expected format
    const mappedData = mapDataToMigrationFormat(extractedData);
    
    // Calculate total records
    let totalRecords = 0;
    Object.values(mappedData).forEach(records => {
      totalRecords += records.length;
    });
    
    console.log(`Extracted ${totalRecords} total records`);
    
    // Output data details
    console.log('Table records:');
    Object.entries(mappedData).forEach(([table, records]) => {
      if (records.length > 0) {
        console.log(`  ${table}: ${records.length} records`);
      }
    });
    
    // Write to output file if specified
    if (outputPath) {
      fs.writeFileSync(outputPath, JSON.stringify(mappedData, null, 2));
      console.log(`Data written to: ${outputPath}`);
    }
    
    return mappedData;
  } catch (error) {
    console.error('Error parsing SQL dump:', error);
    throw error;
  }
}

/**
 * Parse a phpMyAdmin JSON export file
 * @param {string} jsonFilePath - Path to phpMyAdmin JSON export file
 * @param {string} outputPath - Path to write the extracted JSON data
 * @returns {Object} - Extracted data
 */
export function parsePhpMyAdminJson(jsonFilePath, outputPath = null) {
  try {
    console.log(`Parsing phpMyAdmin JSON file: ${jsonFilePath}`);
    
    // Read the JSON file
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(jsonContent);
    
    // Initialize output data structure
    const extractedData = {
      users: [],
      businesses: [],
      business_media: [],
      franchise: [],
      franchise_media: [],
      franchise_formats: [],
      franchise_locations: [],
      investors: [],
      investor_sub_industries: [],
      investor_location_preference: [],
      industries: [],
      sub_industries: [],
      states: [],
      cities: [],
      plans: [],
      plan_features: [],
      user_plans: [],
      userchat: [],
      userchat_msg: [],
      chat_files: []
    };
    
    // Process each item in the JSON export
    for (const key in jsonData) {
      const item = jsonData[key];
      
      // Skip header and database items
      if (item.type === 'header' || item.type === 'database') {
        continue;
      }
      
      // Process table data
      if (item.type === 'table' && item.name && item.data) {
        // Map table names to our expected structure
        let targetCollection = null;
        
        // Map table names directly or with transformations
        switch (item.name) {
          case 'users':
            targetCollection = 'users';
            break;
          case 'businesses':
          case 'business':
            targetCollection = 'businesses';
            break;
          case 'business_media':
            targetCollection = 'business_media';
            break;
          case 'franchise':
          case 'franchises':
            targetCollection = 'franchise';
            break;
          case 'franchise_media':
            targetCollection = 'franchise_media';
            break;
          case 'franchise_formats':
            targetCollection = 'franchise_formats';
            break;
          case 'franchise_locations':
            targetCollection = 'franchise_locations';
            break;
          case 'investors':
          case 'investor':
            targetCollection = 'investors';
            break;
          case 'investor_sub_industries':
            targetCollection = 'investor_sub_industries';
            break;
          case 'investor_location_preference':
            targetCollection = 'investor_location_preference';
            break;
          case 'industries':
          case 'industry':
            targetCollection = 'industries';
            break;
          case 'sub_industries':
          case 'sub_industry':
            targetCollection = 'sub_industries';
            break;
          case 'states':
            targetCollection = 'states';
            break;
          case 'cities':
            targetCollection = 'cities';
            break;
          case 'plans':
            targetCollection = 'plans';
            break;
          case 'plan_features':
            targetCollection = 'plan_features';
            break;
          case 'user_plans':
            targetCollection = 'user_plans';
            break;
          case 'userchat':
          case 'chat':
            targetCollection = 'userchat';
            break;
          case 'userchat_msg':
          case 'chat_messages':
            targetCollection = 'userchat_msg';
            break;
          case 'chat_files':
            targetCollection = 'chat_files';
            break;
          default:
            // Skip tables we don't need
            continue;
        }
        
        // Add data to our structure
        if (targetCollection && Array.isArray(item.data)) {
          extractedData[targetCollection] = item.data;
          console.log(`Added ${item.data.length} records to ${targetCollection} from ${item.name}`);
        }
      }
    }
    
    // Calculate total records
    let totalRecords = 0;
    Object.values(extractedData).forEach(records => {
      totalRecords += records.length;
    });
    
    console.log(`Processed ${totalRecords} total records`);
    
    // Output data details
    console.log('Table records:');
    Object.entries(extractedData).forEach(([table, records]) => {
      if (records.length > 0) {
        console.log(`  ${table}: ${records.length} records`);
      }
    });
    
    // Write to output file if specified
    if (outputPath) {
      fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2));
      console.log(`Data written to: ${outputPath}`);
    }
    
    return extractedData;
  } catch (error) {
    console.error('Error parsing phpMyAdmin JSON:', error);
    throw error;
  }
}

/**
 * Main export function that can handle either SQL or JSON input
 * @param {string} inputPath - Path to SQL or JSON file 
 * @param {string} outputPath - Path to output JSON file
 * @returns {Object} - Parsed data
 */
export function parseDatabase(inputPath, outputPath = null) {
  // Determine file type based on extension
  const extension = path.extname(inputPath).toLowerCase();
  
  if (extension === '.sql') {
    return parseSqlDump(inputPath, outputPath);
  } else if (extension === '.json') {
    return parsePhpMyAdminJson(inputPath, outputPath);
  } else {
    throw new Error(`Unsupported file type: ${extension}. Only .sql and .json are supported.`);
  }
}

// Run script directly if called as main
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node sqlDumpParser.js <input_file> [output_file]');
    process.exit(1);
  }
  
  const inputFile = args[0];
  const outputFile = args.length > 1 ? args[1] : path.join(__dirname, '../migration/data/parsed_data.json');
  
  parseDatabase(inputFile, outputFile);
}

export default parseDatabase;