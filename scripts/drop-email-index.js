const { mongoose } = require('mongoose');

// MongoDB connection string - update this if needed
const MONGODB_URI = process.env.MONGODB_LOCAL_URI || "mongodb://localhost:27017/mafhhlegal";

async function dropEmailIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('appiontments');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Find and drop the email_1 unique index
    const emailIndex = indexes.find(idx => idx.key && idx.key.email === 1);
    
    if (emailIndex) {
      console.log(`Found index: ${emailIndex.name}`);
      if (emailIndex.unique) {
        console.log('Dropping unique index on email...');
        await collection.dropIndex(emailIndex.name);
        console.log('Index dropped successfully!');
      } else {
        console.log('Index is not unique, no need to drop');
      }
    } else {
      console.log('No unique index on email field found');
    }

    // Verify indexes after
    const newIndexes = await collection.indexes();
    console.log('Indexes after:', newIndexes);

    console.log('\nDone! You can now create multiple appointments with the same email.');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

dropEmailIndex();
