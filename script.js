// Variables globales
const API_URL = 'http://localhost:3001/api';
let currentUser = null;

// Gestionnaire d'authentification
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur de connexion');
        }

        // Stocker le token et les informations utilisateur
        localStorage.setItem('token', data.token);
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Rediriger vers l'interface appropriée
        showUserInterface(currentUser.role);
    } catch (error) {
        alert(error.message);
    }
});

// Fonction pour afficher l'interface utilisateur appropriée
function showUserInterface(role) {
    // Cacher la page de connexion
    document.getElementById('login-container').style.display = 'none';

    const interfaceId = `${role}-container`;
    const interfaceElement = document.getElementById(interfaceId);

    // Afficher l'interface appropriée
    interfaceElement.classList.remove('hidden');

    // Charger la section par défaut selon le rôle
    switch (role) {
        case 'admin':
            loadAdminData();
            break;
        case 'doctor':
            loadDoctorData();
            break;
        case 'patient':
            loadPatientData();
            break;
        case 'accompanist':
            loadAccompanistData();
            break;
    }
}

// Fonctions de chargement des données spécifiques aux rôles
async function loadAdminData() {
    try {
        const users = await fetchData(`/users`);
        displayUsers(users);
    } catch (error) {
        console.error('Erreur lors du chargement des données admin:', error);
    }
}

async function loadDoctorData() {
    try {
        const appointments = await fetchData(`/appointments`);
        const patients = await fetchData(`/patients`);

        displayDoctorAppointments(appointments);
        displayDoctorPatients(patients);
    } catch (error) {
        console.error('Erreur lors du chargement des données médecin:', error);
    }
}

async function loadPatientData() {
    try {
        const appointments = await fetchData(`/appointments`);
        const medications = await fetchData(`/medicaments`);

        displayPatientAppointments(appointments);
        displayPatientMedications(medications);
    } catch (error) {
        console.error('Erreur lors du chargement des données patient:', error);
    }
}

async function loadAccompanistData() {
    try {
        const patients = await fetchData(`/accompanied-patients`);
        displayAccompanistPatients(patients);
    } catch (error) {
        console.error('Erreur lors du chargement des données accompagnateur:', error);
    }
}

// Fonctions d'affichage
function displayUsers(users) {
    const container = document.getElementById('users-list');
    
    // Ajout du bouton pour créer un nouvel utilisateur
    container.innerHTML = `
        <div class="actions-bar">
            <button onclick="showAddUserModal()" class="add-btn">
                <i class="fas fa-plus"></i> Ajouter un utilisateur
            </button>
        </div>
        <div class="users-grid">
            ${users.map(user => `
                <div class="user-card">
                    <div class="user-info">
                        <h4>${user.email}</h4>
                        <p>Rôle: ${user.role}</p>
                    </div>
                    <div class="user-actions">
                        <button onclick="editUser(${user.id})" class="edit-btn">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button onclick="deleteUser(${user.id})" class="delete-btn">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Ajout des modals pour Create et Update
    if (!document.getElementById('user-modal')) {
        const modalHTML = `
            <div id="user-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2 id="modal-title">Ajouter un utilisateur</h2>
                    <form id="user-form">
                        <input type="hidden" id="user-id">
                        <div class="form-group">
                            <label for="user-email">Email</label>
                            <input type="email" id="user-email" required>
                        </div>
                        <div class="form-group">
                            <label for="user-password">Mot de passe</label>
                            <input type="password" id="user-password" required>
                        </div>
                        <div class="form-group">
                            <label for="user-role">Rôle</label>
                            <select id="user-role" required>
                                <option value="admin">Administrateur</option>
                                <option value="doctor">Médecin</option>
                                <option value="patient">Patient</option>
                                <option value="accompanist">Accompagnateur</option>
                            </select>
                        </div>
                        <button type="submit" class="submit-btn">Enregistrer</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Event listeners pour le modal
        const modal = document.getElementById('user-modal');
        const span = modal.querySelector('.close');
        const form = document.getElementById('user-form');
        
        span.onclick = () => modal.style.display = "none";
        window.onclick = (event) => {
            if (event.target == modal) modal.style.display = "none";
        }
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            const userId = document.getElementById('user-id').value;
            const userData = {
                email: document.getElementById('user-email').value,
                password: document.getElementById('user-password').value,
                role: document.getElementById('user-role').value
            };
            
            try {
                if (userId) {
                    // Update
                    await fetch(`${API_URL}/users/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(userData)
                    });
                } else {
                    // Create
                    await fetch(`${API_URL}/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(userData)
                    });
                }
                
                modal.style.display = "none";
                loadAdminData(); // Recharger la liste
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue');
            }
        };
    }
}

// Fonctions pour gérer les actions CRUD
function showAddUserModal() {
    const modal = document.getElementById('user-modal');
    const form = document.getElementById('user-form');
    const title = document.getElementById('modal-title');
    
    title.textContent = 'Ajouter un utilisateur';
    form.reset();
    document.getElementById('user-id').value = '';
    modal.style.display = "block";
}

async function editUser(userId) {
    const modal = document.getElementById('user-modal');
    const title = document.getElementById('modal-title');
    
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const user = await response.json();
        
        title.textContent = 'Modifier l\'utilisateur';
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-password').value = ''; // Par sécurité
        
        modal.style.display = "block";
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue');
    }
}

async function deleteUser(userId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        try {
            await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            loadAdminData(); // Recharger la liste
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue');
        }
    }
}

function displayDoctorAppointments(appointments) {
    const container = document.getElementById('doctor-appointments');
    container.innerHTML = appointments.map(apt => `
        <div class="appointment-card">
            <h4>Patient: ${apt.patientFirstName} ${apt.patientLastName}</h4>
            <p>Date: ${new Date(apt.date_time).toLocaleString()}</p>
            <p>Status: ${apt.status}</p>
            <p>Notes: ${apt.notes || 'Aucune note'}</p>
        </div>
    `).join('');
}

function displayDoctorPatients(patients) {
    const container = document.getElementById('doctor-patients');
    container.innerHTML = patients.map(patient => `
        <div class="patient-card">
            <h4>${patient.firstName} ${patient.lastName}</h4>
            <p>Email: ${patient.email}</p>
            <p>Téléphone: ${patient.phoneNumber}</p>
        </div>
    `).join('');
}

function displayPatientAppointments(appointments) {
    const container = document.getElementById('patient-appointments');
    container.innerHTML = appointments.map(apt => `
        <div class="appointment-card">
            <h4>Dr. ${apt.doctorFirstName} ${apt.doctorLastName}</h4>
            <p>Date: ${new Date(apt.date_time).toLocaleString()}</p>
            <p>Status: ${apt.status}</p>
            <p>Notes: ${apt.notes || 'Aucune note'}</p>
        </div>
    `).join('');
}

function displayPatientMedications(medications) {
    const container = document.getElementById('patient-medications');
    container.innerHTML = medications.map(med => `
        <div class="medication-card">
            <h4>${med.name}</h4>
            <p>Dosage: ${med.dosage}</p>
            <p>Fréquence: ${med.frequency}</p>
            <p>Instructions: ${med.displayInfo}</p>
        </div>
    `).join('');
}

function displayAccompanistPatients(patients) {
    const container = document.getElementById('accompanist-patients');
    container.innerHTML = patients.map(patient => `
        <div class="patient-card">
            <h4>${patient.firstName} ${patient.lastName}</h4>
            <p>Email: ${patient.email}</p>
            <p>Téléphone: ${patient.phoneNumber}</p>
        </div>
    `).join('');
}

// Fonction pour afficher une section
async function showSection(section) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Session expirée');
        return;
    }

    const contentId = `${currentUser.role}-content`;
    const contentElement = document.getElementById(contentId);

    try {
        let data;
        switch (section) {
            case 'admin':
                data = await fetchData(`/users`);
                contentElement.innerHTML = generateUserTable(data);
                break;
            case 'doctor':
                data = await fetchData(`/doctor`);
                contentElement.innerHTML = generateDoctorTable(data);
                break;
            case 'patient':
                data = await fetchData(`/patient`);
                contentElement.innerHTML = generatePatientTable(data);
                break;
            case 'medicament':
                data = await fetchData(`/medicament`);
                contentElement.innerHTML = generateMedicamentTable(data);
                break;
            case 'appointment':
                data = await fetchData(`/appointment`);
                contentElement.innerHTML = generateAppointmentTable(data);
                break;
            case 'myPatients':
                data = await fetchData(`/doctor/${currentUser.id}/patients`);
                contentElement.innerHTML = generatePatientTable(data);
                break;
            case 'myMedicaments':
                data = await fetchData(`/patient/${currentUser.id}/medicaments`);
                contentElement.innerHTML = generateMedicamentTable(data);
                break;
            case 'myAppointments':
                data = await fetchData(`/appointment?userId=${currentUser.id}`);
                contentElement.innerHTML = generateAppointmentTable(data);
                break;
            // Ajouter d'autres cas selon les besoins
        }
    } catch (error) {
        contentElement.innerHTML = `<p class="error">Erreur: ${error.message}</p>`;
    }
}

// Fonction utilitaire pour les requêtes API
async function fetchData(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
    }

    return response.json();
}

// Générateurs de tables
function generateUserTable(users) {
    return `
        <h2>Gestion des Utilisateurs</h2>
        <button onclick="showModal('user')">Ajouter un utilisateur</button>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            <button onclick="editUser(${user.id})">Modifier</button>
                            <button onclick="deleteUser(${user.id})">Supprimer</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generateDoctorTable(doctors) {
    return `
        <h2>Gestion des Médecins</h2>
        <button onclick="showModal('doctor')">Ajouter un médecin</button>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Spécialité</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${doctors.map(doctor => `
                    <tr>
                        <td>${doctor.id}</td>
                        <td>${doctor.lastName}</td>
                        <td>${doctor.firstName}</td>
                        <td>${doctor.email}</td>
                        <td>${doctor.speciality}</td>
                        <td>
                            <button onclick="editDoctor(${doctor.id})">Modifier</button>
                            <button onclick="deleteDoctor(${doctor.id})">Supprimer</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function generateMedicamentTable(medicaments) {
    return `
        <h2>Gestion des Médicaments</h2>
        <button onclick="showModal('medicament')">Ajouter un médicament</button>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Fréquence</th>
                    <th>Dosage</th>
                    <th>Détails</th>
                    <th>Instructions</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${medicaments.map(med => `
                    <tr>
                        <td>${med.id}</td>
                        <td>${med.name}</td>
                        <td>${med.frequency}</td>
                        <td>${med.dosage}</td>
                        <td>${med.details}</td>
                        <td>${med.displayInfo}</td>
                        <td>
                            <button onclick="editMedicament(${med.id})">Modifier</button>
                            <button onclick="deleteMedicament(${med.id})">Supprimer</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Gestionnaire de modal
function showModal(type, id = null) {
    const modal = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');

    let title = id ? 'Modifier' : 'Ajouter';
    let content = '';

    switch (type) {
        case 'medicament':
            title += ' un médicament';
            content = generateMedicamentForm();
            break;
        case 'user':
            title += ' un utilisateur';
            content = generateUserForm();
            break;
        case 'doctor':
            title += ' un médecin';
            content = generateDoctorForm();
            break;
        // Ajouter d'autres cas selon les besoins
    }

    modalBody.innerHTML = `
        <h3>${title}</h3>
        ${content}
    `;

    modal.classList.add('active');
}

// Fermeture du modal

// Générateurs de formulaires
function generateMedicamentForm(data = {}) {
    return `
        <form id="medicament-form" onsubmit="handleMedicamentSubmit(event)">
            <div class="form-group">
                <label for="name">Nom</label>
                <input type="text" id="name" name="name" value="${data.name || ''}" required>
            </div>
            <div class="form-group">
                <label for="frequency">Fréquence</label>
                <input type="text" id="frequency" name="frequency" value="${data.frequency || ''}" required>
            </div>
            <div class="form-group">
                <label for="dosage">Dosage</label>
                <input type="text" id="dosage" name="dosage" value="${data.dosage || ''}" required>
            </div>
            <div class="form-group">
                <label for="details">Détails</label>
                <textarea id="details" name="details">${data.details || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="displayInfo">Instructions</label>
                <textarea id="displayInfo" name="displayInfo">${data.displayInfo || ''}</textarea>
            </div>
            <button type="submit">Enregistrer</button>
        </form>
    `;
}

// Gestionnaires de soumission de formulaires
async function handleMedicamentSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const medicamentData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${API_URL}/medicament`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(medicamentData)
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'enregistrement');
        }

        document.getElementById('modal-container').classList.remove('active');
        showSection('medicament');
    } catch (error) {
        alert(error.message);
    }
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    location.reload();
}
