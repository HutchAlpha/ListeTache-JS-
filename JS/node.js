document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const cancelDelete = document.getElementById('cancel-delete');
    const confirmDelete = document.getElementById('confirm-delete');
    const editModal = document.getElementById('edit-modal');
    const editTaskInput = document.getElementById('edit-task-input');
    const editTaskId = document.getElementById('edit-task-id');
    const cancelEdit = document.getElementById('cancel-edit');
    const confirmEdit = document.getElementById('confirm-edit');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const clickSound = document.getElementById('click-sound');

    // État de l'application
    let tasks = [];

    // Charger les tâches depuis localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTasks();
        }
    }

    // Sauvegarder les tâches dans localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateDeleteAllButton();
    }

    // Mettre à jour le bouton "Tout supprimer"
    function updateDeleteAllButton() {
        deleteAllBtn.disabled = tasks.length === 0;
    }

    // Afficher les tâches
    function renderTasks() {
        if (tasks.length === 0) {
            taskList.innerHTML = '<div class="empty-state">Aucune tâche pour le moment. Ajoutez-en une !</div>';
        } else {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.dataset.id = task.id;
                
                taskItem.innerHTML = `
                    <div class="task-name">${task.text}</div>
                    <div class="task-status">
                        <button class="status-btn ${task.completed ? 'completed' : ''}" aria-label="${task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}">
                            <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                        </button>
                    </div>
                    <div class="task-options">
                        <button class="edit-btn" aria-label="Modifier">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button class="delete-btn" aria-label="Supprimer">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </div>
                `;
                
                taskList.appendChild(taskItem);
            });
        }
        updateDeleteAllButton();
    }

    // Ajouter une nouvelle tâche
    function addTask(text) {
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        showToast('Tâche ajoutée avec succès !', 'success');
    }

    // Supprimer une tâche
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        showToast('Tâche supprimée !', 'error');
    }

    // Supprimer toutes les tâches
    function deleteAllTasks() {
        tasks = [];
        saveTasks();
        renderTasks();
        showToast('Toutes les tâches ont été supprimées !', 'error');
    }

    // Basculer l'état d'une tâche (terminée/non terminée)
    function toggleTaskStatus(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                const newStatus = !task.completed;
                if (newStatus) {
                    playClickSound();
                }
                return { ...task, completed: newStatus };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    }

    // Modifier une tâche
    function editTask(id, newText) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, text: newText };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
        showToast('Tâche modifiée avec succès !', 'info');
    }

    // Jouer le son de clic
    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play().catch(error => console.error("Erreur lors de la lecture du son:", error));
    }

    // Afficher une notification toast
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> <span style="margin-left: 10px;">${message}</span>`;
        
        toastContainer.appendChild(toast);
        
        // Supprimer le toast après 3 secondes
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Ouvrir le modal de confirmation
    function openConfirmModal() {
        confirmModal.classList.add('show');
    }

    // Fermer le modal de confirmation
    function closeConfirmModal() {
        confirmModal.classList.remove('show');
    }

    // Ouvrir le modal d'édition
    function openEditModal(id, text) {
        editTaskId.value = id;
        editTaskInput.value = text;
        editModal.classList.add('show');
        editTaskInput.focus();
    }

    // Fermer le modal d'édition
    function closeEditModal() {
        editModal.classList.remove('show');
    }

    // Gestionnaires d'événements
    
    // Soumission du formulaire pour ajouter une tâche
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            addTask(text);
            taskInput.value = '';
        }
    });

    // Clic sur la liste des tâches (délégation d'événements)
    taskList.addEventListener('click', function(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        
        const id = taskItem.dataset.id;
        
        // Bouton de statut
        if (e.target.closest('.status-btn')) {
            toggleTaskStatus(id);
        }
        
        // Bouton de suppression
        if (e.target.closest('.delete-btn')) {
            deleteTask(id);
        }
        
        // Bouton d'édition
        if (e.target.closest('.edit-btn')) {
            const taskText = tasks.find(task => task.id === id).text;
            openEditModal(id, taskText);
        }
    });

    // Bouton "Tout supprimer"
    deleteAllBtn.addEventListener('click', function() {
        if (tasks.length > 0) {
            openConfirmModal();
        }
    });

    // Annuler la suppression de toutes les tâches
    cancelDelete.addEventListener('click', closeConfirmModal);

    // Confirmer la suppression de toutes les tâches
    confirmDelete.addEventListener('click', function() {
        deleteAllTasks();
        closeConfirmModal();
    });

    // Annuler l'édition d'une tâche
    cancelEdit.addEventListener('click', closeEditModal);

    // Confirmer l'édition d'une tâche
    confirmEdit.addEventListener('click', function() {
        const id = editTaskId.value;
        const newText = editTaskInput.value.trim();
        
        if (newText) {
            editTask(id, newText);
            closeEditModal();
        }
    });

    // Fermer les modals avec le bouton X
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeConfirmModal();
            closeEditModal();
        });
    });

    // Fermer les modals en cliquant en dehors
    window.addEventListener('click', function(e) {
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
        if (e.target === editModal) {
            closeEditModal();
        }
    });

    // Raccourci clavier pour fermer les modals avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeConfirmModal();
            closeEditModal();
        }
    });

    // Initialiser l'application
    loadTasks();
});