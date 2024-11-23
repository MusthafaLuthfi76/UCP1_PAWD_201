const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua tugas
router.get('/', (req, res) => {
    db.query('SELECT * FROM pasien', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

// Endpoint untuk mendapatkan tugas berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM pasien WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Tugas tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan tugas baru
router.post('/', (req, res) => {
    const { nama, alamat, nohp } = req.body;
    if (!nama || !alamat || !nohp) {
        return res.status(400).send('Nama, alamat, dan nohp harus diisi');
    }

    db.query('INSERT INTO pasien (nama, alamat, nohp) VALUES (?, ?, ?)', [nama.trim(), alamat.trim(), nohp.trim()], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        const newPasien = { id: results.insertId, nama: nama.trim(), alamat: alamat.trim(), nohp: nohp.trim() };
        res.status(201).json(newPasien);
    });
});

// Endpoint untuk memperbarui tugas
router.put('/:id', (req, res) => {
    const { nama, alamat, nohp } = req.body;

    if (!nama || !alamat || !nohp) {
        return res.status(400).send('Nama, alamat, dan nohp harus diisi');
    }

    db.query('UPDATE pasien SET nama = ?, alamat = ?, nohp = ? WHERE id = ?', [nama.trim(), alamat.trim(), nohp.trim(), req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Pasien tidak ditemukan');
        res.json({ id: req.params.id, nama, alamat, nohp });
    });
});

// Endpoint untuk menghapus tugas
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM pasien WHERE id = ?', [req.params.id], (err, results) => { // Ganti todos dengan pasien
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Pasien tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;