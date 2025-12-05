const form = document.getElementById('add-task-form');
const taskInput = document.getElementById('task-input');
const pendingList = document.getElementById('pending-tasks');
const completedList = document.getElementById('completed-tasks');

function formatTimestamp(date) {
  return date.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function createTaskItem(text, addedAt, completedAt=null) {
  const li = document.createElement('li');
  li.className = `task-item${completedAt ? ' completed' : ''}`;

  const mainDiv = document.createElement('div');
  mainDiv.className = 'task-main';

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completedAt !== null;
  checkbox.setAttribute('aria-label', 'Toggle task completion');
  checkbox.addEventListener('change', e => {
    if (e.target.checked) completeTask(li);
    else uncompleteTask(li);
  });

  // Editable task text
  const taskText = document.createElement('div');
  taskText.className = 'task-text';
  taskText.contentEditable = true;
  taskText.textContent = text;
  taskText.setAttribute('role', 'textbox');
  taskText.setAttribute('aria-multiline', 'true');
  taskText.addEventListener('blur', () => {
    if (taskText.textContent.trim() === '') {
      deleteTask(li);
    }
  });
  taskText.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      taskText.blur();
    }
  });

  // Meta info
  const meta = document.createElement('span');
  meta.className = 'task-meta';
  if (completedAt) {
    meta.textContent = `Added: ${formatTimestamp(addedAt)} | Completed: ${formatTimestamp(completedAt)}`;
  } else {
    meta.textContent = `Added: ${formatTimestamp(addedAt)}`;
  }

  mainDiv.append(checkbox, taskText);

  // Actions: delete button
  const actions = document.createElement('div');
  actions.className = 'task-actions';
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('aria-label', 'Delete task');
  deleteButton.innerHTML = '🗑';
  deleteButton.addEventListener('click', () => deleteTask(li));
  actions.appendChild(deleteButton);

  li.append(mainDiv, meta, actions);

  li._addedAt = addedAt;
  li._completedAt = completedAt;

  return li;
}

function addTask(text) {
  const addedAt = new Date();
  const taskItem = createTaskItem(text, addedAt);
  pendingList.appendChild(taskItem);
}

function completeTask(taskItem) {
  taskItem.classList.add('completed');
  taskItem._completedAt = new Date();
  const meta = taskItem.querySelector('.task-meta');
  meta.textContent = `Added: ${formatTimestamp(taskItem._addedAt)} | Completed: ${formatTimestamp(taskItem._completedAt)}`;
  completedList.appendChild(taskItem);
}

function uncompleteTask(taskItem) {
  taskItem.classList.remove('completed');
  taskItem._completedAt = null;
  const meta = taskItem.querySelector('.task-meta');
  meta.textContent = `Added: ${formatTimestamp(taskItem._addedAt)}`;
  pendingList.appendChild(taskItem);
}

function deleteTask(taskItem) {
  taskItem.remove();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (!taskText) return;
  addTask(taskText);
  taskInput.value = '';
  taskInput.focus();
});