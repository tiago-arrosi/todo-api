var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;

app.use(bodyParser.json());

var todos = [];

// var todos = [{
//   id: 1,
//   description: 'Meet mon for lunch',
//   completed: false
// }, {
//   id: 2,
//   description: 'Go to market',
//   completed: false
// }, {
//   id: 3,
//   description: 'Go to crossfit',
//   completed: true
// }];

app.get('/', function(req, res) {
  res.send('Todo API Root');
});

//GET /todos
app.get('/todos', function(req, res) {
  res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id:todoId});

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

// POST /todos
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }

  body.description = body.description.trim();

  body.id = todoNextId++;
  todos.push(body);

  res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id:todoId});

  if (matchedTodo) {
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  } else {
    res.status(404).json({"error":"no todo found with that id"});
  }
});

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, 'description', 'completed');
  var matchedTodo = _.findWhere(todos, {id:todoId});
  var validAttributes = {};

  if (!matchedTodo) {
    return res.status(404).json({"error":"no todo found with that id"});
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    res.status(400).json({"error": "completed must be a boolean value"})
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    res.status(400).json({"error": "description must be a string value"})
  }

  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);

});

app.listen(PORT, function() {
  console.log('Express listening on port ' + PORT + '!!');
});
