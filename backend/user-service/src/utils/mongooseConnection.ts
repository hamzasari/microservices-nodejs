import mongoose from 'mongoose';

const connectToMongoose = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString);
    console.info('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error);
    process.exit(1);
  }
};

export default connectToMongoose;
