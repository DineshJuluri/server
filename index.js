const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formDataSchema = new Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    issueDate: { type: Date, required: true },
    domain: { type: String, required: true },
    imageFile: { type: String, required: true }
});

const FormData = mongoose.model('FormData', formDataSchema);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://skillintern06:bqXu6Op7pqfDWNTa@cluster0.i4prlpv.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
});

app.post('/data', (req, res) => {
    const data = req.body;
    const newFormData = new FormData({
        code: data.code,
        name: data.name,
        issueDate: data.issueDate,
        domain: data.domain,
        imageFile: data.imageFile
    });
    newFormData.save()
        .then(savedData => {
            console.log('Data saved to MongoDB:', savedData);
            res.status(200).send('Data saved successfully');
        })
        .catch(error => {
            console.error('Error saving data to MongoDB:', error);
            res.status(500).send('Error saving data to MongoDB');
        });
});

app.get('/data/:id', (req, res) => {
    const id = req.params.id;
    FormData.findOne({ code: id })
        .then(data => {
            if (!data) {
                return res.status(404).send('Data not found');
            }
            res.send(data);
        })
        .catch(error => {
            console.error('Error fetching data from MongoDB:', error);
            res.status(500).send('Error fetching data from MongoDB');
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
