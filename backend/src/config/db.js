const mongoose = require('mongoose');
function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log("Error connecting to database");
        console.error(err);
        process.exit(1);//when cant coneected to database it unnecessaryliy consumes the resources so we exit the process
    }) 
}

module.exports = connectDB;