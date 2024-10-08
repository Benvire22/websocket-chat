import mongoose from 'mongoose';
import config from './config';

const run = async () => {
  await mongoose.connect(config.database);
  const db = mongoose.connection;

  try {
    await db.dropDatabase();
    console.log('Database dropped successfully');
  } catch (e) {
    console.log('Error dropping database:', e);
  }

  await db.close();
  await mongoose.disconnect();
};

run().catch(console.error);