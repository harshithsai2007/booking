const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://harshithsai597_db_user:ashritha2205@cluster0.dqxobbb.mongodb.net/luxstay?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const hotelsCount = await mongoose.connection.db.collection('hotels').countDocuments();
        console.log('Hotels count:', hotelsCount);

        const roomsCount = await mongoose.connection.db.collection('rooms').countDocuments();
        console.log('Rooms count:', roomsCount);

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

check();
