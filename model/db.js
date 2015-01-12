var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function callback(){
    var UserSchema = mongoose.Schema({
        user_email : { type : String, validate: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, index : { unique : true } },
        password : {type: String},
        profile : {
            name : {
                 first: String,
                last:  String
            },
            role: { type: String, validate: /(Admin|Normal)/, default : "Normal"}
        }
    });
    var User = db.model('users', UserSchema);
    mpdule.exports = User;
    /*var newUser = new User({user_email:'a@a.com', password:'admin',
                            profile: {name : {first: 'Avi', last: 'Kaza'}, role: "Admin"}});
    newUser.save(function(err) {
        if(err) throw err;
    });  */
    var TodoSchema = mongoose.Schema({ user_id: { type: String, index : {unique:false}},
                                       task: String,
                                       task_description: String,
                                       priority: Number,
                                       due_date: Date,
                                       complete: Boolean,
                                       last_update: Date
                                      });
    var Todo = db.model('todos', TodoSchema);
    console.log("db connection successful");
});
