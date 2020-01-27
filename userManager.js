const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path')
const createCsvWriter = require('csv-writer')
  .createObjectCsvWriter;
const csv = require('csv-parser');
const data = [];

const port = process.env.PORT || 8080;

let num = 0

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', (req, res) => {
  res.render('index')
})

app.post('/user', (req, res) => {
  if (req.body.button === 'edit') {
    data.forEach(user => {
      if(user.userId === req.body.userId) {
        user.userId= req.body.userId;
        user.userName= req.body.userName;
        user.name= req.body.name;
        user.email= req.body.email;
        user.age= req.body.age;
      }
    })
    // data[Number(req.body.userId)] = {userId: req.body.userId, userName: req.body.userName, name: req.body.name, email: req.body.email, age: req.body.age};
  }
  else if(req.body.button === 'delete') {
    data.forEach((user, index, arr) => {
      if (user.userId === req.body.userId) {
        arr.splice(index, 1)
      }
    })
    // data.splice(Number(req.body.userId), 1)
  }
  else {
    let userId = num.toString();
    let csvRecord = {userId, userName: req.body.userName, name: req.body.name, email: req.body.email, age: req.body.age};
    data.push(csvRecord)
    num++

  }

  const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      {id: 'userId', title: 'userId'},
      {id: 'userName', title: 'userName'},
      {id: 'name', title: 'name'},
      {id: 'email', title: 'email'},
      {id: 'age', title: 'age'}
    ]
  });

  csvWriter
    .writeRecords(data)
    .then(() => console.log('CSV file completed'));

  res.render('userListing', {
    dataSet: data
  })

});

app.get('/user', (req, res) => {
  res.render('userListing', {
    dataSet: data
  })
});


app.get('/edit/:userId', (req, res) => {
  let dataSet = data.filter(d => d['userId'] === req.params.userId)
  res.render('edit', {
    userId: req.params.userId,
    userName: dataSet[0].userName,
    name: dataSet[0].name,
    email: dataSet[0].email,
    age: dataSet[0].age
  })
})


app.listen(port, () => {
  console.log("listening to port " +port)
});


