// Seleccionar los elementos de la interfaz usando los ID del HTML
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Función principal para agregar una tarea
function addTask() {
    // 1. Obtener los valores y quitar espacios en blanco
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    // 2. Validar que el campo no esté vacío
    if (taskText !== '') {
        // 3. Crear el contenedor principal de la nueva tarea (li)
        const newTaskItem = document.createElement('li');
        
        // Le asignamos las clases base y la clase dinámica de prioridad (ej. priority-alta)
        newTaskItem.className = `task-item priority-${priority}`;

        // 4. Construir la estructura interna tal cual la dejó el Programador 2
        newTaskItem.innerHTML = `
            <label class="task-label">
                <input type="checkbox" class="task-check">
                <span class="task-text"></span>
            </label>
            <button class="delete-btn">Eliminar</button>
        `;

        // 5. Inyectar el texto de la tarea de forma segura (para evitar ejecución de código no deseado)
        newTaskItem.querySelector('.task-text').textContent = taskText;

        // 6. Agregar la tarea terminada a la lista (ul) en el HTML
        taskList.appendChild(newTaskItem);

        // 7. Limpiar el input y regresar el selector a su valor por defecto
        taskInput.value = '';
        prioritySelect.value = 'media';
    } else {
        console.warn('El campo de tarea está vacío.');
    }
}

// Escuchar el clic en el botón "Agregar Tarea"
addTaskBtn.addEventListener('click', addTask);

// Permitir agregar la tarea presionando la tecla "Enter" desde el input
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});