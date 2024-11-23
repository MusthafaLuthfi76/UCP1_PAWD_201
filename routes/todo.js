const express = require('express');
const router = express.Router();

let users = [
    { id: 1, nama: "John Doe", username: "johndoe", password: "12345" },
    { id: 2, nama: "Jane Smith", username: "janesmith", password: "abcde" },
    { id: 3, nama: "Michael Johnson", username: "mikej", password: "password" },
    { id: 4, nama: "Tesucp", username: "username", password: "password" },
];

// Endpoint untuk mendapatkan data users
router.get('/', (req, res) => {
    res.json(users);
});

// Endpoint untuk menampilkan tabel users
router.get('/table', (req, res) => {
    res.render('users', { users }); // Kirim data users ke template 'users.ejs'
});

// Endpoint untuk menambahkan user baru
router.post('/', (req, res) => {
    const newUser = {
        id: users.length + 1,
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password,
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Endpoint untuk menghapus user berdasarkan ID
router.delete('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).json({ message: 'User tidak ditemukan' });

    const deletedUser = users.splice(userIndex, 1)[0];
    res.status(200).json({ message: `User '${deletedUser.nama}' telah dihapus` });
});

// Endpoint untuk memperbarui data user berdasarkan ID
router.put('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    user.nama = req.body.nama || user.nama;
    user.username = req.body.username || user.username;
    user.password = req.body.password || user.password;

    res.status(200).json({
        message: `User dengan ID ${user.id} telah diperbarui`,
        updatedUser: user,
    });
});

module.exports = router;
