require('dotenv').config();

const app = require('./app');
const mySqlPool = require('./config/database');

const port = process.env.PORT || 5000;

// // Điều kiện mở kết nối server là kết nối thành công tới database trước
// mySqlPool.query("SELECT 1").then(() => {
//     // Kết nối tới database server thành công
//     console.log("MYSQL DB Connected.");
    
// });

// Mở server 
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
 });