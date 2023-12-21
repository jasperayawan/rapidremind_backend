const mongoose = require('mongoose');

const conn = async () => {
    try{
       await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

    }catch(error){
        console.log('Error connecting to MongoDB:', error)
    }
}

module.exports = conn;