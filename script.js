let todosBox = document.querySelector('.todos ul');
let form = document.querySelector('.todo-create form');
let todoList = [];

retriveData();
function retriveData() {
    let savedData = JSON.parse(localStorage.getItem('savedTodo'));
    if (savedData) {
        savedData
            .reverse()
            .forEach(elem => createNewTodo(elem.message, elem.state));
    }
    setTimeout(turnOnAnimations, 1000);
}

function saveData() {
    let objToSave = [...todoList]
        .map(todo => (
            {
                'message': todo.querySelector('span').textContent,
                'state': todo.dataset.state
            }
        ));
    let stringfy = JSON.stringify(objToSave);
    localStorage.setItem('savedTodo', stringfy);
}

function turnOnAnimations() {
    document.body.classList.remove('no-animation');
}

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

    li.classList.add('add-animation');
    setTimeout(() => li.classList.remove('add-animation'), 1000);
    li.append(divSwitch, spanMessage, divRemove);
    todoList.unshift(li);
    todosBox.prepend(li);

    makeDraggable(li);
    updateCounter();
    saveData();
}

let draggableIndex;
function makeDraggable(dragItem) {

    dragItem.ondragstart = function () {
        draggableIndex = todoList.indexOf(this);
    }

    dragItem.ondragenter = function () {
        this.classList.add('drag-over');
    }

    dragItem.ondragleave = function (event) {
        if (event.relatedTarget === null) {
            this.classList.remove('drag-over');
            return;
        }
        if (event.relatedTarget.closest('li') === this) return;
        this.classList.remove('drag-over');
    }

    dragItem.ondragover = function (event) {
        event.preventDefault();
    }

    dragItem.ondrop = function () {
        this.classList.remove('drag-over');
        let droppableIndex = todoList.indexOf(this);
        [todoList[droppableIndex], todoList[draggableIndex]] = [todoList[draggableIndex], todoList[droppableIndex]];
        todosBox.append(...todoList);
        saveData();
    }
}

function updateCounter() {
    let todosQuantity = todoList.length;
    document.querySelector('.todo-bottom-box span').innerHTML = `${todosQuantity} items left`;
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
    saveData();
}

function removeTodo(todo) {
    let indexToRemove = todoList.indexOf(todo);
    todoList.splice(indexToRemove, 1);
    saveData();
    todo.classList.add('remove-amination');
    setTimeout(() => {
        todo.remove();
        updateCounter();
    }, 600);
}

document.querySelector('.clear-completed').onclick = clearAllCompleted;
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
        todo.style.display = '';
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