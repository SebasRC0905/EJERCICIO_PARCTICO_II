// Seleccionar los elementos de la interfaz usando los ID del HTML
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const inputSection = document.querySelector('.input-section');

// Crear dinámicamente un input para la fecha de vencimiento
const dueDateInput = document.createElement('input');
dueDateInput.type = 'date';
dueDateInput.id = 'due-date-input';
dueDateInput.setAttribute('aria-label', 'Fecha de vencimiento');

Object.assign(dueDateInput.style, {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    cursor: 'pointer',
    backgroundColor: 'white'
});

inputSection.insertBefore(dueDateInput, addTaskBtn);

// Formatear la fecha
function formatDueDate(dateValue) {
    const [year, month, day] = dateValue.split('-');
    return `${day}/${month}/${year}`;
}

// Verificar si una fecha está vencida
function isOverdue(dateValue) {
    if (!dateValue) return false;

    const dueDate = new Date(`${dateValue}T23:59:59`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dueDate < today;
}

// Función para agregar tareas
function addTask() {

    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDateValue = dueDateInput.value;

    if (taskText !== '') {

        const newTaskItem = document.createElement('li');
        newTaskItem.className = `task-item priority-${priority}`;

        if (dueDateValue && isOverdue(dueDateValue)) {
            newTaskItem.classList.add('task-overdue');
        }

        newTaskItem.innerHTML = `
            <label class="task-label">
                <input type="checkbox" class="task-check">
                <span class="task-text"></span>
                <span class="task-due-date"></span>
            </label>

            <div class="task-actions">
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Eliminar</button>
            </div>
        `;

        newTaskItem.querySelector('.task-text').textContent = taskText;

        if (dueDateValue) {
            newTaskItem.querySelector('.task-due-date').textContent =
                `Vence: ${formatDueDate(dueDateValue)}`;
        }

        // Botón Editar
        const editBtn = newTaskItem.querySelector('.edit-btn');

        editBtn.addEventListener('click', () => {

            const nuevoTexto = prompt(
                "Editar la tarea:",
                newTaskItem.querySelector('.task-text').textContent
            );

            if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
                newTaskItem.querySelector('.task-text').textContent = nuevoTexto.trim();
            }

            const nuevaPrioridad = prompt(
                "Nueva prioridad (baja, media o alta):",
                priority
            );

            if (
                nuevaPrioridad === "baja" ||
                nuevaPrioridad === "media" ||
                nuevaPrioridad === "alta"
            ) {

                newTaskItem.className = `task-item priority-${nuevaPrioridad}`;

                if (dueDateInput.value && isOverdue(dueDateInput.value)) {
                    newTaskItem.classList.add("task-overdue");
                }

            }

            const fechaActual = dueDateValue || "";

            const nuevaFecha = prompt(
                "Nueva fecha (AAAA-MM-DD):",
                fechaActual
            );

            if (nuevaFecha !== null && nuevaFecha !== "") {

                newTaskItem.querySelector('.task-due-date').textContent =
                    `Vence: ${formatDueDate(nuevaFecha)}`;

                newTaskItem.classList.remove("task-overdue");

                if (isOverdue(nuevaFecha)) {
                    newTaskItem.classList.add("task-overdue");
                }

            }

        });

        // Botón Eliminar
        newTaskItem.querySelector('.delete-btn').addEventListener('click', () => {
            newTaskItem.remove();
        });

        taskList.appendChild(newTaskItem);

        // Limpiar campos
        taskInput.value = '';
        prioritySelect.value = 'media';
        dueDateInput.value = '';

    } else {
        alert("Escribe una tarea antes de agregarla.");
    }
}

// Evento del botón Agregar
addTaskBtn.addEventListener('click', addTask);

// Agregar con Enter
function handleTaskKeypress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

taskInput.addEventListener('keypress', handleTaskKeypress);
dueDateInput.addEventListener('keypress', handleTaskKeypress);