import React, { useState, useMemo } from 'react';
import './AttireSelector.css';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const ATTIRES = [
  { 
    id: 'none', 
    labelKey: 'attireNone', 
    category: 'all',
    emoji: '👕', 
    descEn: 'Keep original clothing', 
    descHi: 'मूल कपड़े रखें' 
  },
  { 
    id: 'male_suit', 
    labelKey: 'attireMaleSuit', 
    category: 'male',
    emoji: '👔', 
    descEn: 'Formal suit & tie', 
    descHi: 'औपचारिक सूट और टाई' 
  },
  { 
    id: 'female_blazer', 
    labelKey: 'attireFemaleBlazer', 
    category: 'female',
    emoji: '🧥', 
    descEn: 'Navy blazer & blouse', 
    descHi: 'नेवी ब्लेज़र और ब्लाउज़' 
  },
  { 
    id: 'male_bowtie', 
    labelKey: 'attireMaleBowtie', 
    category: 'male',
    emoji: '🤵', 
    descEn: 'Tuxedo & bowtie', 
    descHi: 'टक्सीडो और बो टाई' 
  },
  { 
    id: 'formal_shirt', 
    labelKey: 'attireFormalShirt', 
    category: 'formal',
    emoji: '👔', 
    descEn: 'White formal collared shirt', 
    descHi: 'सफेद फॉर्मल कॉलर वाली कमीज' 
  },
];

function AttireSelector({ selected = 'none', onChange }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('all');

  const filteredAttires = useMemo(() => {
    if (activeTab === 'all') return ATTIRES;
    return ATTIRES.filter((a) => a.category === activeTab || a.id === 'none');
  }, [activeTab]);

  return (
    <div className="attire-selector">
      <div className="attire-selector__header">
        <h3 className="attire-selector__title">{t.formalAttire}</h3>
        <p className="attire-selector__subtitle">{t.formalAttireSubtitle}</p>
      </div>

      <div className="attire-selector__tabs" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {['all', 'male', 'female', 'formal'].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveTab(category)}
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              background: activeTab === category ? '#3b82f6' : 'transparent',
              color: activeTab === category ? '#ffffff' : '#64748b',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="attire-selector__grid" role="radiogroup" aria-label={t.formalAttire}>
        {filteredAttires.map(({ id, labelKey, emoji, descEn, descHi }) => {
          const isActive = selected === id;
          const desc = language === 'hi' ? descHi : descEn;
          return (
            <button
              key={id}
              className={`attire-card ${isActive ? 'attire-card--active' : ''}`}
              onClick={() => onChange && onChange(id)}
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              title={t[labelKey]}
            >
              <div className="attire-card__icon">{emoji}</div>
              <div className="attire-card__content">
                <span className="attire-card__label">{t[labelKey]}</span>
                <span className="attire-card__desc">{desc}</span>
              </div>
              {isActive && (
                <div className="attire-card__badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AttireSelector;
