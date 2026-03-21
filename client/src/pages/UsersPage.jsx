import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [formData, setFormData] = useState({ name: '', account: '', email: '', group: '', phone: '' });

    // Загрузка данных
    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/users');
            setUsers(await res.json());
        } catch (err) { console.error("Ошибка загрузки", err); }
    };

    useEffect(() => { fetchUsers(); }, []);


    // Уведомление о удалении
    const deleteUserWithConfirm = (id) => {
        toast((t) => (
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#fff' }}>Удалить сотрудника?</span>
            <button
                onClick={() => {
                    executeDelete(id); // Вызываем само удаление
                    toast.dismiss(t.id); // Закрываем уведомление
                }}
                style={{
                    background: '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                }}
            >
                Да
            </button>
            <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                    background: '#333',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                }}
            >
                Отмена
            </button>
        </span>
        ), {
            duration: 6000,
            style: {
                background: '#1c1c1f',
                border: '1px solid #2d2d30',
                padding: '12px',
                minWidth: '250px'
            },
        });
    };

// Логика удаления
    const executeDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
                toast.success("Удалено");
            }
        } catch (err) {
            toast.error("Ошибка при удалении");
        }
    };

    // Добавление
    const handleAddUser = async (e) => {
        e.preventDefault();

        // 1. Проверка на пустые поля
        const isFormValid = Object.values(formData).every(val => val && val.trim() !== '');
        if (!isFormValid) {
            toast.error("Заполните все поля!", {
                style: { background: '#1c1c1f', color: '#fff' }
            });
            return;
        }

        // Подготавливаем данные (убираем лишние пробелы)
        const newEmail = formData.email.trim().toLowerCase();
        const newAccount = formData.account.trim();
        const newPhone = formData.phone.trim();

        const emailExists = users.some(user => user.email.toLowerCase() === newEmail);
        if (emailExists) {
            toast.error(`Электронная почта ${newEmail} привязана к другому сотруднику`, {
                style: { background: '#1c1c1f', color: '#fff' }
            });
            return;
        }

        // Проверяем Аккаунт
        const accountExists = users.some(user => user.account === newAccount);
        if (accountExists) {
            // Ошибка дубликата аккаунта:
            toast.error(`Аккаунт ${newAccount} уже занят!`, {
                style: { background: '#1c1c1f', color: '#fff' }
            });
            return;
        }

        // Проверяем Телефон
        const phoneExists = users.some(user => user.phone === newPhone);
        if (phoneExists) {
            toast.error(`Номер телефона ${newPhone} закреплён за другим сотрудником`, {
                style: { background: '#1c1c1f', color: '#fff' }
            });
            return;
        }

        // Форматные проверки
        if (!newAccount.startsWith('company/')) {
            toast.error("Аккаунт должен начинаться с company/", {
                style: { background: '#1c1c1f', color: '#fff' }
            });
            return;
        }

        if (!newEmail.includes('@') || !newEmail.includes('.')) {
            toast.error("Неккоректный формат email", {
                style: { background: '#1c1c1f', color: '#fff' }
            });
            return;
        }

        const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(newPhone)) {
            toast.error("Формат телефона: +7(123)456-78-90", {
                style: { background: '#1c1c1f', color: '#fff' }
            });
            return;
        }

        // Отправка на сервер
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    email: newEmail,
                    phone: newPhone
                })
            });

            if (response.ok) {
                const addedUser = await response.json();

                // Обновляем список в таблице и очищаем форму
                setUsers([...users, addedUser]);
                toast.success("Сотрудник успешно добавлен!", {
                    style: {
                        background: '#ffffff',
                        color: '#1c1c1f',
                        border: '1px solid #00cc7e'
                    }
                });

                setFormData({
                    name: '',
                    account: '',
                    email: '',
                    group: '',
                    phone: ''
                });
            }

        } catch (error) {
            console.error("Критическая ошибка:", error);
            toast.error("Не удалось связаться с сервером.", {
                style: { background: '#1c1c1f', color: '#fff' }
            });
        }
    };
    // Логика сортировки
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Обработка данных (Поиск + Сортировка)
    const processedUsers = [...users]
        .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

    const formCardStyle = {
        backgroundColor: '#1c1c1f',
        padding: '25px',
        borderRadius: '16px',
        border: '1px solid #2d2d30',
        marginBottom: '30px'
    };


    const inputStyle = {
        padding: '14px',
        backgroundColor: '#ffffff',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#00000',
        outline: 'none',
        width: '100%',
        transition: 'border-color 0.3s'
    };
    const buttonStyle = {
        padding: '12px 24px',
        backgroundColor: '#19e19e',
        color: '#000',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: '0.3s'
    };


    const deleteButtonStyle = {
        backgroundColor: 'rgba(255, 77, 79, 0.1)', // Прозрачно-красный
        color: '#ff4d4f',
        border: '1px solid #ff4d4f',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px'
    };


    const thStyle = {
        padding: '18px 15px',
        textAlign: 'left',
        borderBottom: '1px solid #333',
        color: '#000', // Серый текст заголовка
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    };

    const tdStyle = {
        padding: '18px 15px',
        borderBottom: '1px solid #222',
        color: '#000',
        fontSize: '15px'
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '50px' }}>
            <h2 style={{ color: '#19e19e', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                Управление пользователями
            </h2>


            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <h3 style={{ marginTop: '0', color: '#000' }}>Добавить нового сотрудника</h3>
                <form onSubmit={handleAddUser} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <input placeholder="Имя" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={inputStyle} />
                    <input placeholder="Аккаунт" value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} style={inputStyle} />
                    <input placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
                    <input placeholder="Группа" value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} style={inputStyle} />
                    <input placeholder="Телефон" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
                    <button
                        type="submit"
                        className="add-btn"
                        style={buttonStyle}
                        onMouseDown={() => setIsAdding(true)}
                        onMouseUp={() => setIsAdding(false)}
                        onMouseLeave={() => setIsAdding(false)}
                    >
                        + Добавить
                    </button>
                </form>
            </div>


            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: '0', color: '#000' }}>Список сотрудников</h3>
                    <input
                        type="text"
                        placeholder="🔍 Поиск по имени или почте..."
                        style={{ ...inputStyle, width: '300px', margin: '0' }}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th style={thStyle} onClick={() => requestSort('name')}>
                            Имя {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={thStyle} onClick={() => requestSort('account')}>
                            Аккаунт {sortConfig.key === 'account' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={thStyle} onClick={() => requestSort('email')}>
                            Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={thStyle} onClick={() => requestSort('group')}>
                            Группа {sortConfig.key === 'group' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={thStyle} onClick={() => requestSort('phone')}>
                            Телефон {sortConfig.key === 'phone' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={{ ...thStyle, cursor: 'default', textAlign: 'center' }}>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {processedUsers.length > 0 ? processedUsers.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={tdStyle}>{user.name}</td>
                            <td style={tdStyle}>{user.account}</td>
                            <td style={tdStyle}>{user.email}</td>
                            <td style={tdStyle}>
                  <span style={{ backgroundColor: '#eff1e9', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>
                    {user.group}
                  </span>
                            </td>
                            <td style={tdStyle}>{user.phone}</td>
                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                <button onClick={() => deleteUserWithConfirm(user.id)} style={deleteButtonStyle}>
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Пользователи не найдены</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}