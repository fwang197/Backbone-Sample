/**
 * 
 */

var app = {};

//Model for a single Todo item
app.Todo = Backbone.Model.extend({
	defaults: {
		title: '',
		completed: false
	},   
	toggle: function(){
		this.save({ completed: !this.get('completed')});
	}

});


//Model for the entire list
app.TodoList = Backbone.Collection.extend({
	model: app.Todo,
	localStorage: new Store("backbone-todo")
});
