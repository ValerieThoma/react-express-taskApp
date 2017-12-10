var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config');

var connection = mysql.createConnection(config);
connection.connect();

/* GET home page. */

router.post('/addTask', (req,res)=>{
	const taskName = req.body.taskName;
	const taskDate = req.body.taskDate;
	var thePromise = new Promise((resolve, reject)=>{
		const insertQuery = `INSERT INTO tasks (taskName, taskDate)
			VALUES (?,?);`;
		connection.query(insertQuery, [taskName, taskDate], (error)=>{
			if(error){
				reject(error);
			}else{
				resolve({msg:"success"});
			}
		})	
	})
	thePromise.then((promiseResponse)=>{
		const selectQuery = `SELECT taskName, DATE_FORMAT(taskDate, '%M %D\, %Y') as taskDate FROM tasks;`;
		connection.query(selectQuery, (error, results)=>{
			if (error){
				throw error;
			}else{
				res.json(results);
			}
		})	
	});
})

router.post('/deleteTask', function(req, res){
	const taskId = req.body.taskId;
	const deleteQuery = `DELETE FROM tasks WHERE id=?`;
	var promiseOne = new Promise((resolve, reject)=>{
		connection.query(deleteQuery, [taskId], (error, result)=>{
			if (error){
				reject(error)
			}else{
				resolve({msg: "Success"});
			}
		})
	})
	promiseOne.then((data)=>{
		const selectQuery = `SELECT * FROM tasks;`;
		const updateQuery = `ALTER TABLE tasks AUTO_INCREMENT = 1;`;
		connection.query(selectQuery, (error, results)=>{
			if (error){
				throw error
			}else{
				if (results.length === 0){
					connection.query(updateQuery)
				}
				res.json(results)
			}			
		})

	})
})

router.get('/getStudents', function(req, res, next) {
	const selectQuery = `SELECT * FROM students;`;
	connection.query(selectQuery,(error, results)=>{
		if (error){
			throw error;
		}else{
			res.json(results);
		}
	})
});

router.post('/addStudent', (req, res)=>{
	const studentName = req.body.studentName;
	var insertQuery = `INSERT INTO students (name)
		VALUES
		(?);`;
	var promiseOne = new Promise((resolve,reject)=>{
		connection.query(insertQuery, [studentName], (error)=>{
			if (error){
				reject(error);
			}else{
				resolve({msg:"Success"});
			}
		})
	});
	promiseOne.then((data)=>{
		var promiseTwo = new Promise((resolve, reject)=>{
			const query = `SELECT * FROM students;`;
			connection.query(query, (error, results)=>{
				if(error){
					reject(error);
				}else{
					resolve(results)
				}

			})
		});
		promiseTwo.then((studentsList)=>{
			res.json(studentsList)
		})
	});		
	// res.json(req.body);
});

module.exports = router;
