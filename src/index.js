import React, { Component } from 'react';
import { render } from 'react-dom';
import './index.css';

var ESCAPE_KEY = 27;
var ENTER_KEY = 13;

class TodoItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editText: this.props.todo.title
		};
	}

	handleChange(event) {
		if (this.props.editing) {
			this.setState({ editText: event.target.value });
		}
	}

	handleDelete() {
		this.props.handleDelete();
	}

	handleEdit(todo) {
		// onDoubleClick event handler
		this.props.onEdit(todo);
		this.setState({ editText: this.props.todo.title });
	}
	handleKeyDown(event) {
		if (event.which === ENTER_KEY) {
			this.handleSubmit(event);
		}
	}
	handleSubmit(event) {
		let value = event.target.value.trim();
		if (value) {
			this.props.onSave(value);
			this.setState({ editText: value });
		} else {
			this.props.delete();
		}
	}
	//(this.props.todo.completed) ? 'completed' : null
	//(this.props.editing) ? 'editing' : null
	render(props) {
		return (
			<li
				className={
					this.props.editing ? 'editing' : null 
					|| this.props.todo.completed ? 'completed' : null
				}>
				<div className="view">
					<input
						className="toggle"
						type="checkbox"
						checked={this.props.todo.completed}
						onChange={this.props.onToggle.bind(this)}
					/>
					<label onClick={this.handleEdit.bind(this)}>
						{this.props.todo.title}
					</label>

					<button className="destroy" onClick={this.handleDelete.bind(this)} />
				</div>
				<input
					className="edit"
					value={this.state.editText}
					onBlur={this.handleSubmit.bind(this)}
					onChange={this.handleChange.bind(this)}
					onKeyDown={this.handleKeyDown.bind(this)}
				/>
			</li>
		);
	}
}

const ALL = 'all';
let key = 0;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newTodo: '',
			todos: [],
			nowShowing: ALL,
			editing: null
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	addTodo(title) {
		this.setState({
			todos: this.state.todos.concat({
				title: title,
				completed: false
			})
		});
	}

	handleChange = e => {
		this.setState({ newTodo: e.target.value });
	};

	handleSubmit = e => {
		// add todo Item to array
		e.preventDefault(e);
		let val = this.state.newTodo.trim();
		if (val) {
			this.addTodo(val);
			this.setState({ newTodo: '' });
		}
	};

	edit(todo) {
		this.setState({ editing: todo });
	}
	extend() {
		var newObj = {};
		for (var i = 0; i < arguments.length; i++) {
			var obj = arguments[i];
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					newObj[key] = obj[key];
				}
			}
		}
		return newObj;
	}
	delete(todo) {
		// delete selected todo Item from array
		const newState = this.state.todos.slice();
		if (newState.indexOf(todo) > -1) {
			newState.splice(newState.indexOf(todo), 1);
			this.setState({ todos: newState });
		}
		// this.setState({
		// 	todos: this.state.todos.filter(function (candidate) {
		// 		return candidate !== todo;
		// 	})
		// });
	}

	save(todoToSave, text) {
		this.setState({
			todos: this.state.todos.map(function(todo) {
				return todo !== todoToSave
					? todo
					: this.extend({}, todo, { title: text });
			}, this)
		});
		this.setState({ editing: null });
	}
	toggle = todoToToggle => {
		this.setState({
			todos: this.state.todos.map(function(todo) {
				return todo !== todoToToggle
					? todo
					: this.extend({}, todo, { completed: !todo.completed });
			}, this)
		});
	};

	toggleAll(event) {
		this.setState({
			todos: this.state.todos.map(function(todo) {
				return this.extend({}, todo, { completed: event.target.checked });
			}, this)
		});
	}

	renderTodoItem(todo) {
		return (
			<TodoItem
				todo={todo}
				key={key++}
				onToggle={this.toggle.bind(this, todo)}
				handleDelete={this.delete.bind(this, todo)}
				onEdit={this.edit.bind(this, todo)}
				editing={this.state.editing === todo}
				onSave={this.save.bind(this, todo)}
				onCancel={this.cancel}
			/>
		);
	}

	render() {
		let todoItems = [];
		this.state.todos.map(todo => {
			let view = this.renderTodoItem(todo);
			if (!view) return;
			todoItems.push(view);
		}, this);

		return (
			<div className="todoapp">
				<header className="header">
					<h1>Todo List</h1>
					<form onSubmit={this.handleSubmit}>
						<input
							className="new-todo"
							type="text"
							placeholder="What needs to be done?"
							value={this.state.newTodo}
							onChange={this.handleChange}
						/>
					</form>
				</header>
				<section className="main">
					<input
						type="checkbox"
						className="toggle-all"
						onChange={this.toggleAll.bind(this)}
						checked={this.state.completed}
					/>
					<ul className="todo-list">{todoItems}</ul>
				</section>
			</div>
		);
	}
}

render(<App />, document.getElementById('root'));

// get rid of submit button 													DONE
// add a completed state and radiobox for each todo 	DONE
// delete button for each todo 												DONE
// edit by double clicking
// select all or toggle all as completed							DONE
// filter by completed
// footer showing how many completed & left to do
