import React, { useState } from 'react';
import { useInventory, StockItem } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Boxes, 
  Plus, 
  Search, 
  MapPin, 
  Layers, 
  Edit3, 
  Trash2, 
  AlertCircle,
  X
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { companyInventory, addStockItem, updateStockItem, deleteStockItem } = useInventory();
  const { currentCompany } = useAuth();
  const { t } = useLanguage();

  const [searchFilter, setSearchFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [unit, setUnit] = useState('Units');
  const [locationTag, setLocationTag] = useState('');
  const [category, setCategory] = useState('Semiconductors');
  const [bomParent, setBomParent] = useState('');
  const [criticality, setCriticality] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setSku('');
    setQuantity(1000);
    setUnit('Units');
    setLocationTag(currentCompany.headquarters.split(',')[0] || 'Shenzhen');
    setCategory('Semiconductors');
    setBomParent('');
    setCriticality('medium');
    setIsModalOpen(true);
  };

  const openEditModal = (item: StockItem) => {
    setEditingItem(item);
    setName(item.name);
    setSku(item.sku);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setLocationTag(item.locationTag);
    setCategory(item.category);
    setBomParent(item.bomParent);
    setCriticality(item.criticality);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !locationTag.trim()) return;

    if (editingItem) {
      updateStockItem(editingItem.id, {
        name,
        sku,
        quantity,
        unit,
        locationTag,
        category,
        bomParent,
        criticality
      });
    } else {
      addStockItem({
        name,
        sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        quantity,
        unit,
        locationTag,
        category,
        bomParent: bomParent || 'Standalone Product',
        criticality
      });
    }
    setIsModalOpen(false);
  };

  const filteredItems = companyInventory.filter((item) => {
    const q = searchFilter.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.locationTag.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel glass-panel-glow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: currentCompany.logoColor || '#00f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Boxes size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {currentCompany.name} — {t('companyInventory')}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Manage physical warehouse stock, location tags, SKUs, and BOM parent linkages.
            </p>
          </div>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          {t('addStock')}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.8rem' }}
            placeholder="Search company inventory by Name, SKU, Location Tag, or Category..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Table / Cards */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
          <AlertCircle size={40} style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }} />
          <h3>{t('noInventory')}</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Click "{t('addStock')}" above to add components and products with location tags.
          </p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>{t('itemName')}</th>
                  <th style={{ padding: '1rem' }}>{t('sku')}</th>
                  <th style={{ padding: '1rem' }}>{t('quantity')}</th>
                  <th style={{ padding: '1rem' }}>{t('locationTag')}</th>
                  <th style={{ padding: '1rem' }}>{t('category')}</th>
                  <th style={{ padding: '1rem' }}>{t('bomParent')}</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                      <div style={{ color: 'var(--text-main)' }}>{item.name}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="font-mono" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                        {item.sku}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {item.quantity.toLocaleString()} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>{item.unit}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#60a5fa' }}>
                        <MapPin size={14} />
                        {item.locationTag}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-info">{item.category}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Layers size={14} style={{ color: 'var(--accent-purple)' }} />
                        {item.bomParent}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(item)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteStockItem(item.id)}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                {editingItem ? t('editStock') : t('addStock')} ({currentCompany.code})
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">{t('itemName')} *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. 32-Bit Microcontrollers (MCU-550)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('sku')}</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    placeholder="e.g. MCU-APX-8840"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('quantity')} *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('unit')}</label>
                  <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="Units">Units</option>
                    <option value="Containers">Containers</option>
                    <option value="Tons">Tons</option>
                    <option value="Pallets">Pallets</option>
                    <option value="Barrels">Barrels</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('locationTag')} *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Shenzhen, Rotterdam, Tokyo..."
                    value={locationTag}
                    onChange={(e) => setLocationTag(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('category')}</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Semiconductors">Semiconductors</option>
                    <option value="Energy Storage">Energy Storage</option>
                    <option value="Sensors">Sensors</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Shipping Assets">Shipping Assets</option>
                    <option value="Cold Chain">Cold Chain</option>
                    <option value="Medical">Medical</option>
                    <option value="Raw Materials">Raw Materials</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('bomParent')}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. EV Battery Management Unit"
                    value={bomParent}
                    onChange={(e) => setBomParent(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Stock Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
