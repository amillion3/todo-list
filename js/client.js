var todoList = {
  todos: [],
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
  },
  changeTodo: function(position, todoText) {
    this.todos[position].todoText = todoText;
  },
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
  },
  toggleCompleted: function(position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
  },
  toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = 0;

    // Get number of completed todos.
    this.todos.forEach(function(todo) {
      if(todo.completed === true){
        completedTodos++;
      }
    });

    this.todos.forEach(function(todo) {
      if(completedTodos === totalTodos){
        todo.completed = false;
      } else {
        todo.completed = true;
      }
    });
  }
};

var handlers = {  //Object to handle events
  addTodo: function() {
    var addTodoTextInput = document.getElementById('addTodoTextInput');
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = '';
    view.displayTodos();
  },
  changeTodo: function(position) {  //change one 'to do' at a time
    todoList.toggleCompleted(position);
    view.displayTodos();
    console.log(position); //for testing purposes
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodos();
  },
  toggleCompleted: function() {  //toggles all 'to do' items at once
    var toggleCompletedPositionInput = document.getElementById('toggleCompletedPositionInput');
    todoList.toggleCompleted(toggleCompletedPositionInput.valueAsNumber);
    toggleCompletedPositionInput.value = '';
    view.displayTodos();
  },
  toggleAll: function() {  //calls a function to change all 'to do' items at once
    todoList.toggleAll();
    view.displayTodos();
  }
};

var view = {
  displayTodos: function() {
    var todosUl = document.querySelector('ul');
    todosUl.innerHTML = '';

    todoList.todos.forEach(function(todo, position){
      var todoLi = document.createElement('li');
      todoLi.className = 'list-group-item listItems';
      var todoTextWithCompletion = '';

      if (todo.completed === true) {
        todoTextWithCompletion = ' ' + todo.todoText + ' ';  // Items ARE crossed off on the list
        todoLi.className = 'list-group-item listItems listBackground offsetBorder strikethrough';
      } else {
        todoTextWithCompletion = ' ' + todo.todoText + ' ';  // Items are NOT crossed off on the list
        todoLi.className = 'list-group-item listItems listBackground offsetBorder noStrikethrough';
      }

      todoLi.id = position;
      todoLi.textContent = todoTextWithCompletion;
      todoLi.appendChild(this.createDeleteButton());
      todoLi.insertBefore(this.createCheckButton(position),todoLi.childNodes[0]);
      todoLi.appendChild(this.createCheckButtonLabel(position));
      todosUl.appendChild(todoLi);
    }, this);
  },
  //event delegation
  createDeleteButton: function() {  //method to create a delete button for each <li> item
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton btn btn-sm btn-danger buttonDeleteFontInfo';
    return deleteButton;
  },

  createCheckButton: function(position) {  //checkbox
    var todoLiCheckBox = document.createElement('input');  //I tried document.insertBefore('input',null) & Node, with no luck
    todoLiCheckBox.checked = false;
    todoLiCheckBox.type = 'checkbox';
    todoLiCheckBox.className = '';
    todoLiCheckBox.name = 'checkbox' + position;  // .name equals checkbox plus the position of the 'to do'
    return todoLiCheckBox;
  },
  createCheckButtonLabel: function(position) {  //label for the checkbox
    var todoLiCheckBoxLabel = document.createElement('label');
    todoLiCheckBoxLabel.htmlFor = 'checkbox' + position;  // .name equals checkbox plus the position of the 'to do'
    todoLiCheckBoxLabel.className = '';
    return todoLiCheckBoxLabel;
  },

  setupEventListeners: function() {
    var todosUl = document.querySelector('ul');

    todosUl.addEventListener('click', function(event) {
      //get the element that was clicked on
      var elementClicked = event.target;
      debugger;
      console.log("This type of element was clicked: " + elementClicked);
      //check if element clicked is a delete button
      if(elementClicked.className === 'deleteButton btn btn-sm btn-danger buttonDeleteFontInfo'){  //delete button clicked, seems super clunky though. refactor?
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
      } else if (elementClicked.type === 'checkbox') {  //checkbox clicked
        //ERROR follows below
        console.log('check this: ' + document.getElementById(elementClicked).checked); //This throws an error and won't run the changeTodo method
        //above line always returns "Uncaught TypeError: Cannot read property 'checked' of null at HTMLUListElement.<anonymous> (client.js:128)"
        //console.log('check this: ' + document.getElementById(elementClicked));  //This does not throw an error, but the checkbox won't Check/Uncheck, ever.
        //above line always returns "Uncaught TypeError: Cannot read property 'checked' of null at HTMLUListElement.<anonymous> (client.js:128)"

        document.getElementById(elementClicked.parentNode.id).checked = !document.getElementById(elementClicked.parentNode.id).checked;  //switches checkbox to the opposite upon click
        handlers.changeTodo(parseInt(elementClicked.parentNode.id));
        }
    });
  }
};
view.setupEventListeners();
