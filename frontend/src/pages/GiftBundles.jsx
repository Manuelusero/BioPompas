import { useEffect, useState } from "react";
import "./Home.css"; // Import the correct CSS file for styling

const GiftBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gift-bundles")
      .then((res) => res.json())
      .then((data) => {
        setBundles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="gift-bundles-page">
      <h1 className="gift-bundles-title" style={{ marginTop: 24 }}>
        Gift Bundles
      </h1>
      <div className="gift-bundles-list">
        {bundles.map((bundle) => (
          <div className="gift-bundle-card" key={bundle._id}>
            <img src={bundle.image} alt={bundle.name} />
            <div className="gift-bundle-info">
              <div className="gift-bundle-name">{bundle.name}</div>
              <div className="gift-bundle-price">€{bundle.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftBundles;