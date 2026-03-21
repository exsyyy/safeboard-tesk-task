const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Начальные данные
let users = [
    { id: 1, name: "Olga Kalachikova", account: "company/Olya", email: "OlKalach@mail.com", group: "CEO", phone: "+7(456)123-45-66" },
    { id: 2, name: "Ivan Subotin", account: "company/Vanya", email: "IvSub@mail.com", group: "Managers", phone: "+7(456)789-00-11" },
    { id: 3, name: "Nikita Pupkin", account: "company/Nik", email: "NikPup@mail.com", group: "Unmanaged", phone: "+7(456)555-66-77" }
];

// Маршруты
app.get('/api/users', (req, res) => res.json(users));

app.post('/api/users', (req, res) => {
    const newUser = { id: Date.now(), ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    users = users.filter(user => user.id !== parseInt(id));
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Сервер: http://localhost:${PORT}`));