let todos = [
    { id: 1, title: 'Buy groceries', completed: true },
    { id: 2, title: 'Buy a new phone', completed: false },
    { id: 3, title: 'Buy a new car', completed: false },
    { id: 4, title: 'Buy a new house', completed: false }
];
export default function WorkingWithArrays(app) {
    const createNewTodo = (req, res) => {
        const newTodo = {
            id: new Date().getTime(),
            title: "New Task",
            completed: false,
        };
        todos.push(newTodo);
        res.json(todos);
    };
    const postNewTodo = (req, res) => {
        const newTodo = { ...req.body, id: new Date().getTime() };
        todos.push(newTodo);
        res.json(newTodo);
    };


    const getTodos = (req, res) => {
        const { completed } = req.query;
        if (completed !== undefined) {
            const completedBool = completed === "true";
            const completedTodos = todos.filter((t) => t.completed === completedBool);
            res.json(completedTodos);
            return;
        }
        res.json(todos);
    };
    const getTodoById = (req, res) => {
        const { id } = req.params;
        const todo = todos.find(todo => todo.id === parseInt(id));
        res.json(todo);
    };
    const removeTodo = (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) {
            res.status(404).json({ message: `Unable to remove Todo with ID ${id}` });
            return;
        }
        todos.splice(todoIndex, 1);
        res.json(todos);
    };
    const deleteTodo = (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) {
            res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
            return;
          }
      
        todos.splice(todoIndex, 1);
        res.sendStatus(200);
    };

    const updateTodoTitle = (req, res) => {
        const { id, title } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.title = title;
        res.json(todos);
    };
    const updateTodoCompleted = (req, res) => {
        const { id, completed } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.completed = completed;
        res.json(todos);
    };
    const updateTodoDescription = (req, res) => {
        const { id, description } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.description = description;
        res.json(todos);
    };
    const updateTodo = (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) {
          res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
          return;
        }
    
        todos = todos.map((t) => {
          if (t.id === parseInt(id)) {
            return { ...t, ...req.body };
          }
          return t;
        });
        res.sendStatus(200);
      };
      app.put("/lab5/todos/:id", updateTodo);
    app.delete("/lab5/todos/:id", deleteTodo);
    app.get("/lab5/todos/:id/delete", removeTodo);
    app.get('/lab5/todos', getTodos);
    app.get("/lab5/todos/create", createNewTodo);
    app.post("/lab5/todos", postNewTodo);
    app.get('/lab5/todos/:id', getTodoById);
    app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
    app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
    app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
}