/**
 * 
 */
//renders individual todo items list (li)
app.TodoView = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#item-template').html()),
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.fadeIn(400);
		this.input = this.$('.edit');
		return this; // enable chained calls
	},
	initialize: function(){
		this.model.on('change', this.render, this);    
		this.model.on('destroy', this.remove, this); // remove: Convenience Backbone'
	},
	events: {
		'dblclick label' : 'edit',
		'keypress .edit' : 'updateOnEnter',
		'blur .edit' : 'close',
		'click #toggle': 'toggleCompleted',
		'click .destroy': 'destroy'
	},
	edit: function(){
		this.$el.addClass('editing');
		this.input.focus();
	},
	close: function(){
		var value = this.input.val().trim();
		if(value) {
			this.model.save({title: value});
		}
		this.$el.removeClass('editing');
	},
	updateOnEnter: function(e){
		if(e.which == 13){
			this.close();
		}
	}, 
	toggleCompleted: function(){
		this.$el.toggleClass('line-trought');
		this.model.toggle();
	},
	destroy: function(){
		var self = this;
		this.$el.fadeOut(500,function(){
			self.model.destroy();
		});
	}    
});

app.todoList = new app.TodoList();

//renders the full list of todo items calling TodoView for each one.
app.AppView = Backbone.View.extend({
	el: '#todoapp',
	initialize: function () {
		this.input = this.$('#new-todo');
		app.todoList.on('add', this.addOne, this);
		app.todoList.on('reset', this.addAll, this);
		app.todoList.fetch(); // Loads list from local storage
	},
	events: {
		'keypress #new-todo': 'createTodoOnEnter',
		'click .add': 'createTodo'
	},
	createTodo: function(){
		if(!this.input.val().trim()){
			return;
		}
		app.todoList.create(this.newAttributes()),
		this.input.val('');
	},
	createTodoOnEnter: function(e){
		if ( e.which !== 13 || !this.input.val().trim() ) { // ENTER_KEY = 13
			return;
		}
		app.todoList.create(this.newAttributes());
		this.input.val(''); // clean input box
	},
	addOne: function(todo){
		var view = new app.TodoView({model: todo});
		$('#todo-list').append(view.render().el);
	},
	addAll: function(){
		this.$('#todo-list').html(''); // clean the todo list
		app.todoList.each(this.addOne, this);
	},
	newAttributes: function(){
		return {
			title: this.input.val().trim(),
			completed: false
		}
	}
});

app.appView = new app.AppView();