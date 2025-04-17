CREATE TABLE gameusers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    marketing INT,
    rnd INT,
    training INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);