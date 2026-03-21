import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import WelcomePage from './pages/WelcomePage';
import UsersPage from './pages/UsersPage';
import GroupsPage from './pages/GroupsPage';

function App() {
    const layoutStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        color: '#1c1c1f'
    };

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '20px'
    };

    const linkStyle = {
        textDecoration: 'none',
        color: '#000',
        marginLeft: '25px',
        fontSize: '15px',
        fontWeight: '500',
        transition: 'color 0.3s'
    };

    const footerStyle = {
        padding: '20px 0',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'transparent',
        color: '#000',
        fontSize: '14px',
        marginTop: 'auto',
        width: '100%'
    };

    return (
        <Router>
            <Toaster position="top-center" />
            <div style={layoutStyle}>
                <nav style={navStyle}>
                    <div style={{ color: '#00cc7e', fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px' }}>
                        Safeboard <span style={{color: '#fff'}}></span>
                    </div>
                    <div>
                        <Link to="/" style={linkStyle} onMouseEnter={(e) => e.target.style.color = '#00cc7e'} onMouseLeave={(e) => e.target.style.color = '#000'}>ГЛАВНАЯ</Link>
                        <Link to="/users" style={linkStyle} onMouseEnter={(e) => e.target.style.color = '#00cc7e'} onMouseLeave={(e) => e.target.style.color = '#000'}>ПОЛЬЗОВАТЕЛИ</Link>
                        <Link to="/groups" style={linkStyle} onMouseEnter={(e) => e.target.style.color = '#00cc7e'} onMouseLeave={(e) => e.target.style.color = '#000'}>ГРУППЫ</Link>
                    </div>
                </nav>

                <main style={{ padding: '40px' }}>
                    <Routes>
                        <Route path="/" element={<WelcomePage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/groups" element={<GroupsPage />} />
                    </Routes>
                </main>

                <footer style={footerStyle}>
                    Тестовое задание
                </footer>
            </div>
        </Router>
    );
}

export default App;