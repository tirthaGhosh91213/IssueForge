require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());  

const { auth, adminOnly } = require('./middleware/auth');


/* MongoDB connect */
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('MongoDB Connected'))
.catch(err => console.log(err));


const adminCreateRoutes = require('./routes/admin');
const adminRoutes = require('./routes/adminAuth');
const userRoutes = require('./routes/userAuth');
const adminUserRoutes = require('./routes/adminUser');
const adminUsersListRoutes = require('./routes/adminUsersList');
const projectRoutes = require('./routes/projectRoutes');
const issueRoutes = require('./routes/issueRoutes');
const publicRoutes = require('./routes/publicRoutes');

app.use('/api/public', publicRoutes);

/* ── UNAUTHENTICATED routes FIRST (login, signup) ── */
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

/* ── AUTHENTICATED routes AFTER ── */
app.use('/api/admin', auth, adminOnly, adminCreateRoutes);
app.use('/api/admin', auth, adminOnly, adminUserRoutes);
app.use('/api/admin', auth, adminOnly, adminUsersListRoutes);
app.use('/api/admin', auth, projectRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/issues', auth, issueRoutes);

app.listen(5000, ()=>{
  console.log('🚀 Server running at http://localhost:5000');
});
