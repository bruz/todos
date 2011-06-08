Todos = SC.Application.create({
  store: SC.Store.create({
    commitRecordsAutomatically: YES
  }).from('SC.LocalStorageDataSource')
});


Todos.Todo = SC.Record.extend({
  title: SC.Record.attr(String),
  isDone: SC.Record.attr(Boolean, { defaultValue: NO })
});

Todos.todosController = SC.ArrayProxy.create({
  content: [],

  createTodo: function(title) {
    Todos.store.createRecord(Todos.Todo, { title: title });
  },

  clearCompletedTodos: function() {
    this.filterProperty('isDone', true).forEach( function(item) {
      item.destroy();
    });
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  allAreDone: function(key, value) {
    if (value !== undefined) {
      this.setEach('isDone', value);

      return value;
    } else {
      return !!this.get('length') && this.everyProperty('isDone', true);
    }
  }.property('@each.isDone')
});

Todos.StatsView = SC.View.extend({
  remainingBinding: 'Todos.todosController.remaining',

  remainingString: function() {
    var remaining = this.get('remaining');
    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining')
});

Todos.CreateTodoView = SC.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.todosController.createTodo(value);
      this.set('value', '');
    }
  }
});

SC.$(document).ready(function() {
  var todos = Todos.store.find(Todos.Todo);
  Todos.todosController.set('content', todos);
});

