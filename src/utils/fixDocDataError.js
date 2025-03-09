// Fix for the doc.data is not a function error
// File: src/utils/fixDocDataError.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the advanced migration file
const migrationFilePath = path.join(__dirname, 'advancedMigration.js');

try {
  console.log(`Fixing document data access in: ${migrationFilePath}`);
  
  // Read the file
  let fileContent = fs.readFileSync(migrationFilePath, 'utf8');
  
  // Find all instances of direct doc.data accessing and fix them
  // This finds patterns like: planDoc.data().planType
  const docDataPattern = /(\w+Doc)\.data\(\)(\.\w+)?/g;
  
  fileContent = fileContent.replace(docDataPattern, (match, docVar, property) => {
    // Replace with proper existence check and data access
    const propAccess = property || '';
    return `${docVar}.exists() ? ${docVar}.data()${propAccess} : null`;
  });
  
  // Fix specific issues in the migrateBusinesses function around line 1207
  const businessesPattern = /if \(planDoc\.exists\(\)\) \{\s*planType = planDoc\.data\.planType;/g;
  
  if (fileContent.includes(businessesPattern)) {
    fileContent = fileContent.replace(businessesPattern, 
      `if (planDoc.exists()) {\n        planType = planDoc.data().planType;`);
  }
  
  // Fix all similar patterns across the codebase
  const badDataAccessPattern = /(\w+Doc)\.data\./g;
  fileContent = fileContent.replace(badDataAccessPattern, "$1.data().");
  
  // Write the fixed content back to the file
  fs.writeFileSync(migrationFilePath, fileContent);
  
  console.log('✅ Successfully fixed document data access issues!');
  console.log('\nChecking for any other potential issues...');
  
  // Additional fixes for other potential issues
  let additionalFixes = 0;
  
  // Look for plan references
  const planRefPattern = /const planRef = doc\(db, 'plans', (.*?)\);/g;
  const planGetPattern = /await getDoc\(planRef\);/g;
  
  // Fix plan data access
  if (fileContent.includes("planType = planDoc.exists()")) {
    fileContent = fileContent.replace(
      /planType = planDoc\.exists\(\) \? planDoc\.data\(\)\.planType : null;/g,
      `if (planDoc.exists()) {
        planType = planDoc.data().planType;
      }`
    );
    additionalFixes++;
  }
  
  // Fix planDoc checking
  if (fileContent.includes("planDoc?.exists()")) {
    fileContent = fileContent.replace(
      /planDoc\?\.exists\(\)/g,
      "planDoc && planDoc.exists()"
    );
    additionalFixes++;
  }
  
  // Check for user listings updates
  if (fileContent.includes("listings: arrayUnion(docId)")) {
    // Make sure the update doesn't try to access non-existent user
    const userUpdatePattern = /if \(ownerId\) \{\s*const userRef = doc\(db, 'users', ownerId\);\s*batch\.update\(userRef, \{\s*listings: arrayUnion\(docId\)\s*\}\);/g;
    
    fileContent = fileContent.replace(userUpdatePattern, 
      `if (ownerId) {
      const userRef = doc(db, 'users', ownerId);
      // Check if user exists before updating
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          batch.update(userRef, {
            listings: arrayUnion(docId)
          });
        } else {
          console.warn(\`User \${ownerId} not found for listing \${docId}\`);
        }
      } catch (error) {
        console.error(\`Error updating user \${ownerId} for listing \${docId}:\`, error);
      }`);
    additionalFixes++;
  }
  
  if (additionalFixes > 0) {
    console.log(`Applied ${additionalFixes} additional fixes to the file.`);
    // Write the fixed content back to the file
    fs.writeFileSync(migrationFilePath, fileContent);
  }
  
  console.log('\nYou can now run the migration again with:');
  console.log('node src/scripts/migrate.js "F:/CascadeProjects/vite-react-tailwind/src/migration/data/sql_dump.sql"');
  
} catch (error) {
  console.error('❌ Error fixing document data access issues:', error);
}