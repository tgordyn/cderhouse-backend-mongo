import mongoose from 'mongoose';

const uri = "mongodb+srv://dbUser:passwordUser@codercluster.lwivk.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

export default db;
