#!/usr/bin/env node
// src/scripts/migrate.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import parseDatabase from '../utils/sqlDumpParser.js';
import runMigration from '../utils/advancedMigration.js';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

// Get current file directory for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Clean and validate data before migration
 * @param {Object} data - Parsed data from SQL
 * @returns {Object} - Cleaned data
 */
function cleanData(data) {
  console.log(chalk.blue('Cleaning and validating data...'));
  
  // Deep clone to avoid modifying original
  const cleanedData = JSON.parse(JSON.stringify(data));
  
  // Remove any invalid or problematic records
  Object.keys(cleanedData).forEach(table => {
    if (!Array.isArray(cleanedData[table])) {
      console.warn(chalk.yellow(`Table ${table} does not contain an array of records. Initializing as empty array.`));
      cleanedData[table] = [];
      return;
    }
    
    // Initial length
    const initialLength = cleanedData[table].length;
    
    // Filter out records without ID (except for special cases)
    cleanedData[table] = cleanedData[table].filter(record => {
      if (!record) return false;
      if (table === 'plan_features' || table === 'franchise_locations' || 
          table === 'investor_sub_industries' || table === 'investor_location_preference') {
        // These are junction tables where we mainly care about the relation IDs
        return record.id !== undefined && record.id !== null;
      }
      return record.id !== undefined && record.id !== null;
    });
    
    if (initialLength !== cleanedData[table].length) {
      console.log(chalk.yellow(`Removed ${initialLength - cleanedData[table].length} invalid records from ${table}`));
    }
  });
  
  // Add necessary defaults
  if (cleanedData.users) {
    cleanedData.users.forEach(user => {
      if (!user.joining_date) user.joining_date = new Date().toISOString();
      if (!user.email) user.email = `user_${user.id}@placeholder.com`;
    });
  }
  
  // Ensure all businesses have company_name or headline
  if (cleanedData.businesses) {
    cleanedData.businesses.forEach(business => {
      if (!business.company_name && !business.headline) {
        business.company_name = `Business ${business.id}`;
      }
    });
  }
  
  // Ensure all franchises have brand_name
  if (cleanedData.franchise) {
    cleanedData.franchise.forEach(franchise => {
      if (!franchise.brand_name) {
        franchise.brand_name = `Franchise ${franchise.id}`;
      }
    });
  }
  
  // Ensure all investors have full_name
  if (cleanedData.investors) {
    cleanedData.investors.forEach(investor => {
      if (!investor.full_name) {
        investor.full_name = `Investor ${investor.id}`;
      }
    });
  }
  
  console.log(chalk.green('Data cleaning completed!'));
  return cleanedData;
}

/**
 * Analyze data for migration preparation
 * @param {Object} data - Parsed and cleaned data
 * @returns {Object} - Analysis results
 */
function analyzeData(data) {
  console.log(chalk.blue('Analyzing data for migration...'));
  
  const analysis = {
    recordCounts: {},
    relationships: [],
    warnings: [],
    validationIssues: []
  };
  
  // Count records per table
  Object.keys(data).forEach(table => {
    analysis.recordCounts[table] = Array.isArray(data[table]) ? data[table].length : 0;
  });
  
  console.log(chalk.cyan('Record counts by table:'));
  Object.entries(analysis.recordCounts)
    .filter(([_, count]) => count > 0)
    .sort(([_, countA], [__, countB]) => countB - countA)
    .forEach(([table, count]) => {
      console.log(`  ${chalk.bold(table)}: ${count} records`);
    });
  
  // Check for missing relationships
  if (data.businesses && data.businesses.length > 0) {
    const businessesWithoutUser = data.businesses.filter(b => !b.user_id).length;
    if (businessesWithoutUser > 0) {
      analysis.warnings.push(`${businessesWithoutUser} businesses have no user_id`);
    }
  }
  
  if (data.franchise && data.franchise.length > 0) {
    const franchisesWithoutUser = data.franchise.filter(f => !f.user_id).length;
    if (franchisesWithoutUser > 0) {
      analysis.warnings.push(`${franchisesWithoutUser} franchises have no user_id`);
    }
  }
  
  if (data.investors && data.investors.length > 0) {
    const investorsWithoutUser = data.investors.filter(i => !i.user_id).length;
    if (investorsWithoutUser > 0) {
      analysis.warnings.push(`${investorsWithoutUser} investors have no user_id`);
    }
  }
  
  // Sample data from each significant table
  ['users', 'businesses', 'franchise', 'investors'].forEach(table => {
    if (data[table] && data[table].length > 0) {
      console.log(chalk.cyan(`Sample record from ${table}:`));
      console.log(JSON.stringify(data[table][0], null, 2)
        .split('\n')
        .slice(0, 10)
        .join('\n') + (Object.keys(data[table][0]).length > 10 ? '\n  ...' : ''));
    }
  });
  
  // Log any warnings
  if (analysis.warnings.length > 0) {
    console.log(chalk.yellow('Warnings:'));
    analysis.warnings.forEach(warning => {
      console.log(`  - ${warning}`);
    });
  }
  
  console.log(chalk.green('Data analysis completed!'));
  return analysis;
}

/**
 * Save processed data to a file
 * @param {Object} data - Data to save
 * @param {string} outputPath - Path to save file
 */
function saveProcessedData(data, outputPath) {
  try {
    const dir = path.dirname(outputPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(chalk.green(`Data saved to: ${outputPath}`));
  } catch (error) {
    console.error(chalk.red(`Error saving data: ${error.message}`));
  }
}

/**
 * Execute the migration process
 * @param {Object} options - Migration options
 */
async function executeMigration(options) {
  try {
    console.log(chalk.blue.bold('======================================='));
    console.log(chalk.blue.bold('   SQL to Firestore Migration Tool'));
    console.log(chalk.blue.bold('======================================='));
    console.log('');
    
    const {
      inputFile,
      outputDir = path.join(__dirname, '../migration/data'),
      steps = true,
      skipUsers = false,
      skipCategories = false,
      skipLocations = false,
      skipPlans = false,
      skipUserPlans = false,
      skipBusinesses = false,
      skipFranchises = false,
      skipInvestors = false,
      skipChats = false,
      dryRun = false
    } = options;
    
    // Create unique session ID for this migration run
    const sessionId = uuidv4().substring(0, 8);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Define output files
    const parsedDataFile = path.join(outputDir, `parsed_data_${sessionId}.json`);
    const cleanedDataFile = path.join(outputDir, `cleaned_data_${sessionId}.json`);
    
    // Step 1: Parse the input file
    console.log(chalk.blue.bold('\nSTEP 1: Parsing input file'));
    console.log(`Input file: ${chalk.cyan(inputFile)}`);
    
    // Determine if SQL or JSON based on extension
    const fileExt = path.extname(inputFile).toLowerCase();
    console.log(`Detected file type: ${chalk.cyan(fileExt)}`);
    
    const parsedData = parseDatabase(inputFile, parsedDataFile);
    
    console.log(chalk.green('✓ Parsing completed'));
    console.log(`Parsed data saved to: ${chalk.cyan(parsedDataFile)}`);
    
    // Step 2: Clean and validate the data
    console.log(chalk.blue.bold('\nSTEP 2: Cleaning and validating data'));
    const cleanedData = cleanData(parsedData);
    saveProcessedData(cleanedData, cleanedDataFile);
    
    // Step 3: Analyze the data
    console.log(chalk.blue.bold('\nSTEP 3: Analyzing data for migration'));
    const analysis = analyzeData(cleanedData);
    
    // Step 4: Migrate to Firestore (or dry run)
    console.log(chalk.blue.bold('\nSTEP 4: Migrating to Firestore'));
    
    if (dryRun) {
      console.log(chalk.yellow('DRY RUN MODE: No data will be written to Firestore'));
      console.log(chalk.green('✓ Dry run completed successfully'));
    } else {
      const migrationOptions = {
        skipUsers,
        skipCategories,
        skipLocations,
        skipPlans,
        skipUserPlans,
        skipBusinesses,
        skipFranchises,
        skipInvestors,
        skipChats
      };
      
      // Log migration options
      console.log(chalk.cyan('Migration options:'));
      Object.entries(migrationOptions).forEach(([option, value]) => {
        if (value) {
          console.log(`  ${option}: ${chalk.yellow('SKIPPED')}`);
        }
      });
      
      // Execute migration
      await runMigration(cleanedData, migrationOptions);
      
      console.log(chalk.green.bold('\n✓ Migration completed successfully!'));
    }
    
    console.log(chalk.blue.bold('\nMigration Summary:'));
    console.log(`Session ID: ${chalk.cyan(sessionId)}`);
    console.log(`Total tables: ${chalk.cyan(Object.keys(analysis.recordCounts).length)}`);
    console.log(`Total records: ${chalk.cyan(Object.values(analysis.recordCounts).reduce((a, b) => a + b, 0))}`);
    console.log(`Parsed data: ${chalk.cyan(parsedDataFile)}`);
    console.log(`Cleaned data: ${chalk.cyan(cleanedDataFile)}`);
    
    console.log(chalk.blue.bold('\nThank you for using the SQL to Firestore Migration Tool!'));
    
  } catch (error) {
    console.error(chalk.red.bold('\nMigration failed:'));
    console.error(chalk.red(error.stack || error.message));
    process.exit(1);
  }
}

// Parse command line arguments when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error(chalk.red('Error: Input file is required'));
    console.log(`
${chalk.bold('Usage:')} node migrate.js <input_file> [options]

${chalk.bold('Options:')}
  --output-dir=<path>     Directory to save processed data files
  --no-steps              Run migration without steps
  --skip-users            Skip migrating users
  --skip-categories       Skip migrating categories
  --skip-locations        Skip migrating locations
  --skip-plans            Skip migrating plans
  --skip-user-plans       Skip migrating user plans
  --skip-businesses       Skip migrating businesses
  --skip-franchises       Skip migrating franchises
  --skip-investors        Skip migrating investors
  --skip-chats            Skip migrating chats
  --dry-run               Process data without migrating to Firestore

${chalk.bold('Example:')}
  node migrate.js data/sql_dump.sql --output-dir=./processed-data --dry-run
`);
    process.exit(1);
  }
  
  const inputFile = args[0];
  
  // Parse options
  const options = {
    inputFile,
    outputDir: args.find(arg => arg.startsWith('--output-dir='))?.split('=')[1],
    steps: !args.includes('--no-steps'),
    skipUsers: args.includes('--skip-users'),
    skipCategories: args.includes('--skip-categories'),
    skipLocations: args.includes('--skip-locations'),
    skipPlans: args.includes('--skip-plans'),
    skipUserPlans: args.includes('--skip-user-plans'),
    skipBusinesses: args.includes('--skip-businesses'),
    skipFranchises: args.includes('--skip-franchises'),
    skipInvestors: args.includes('--skip-investors'),
    skipChats: args.includes('--skip-chats'),
    dryRun: args.includes('--dry-run')
  };
  
  executeMigration(options);
}

export default executeMigration;