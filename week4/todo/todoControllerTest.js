import { TodoController }  from "./todo.js"
import { Suite }                from "../test/test.js";

const todoCtrlSuite = Suite("todoCtrl");

todoCtrlSuite.add("todo-ctrl", assert => {

	const todoController = TodoController();

	assert.is(todoController.numberOfTodos(), 0);
	assert.is(todoController.numberOfopenTasks(), 0);
	assert.is(todoController.openTasksRatio(), undefined);

	todoSuite.addTodo()
	todoSuite.run();
});
