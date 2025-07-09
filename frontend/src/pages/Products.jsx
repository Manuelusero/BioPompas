import { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {

        axios.get("http://localhost:5001/api/products")
            .then(response => {
                console.log(response.data);
                setProducts(response.data);
            })
            .catch(error => {
                console.error("Error al obtener productos:", error);
            });


    }, []);

    return (
        <div>

            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Precio: ${product.price}</p>
                        <img src={`http://localhost:5001${product.image}`} alt={product.name} width="100" />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;
