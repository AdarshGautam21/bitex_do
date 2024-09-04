const mongoose = require('mongoose');
const db = require('../config/key').mongoURI;
const { isEmpty } = require('lodash');
const {insert} = require('./permission');
const args = process.argv.slice(2);
if(isEmpty(args)) {
    console.log("seeder name missing.!!!");
    return;
}
const checkAvailableSeeder = {
    permission: insert,
}
connectDatabase = async () => {
    try {
        await mongoose.connect(db, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });

        const runSeederStatus = await Promise.all(
            args.map( async arg => {
                return (await checkAvailableSeeder[(arg.trim())]()) ? arg : "";
            })
        );
        console.log(`Run seeder: ${runSeederStatus.toString()}`);
        process.exit();
    } catch(error) {
        console.log("error:", error);
        process.exit();
    }
}
connectDatabase();
