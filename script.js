const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const dueDateInput = document.getElementById('due-date-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const taskCounter = document.getElementById('task-counter');
const clearAllBtn = document.getElementById('clear-all-btn');
const currentDateElement = document.getElementById('current-date');
const helperText = document.querySelector('.helper-text');

const PRIORITIES = ['baja', 'media', 'alta'];
const PRIORITY_LABELS = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta'
};

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDueDate(dateValue) {
    if (!dateValue) return '';
    const [year, month, day] = dateValue.split('-');
    return `${day}/${month}/${year}`;
}

function getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function setDateLimits() {
    dueDateInput.min = getTodayString();
}

function isOverdue(dateValue) {
    if (!dateValue) return false;

    const dueDate = new Date(`${dateValue}T23:59:59`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dueDate < today;
}

function validateTaskData(taskText, priority, dueDateValue) {
    if (taskText.trim() === '') {
        return { valid: false, message: 'Escribe una tarea antes de agregarla.' };
    }

    if (!PRIORITIES.includes(priority)) {
        return { valid: false, message: 'La prioridad seleccionada no es válida.' };
    }

    if (!dueDateValue) {
        return { valid: false, message: 'Debes ingresar una fecha válida para la tarea.' };
    }

    const selectedDate = new Date(`${dueDateValue}T23:59:59`);
    if (Number.isNaN(selectedDate.getTime())) {
        return { valid: false, message: 'La fecha ingresada no es válida.' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return { valid: false, message: 'La fecha debe ser igual o posterior a hoy.' };
    }

    return { valid: true, message: '' };
}

function updateTaskCounter() {
    const allTasks = Array.from(taskList.querySelectorAll('.task-item'));
    const completedTasks = allTasks.filter(task => task.dataset.completed === 'true').length;
    const pendingTasks = allTasks.length - completedTasks;

    taskCounter.textContent = `${pendingTasks} pendiente${pendingTasks === 1 ? '' : 's'} · ${completedTasks} completada${completedTasks === 1 ? '' : 's'}`;
}

function renderTaskItem(taskItem) {
    const text = taskItem.dataset.text || '';
    const priority = taskItem.dataset.priority || 'media';
    const dueDateValue = taskItem.dataset.dueDate || '';
    const completed = taskItem.dataset.completed === 'true';

    taskItem.className = `task-item priority-${priority}`;

    if (completed) {
        taskItem.classList.add('task-completed');
    } else {
        taskItem.classList.remove('task-completed');
    }

    if (dueDateValue && isOverdue(dueDateValue)) {
        taskItem.classList.add('task-overdue');
    } else {
        taskItem.classList.remove('task-overdue');
    }

    taskItem.innerHTML = `
        <div class="task-main">
            <label class="task-label">
                <input type="checkbox" class="task-check" ${completed ? 'checked' : ''}>
                <span class="task-text">${escapeHtml(text)}</span>
            </label>
            <div class="task-meta">
                <span class="priority-badge ${priority}">${PRIORITY_LABELS[priority]}</span>
                ${dueDateValue ? `<span class="task-due-date">Vence: ${formatDueDate(dueDateValue)}</span>` : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="edit-btn" type="button">Editar</button>
            <button class="delete-btn" type="button">Eliminar</button>
        </div>
    `;

    const checkbox = taskItem.querySelector('.task-check');
    checkbox.addEventListener('change', () => {
        taskItem.dataset.completed = checkbox.checked ? 'true' : 'false';
        taskItem.classList.toggle('task-completed', checkbox.checked);
        updateTaskCounter();
    });

    taskItem.querySelector('.edit-btn').addEventListener('click', () => startEditingTask(taskItem));
    taskItem.querySelector('.delete-btn').addEventListener('click', () => {
        taskItem.remove();
        updateTaskCounter();
    });
}

function startEditingTask(taskItem) {
    const currentText = taskItem.dataset.text || '';
    const currentPriority = taskItem.dataset.priority || 'media';
    const currentDueDate = taskItem.dataset.dueDate || '';

    taskItem.innerHTML = `
        <div class="edit-form">
            <label class="field">
                <span>Tarea</span>
                <input type="text" class="edit-task-input" value="${escapeHtml(currentText)}" maxlength="120" autocomplete="off">
            </label>
            <label class="field">
                <span>Prioridad</span>
                <select class="edit-priority-select">
                    ${PRIORITIES.map(priority => `<option value="${priority}" ${currentPriority === priority ? 'selected' : ''}>${PRIORITY_LABELS[priority]}</option>`).join('')}
                </select>
            </label>
            <label class="field">
                <span>Fecha límite</span>
                <input type="date" class="edit-due-date-input" value="${currentDueDate}" aria-label="Fecha de vencimiento" required>
            </label>
            <div class="edit-actions">
                <button class="save-edit-btn" type="button">Guardar</button>
                <button class="cancel-edit-btn" type="button">Cancelar</button>
            </div>
            <p class="form-error" aria-live="polite"></p>
        </div>
    `;

    const editTaskInput = taskItem.querySelector('.edit-task-input');
    const editPrioritySelect = taskItem.querySelector('.edit-priority-select');
    const editDueDateInput = taskItem.querySelector('.edit-due-date-input');
    const errorText = taskItem.querySelector('.form-error');

    editDueDateInput.min = getTodayString();

    taskItem.querySelector('.save-edit-btn').addEventListener('click', () => {
        const nextText = editTaskInput.value.trim();
        const nextPriority = editPrioritySelect.value;
        const nextDueDate = editDueDateInput.value;
        const validation = validateTaskData(nextText, nextPriority, nextDueDate);

        if (!validation.valid) {
            errorText.textContent = validation.message;
            return;
        }

        taskItem.dataset.text = nextText;
        taskItem.dataset.priority = nextPriority;
        taskItem.dataset.dueDate = nextDueDate;
        renderTaskItem(taskItem);
        updateTaskCounter();
    });

    taskItem.querySelector('.cancel-edit-btn').addEventListener('click', () => {
        renderTaskItem(taskItem);
    });
}

function clearCompletedTasks() {
    const completedTasks = taskList.querySelectorAll('.task-item').length;
    taskList.querySelectorAll('.task-item').forEach(taskItem => {
        if (taskItem.dataset.completed === 'true') {
            taskItem.remove();
        }
    });

    if (completedTasks === 0) {
        return;
    }

    updateTaskCounter();
}

function addTask() {
    const taskText = taskInput.value;
    const priority = prioritySelect.value;
    const dueDateValue = dueDateInput.value;
    const validation = validateTaskData(taskText, priority, dueDateValue);

    if (!validation.valid) {
        helperText.textContent = validation.message;
        return;
    }

    const newTaskItem = document.createElement('li');
    newTaskItem.dataset.text = taskText.trim();
    newTaskItem.dataset.priority = priority;
    newTaskItem.dataset.dueDate = dueDateValue;
    newTaskItem.dataset.completed = 'false';
    renderTaskItem(newTaskItem);
    taskList.appendChild(newTaskItem);

    taskInput.value = '';
    prioritySelect.value = 'media';
    dueDateInput.value = '';
    helperText.textContent = 'Prioridades permitidas: Baja, Media y Alta. La fecha es obligatoria.';
    updateTaskCounter();
}

function handleTaskKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTask();
    }
}

addTaskBtn.addEventListener('click', addTask);
clearAllBtn.addEventListener('click', clearCompletedTasks);
taskInput.addEventListener('keypress', handleTaskKeypress);
dueDateInput.addEventListener('keypress', handleTaskKeypress);

currentDateElement.textContent = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
}).format(new Date());

setDateLimits();

const appFooter = document.querySelector('.app-footer');
const teamCredits = document.createElement('p');
teamCredits.className = 'team-credits';
teamCredits.innerHTML = '<strong>Integrantes:</strong> Zoe Yeray Cruz Cruz, Montaño Hernandez Edgar, Ruiz Cortes Sebastian y Vargas Mendoza Julian Axel.';
appFooter.appendChild(teamCredits);