export default function WelcomePage() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '60px',
            maxWidth: '1000px',
            margin: '60px auto',
            padding: '20px'
        }}>

            <div style={{
                width: '320px',
                height: '400px',
                backgroundColor: '#1a1a1a',
                borderRadius: '20px',
                border: '1px solid #00cc7e',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 204, 126, 0.15)',
                flexShrink: 0
            }}>
                <img
                    src="/my.jpg"
                    alt="Developer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => e.target.src = "https://via.placeholder.com/320x400/1a1a1a/00cc7e?text=YOUR+PHOTO"}
                />
            </div>

            <div style={{ flex: 1 }}>
                <h2 style={{ color: '#00cc7e', fontSize: '1.2rem', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    Frontend Developer
                </h2>
                <h1 style={{ color: '#000', fontSize: '3rem', margin: '0 0 20px 0', lineHeight: '1.1' }}>
                    {/* Вставь сюда свое имя */}
                    Климов Семён
                </h1>
                <p style={{ color: '#000', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '30px' }}>
                    Студент 1 курса РОСБИОТЕХ. Специализируюсь на создании современных
                    веб-интерфейсов. Данный проект — это реализация системы управления
                    пользователями для Safeboard.
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={tagStyle}>React</span>
                    <span style={tagStyle}>Node.js</span>
                    <span style={tagStyle}>JavaScript</span>
                </div>
            </div>
        </div>
    );
}

const tagStyle = {
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #19e19e',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#000',
    fontWeight: '500'
};