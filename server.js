const express = require('express');
const db = require('./data/db');


const port = 5555;
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
	res.send('hello from express');
})

server.post('/api/users', (req, res) => {
	const {name, bio} = req.body;
	if (!req.body.name || !req.body.bio){
		res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
	} else {
		db
		.insert({name, bio}).then(response => {
			res.status(201).json(response)
		})
		.catch(error => {
			console.log(error)
			res.status(500).json({ error: "There was an error while saving the user to the database" })
		})
	}
});


server.get('/api/users', (req, res) => {
	db
	.find()
	.then(users => {
		res.status(200).json({ users })
	})
	.catch(error => {
		console.log(error)
		res.status(500).json({ error: "The users information could not be retrieved." })
	});
})

server.get('/api/users/:id', (req, res) => {
	const id = req.params.id
	db
	.findById(id)
	.then(user => {
		if (!user[0]){
			res.status(404).json({ message: "The user with the specified ID does not exist." })
		} else {
			res.status(200).json({user})
		}
	})
	.catch(error => {
		console.log(error)
		res.status(500).json({ error: "The user information could not be retrieved." })
	})
})


server.put('/api/users/:id', (req, res) => {
	const id = req.params.id
	const {name, bio} = req.body;
	db
	.update(id, {name, bio})
	.then(user => {

		//0 for no user there at request link
		if (user === 0){
			res.status(404).json({ message: "The user with the specified ID does not exist." })
		}

		//1 for there is a user there at request link
		if (user === 1) {
			if (!req.body.name || !req.body.bio){
				res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' });
			} else {
				res.status(200).json(user);
			}
		}
	})
	.catch(error => {
		console.log(error);
		res.status(500).json({error: "The user information could not be retrieved." });
	});
})

server.delete('/api/users/:id', (req, res) => {
	const id = req.params.id
	db
	.remove(id)
	.then(user => {
		//0 for no user there at request link
		if (user === 0){
			res.status(404).json({ message: "The user with the specified ID does not exist." })
		}

		//1 for there is a user there at request link
		if (user === 1){
			res.json({user})
		}
	})
	.catch(error => {
		console.log(error)
		res.status(500).json({ error: "The user could not be removed" });
	});
})


server.listen(port, () => console.log(`server running on port ${port}`));
