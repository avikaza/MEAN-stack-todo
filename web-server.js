var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
var User;
var Todo;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function callback(){
        var UserSchema = mongoose.Schema({
            user_email : { type : String, index : {unique : true} },
            password : {type: String},
            profile : {
                name : {
                 first: String,
                last:  String
                },
        role : { type: String, validate: /(Admin|Normal)/, default : "Normal"}
     }
});
User = db.model('users', UserSchema);

var TodoSchema = mongoose.Schema({ user_id: { type: String, index : {unique:false}},
    task: String,
    task_description: String,
    priority: Number,
    due_date: Date,
    complete: Boolean,
    last_update: Date
});
Todo = db.model('todos', TodoSchema);
console.log("db connection successful");
});

//config
app.configure(function () {
    app.set('views', __dirname + '/app');
    app.engine('html', require('ejs').renderFile);
    app.use(express.static(__dirname + '/app'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});


// routes
app.get('/', function (request, response) {
    response.render('index.html');
});
app.get('partials/:name', function (request, response) {
    var name = request.params.name;
    response.render('partials/' + name);
});


// API
app.get('/api/v1/authenticate/:userEmail/:password', function (request, response) {
    User.find({'user_email':request.params.userEmail, 'password': request.params.password}, function (err, user) {
        if (err) {response.send({status: 'fail', error:err});} else {
           if (user.length > 0) {
               console.log('login success');
               response.send({status:'win', user: user[0]});
           } else {
               console.log('login failed');
               response.send({status: 'fail'});
           }
        }
    });
});
app.post('/api/v1/user', function(request, response) {
    var newUser = new User(request.body);
    newUser.save(function(err, doc) {
        if(err) {response.send({status: 'fail', error:err, errorString:err.toString()});} else if(doc) {
            console.log('add user success');
            response.send({status:'win', user: doc});
        } else {
            response.send({status: 'fail', errorString:'save failed'});
        }
    });
});
app.get('/api/v1/todo/:userEmail/:password', function(request, response) {
    User.find({'user_email':request.params.userEmail, 'password': request.params.password}, function (err, user) {
        if (err) {response.send({status: 'fail', error:err});} else {
            if (user.length > 0) {
                Todo.find({user_id:user[0]._id},function(err, docs) {
                    if(err) {response.send({status: 'fail', error:err, errorString:err.toString()});} else if(docs) {
                        console.log('get Todos success');
                        response.send({status:'win', todos: docs});
                    } else {
                        response.send({status: 'fail', errorString:'save failed'});
                    }
                });
            }else {
                console.log('login failed');
                response.send({status: 'fail', errorString:'Credentials Missing'});
            }
        }
    });
});
app.post('/api/v1/todo/:userEmail/:password', function(request, response) {
    var newTodo = new Todo(request.body);
    User.find({'user_email':request.params.userEmail, 'password': request.params.password}, function (err, user) {
        if (err) {response.send({status: 'fail', error:err});} else {
            if (user.length > 0) {
                newTodo.save(function(err, doc) {
                    if(err) {response.send({status: 'fail', error:err, errorString:err.toString()});} else if(doc) {
                        console.log('add Todo success');
                        response.send({status:'win', todo: doc});
                    } else {
                        response.send({status: 'fail', errorString:'save failed'});
                    }
                });
            }else {
                console.log('login failed');
                response.send({status: 'fail', errorString:'Credentials Missing'});
            }
        }
    });
});
app.put('/api/v1/todo/:userEmail/:password', function(request, response) {
    var updateTodo = new Todo(request.body);
    console.log(updateTodo._id);
    User.find({'user_email':request.params.userEmail, 'password': request.params.password}, function (err, user) {
        if (err) {response.send({status: 'fail', error:err});} else {
            if (user.length > 0) {
                Todo.update({_id:updateTodo._id}, {$set:{task: updateTodo.task,
                                                         task_description: updateTodo.task_description,
                                                         priority: updateTodo.priority,
                                                         due_date: updateTodo.due_date,
                                                         complete: updateTodo.complete,
                                                         last_update: new Date()}}, function(err) {
                    if(err) {response.send({status: 'fail', error:err, errorString:err.toString()});} else {
                        response.send({status: 'win'});
                    }
                });
            }else {
                console.log('login failed');
                response.send({status: 'fail', errorString:'Credentials Missing'});
            }
        }
    });
});
app.delete('/api/v1/todo/:userEmail/:password/:id', function(request, response) {
    console.log(request.params.id);
    User.find({'user_email':request.params.userEmail, 'password': request.params.password}, function (err, user) {
        if (err) {response.send({status: 'fail', error:err});} else {
            if (user.length > 0) {
                Todo.findOneAndRemove({_id:request.params.id}, function(err) {
                    if(err) {response.send({status: 'fail', error:err, errorString:err.toString()});} else {
                        response.send({status: 'win'});
                    }
                });
            }else {
                console.log('login failed');
                response.send({status: 'fail', errorString:'Credentials Missing'});
            }
        }
    });
});
// Start server
app.listen(3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});