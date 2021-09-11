let form = document.querySelector('.todo-create form');
let todosBox = document.querySelector('.todos ul');

let todoList = [];

form.addEventListener('submit', function (event) {
    event.preventDefault();

    let input = this.querySelector('input');
    let message = input.value;
    if (!message) return;
    createNewTodo(message, 'active');
    input.value = '';
});

function createNewTodo(message, state) {
    let li = document.createElement('li');
    li.setAttribute('draggable', 'true');
    li.className = 'task';
    li.dataset.state = state;

    let divSwitch = document.createElement('div');
    divSwitch.className = 'state-switch';
    let spanMessage = document.createElement('span');
    spanMessage.textContent = message || 'no message';
    let divRemove = document.createElement('div');
    divRemove.className = 'remove-task';

    li.append(divSwitch, spanMessage, divRemove);
    todoList.push(li);
    todosBox.append(li);

    updateCounter();
}

todosBox.addEventListener('click', function (event) {
    let elem = event.target.closest('.state-switch');
    if (elem) changeState(elem.closest('.task'));

    elem = event.target.closest('.remove-task');
    if (elem) removeTodo(elem.closest('.task'));
    return;
});

function changeState(todo) {
    if (todo.dataset.state === 'active') {
        todo.dataset.state = 'completed';
    } else {
        todo.dataset.state = 'active';
    }
}

function removeTodo(todo) {
    let indexToRemove = todoList.indexOf(todo);
    todo.remove();
    todoList.splice(indexToRemove, 1);
    updateCounter();
}

const clearCompletedButton = document.querySelector('.clear-completed');
clearCompletedButton.onclick = clearAllCompleted;

function clearAllCompleted() {
    let toRemove = [];
    todoList.forEach(todo => {
        if (todo.dataset.state === 'completed') {
            toRemove.push(todo)
        }
    });
    toRemove.forEach(todo => removeTodo(todo));
}

document.querySelector('#show-active').onclick = showActiveTodos;
function showActiveTodos() {
    todoList.forEach(todo => {
        if (todo.dataset.state == 'active') {
            todo.style.display = '';
        } else {
            todo.style.display = 'none';
        }
    });
}

document.querySelector('#show-all').onclick = showAllTodos;
function showAllTodos() {
    todoList.forEach(todo => {
        if (todo.dataset.state !== 'active') {
            todo.style.display = '';
        }
    });
}

document.querySelector('#show-completed').onclick = showCompletedTodos;
function showCompletedTodos() {
    todoList.forEach(todo => {
        if (todo.dataset.state === 'completed') {
            todo.style.display = '';
        } else {
            todo.style.display = 'none';
        }
    });
}

function updateCounter(){
    let todosQuantity = todoList.length;
    document.querySelector('.todo-bottom-box span').innerHTML = `${todosQuantity} items left`;
}