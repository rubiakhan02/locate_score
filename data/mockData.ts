
import { SectorData, UseCase } from '../types';

export const NOIDA_SECTORS: SectorData[] = [
  {
    id: 'sec-62',
    name: 'Sector 62',
    overallScore: 88,
    label: 'Excellent',
    summary: 'Sector 62 is a premier institutional and IT hub, offering a mature ecosystem for both residents and corporate professionals with top-tier connectivity.',
    breakdown: {
      connectivity: 95,
      healthcare: 85,
      education: 80,
      retail: 75,
      employment: 98,
    },
    infrastructure: [
      { name: 'Noida Sector 62 Station', category: 'Metro & Transport', importance: 'Blue Line Extension, connects directly to Delhi/CP', icon: '🚇' },
      { name: 'NH-24 (Delhi-Meerut Expressway)', category: 'Metro & Transport', importance: 'Major highway providing seamless access to Ghaziabad and Delhi', icon: '🛣️' },
      { name: 'Fortis Hospital', category: 'Healthcare', importance: 'Multi-speciality tertiary care hospital', icon: '🏥' },
      { name: 'Indus Valley Public School', category: 'Education', importance: 'Reputed K-12 educational institution', icon: '🏫' },
      { name: 'Stellar IT Park', category: 'Business & IT Hubs', importance: 'Houses major MNCs and tech giants', icon: '🏢' },
      { name: 'Indira Gandhi International Airport', category: 'Airport Access', importance: 'Primary international gateway accessible via DND/ORR', icon: '✈️' },
      { name: 'Ginger Mall', category: 'Malls & Entertainment', importance: 'Local retail hub with various F&B options', icon: '🛍️' },
    ]
  },
  {
    id: 'sec-18',
    name: 'Sector 18 (Atta Market)',
    overallScore: 92,
    label: 'Excellent',
    summary: 'The commercial heart of Noida, Sector 18 offers unparalleled retail and lifestyle experiences along with robust metro connectivity.',
    breakdown: {
      connectivity: 98,
      healthcare: 90,
      education: 70,
      retail: 100,
      employment: 80,
    },
    infrastructure: [
      { name: 'Noida Sector 18 Metro', category: 'Metro & Transport', importance: 'Blue Line, busiest commercial transit point', icon: '🚇' },
      { name: 'DLF Mall of India', category: 'Malls & Entertainment', importance: 'One of India\'s largest premium malls with IMAX and global brands', icon: '🛍️' },
      { name: 'The Great India Place', category: 'Malls & Entertainment', importance: 'Major shopping and amusement hub (Worlds of Wonder)', icon: '🎢' },
      { name: 'Max Hospital', category: 'Healthcare', importance: 'Speciality healthcare facility', icon: '🏥' },
      { name: 'Cambridge School', category: 'Education', importance: 'One of the oldest and most reputed schools in Noida', icon: '🏫' },
      { name: 'Wave Silver Tower', category: 'Business & IT Hubs', importance: 'Grade-A commercial office spaces', icon: '🏢' },
    ]
  },
  {
    id: 'sec-150',
    name: 'Sector 150',
    overallScore: 74,
    label: 'Good',
    summary: 'Known as the "Greenest Sector of Noida", it is an emerging low-density luxury residential destination with massive future growth potential.',
    breakdown: {
      connectivity: 65,
      healthcare: 70,
      education: 75,
      retail: 60,
      employment: 85,
    },
    infrastructure: [
      { name: 'Noida-Greater Noida Expressway', category: 'Metro & Transport', importance: 'Lifeline connectivity for high-speed transit', icon: '🛣️' },
      { name: 'Sector 148 Metro', category: 'Metro & Transport', importance: 'Aqua Line providing access to Greater Noida and Noida Central', icon: '🚇' },
      { name: 'Shaheed Bhagat Singh Park', category: 'Lifestyle & Daily Needs', importance: 'Massive 40-acre expansive green lung', icon: '🌳' },
      { name: 'Jewar International Airport', category: 'Airport Access', importance: 'Upcoming mega airport project driving future appreciation', icon: '✈️' },
      { name: 'Learners International School', category: 'Education', importance: 'Modern progressive educational facility', icon: '🏫' },
      { name: 'Medanta (Upcoming)', category: 'Healthcare', importance: 'Proposed high-end healthcare facility', icon: '🏥' },
    ]
  }
];

export const USE_CASES: UseCase[] = [
  { title: 'Real Estate Developers', description: 'Validate project feasibility with data-backed infrastructure maps.', icon: '🏗' },
  { title: 'Investors', description: 'Identify high-yield rental areas based on proximity to employment hubs.', icon: '📈' },
  { title: 'Brokers', description: 'Pitch with confidence using verified landmark data.', icon: '🤝' },
  { title: 'Home Buyers', description: 'Find the perfect home near schools, hospitals, and transit.', icon: '🏡' },
  { title: 'Channel Partners', description: 'Empower sales teams with instant location scoring tools.', icon: '🏢' },
];
