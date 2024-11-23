const express = require('express');
const app = express();
const pasienRoutes = require('./routes/pasiendb.js');
const userRoutes = require('./routes/todo.js');
require('dotenv').config();
const port = process.env.PORT;
const db = require('./database/db');
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');

app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET, // Gunakan secret key yang aman
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

app.use('/', authRoutes);
app.use('/pasien', pasienRoutes);

app.set('view engine' , 'ejs');

app.use('/users', userRoutes);

app.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
        layout : 'layouts/main-layout'
    });
});

app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', {
        layout : 'layouts/main-layout'
    });
});

app.get('/pasien', (req, res) => {
    db.query('SELECT * FROM pasien', (err, patients) => {  
        if (err) return res.status(500).send('Internal Server Error');
        res.render('pasien', {
            layout: 'layouts/main-layout',
            patients: patients // Ganti ke "patients"
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});