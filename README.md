# Système de Gestion de Santé

Un système complet de gestion de santé permettant la gestion des patients, médecins, rendez-vous et médicaments.

## 🚀 Fonctionnalités

- ✅ Authentification multi-rôles (Admin, Médecin, Patient, Accompagnateur)
- 📊 Interface d'administration complète
- 👨‍⚕️ Gestion des médecins et leurs patients
- 🏥 Gestion des rendez-vous
- 💊 Suivi des médicaments
- 👥 Gestion des accompagnateurs

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- MySQL (v5.7 ou supérieur)
- Navigateur web moderne

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone [votre-repo]
cd [nom-du-dossier]
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**

Créez une base de données MySQL et exécutez les scripts SQL suivants :

```sql
-- Création de la base de données
CREATE DATABASE health_management;
USE health_management;

-- Table utilisateur
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'patient', 'accompanist') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table administrateur
CREATE TABLE administrator (
    id INT PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    FOREIGN KEY (id) REFERENCES user(id)
);

-- Table médecin
CREATE TABLE doctor (
    id INT PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    speciality VARCHAR(100),
    FOREIGN KEY (id) REFERENCES user(id)
);

-- Table patient
CREATE TABLE patient (
    id INT PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    dateOfBirth DATE,
    gender VARCHAR(10),
    phoneNumber VARCHAR(20),
    address TEXT,
    FOREIGN KEY (id) REFERENCES user(id)
);

-- Table accompagnateur
CREATE TABLE accompanist (
    id INT PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    phoneNumber VARCHAR(20),
    FOREIGN KEY (id) REFERENCES user(id)
);

-- Table médicament
CREATE TABLE medicament (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    frequency VARCHAR(100),
    dosage VARCHAR(100),
    details TEXT,
    displayInfo TEXT
);

-- Table rendez-vous
CREATE TABLE appointment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    doctor_id INT,
    date_time DATETIME,
    status VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);

-- Insertion des données de test
INSERT INTO user (email, password, role) VALUES
('admin@test.com', 'password123', 'admin'),
('doctor1@test.com', 'password123', 'doctor'),
('doctor2@test.com', 'password123', 'doctor'),
('patient1@test.com', 'password123', 'patient'),
('patient2@test.com', 'password123', 'patient'),
('accompanist1@test.com', 'password123', 'accompanist'),
('accompanist2@test.com', 'password123', 'accompanist');
```

4. **Configurer l'application**

Dans le fichier `server.js`, modifiez les paramètres de connexion à la base de données :

```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Votre mot de passe MySQL
    database: 'health_management'
});
```

## 🚀 Démarrage

1. **Démarrer le serveur**
```bash
node server.js
```

2. **Accéder à l'application**
Ouvrez `index.html` dans votre navigateur

## 👥 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@test.com | password123 |
| Médecin | doctor1@test.com | password123 |
| Patient | patient1@test.com | password123 |
| Accompagnateur | accompanist1@test.com | password123 |

## 🖥️ Interfaces

### Interface Administrateur
- Gestion complète des utilisateurs (CRUD)
- Vue d'ensemble des médecins, patients et rendez-vous
- Gestion des médicaments

### Interface Médecin
- Liste de ses patients
- Gestion des rendez-vous
- Suivi des prescriptions

### Interface Patient
- Voir ses rendez-vous
- Consulter ses médicaments
- Gérer ses accompagnateurs

### Interface Accompagnateur
- Voir les patients suivis
- Consulter les rendez-vous des patients
- Voir les médicaments des patients

## 🔒 API Endpoints

### Authentification
- POST `/auth` - Connexion utilisateur

### Utilisateurs
- GET `/users` - Liste des utilisateurs
- GET `/users/:id` - Détails d'un utilisateur
- POST `/users` - Créer un utilisateur
- PUT `/users/:id` - Modifier un utilisateur
- DELETE `/users/:id` - Supprimer un utilisateur

### Rendez-vous
- GET `/appointments` - Liste des rendez-vous
- GET `/my-appointments` - Rendez-vous de l'utilisateur connecté

### Médicaments
- GET `/medicaments` - Liste des médicaments
- GET `/my-medicaments` - Médicaments prescrits (pour les patients)

## 🔐 Sécurité

- Authentification par JWT
- Protection des routes par rôle
- Validation des données
- Gestion des erreurs

## 📝 Notes de développement

- Le mot de passe est stocké en clair pour la démo (à modifier pour la production)
- Les tokens JWT expirent après 24h
- L'application utilise CORS pour la sécurité

## 🛠️ Technologies utilisées

- Frontend : HTML5, CSS3, JavaScript (Vanilla)
- Backend : Node.js, Express.js
- Base de données : MySQL
- Sécurité : JWT

## 📈 Améliorations futures

- [ ] Ajout de la validation des données côté serveur
- [ ] Implémentation du hachage des mots de passe
- [ ] Ajout de la pagination pour les listes
- [ ] Amélioration de la gestion des erreurs
- [ ] Ajout de tests automatisés
- [ ] Support des notifications en temps réel
