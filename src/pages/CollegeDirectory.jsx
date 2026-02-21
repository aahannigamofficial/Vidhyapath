import { useState } from 'react';
import { colleges } from '../data/collegesData';

export default function CollegeDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('all');

  // Get unique states for the filter
  const states = ['all', ...new Set(colleges.map(c => c.state))];

  // Filter colleges based on search and state
  const filteredColleges = colleges.filter(college => {
    const matchesSearch = 
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = stateFilter === 'all' || college.state === stateFilter;
    
    return matchesSearch && matchesState;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f3',
      padding: 32,
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f1923', marginBottom: 8 }}>
          🏫 Government College Directory
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: 32 }}>
          Explore {colleges.length} government colleges across India
        </p>

        {/* Search and Filters */}
        <div style={{
          background: 'white',
          padding: 24,
          borderRadius: 12,
          border: '1px solid #e2d9c8',
          marginBottom: 32
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: '#0f1923' }}>
                🔍 Search by name or district
              </label>
              <input
                type="text"
                placeholder="Search colleges..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  fontSize: '1rem',
                  border: '2px solid #e2d9c8',
                  borderRadius: 10,
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: '#0f1923' }}>
                📍 Filter by state
              </label>
              <select
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  fontSize: '1rem',
                  border: '2px solid #e2d9c8',
                  borderRadius: 10,
                  outline: 'none',
                  background: 'white'
                }}
              >
                {states.map(state => (
                  <option key={state} value={state}>
                    {state === 'all' ? 'All States' : state}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 16 }}>
            Showing {filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* College Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 20
        }}>
          {filteredColleges.map(college => (
            <div
              key={college.id}
              style={{
                background: 'white',
                borderRadius: 16,
                border: '1px solid #e2d9c8',
                overflow: 'hidden',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header */}
              <div style={{ padding: 24, borderBottom: '1px solid #e2d9c8' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    🏛️
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f1923', marginBottom: 4 }}>
                      {college.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                      📍 {college.district}, {college.state}
                    </p>
                  </div>
                </div>

                {/* Programs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {college.programs.map(program => (
                    <span key={program} style={{
                      padding: '4px 10px',
                      background: '#bbf7d0',
                      color: '#166534',
                      border: '1.5px solid #86efac',
                      borderRadius: 100,
                      fontSize: '0.72rem',
                      fontWeight: 600
                    }}>
                      {program}
                    </span>
                  ))}
                </div>

                {/* Facilities */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {college.hasHostel && (
                    <span style={{
                      padding: '4px 10px',
                      background: '#bae6fd',
                      color: '#0369a1',
                      border: '1.5px solid #7dd3fc',
                      borderRadius: 100,
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}>
                      Hostel
                    </span>
                  )}
                  {college.hasGirlsHostel && (
                    <span style={{
                      padding: '4px 10px',
                      background: '#ddd6fe',
                      color: '#7c3aed',
                      border: '1.5px solid #c4b5fd',
                      borderRadius: 100,
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}>
                      Girls Hostel
                    </span>
                  )}
                  {college.scholarshipAvailable && (
                    <span style={{
                      padding: '4px 10px',
                      background: '#fed7aa',
                      color: '#b45309',
                      border: '1.5px solid #fdba74',
                      borderRadius: 100,
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}>
                      Scholarship
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Stats */}
              <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, color: '#0f1923' }}>
                    {college.totalSeats}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Seats</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, color: '#0f1923' }}>
                    {college.cutoffPercentage}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Min %</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, color: '#0f1923' }}>
                    {college.establishedYear}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Est.</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            background: 'white',
            borderRadius: 16,
            border: '1px solid #e2d9c8'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
              No colleges found matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}