export const timelineEvents = [
  {
    id: 1,
    title: 'Class 12 Board Exams End',
    description: 'Focus on your preparation. Results expected in May.',
    startDate: '2025-03-15',
    endDate: '2025-03-15',
    type: 'exam',
    status: 'completed',
    applicableStates: ['all'],
    applicableStreams: ['all']
  },
  {
    id: 2,
    title: 'NEET / JEE Results & Counseling',
    description: 'Check your score and begin counseling registration for science streams.',
    startDate: '2025-05-20',
    endDate: '2025-06-10',
    type: 'counseling',
    status: 'completed',
    applicableStates: ['all'],
    applicableStreams: ['science']
  },
  {
    id: 3,
    title: 'Bihar State University Admissions Open',
    description: 'Apply online for B.A., B.Sc., B.Com. at government colleges. Documents required: Mark sheet, Aadhar, Photo.',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    type: 'admission',
    status: 'open',
    applicableStates: ['Bihar'],
    applicableStreams: ['all'],
    url: 'https://bceceboard.bihar.gov.in'
  },
  {
    id: 4,
    title: 'Uttar Pradesh CUET Registration',
    description: 'Common University Entrance Test for admission to central and state universities.',
    startDate: '2025-06-05',
    endDate: '2025-06-25',
    type: 'exam',
    status: 'open',
    applicableStates: ['Uttar Pradesh'],
    applicableStreams: ['all'],
    url: 'https://cuet.samarth.ac.in'
  },
  {
    id: 5,
    title: 'National Scholarship Portal (NSP) — Post-Matric',
    description: 'Apply for NSP post-matric scholarship. Income certificate required. For SC/ST/OBC/Minority students.',
    startDate: '2025-07-05',
    endDate: '2025-07-20',
    type: 'scholarship',
    status: 'upcoming',
    applicableStates: ['all'],
    applicableStreams: ['all'],
    url: 'https://scholarships.gov.in'
  },
  {
    id: 6,
    title: 'Bihar College Allotment Round 1',
    description: 'First round seat allotment. Accept your seat and pay admission fee online.',
    startDate: '2025-07-15',
    endDate: '2025-07-15',
    type: 'admission',
    status: 'upcoming',
    applicableStates: ['Bihar'],
    applicableStreams: ['all']
  },
  {
    id: 7,
    title: 'Rajasthan University Admissions',
    description: 'Online registration for undergraduate programs at Rajasthan state universities.',
    startDate: '2025-06-10',
    endDate: '2025-07-10',
    type: 'admission',
    status: 'open',
    applicableStates: ['Rajasthan'],
    applicableStreams: ['all']
  },
  {
    id: 8,
    title: 'Classes Begin — New Academic Year',
    description: 'Orientation week and registration for your chosen government college.',
    startDate: '2025-08-01',
    endDate: '2025-08-01',
    type: 'general',
    status: 'upcoming',
    applicableStates: ['all'],
    applicableStreams: ['all']
  },
  {
    id: 9,
    title: 'NMMS Scholarship Application',
    description: 'National Means-cum-Merit Scholarship for Class 11 students. Last date to apply.',
    startDate: '2025-09-15',
    endDate: '2025-09-15',
    type: 'scholarship',
    status: 'upcoming',
    applicableStates: ['all'],
    applicableStreams: ['all'],
    url: 'https://scholarships.gov.in'
  },
  {
    id: 10,
    title: 'Madhya Pradesh College Counseling',
    description: 'Online choice filling for government college admissions in MP.',
    startDate: '2025-06-20',
    endDate: '2025-07-05',
    type: 'counseling',
    status: 'open',
    applicableStates: ['Madhya Pradesh'],
    applicableStreams: ['all']
  }
];

// Helper to create a date object set to local midnight to prevent time/timezone issues
const parseLocalResult = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export function getPersonalizedTimeline(studentState, studentStream) {
  // 1. Get Today at 00:00:00 Local Time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return timelineEvents
    .filter(event => {
      const stateMatch = event.applicableStates.includes('all') || 
                         event.applicableStates.includes(studentState);
      
      const streamMatch = event.applicableStreams.includes('all') || 
                          event.applicableStreams.includes(studentStream);
      
      return stateMatch && streamMatch;
    })
    .map(event => {
      // 2. Parse Event Dates to 00:00:00 Local Time
      const startDate = parseLocalResult(event.startDate);
      const endDate = parseLocalResult(event.endDate);
      
      let status = event.status;
      
      // 3. Logic uses consistent midnight-to-midnight comparison
      if (endDate < today) {
        status = 'completed';
      } else if (startDate <= today && endDate >= today) {
        status = 'open';
      } else if (startDate > today) {
        status = 'upcoming';
      }
      
      // Calculate days remaining
      let daysRemaining = null;
      if (status === 'open') {
        daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      } else if (status === 'upcoming') {
        daysRemaining = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
      }
      
      return { ...event, status, daysRemaining };
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
}