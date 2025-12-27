import { HealthFacility } from '@/types/emec';

export const demoFacilities: HealthFacility[] = [
  {
    id: 'facility-001',
    name: 'Mbita Sub-County Hospital',
    licenseNumber: 'SHA-001-2025',
    type: 'hospital',
    distance: '0.5 km',
    coordinates: { lat: -0.4272, lng: 34.2061 },
    phone: '+254 700 123 456',
    emergencyPhone: '+254 700 999 999',
    isVerified: true,
  },
  {
    id: 'facility-002',
    name: 'Rusinga Health Center',
    licenseNumber: 'SHA-002-2025',
    type: 'clinic',
    distance: '2.3 km',
    coordinates: { lat: -0.3905, lng: 34.1617 },
    phone: '+254 700 234 567',
    emergencyPhone: '+254 700 888 888',
    isVerified: true,
  },
  {
    id: 'facility-003',
    name: 'Sena Dispensary',
    licenseNumber: 'SHA-003-2025',
    type: 'dispensary',
    distance: '4.1 km',
    coordinates: { lat: -0.4512, lng: 34.2234 },
    phone: '+254 700 345 678',
    emergencyPhone: '+254 700 777 777',
    isVerified: true,
  },
  {
    id: 'facility-004',
    name: 'Homa Bay County Referral Hospital',
    licenseNumber: 'SHA-004-2025',
    type: 'hospital',
    distance: '45 km',
    coordinates: { lat: -0.5273, lng: 34.4571 },
    phone: '+254 700 456 789',
    emergencyPhone: '+254 700 666 666',
    isVerified: true,
  },
  {
    id: 'facility-005',
    name: 'Lwanda Health Centre',
    licenseNumber: 'SHA-005-2025',
    type: 'clinic',
    distance: '8.2 km',
    coordinates: { lat: -0.4123, lng: 34.1890 },
    phone: '+254 700 567 890',
    emergencyPhone: '+254 700 555 555',
    isVerified: true,
  },
  {
    id: 'facility-006',
    name: 'Kisumu County Hospital',
    licenseNumber: 'SHA-006-2025',
    type: 'hospital',
    distance: '120 km',
    coordinates: { lat: -0.1022, lng: 34.7617 },
    phone: '+254 700 678 901',
    emergencyPhone: '+254 700 444 444',
    isVerified: true,
  },
];

export const getNearestFacility = (): HealthFacility => {
  return demoFacilities[0];
};

export const getFacilityById = (id: string): HealthFacility | undefined => {
  return demoFacilities.find((f) => f.id === id);
};

export const getFacilitiesByType = (type: 'hospital' | 'clinic' | 'dispensary'): HealthFacility[] => {
  return demoFacilities.filter((f) => f.type === type);
};

export const getVerifiedFacilities = (): HealthFacility[] => {
  return demoFacilities.filter((f) => f.isVerified);
};
