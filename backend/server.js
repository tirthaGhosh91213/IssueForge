const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());


/* MongoDB connect */
mongoose.connect('mongodb+srv://tirtha:tirtha2004@cluster1.6jhriyo.mongodb.net/Issueforge')
.then(()=> console.log('MongoDB Connected'))
.catch(err => console.log(err));


const adminCreateRoutes = require('./routes/admin');
app.use('/api/admin', adminCreateRoutes);

const adminRoutes = require('./routes/adminAuth');
const userRoutes = require('./routes/userAuth');
const adminUserRoutes = require('./routes/adminUser');

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminUserRoutes);



app.listen(5000, ()=>{
  console.log('🚀 Server running at http://localhost:5000');
});
