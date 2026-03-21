import { useState, useEffect } from 'react';

export default function GroupsPage() {
    const [groupsData, setGroupsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        const fetchAndProcessGroups = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users');
                const usersFromApi = await response.json();


                setAllUsers(usersFromApi);

                // Логика группировки
                const groupCounts = usersFromApi.reduce((acc, user) => {
                    const groupName = user.group || 'Unmanaged';
                    acc[groupName] = (acc[groupName] || 0) + 1;
                    return acc;
                }, {});

                const formattedGroups = Object.entries(groupCounts).map(([name, count]) => ({
                    name, count
                }));

                setGroupsData(formattedGroups);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchAndProcessGroups();
    }, []);


    const cardStyle = {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid #19e19e',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        transition: 'border-color 0.3s',
    };

    const badgeStyle = {
        backgroundColor: 'rgba(0, 204, 126, 0.1)',
        color: '#00cc7e',
        padding: '6px 14px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '13px',
        border: '1px solid rgba(0, 204, 126, 0.3)'
    };

    const viewButtonStyle = {
        marginTop: '15px',
        padding: '10px 20px',
        backgroundColor: 'transparent',
        color: '#00cc7e',
        border: '1px solid #00cc7e',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: '0.3s'
    };

    const modalBackdropStyle = {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
    };

    const modalContentStyle = {
        backgroundColor: '#1c1c1f',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid #2d2d30',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflowY: 'auto'
    };

    if (loading) return <div style={{ color: '#888', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ color: '#000', fontSize: '28px', marginBottom: '30px' }}>Группы</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {groupsData.map((group, index) => (
                    <div key={index} style={cardStyle}>
                        <h3 style={{ margin: 0, color: '#000' }}>{group.name}</h3>
                        <div style={badgeStyle}>Сотрудников: {group.count}</div>

                        <button
                            style={viewButtonStyle}
                            onClick={() => setSelectedGroup(group.name)}
                        >
                            Посмотреть список
                        </button>
                    </div>
                ))}
            </div>

            {/* Модальное окно */}
            {selectedGroup && (
                <div style={modalBackdropStyle} onClick={() => setSelectedGroup(null)}>
                    <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                            <h3 style={{ color: '#00cc7e', margin: 0 }}>Состав группы: {selectedGroup}</h3>
                            <button
                                onClick={() => setSelectedGroup(null)}
                                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '24px' }}
                            >
                                &times;
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {allUsers
                                .filter(user => user.group === selectedGroup)
                                .map((user, idx) => (
                                    <div key={idx} style={{ paddingBottom: '12px', borderBottom: '1px solid #2d2d30' }}>
                                        <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>
                                            {user.name}
                                        </div>
                                        <div style={{ color: '#888', fontSize: '13px', fontFamily: 'monospace' }}>
                                            {user.email}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}