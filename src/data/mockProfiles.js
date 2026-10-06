import { mockLocations } from './mockLocations.js';

// Deterministic development fixture: exactly one Bride and one Groom per location.
// Production builds do not load this collection into application state.
const BRIDE_FIRST_NAMES = [
  'Ananya', 'Priya', 'Saniya', 'Aditi', 'Meera', 'Ishita', 'Kavya', 'Riya', 'Naina', 'Simran',
  'Diya', 'Avni', 'Tanya', 'Neha', 'Pooja', 'Shruti', 'Aarohi', 'Maya', 'Zoya', 'Navya',
  'Anika', 'Jasleen', 'Sneha', 'Radhika', 'Myra',
];

const GROOM_FIRST_NAMES = [
  'Rohan', 'Aditya', 'Gurpreet', 'Arjun', 'Kabir', 'Vivaan', 'Rahul', 'Karan', 'Aman', 'Dev',
  'Siddharth', 'Nikhil', 'Varun', 'Akash', 'Manav', 'Yash', 'Dhruv', 'Aarav', 'Reyansh', 'Harsh',
  'Ishaan', 'Jatin', 'Neil', 'Ritvik', 'Sameer',
];

const SURNAMES = [
  'Sharma', 'Kapoor', 'Merchant', 'Singh', 'Patel', 'Mehta', 'Verma', 'Iyer', 'Reddy', 'Nair',
  'Gupta', 'Joshi', 'Khan', 'Das', 'Bose', 'Desai', 'Malhotra', 'Chopra', 'Jain', 'Rao',
];

const FEATURED_NAMES = {
  101: 'Ananya Sharma',
  102: 'Rohan Verma',
  103: 'Dr. Priya Kapoor',
  104: 'Aditya Singhania',
  105: 'Saniya Merchant',
  106: 'Gurpreet Singh',
};

const BRIDE_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
];

const GROOM_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
];

const COMMUNITIES = [
  { religion: 'Hindu', caste: 'Brahmin - Gaur', motherTongue: 'Hindi' },
  { religion: 'Sikh', caste: 'Jat / Jatt Sikh', motherTongue: 'Punjabi' },
  { religion: 'Muslim', caste: 'Sunni Syed', motherTongue: 'Urdu' },
  { religion: 'Christian', caste: 'Caste No Bar', motherTongue: 'English' },
  { religion: 'Jain', caste: 'Jain - Digambar', motherTongue: 'Hindi' },
  { religion: 'Hindu', caste: 'Agarwal / Vaishya', motherTongue: 'Marwari' },
  { religion: 'Hindu', caste: 'Brahmin - Iyer', motherTongue: 'Tamil' },
  { religion: 'Hindu', caste: 'Reddy', motherTongue: 'Telugu' },
  { religion: 'Hindu', caste: 'Nair', motherTongue: 'Malayalam' },
  { religion: 'Buddhist', caste: 'Caste No Bar', motherTongue: 'Marathi' },
];

const BRIDE_OCCUPATIONS = [
  'Software Engineer', 'Doctor', 'Product Manager', 'Corporate Lawyer', 'Architect', 'Data Scientist',
  'Chartered Accountant', 'University Lecturer', 'UX Designer', 'Entrepreneur',
];

const GROOM_OCCUPATIONS = [
  'Engineering Manager', 'Doctor', 'Investment Analyst', 'Civil Services Officer', 'Architect', 'Data Architect',
  'Chartered Accountant', 'Commercial Pilot', 'Product Director', 'Entrepreneur',
];

const EDUCATIONS = [
  'M.Tech Computer Science', 'MD / MBBS', 'MBA', 'LLM', 'M.Arch',
  'MS Data Science', 'CA', 'PhD', 'M.Des', 'B.Tech',
];

const RASHIS = ['Tula', 'Vrishabha', 'Simha', 'Mithuna', 'Meena', 'Kanya', 'Dhanu', 'Karka'];
const NAKSHATRAS = ['Chitra', 'Rohini', 'Magha', 'Ardra', 'Revati', 'Hasta', 'Mula', 'Pushya'];
const GOTRAS = ['Vashishtha', 'Kashyap', 'Bharadwaj', 'Garg', 'Gautam', 'Shandilya', 'Kaushik', 'Atri'];
const DIETS = ['Vegetarian', 'Eggetarian', 'Non-Vegetarian', 'Vegetarian', 'Vegan'];

// Parent hometown lookup — families search from their hometown, not work city (Feature 5)
const PARENT_HOMETOWNS = [
  { id: 'Sirsa',    label: 'Sirsa',    state: 'Haryana',   lat: 29.5320, lng: 75.0318 },
  { id: 'Hisar',    label: 'Hisar',    state: 'Haryana',   lat: 29.1492, lng: 75.7217 },
  { id: 'Rohtak',   label: 'Rohtak',   state: 'Haryana',   lat: 28.8955, lng: 76.6066 },
  { id: 'Panipat',  label: 'Panipat',  state: 'Haryana',   lat: 29.3909, lng: 76.9635 },
  { id: 'Karnal',   label: 'Karnal',   state: 'Haryana',   lat: 29.6857, lng: 76.9905 },
  { id: 'Ambala',   label: 'Ambala',   state: 'Haryana',   lat: 30.3782, lng: 76.7767 },
  { id: 'Ludhiana', label: 'Ludhiana', state: 'Punjab',    lat: 30.9010, lng: 75.8573 },
  { id: 'Amritsar', label: 'Amritsar', state: 'Punjab',    lat: 31.6340, lng: 74.8723 },
  { id: 'Bathinda', label: 'Bathinda', state: 'Punjab',    lat: 30.2110, lng: 74.9455 },
  { id: 'Jaipur',   label: 'Jaipur',   state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
];

// Cover photos (landscape banners for profile cover — Feature 9)
const COVER_PHOTOS = [
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1200&q=80',
];

// Past achievements (Feature 11)
const PAST_ACHIEVEMENTS = [
  [
    { year: '2019', title: 'Graduated with Honours — M.Tech CSE', type: 'education' },
    { year: '2021', title: 'Promoted to Senior Software Engineer', type: 'career' },
    { year: '2023', title: 'Led product launch serving 2M+ users', type: 'achievement' },
  ],
  [
    { year: '2018', title: 'Completed MBBS from AIIMS', type: 'education' },
    { year: '2020', title: 'Started own clinic in Chandigarh', type: 'career' },
    { year: '2022', title: 'Published research in medical journal', type: 'achievement' },
  ],
  [
    { year: '2017', title: 'Cleared CA Final with All-India Rank 18', type: 'education' },
    { year: '2020', title: 'Joined Big 4 Audit Firm as Manager', type: 'career' },
    { year: '2023', title: 'Managed ₹500 Cr portfolio independently', type: 'achievement' },
  ],
  [
    { year: '2019', title: 'Completed MBA from IIM Ahmedabad', type: 'education' },
    { year: '2021', title: 'Promoted to Product Director', type: 'career' },
    { year: '2023', title: 'Company achieved Series B funding', type: 'achievement' },
  ],
  [
    { year: '2016', title: 'Completed LLM from National Law School', type: 'education' },
    { year: '2019', title: 'Partner-track at top law firm', type: 'career' },
    { year: '2022', title: 'Won landmark corporate litigation case', type: 'achievement' },
  ],
];

// Present targets (Feature 11)
const PRESENT_TARGETS = [
  ['Building a SaaS product for SMBs', 'Running my first half-marathon', 'Completing AWS Architect certification'],
  ['Starting a wellness clinic chain', 'Publishing a healthcare book', 'Mentoring junior doctors'],
  ['Expanding practice across 3 cities', 'Completing CFA Level 3', 'Learning a new language'],
  ['Taking product to 10M users', 'Travelling to 5 countries this year', 'Learning pottery and cooking'],
  ['Making partner at the firm', 'Completing a marathon', 'Renovating family home in Chandigarh'],
];

// Future visions (Feature 11)
const FUTURE_VISIONS = [
  'Looking to build a warm, modern home where both careers flourish and family values are cherished. Hoping to settle in Chandigarh or Gurugram, travel to Europe every 2 years, and one day start a small impact-driven venture together.',
  'Vision is a life where professional excellence and emotional depth coexist — a home full of laughter, ambitious kids, great food, and meaningful community bonds. Would love to travel and explore cultures together.',
  'Believe in building a life that is financially secure yet spiritually grounded. Dream of a home with space for elders, children, books, and occasional adventure. Weekend road trips and Haryanvi culture close to heart.',
  'Want to build a tech-forward but values-rooted home. Deeply respect both parents and career aspirations in a partner. Dream of raising confident, curious children while building something meaningful professionally.',
  'Envision a life of purpose — great career, great family, and giving back to society through mentoring. Inspired by simplicity, authenticity, and depth of connection over surface glamour.',
];

// Designations (more specific than occupation — Feature 4)
const BRIDE_DESIGNATIONS = [
  'Senior Software Engineer', 'Doctor', 'Product Manager', 'Corporate Lawyer',
  'Principal Architect', 'Lead Data Scientist', 'CA Manager', 'Associate Professor',
  'Senior UX Designer', 'Founder & CEO',
];
const GROOM_DESIGNATIONS = [
  'Engineering Manager', 'Doctor', 'VP Investments', 'IAS Officer',
  'Principal Architect', 'Data Architecture Lead', 'Senior Chartered Accountant',
  'Commercial Pilot (Grade A)', 'Product Director', 'Co-Founder & CEO',
];

const formatHeight = heightCm => {
  const totalInches = Math.round(heightCm / 2.54);
  return `${Math.floor(totalInches / 12)}' ${totalInches % 12}" (${heightCm} cm)`;
};

const buildDob = (age, index) => {
  const month = String((index % 12) + 1).padStart(2, '0');
  const day = String((index % 27) + 1).padStart(2, '0');
  return `${2026 - age}-${month}-${day}`;
};

const buildPreferences = (profile, index) => [
  { criteria: 'Location',    value: `${profile.city} or open to relocation`, matchDetail: profile.mapArea,               isMatched: true },
  { criteria: 'Age Range',   value: '24 - 35 Years',                          matchDetail: `${profile.age} Years`,        isMatched: true },
  { criteria: 'Education',   value: 'Graduate or above',                       matchDetail: profile.education,             isMatched: true },
  { criteria: 'Profession',  value: 'Professionally settled',                   matchDetail: profile.occupation,            isMatched: true },
  { criteria: 'Religion',    value: profile.religion,                           matchDetail: `${profile.religion} (${profile.caste})`, isMatched: index % 7 !== 0 },
  { criteria: 'Diet',        value: 'Flexible',                                 matchDetail: profile.diet,                  isMatched: index % 5 !== 0 },
  { criteria: 'Income',      value: 'Financially independent',                  matchDetail: profile.income,                isMatched: true },
  { criteria: 'Relocation',  value: 'Discuss together',                         matchDetail: profile.relocationFlexibility, isMatched: index % 6 !== 0 },
];

const buildProfile = (location, locationIndex, gender, profileId) => {
  const isBride = gender === 'Bride';
  const personIndex = locationIndex + (isBride ? 0 : 5);
  const firstNames = isBride ? BRIDE_FIRST_NAMES : GROOM_FIRST_NAMES;
  const photos = isBride ? BRIDE_PHOTOS : GROOM_PHOTOS;
  const community = COMMUNITIES[personIndex % COMMUNITIES.length];
  const age = (isBride ? 24 : 27) + (locationIndex % 7);
  const heightCm = (isBride ? 158 : 171) + (locationIndex % 12);
  const incomeValue = 18 + ((locationIndex * 7 + (isBride ? 0 : 9)) % 83);
  const galleryPhotos = [0, 1, 2, 3].map(offset => photos[(locationIndex + offset) % photos.length]);
  const photo = galleryPhotos[0];
  const coverPhoto = COVER_PHOTOS[personIndex % COVER_PHOTOS.length];
  const isNri = location.country !== 'India';
  const latitudeOffset = (((locationIndex * 7) % 9) - 4) * 0.006 + (isBride ? -0.003 : 0.003);
  const longitudeOffset = (((locationIndex * 11) % 9) - 4) * 0.006 + (isBride ? 0.003 : -0.003);
  const name = FEATURED_NAMES[profileId]
    || `${firstNames[locationIndex % firstNames.length]} ${SURNAMES[(locationIndex * 7 + (isBride ? 0 : 3)) % SURNAMES.length]}`;
  const occupation = (isBride ? BRIDE_OCCUPATIONS : GROOM_OCCUPATIONS)[personIndex % 10];
  const designation = (isBride ? BRIDE_DESIGNATIONS : GROOM_DESIGNATIONS)[personIndex % 10];
  const education = EDUCATIONS[personIndex % EDUCATIONS.length];
  const mapArea = `${location.label} metropolitan area`;

  // Parent hometown — where the family lives (for parent-location search)
  const parentHometown = PARENT_HOMETOWNS[personIndex % PARENT_HOMETOWNS.length];

  const profile = {
    id: profileId,
    name,
    gender,
    dob: buildDob(age, personIndex),
    age,
    height: formatHeight(heightCm),
    heightCm,
    religion: community.religion,
    caste: community.caste,
    motherTongue: community.motherTongue,
    education,
    degree: education,      // Feature 4: explicit degree alias
    occupation,
    designation,            // Feature 4: specific role title
    income: isNri
      ? `$${70 + (locationIndex % 9) * 10}k - $${85 + (locationIndex % 9) * 10}k / Year`
      : `₹${incomeValue} - ${incomeValue + 8} Lakhs / Year`,
    incomeValue,
    city: location.label,
    state: location.state,
    country: location.country,
    countryCode: location.countryCode,
    placeId: `mock-place-${location.id}`,
    isNri,
    visaStatus: isNri ? `Resident in ${location.country}` : 'India Resident',
    relocationFlexibility: isNri ? `${location.country} / India / Open to discuss` : 'India metros / Open to discuss',
    diet: DIETS[personIndex % DIETS.length],
    manglik: community.religion === 'Hindu' ? ['No', 'Anshik', 'No', 'Yes'][personIndex % 4] : 'No',
    rashi: community.religion === 'Hindu' ? RASHIS[personIndex % RASHIS.length] : 'N/A',
    nakshatra: community.religion === 'Hindu' ? NAKSHATRAS[personIndex % NAKSHATRAS.length] : 'N/A',
    gotra: community.religion === 'Hindu' ? GOTRAS[personIndex % GOTRAS.length] : 'N/A',
    timeOfBirth: `${String((personIndex % 11) + 1).padStart(2, '0')}:30 AM`,
    placeOfBirth: location.label,
    isVerified: locationIndex % 4 !== 0,
    photoPrivacy: locationIndex % 5 === 0 ? 'Protected' : 'Public',
    matchScore: 76 + ((locationIndex * 7 + (isBride ? 4 : 1)) % 23),
    lat: Number((location.lat + latitudeOffset).toFixed(6)),
    lng: Number((location.lng + longitudeOffset).toFixed(6)),
    mapArea,
    photo,
    photos: galleryPhotos,
    activeStatus: locationIndex % 4 === 0 ? 'Online recently' : 'Active this week',
    profileCreatedBy: locationIndex % 3 === 0 ? 'Family' : 'Self',
    about: `${name} is a ${designation.toLowerCase()} based in ${location.label}. Values kindness, education, family connection, and an equal partnership. Enjoys travel, music, good food, and meaningful conversations.`,

    // Feature 9: Multiple image roles
    profilePhoto: galleryPhotos[0],
    coverPhoto,
    galleryPhotos,

    // Feature 5: Parent location (where family lives)
    parentLocation: {
      city: parentHometown.label,
      state: parentHometown.state,
      lat: parentHometown.lat,
      lng: parentHometown.lng,
    },

    family: {
      father: locationIndex % 2 === 0 ? 'Business / Professional' : 'Retired Professional',
      mother: locationIndex % 3 === 0 ? 'Teacher' : 'Homemaker / Professional',
      siblings: locationIndex % 4 === 0 ? 'Only Child' : 'One Sibling',
      familyType: locationIndex % 3 === 0 ? 'Joint Family' : 'Nuclear Family',
      familyValues: 'Moderate and respectful',
      familyStatus: 'Upper Middle Class',
      familyIncome: isNri ? '$120k+ / Year' : '₹40 - 80 Lakhs / Year',
      hometown: parentHometown.label,
    },

    // Feature 11: Life story — achievements, targets, vision
    achievements: PAST_ACHIEVEMENTS[personIndex % PAST_ACHIEVEMENTS.length],
    presentTargets: PRESENT_TARGETS[personIndex % PRESENT_TARGETS.length],
    futureVision: FUTURE_VISIONS[personIndex % FUTURE_VISIONS.length],
  };

  profile.preferencesMatch = buildPreferences(profile, personIndex);
  if (locationIndex % 2 === 0) {
    profile.lifestyleVideo = {
      title: `A day in ${name.split(' ')[0]}'s life`,
      duration: '0:24',
      thumbnail: galleryPhotos[1] || photo,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      caption: `A short development-fixture lifestyle reel from ${location.label}.`,
    };
  }

  return profile;
};

export const mockProfiles = mockLocations.flatMap((location, index) => [
  buildProfile(location, index, 'Bride', 101 + index * 2),
  buildProfile(location, index, 'Groom', 102 + index * 2),
]);
