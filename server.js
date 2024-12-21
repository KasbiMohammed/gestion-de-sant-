const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuration MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'health_management'
});

// Connexion MySQL
db.connect(err => {
    if (err) {
        console.error('Erreur de connexion MySQL:', err);
        return;
    }
    console.log('Connecté à MySQL');
});

// Route d'authentification
app.post('/api/auth', (req, res) => {
    const { email, password } = req.body;
    console.log('Tentative de connexion:', { email, password });

    const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
    
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const user = results[0];
        const token = jwt.sign(
            { id: user.id, role: user.role },
            'votre_clé_secrète',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    });
});

// Middleware d'authentification
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token requis' });

    jwt.verify(token, 'votre_clé_secrète', (err, user) => {
        if (err) return res.status(403).json({ message: 'Token invalide' });
        req.user = user;
        next();
    });
}

// Routes protégées
app.use(authenticateToken);

// Utilisateurs
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM user';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json(results);
    });
});

// Médecins
app.get('/api/doctors', (req, res) => {
    const query = `
        SELECT d.*, u.email 
        FROM doctor d
        JOIN user u ON d.id = u.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json(results);
    });
});

// Patients
app.get('/api/patients', (req, res) => {
    const query = `
        SELECT p.*, u.email 
        FROM patient p
        JOIN user u ON p.id = u.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json(results);
    });
});

// Médicaments
app.get('/api/medicaments', (req, res) => {
    const query = 'SELECT * FROM medicament';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json(results);
    });
});

// Rendez-vous
app.get('/api/appointments', (req, res) => {
    const query = `
        SELECT a.*, 
               p.firstName as patientFirstName, 
               p.lastName as patientLastName,
               d.firstName as doctorFirstName, 
               d.lastName as doctorLastName
        FROM appointment a
        JOIN patient p ON a.patient_id = p.id
        JOIN doctor d ON a.doctor_id = d.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json(results);
    });
});

// Mes rendez-vous (pour patients et médecins)
app.get('/api/my-appointments', (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    
    let query;
    if (role === 'patient') {
        query = `
            SELECT a.*, 
                   d.firstName as doctorFirstName, 
                   d.lastName as doctorLastName
            FROM appointment a
            JOIN doctor d ON a.doctor_id = d.id
            WHERE a.patient_id = ?
        `;
    } else if (role === 'doctor') {
        query = `
            SELECT a.*, 
                   p.firstName as patientFirstName, 
                   p.lastName as patientLastName
            FROM appointment a
            JOIN patient p ON a.patient_id = p.id
            WHERE a.doctor_id = ?
        `;
    } else {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json(results);
    });
});

// Mes patients (pour médecins)
app.get('/api/my-patients', (req, res) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const query = `
        SELECT DISTINCT p.*, u.email
        FROM patient p
        JOIN user u ON p.id = u.id
        JOIN appointment a ON p.id = a.patient_id
        WHERE a.doctor_id = ?
    `;

    db.query(query, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json(results);
    });
});

// Mes médicaments (pour patients)
app.get('/api/my-medicaments', (req, res) => {
    if (req.user.role !== 'patient') {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const query = `
        SELECT m.*
        FROM medicament m
        JOIN patient_medication pm ON m.id = pm.medication_id
        WHERE pm.patient_id = ?
    `;

    db.query(query, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json(results);
    });
});

// Routes pour la gestion des utilisateurs (CRUD)
app.get('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const query = `
        SELECT id, email, role FROM user
    `;
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json(results);
    });
});

app.get('/api/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const query = 'SELECT id, email, role FROM user WHERE id = ?';
    
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (results.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(results[0]);
    });
});

app.post('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Données manquantes' });
    }

    const query = 'INSERT INTO user (email, password, role) VALUES (?, ?, ?)';
    
    db.query(query, [email, password, role], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        res.status(201).json({ id: result.insertId, email, role });
    });
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { email, password, role } = req.body;
    const userId = req.params.id;

    if (!email || !role) {
        return res.status(400).json({ message: 'Données manquantes' });
    }

    let query, params;
    if (password) {
        query = 'UPDATE user SET email = ?, password = ?, role = ? WHERE id = ?';
        params = [email, password, role, userId];
    } else {
        query = 'UPDATE user SET email = ?, role = ? WHERE id = ?';
        params = [email, role, userId];
    }

    db.query(query, params, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ id: userId, email, role });
    });
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const query = 'DELETE FROM user WHERE id = ?';
    
    db.query(query, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur supprimé avec succès' });
    });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
