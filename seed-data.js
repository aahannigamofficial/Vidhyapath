import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2').then(({ createClient }) => {
const supabase = createClient(
  'https://mfokcfmemcpkqocirvez.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mb2tjZm1lbWNwa3FvY2lydmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjM3NTEsImV4cCI6MjA4Njg5OTc1MX0.dnLE_5-I1gopAaz2Tt1IGlmTcwtwiJ-N7XeAZoVyMcU'
);

const states = ['Bihar', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Chhattisgarh', 'Maharashtra', 'Odisha'];
const districts = {
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg', 'Korba'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri']
};

const streams = ['science', 'commerce', 'arts', 'vocational'];
const names = [
  'Rahul Kumar', 'Priya Singh', 'Amit Sharma', 'Neha Patel', 'Ravi Verma',
  'Sneha Gupta', 'Vikram Singh', 'Anjali Yadav', 'Deepak Kumar', 'Pooja Jain',
  'Suresh Reddy', 'Kavita Sharma', 'Rajesh Kumar', 'Meena Devi', 'Arun Kumar',
  'Sunita Singh', 'Manoj Gupta', 'Rekha Rani', 'Sanjay Kumar', 'Geeta Devi',
  'Ramesh Singh', 'Suman Kumari', 'Pankaj Kumar', 'Asha Singh', 'Dinesh Kumar',
  'Pushpa Devi', 'Ajay Singh', 'Sangeeta Kumari', 'Vijay Kumar', 'Savita Devi',
  'Mohan Lal', 'Radha Rani', 'Gopal Singh', 'Kiran Kumari', 'Shyam Kumar',
  'Lata Devi', 'Prakash Singh', 'Usha Rani', 'Raju Kumar', 'Kamala Devi',
  'Krishna Singh', 'Parvati Kumari', 'Ram Kumar', 'Saraswati Devi', 'Shiv Kumar',
  'Lakshmi Rani', 'Hari Singh', 'Durga Devi', 'Ganesh Kumar', 'Kali Kumari'
];

async function seedDatabase() {
  console.log('🌱 Starting to seed database...');

  const students = [];

  for (let i = 0; i < 50; i++) {
    const state = states[Math.floor(Math.random() * states.length)];
    const district = districts[state][Math.floor(Math.random() * districts[state].length)];
    const stream = streams[Math.floor(Math.random() * streams.length)];
    const name = names[i % names.length];
    
    // Generate realistic scores
    const scores = {
      science: Math.floor(Math.random() * 40) + 20,
      commerce: Math.floor(Math.random() * 40) + 20,
      arts: Math.floor(Math.random() * 40) + 20,
      vocational: Math.floor(Math.random() * 40) + 20
    };
    
    // Make the chosen stream have highest score
    scores[stream] = Math.floor(Math.random() * 30) + 70;

    const student = {
      full_name: name,
      mobile: `98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      current_class: 'Class 12',
      state: state,
      district: district,
      language: 'English',
      stream: stream,
      aptitude_score: {
        topStream: stream,
        scores: scores
      },
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date in last 30 days
    };

    students.push(student);
  }

  // Insert in batches
  const { data, error } = await supabase
    .from('students')
    .insert(students);

  if (error) {
    console.error('❌ Error seeding database:', error);
  } else {
    console.log('✅ Successfully added 50 demo students!');
    console.log('📊 Analytics should now show diverse data');
  }
}

seedDatabase();});