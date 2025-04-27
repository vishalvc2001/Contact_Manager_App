const mongoose = require("mongoose");

before(async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/testdb", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
