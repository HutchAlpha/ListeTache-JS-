document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.getElementById('taskForm');
    const tacheInputElement = document.getElementById('Tache');
    const tasksTableBody = document.getElementById('tasksTableBody');

    if (formElement && tacheInputElement && tasksTableBody) {
        // Gestionnaire d'événements pour le formulaire
        function onSubmitForm(event) {
            event.preventDefault();

            const tacheValue = tacheInputElement.value;

            // Création d'une nouvelle ligne dans le tableau
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${tacheValue}</td>
                <td>Non</td>
                <td>Options ici</td>
            `;

            // Ajout de la nouvelle ligne à la fin du corps du tableau
            tasksTableBody.appendChild(newRow);

            // Effacez le champ de saisie après soumission
            tacheInputElement.value = '';
        }

        formElement.addEventListener('submit', onSubmitForm);
    } else {
        console.error('Éléments introuvables dans le DOM');
    }
});