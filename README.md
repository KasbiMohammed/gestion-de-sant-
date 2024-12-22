# Système de Gestion de Santé

Un système complet de gestion de santé permettant la gestion des patients, médecins, rendez-vous et médicaments.


### Page de connexion
- Interface de connexion sécurisée
- Validation des champs email/mot de passe
- Messages d'erreur clairs
- Redirection automatique selon le rôle

## 🚀 Fonctionnalités

- ✅ Authentification multi-rôles (Admin, Médecin, Patient, Accompagnateur)
- 🔐 Système de connexion sécurisé avec JWT
- 📊 Interface d'administration complète
- 👨‍⚕️ Gestion des médecins et leurs patients
- 🏥 Gestion des rendez-vous
- 💊 Suivi des médicaments
- 👥 Gestion des accompagnateurs
- 📱 Interface responsive (mobile-friendly)
- 🎨 Design moderne et intuitif

## 📋 Structure du projet

```
health-management/
├── server.js          # Serveur Node.js + Express
├── index.html         # Page principale
├── style.css          # Styles CSS
├── script.js          # JavaScript frontend
├── package.json       # Dépendances
└── README.md          # Documentation
```

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
('admin@test.com', 'admin', 'admin'),
('doctor1@test.com', 'doctor', 'doctor'),
('doctor2@test.com', 'doctor', 'doctor'),
('patient1@test.com', 'patient', 'patient'),
('patient2@test.com', 'patient', 'patient'),
('accompanist1@test.com', 'accompanist', 'accompanist'),
('accompanist2@test.com', 'accompanist', 'accompanist');
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
| Admin | admin@test.com | admin |
| Médecin | doctor@test.com | doctor |
| Patient | patient@test.com | patient |
| Accompagnateur | accompanist@test.com | accompanist |

## 🖥️ Interfaces

### Page de connexion
- Formulaire de connexion responsive
- Validation des champs en temps réel
- Gestion des erreurs de connexion
- Animation de chargement pendant l'authentification

<img width="316" alt="image" src="https://github.com/user-attachments/assets/6445403e-fce6-4664-8f98-1ccd9f20fd06" />

### Interface Administrateur
- Tableau de bord avec statistiques
- Gestion complète des utilisateurs (CRUD)
- Vue d'ensemble des médecins, patients et rendez-vous
- Gestion des médicaments
- Export des données
  
  <img width="599" alt="image" src="https://github.com/user-attachments/assets/c2639291-6488-459d-bbc1-6a6c33f0d383" />

### Interface Médecin
- Calendrier des rendez-vous
- Liste de ses patients
- Gestion des prescriptions
- Historique des consultations
- Notes sur les patients
  
  <img width="603" alt="image" src="https://github.com/user-attachments/assets/991219e0-bbe2-447a-a554-dd7f62f68a1a" />


### Interface Patient
- Vue calendrier de ses rendez-vous
- Liste de ses médicaments actuels
- Historique médical
- Gestion de ses accompagnateurs
- Prise de rendez-vous
  
  <img width="305" alt="image" src="https://github.com/user-attachments/assets/d61dacc9-3dad-4f23-ac24-792c8bd43d9d" />


### Interface 
- Liste des patients suivis
- Calendrier des rendez-vous
- Alertes médicaments
- Notes de suivi

## 💻 Guide d'utilisation

### Connexion
1. Ouvrez `index.html` dans votre navigateur
2. Entrez vos identifiants de connexion
3. Le système vous redirigera automatiquement vers votre interface

### Administration
1. Connectez-vous avec le compte admin
2. Accédez aux différentes sections depuis le menu
3. Utilisez les boutons CRUD pour gérer les utilisateurs
4. Consultez les statistiques dans le tableau de bord

### Médecins
1. Connectez-vous avec un compte médecin
2. Consultez vos rendez-vous du jour
3. Gérez vos patients et leurs prescriptions
4. Ajoutez des notes de consultation

### Patients
1. Connectez-vous avec un compte patient
2. Consultez vos prochains rendez-vous
3. Vérifiez vos prescriptions actuelles
4. Gérez vos accompagnateurs

## 🔐 API Endpoints

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

## 🎨 Personnalisation

### Thème
Modifiez les variables CSS dans `style.css` pour changer les couleurs :
```css
:root {
    --primary-color: #4CAF50;
    --secondary-color: #2196F3;
    --background-color: #f5f5f5;
    --text-color: #333;
    --border-color: #ddd;
}
```

### Textes
Les textes peuvent être modifiés dans les fichiers :
- `index.html` pour les labels et titres
- `script.js` pour les messages d'erreur et notifications

## 🔧 Dépannage

### Problèmes courants

1. **Erreur de connexion**
   - Vérifiez que le serveur est bien démarré
   - Vérifiez les identifiants dans la base de données
   - Vérifiez la connexion à la base de données

2. **Page blanche**
   - Vérifiez la console du navigateur
   - Assurez-vous que tous les fichiers sont bien chargés
   - Vérifiez les chemins des fichiers

3. **Erreurs API**
   - Vérifiez que le port 3001 est libre
   - Vérifiez les logs du serveur
   - Vérifiez la validité du token JWT

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les logs serveur
3. Contactez le support technique
