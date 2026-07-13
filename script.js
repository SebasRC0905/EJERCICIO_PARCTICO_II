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

function formatDueDate(dateValue) {
    const [year, month, day] = dateValue.split('-');
    return `${day}/${month}/${year}`;
}

function isOverdue(dateValue) {
    if (!dateValue) return false;

    const dueDate = new Date(`${dateValue}T23:59:59`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dueDate < today;
}

// Función principal para agregar una tarea
function addTask() {
    // 1. Obtener los valores y quitar espacios en blanco
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    const dueDateValue = dueDateInput.value;

    // 2. Validar que el campo no esté vacío
    if (taskText !== '') {
        // 3. Crear el contenedor principal de la nueva tarea (li)
        const newTaskItem = document.createElement('li');

        // Le asignamos las clases base y la clase dinámica de prioridad (ej. priority-alta)
        newTaskItem.className = `task-item priority-${priority}`;

        if (dueDateValue && isOverdue(dueDateValue)) {
            newTaskItem.classList.add('task-overdue');
        }

        // 4. Construir la estructura interna de la nueva tarea
        newTaskItem.innerHTML = `
            <label class="task-label">
                <input type="checkbox" class="task-check">
                <span class="task-text"></span>
                <span class="task-due-date"></span>
            </label>
            <button class="delete-btn">Eliminar</button>
        `;

        // 5. Inyectar el texto y la fecha de vencimiento de forma segura
        newTaskItem.querySelector('.task-text').textContent = taskText;

        if (dueDateValue) {
            newTaskItem.querySelector('.task-due-date').textContent = `Vence: ${formatDueDate(dueDateValue)}`;
        }

        // 6. Permitir eliminar la tarea desde su botón
        newTaskItem.querySelector('.delete-btn').addEventListener('click', () => {
            newTaskItem.remove();
        });

        // 7. Agregar la tarea terminada a la lista (ul) en el HTML
        taskList.appendChild(newTaskItem);

        // 8. Limpiar los inputs y regresar el selector a su valor por defecto
        taskInput.value = '';
        prioritySelect.value = 'media';
        dueDateInput.value = '';
    } else {
        console.warn('El campo de tarea está vacío.');
    }
}

// Escuchar el clic en el botón "Agregar Tarea"
addTaskBtn.addEventListener('click', addTask);

// Permitir agregar la tarea presionando la tecla "Enter" desde los inputs
function handleTaskKeypress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

taskInput.addEventListener('keypress', handleTaskKeypress);
dueDateInput.addEventListener('keypress', handleTaskKeypress);