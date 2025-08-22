import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './ServiceSidebar.css';

function ServiceSidebar({ onSelectCenter }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Service Centers');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    axios.get('http://localhost:5000/api/vendors')
      .then(res => {
        if (!mounted) return;
        setVendors(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        if (!mounted) return;
        setError('Failed to load centers');
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = vendors;
    // For now both tabs show same vendors; can filter by type later
    return base.filter(v =>
      (v.name || '').toLowerCase().includes(term) ||
      (v.address || '').toLowerCase().includes(term)
    );
  }, [vendors, search, activeTab]);

  return (
    <div className="service-sidebar">
      <h3 className="service-sidebar-title">Centers</h3>
      <div className="service-sidebar-tabs">
        {['Service Centers', 'Repair Centers'].map(tab => (
          <button
            key={tab}
            className={`service-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="service-search">
        <input
          type="text"
          placeholder="Search by name or address"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="service-list">
        {loading && <div className="sidebar-message">Loading centers…</div>}
        {error && <div className="sidebar-error">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="sidebar-message">No centers found</div>
        )}
        {!loading && !error && filtered.map(center => (
          <button
            key={center._id}
            className="service-list-item"
            onClick={() => onSelectCenter && onSelectCenter(center)}
            type="button"
          >
            <div className="service-avatar" aria-hidden>
              {(center.name || '?').slice(0,1).toUpperCase()}
            </div>
            <div className="service-item-text">
              <div className="service-item-name">{center.name || 'Unknown Center'}</div>
              {center.address && (
                <div className="service-item-address">{center.address}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ServiceSidebar;