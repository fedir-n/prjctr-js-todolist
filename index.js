'use strict';

const taskInput = document.querySelector('.task-input');
const tasksList = document.querySelector('.collection');
const clearAllBtn = document.querySelector('.clear-tasks');
const form = document.querySelector('.create-task-form');
const search = document.querySelector('.filter-input');

//завантаження інформації при завантаженні сторінки
document.addEventListener('DOMContentLoaded', updateTasksList);

function updateTasksList () {
    //очищуємо список
    tasksList.innerHTML = '';

    const tasks = localStorage.getItem('tasks') !== null
        ? JSON.parse(localStorage.getItem('tasks')) : [];

    tasks.forEach((task) => {
        createSingleTaskElement(task);
    });
};

form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (taskInput.value.trim() === '') {
        taskInput.value = '';
        return;
    }

    const taskId = Date.now();
    const task = {
        id: taskId,
        task: taskInput.value
    };

    createSingleTaskElement(task);
    storeTaskInLocalStorage(task);
    taskInput.value = '';
});



// створення окремого елементу списку завдань + кнопок взаємодії з ним
function createSingleTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'collection-item'; 
    li.dataset.id = task.id;

    //кнопка редагування
    const editElement = document.createElement('span');
    editElement.className = 'edit-item';
    editElement.innerHTML = '  <i class="fa fa-edit"></i> ';
    li.appendChild(editElement);

    //текст завдання 
    li.appendChild(document.createTextNode(task.task));

    //кнопка видалення
    const deleteElement = document.createElement('span');
    deleteElement.className = 'delete-item';
    deleteElement.innerHTML = ' <i class="fa fa-remove"></i> ';
    li.appendChild(deleteElement);
    
    //додавання завдання в загальний список завдань
    tasksList.appendChild(li);
}

//зберігання завдань в локал сторедж
function storeTaskInLocalStorage(task) {
    const tasks = localStorage.getItem('tasks') !== null
        ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//видалення всіх завдань
clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        localStorage.removeItem('tasks');
        tasksList.innerHTML = '';
    }
})

//видалення/редагування однієї задачі
tasksList.addEventListener('click', function(event) {
    const task = event.target.closest('li');
    const taskId = parseInt(task.dataset.id);
    const tasks = localStorage.getItem('tasks') !== null
        ? JSON.parse(localStorage.getItem('tasks')) : [];
    //видалення
    if (event.target.closest('.delete-item')) {
        tasksList.removeChild(task);
        const updatedTasks = tasks.filter(task => task.id !== taskId)
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    //редагування
    } else if (event.target.closest('.edit-item')) {
        let editedTask = prompt('Редагування завдання', task.textContent);
        if (editedTask === null || editedTask.trim() === '') {
            return;
        } else {
            editedTask = editedTask.trim();
            task.childNodes[1].nodeValue = editedTask;
            const updatedTasks = tasks.map(task =>
                task.id === taskId ? {...task, task: editedTask} : task);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        };
    }   
});
 
//пошук
search.addEventListener('input', findTasks);
function findTasks(){
    let tasks = tasksList.querySelectorAll('li');
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].childNodes[1].nodeValue.indexOf(search.value) > -1) {
            tasks[i].style.display = '';
        } else {
            tasks[i].style.display = 'none';
        }
    };
};



