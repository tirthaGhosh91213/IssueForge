const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
require('dotenv').config();



/* MongoDB connect */
mongoose.connect('mongodb+srv://tirtha:tirtha2004@cluster1.6jhriyo.mongodb.net/Issueforge')
.then(()=> console.log('MongoDB Connected'))
.catch(err => console.log(err));


const adminCreateRoutes = require('./routes/admin');
const adminRoutes = require('./routes/adminAuth');
const userRoutes = require('./routes/userAuth');
const adminUserRoutes = require('./routes/adminUser');
const adminUsersListRoutes = require('./routes/adminUsersList');
const projectRoutes = require('./routes/projectRoutes');
const issueRoutes = require('./routes/issueRoutes');

app.use('/api/admin', adminCreateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes)
app.use('/api/admin', adminUserRoutes);
app.use('/api/admin', adminUsersListRoutes);
app.use('/api/admin', projectRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/issues', issueRoutes);
app.use('/uploads', express.static('uploads'));



app.listen(5000, ()=>{
  console.log('🚀 Server running at http://localhost:5000');
});
