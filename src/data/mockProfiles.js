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
  { criteria: 'Location', value: `${profile.city} or open to relocation`, matchDetail: profile.mapArea, isMatched: true },
  { criteria: 'Age Range', value: '24 - 35 Years', matchDetail: `${profile.age} Years`, isMatched: true },
  { criteria: 'Education', value: 'Graduate or above', matchDetail: profile.education, isMatched: true },
  { criteria: 'Profession', value: 'Professionally settled', matchDetail: profile.occupation, isMatched: true },
  { criteria: 'Religion', value: profile.religion, matchDetail: `${profile.religion} (${profile.caste})`, isMatched: index % 7 !== 0 },
  { criteria: 'Diet', value: 'Flexible', matchDetail: profile.diet, isMatched: index % 5 !== 0 },
  { criteria: 'Income', value: 'Financially independent', matchDetail: profile.income, isMatched: true },
  { criteria: 'Relocation', value: 'Discuss together', matchDetail: profile.relocationFlexibility, isMatched: index % 6 !== 0 },
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
  const isNri = location.country !== 'India';
  const latitudeOffset = (((locationIndex * 7) % 9) - 4) * 0.006 + (isBride ? -0.003 : 0.003);
  const longitudeOffset = (((locationIndex * 11) % 9) - 4) * 0.006 + (isBride ? 0.003 : -0.003);
  const name = FEATURED_NAMES[profileId]
    || `${firstNames[locationIndex % firstNames.length]} ${SURNAMES[(locationIndex * 7 + (isBride ? 0 : 3)) % SURNAMES.length]}`;
  const occupation = (isBride ? BRIDE_OCCUPATIONS : GROOM_OCCUPATIONS)[personIndex % 10];
  const education = EDUCATIONS[personIndex % EDUCATIONS.length];
  const mapArea = `${location.label} metropolitan area`;

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
    occupation,
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
    about: `${name} is a ${occupation.toLowerCase()} based in ${location.label}. Values kindness, education, family connection, and an equal partnership. Enjoys travel, music, good food, and meaningful conversations.`,
    family: {
      father: locationIndex % 2 === 0 ? 'Business / Professional' : 'Retired Professional',
      mother: locationIndex % 3 === 0 ? 'Teacher' : 'Homemaker / Professional',
      siblings: locationIndex % 4 === 0 ? 'Only Child' : 'One Sibling',
      familyType: locationIndex % 3 === 0 ? 'Joint Family' : 'Nuclear Family',
      familyValues: 'Moderate and respectful',
      familyStatus: 'Upper Middle Class',
      familyIncome: isNri ? '$120k+ / Year' : '₹40 - 80 Lakhs / Year',
      hometown: location.label,
    },
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
