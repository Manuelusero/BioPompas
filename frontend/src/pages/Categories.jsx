import './Categories.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/categories')
            .then(res => setCategories(res.data))
            .catch(() => setCategories([]));
    }, []);

    return (
        <div className="categoriesPage">
            <div className="categoriesHeader">
                <Link to="/home" className="categoriesBack"><span className="arrowIcon">&larr;</span></Link>
                <h2 className="categoriesTitle">CATEGORIES</h2>
                <img src="/src/assets/Icons/Cart.svg" alt="Carrito" className="categoriesCart" />
            </div>
            <div className="categoriesGrid">
                {categories.map(cat => (
                    <a href={cat.url} className="categoryCard" key={cat._id} style={{ position: 'relative' }}>
                        <img src={`http://localhost:5001${cat.image}`} alt={cat.name} />
                    </a>
                ))}
            </div>
            <nav className="bottom-navbar">
                <a href="/home" className="nav-icon" aria-label="Home">
                    <img src="/src/assets/Icons/HomeIcon.png" alt="Home" />
                </a>
                <a href="/search" className="nav-icon" aria-label="Search">
                    <img src="/src/assets/Icons/SearchIcon.png" alt="Search" />
                </a>
                <a href="/login" className="nav-icon" aria-label="Avatar">
                    <img src="/src/assets/Icons/AvatarIcon.png" alt="Avatar" />
                </a>
            </nav>
        </div>
    );
};

export default Categories;
