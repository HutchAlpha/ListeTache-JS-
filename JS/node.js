document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.getElementById('taskForm');
    const tacheInputElement = document.getElementById('Tache');
    const tasksTableBody = document.getElementById('tasksTableBody');

    if (formElement && tacheInputElement && tasksTableBody) {
        function onSubmitForm(event) {
            event.preventDefault();

            const tacheValue = tacheInputElement.value;

            // Création d'une nouvelle ligne dans le tableau
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${tacheValue}</td>
                <td class="center"><input type="checkbox" id="check" name="check"/></td>
                <td><button class="supprimer">Supprimer</button></td>
            `;

            // Ajout de la nouvelle ligne à la fin du corps du tableau
            tasksTableBody.appendChild(newRow);

            const checkbox = newRow.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', function() {
                changeColor(this);
            });

            // Effacez le champ de saisie après soumission
            tacheInputElement.value = '';
        }

        formElement.addEventListener('submit', onSubmitForm);

        tasksTableBody.addEventListener('click', function(event) {
            if (event.target.classList.contains('supprimer')) {
                var row = event.target.closest('tr');

                if (row) {
                    row.remove();
                }
            }
        });

        function changeColor(checkbox) {
            const row = checkbox.closest('tr');
            if (checkbox.checked) {
                row.style.backgroundColor = 'rgb(219, 219, 162)';
            } else {
                row.style.backgroundColor = ''; 
            }
        }
        
    } else {
        console.error('Éléments introuvables dans le DOM');
    }
});
