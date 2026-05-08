CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    email TEXT,
    password TEXT,
    role TEXT,
    aktif INTEGER,
    nama TEXT,
    no_hp TEXT,
    tanggal_bergabung TEXT
);

CREATE TABLE pesanan (
    id_pesanan INTEGER PRIMARY KEY,
    no_antrian INTEGER,
    nama TEXT,
    items TEXT,
    total_harga INTEGER,
    status TEXT,
    status_bayar NUMERIC,
    no_hp TEXT
);

CREATE TABLE barang (
    id_barang INTEGER PRIMARY KEY,
    nama TEXT,
    harga INTEGER,
    stok INTEGER
);

CREATE TABLE menu (
    id_makanan INTEGER PRIMARY KEY,
    nama_makanan TEXT,
    harga INTEGER
);