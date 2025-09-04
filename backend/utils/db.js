import mongoose from "mongoose";

const statusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
};

const connectDB = async () => {
    try { 
        const dbConnection = await mongoose.connect(process.env.MONGODB_URI);
        console.log('MONGODB connection status:', statusMap[dbConnection.connection.readyState]);
    } catch (error) {
        console.log('Database connection error.', error)
    }
}

export default connectDB;