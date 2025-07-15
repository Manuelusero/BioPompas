import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CategoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/products/category/${category}`);
        setProducts(response.data);
      } catch (err) {
        setError('Error loading products' + (err?.response?.data?.error ? ': ' + err.response.data.error : ''));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading) return <div className="category-loading">Loading...</div>;
  if (error) return <div className="category-error">{error}</div>;

  return (
    <div className="category-page-container">
      <h2 className="category-title">{category} Products</h2>
      <div className="category-products-list">
        {products.length === 0 ? (
          <div className="category-no-products">No products found.</div>
        ) : (
          products.map(product => (
            <div className="category-product-card" key={product.id}>
              <img src={product.image || product.url} alt={product.name} className="category-product-image" />
              <div className="category-product-info">
                <h3>{product.name}</h3>
                <p>${product.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
