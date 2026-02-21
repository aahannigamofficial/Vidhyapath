import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { colleges } from '../data/collegesData';

export default function CollegeDirectory({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [facilityFilters, setFacilityFilters] = useState({
    hasHostel: false,
    hasGirlsHostel: false,
    scholarshipAvailable: false,
    hasLab: false,
    hasInternet: false
  });
  const [sortBy, setSortBy] = useState('name');
  const [studentDistrict, setStudentDistrict] = useState(null);

  useEffect(() => {
    // Load student's district for distance sorting
    loadStudentDistrict();
  }, []);

  async function loadStudentDistrict() {
    const { data } = await supabase
      .from('students')
      .select('district')
      .eq('id', user.id)
      .single();
    
    if (data?.district) {
      setStudentDistrict(data.district);
    }
  }

  // Get unique states and programs for filters
  const states = ['all', ...new Set(colleges.map(c => c.state))];
  const programs = ['all', ...new Set(colleges.flatMap(c => c.programs))].sort();

  function toggleFacilityFilter(facility) {
    setFacilityFilters(prev => ({
      ...prev,
      [facility]: !prev[facility]
    }));
  }

  function clearAllFilters() {
    setSearchQuery('');
    setStateFilter('all');
    setProgramFilter('all');
    setFacilityFilters({
      hasHostel: false,
      hasGirlsHostel: false,
      scholarshipAvailable: false,
      hasLab: false,
      hasInternet: false
    });
    setSortBy('name');
  }

  // Filter colleges
  let filteredColleges = colleges.filter(college => {
    const matchesSearch = 
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = stateFilter === 'all' || college.state === stateFilter;
    
    const matchesProgram = programFilter === 'all' || college.programs.includes(programFilter);
    
    const matchesFacilities = 
      (!facilityFilters.hasHostel || college.hasHostel) &&
      (!facilityFilters.hasGirlsHostel || college.hasGirlsHostel) &&
      (!facilityFilters.scholarshipAvailable || college.scholarshipAvailable) &&
      (!facilityFilters.hasLab || college.hasLab) &&
      (!facilityFilters.hasInternet || college.hasInternet);
    
    return matchesSearch && matchesState && matchesProgram && matchesFacilities;
  });

  // Sort colleges
  if (sortBy === 'name') {
    filteredColleges.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'seats') {
    filteredColleges.sort((a, b) => b.totalSeats - a.totalSeats);
  } else if (sortBy === 'cutoff') {
    filteredColleges.sort((a, b) => a.cutoffPercentage - b.cutoffPercentage);
  } else if (sortBy === 'distance' && studentDistrict) {
    // Simple distance: same district = top, then sort by name
    filteredColleges.sort((a, b) => {
      const aIsLocal = a.district === studentDistrict;
      const bIsLocal = b.district === studentDistrict;
      if (aIsLocal && !bIsLocal) return -1;
      if (!aIsLocal && bIsLocal) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  const activeFilterCount = 
    (stateFilter !== 'all' ? 1 : 0) +
    (programFilter !== 'all' ? 1 : 0) +
    Object.values(facilityFilters).filter(Boolean).length;

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

        {/* Search Bar */}
        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 12,
          border: '1px solid #e2d9c8',
          marginBottom: 16
        }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: '#0f1923' }}>
            🔍 Search colleges
          </label>
          <input
            type="text"
            placeholder="Search by name or district..."
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

        {/* Filters */}
        <div style={{
          background: 'white',
          padding: 24,
          borderRadius: 12,
          border: '1px solid #e2d9c8',
          marginBottom: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f1923' }}>
              🎛️ Filters {activeFilterCount > 0 && `(${activeFilterCount} active)`}
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  color: '#f97316',
                  border: '1px solid #f97316',
                  borderRadius: 6,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear All
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* State Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: '#6b7280' }}>
                State
              </label>
              <select
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  fontSize: '0.9rem',
                  border: '2px solid #e2d9c8',
                  borderRadius: 8,
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

            {/* Program Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: '#6b7280' }}>
                Program
              </label>
              <select
                value={programFilter}
                onChange={e => setProgramFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  fontSize: '0.9rem',
                  border: '2px solid #e2d9c8',
                  borderRadius: 8,
                  outline: 'none',
                  background: 'white'
                }}
              >
                {programs.map(program => (
                  <option key={program} value={program}>
                    {program === 'all' ? 'All Programs' : program}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: '#6b7280' }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  fontSize: '0.9rem',
                  border: '2px solid #e2d9c8',
                  borderRadius: 8,
                  outline: 'none',
                  background: 'white'
                }}
              >
                <option value="name">Name (A-Z)</option>
                <option value="seats">Most Seats</option>
                <option value="cutoff">Lowest Cutoff</option>
                {studentDistrict && <option value="distance">Nearest First</option>}
              </select>
            </div>
          </div>

          {/* Facility Filters */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 8, color: '#6b7280' }}>
              Facilities
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { key: 'hasHostel', label: 'Hostel' },
                { key: 'hasGirlsHostel', label: 'Girls Hostel' },
                { key: 'scholarshipAvailable', label: 'Scholarship' },
                { key: 'hasLab', label: 'Lab' },
                { key: 'hasInternet', label: 'Internet' }
              ].map(facility => (
                <button
                  key={facility.key}
                  onClick={() => toggleFacilityFilter(facility.key)}
                  style={{
                    padding: '8px 14px',
                    background: facilityFilters[facility.key] ? '#f97316' : 'white',
                    color: facilityFilters[facility.key] ? 'white' : '#6b7280',
                    border: `2px solid ${facilityFilters[facility.key] ? '#f97316' : '#e2d9c8'}`,
                    borderRadius: 8,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {facilityFilters[facility.key] ? '✓ ' : ''}{facility.label}
                </button>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 16 }}>
            Showing <strong>{filteredColleges.length}</strong> college{filteredColleges.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* College Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 20
        }}>
          {filteredColleges.map(college => {
            const isLocal = college.district === studentDistrict;
            
            return (
              <div
                key={college.id}
                style={{
                  background: 'white',
                  borderRadius: 16,
                  border: `2px solid ${isLocal ? '#f97316' : '#e2d9c8'}`,
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  position: 'relative'
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
                {isLocal && (
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: '#f97316',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: 100,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    zIndex: 1
                  }}>
                    📍 Nearby
                  </div>
                )}

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
                        background: programFilter === program ? '#bbf7d0' : '#f3f4f6',
                        color: programFilter === program ? '#166534' : '#6b7280',
                        border: `1.5px solid ${programFilter === program ? '#86efac' : '#e5e7eb'}`,
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
            );
          })}
        </div>

        {filteredColleges.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 60,
            background: 'white',
            borderRadius: 16,
            border: '1px solid #e2d9c8'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: 12 }}>
              No colleges found matching your filters
            </p>
            <button
              onClick={clearAllFilters}
              style={{
                padding: '10px 20px',
                background: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}