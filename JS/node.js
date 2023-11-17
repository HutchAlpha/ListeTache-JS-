document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.getElementById('taskForm');
    const tacheInputElement = document.getElementById('Tache');
    const tasksTableBody = document.getElementById('tasksTableBody');
    var supprimer = document.getElementsByClassName('supprimer');

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
                <td><button class="supprimer">Supprimer</button></td>
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

    tasksTableBody.addEventListener('click', function(event) {
        // Vérifiez si le clic a été effectué sur un bouton avec la classe "supprimer"
        if (event.target.classList.contains('supprimer')) {
            // Obtenez la ligne parente du bouton cliqué (tr)
            var row = event.target.closest('tr');

        if (row) {
            row.remove();
        }
    }
    });

});