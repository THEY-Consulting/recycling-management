'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RecyclingCenter } from '@/types';
import { mockRecyclingCenters } from '@/data/mockData';

interface FacilityContextType {
  selectedFacility: RecyclingCenter | null;
  setSelectedFacility: (facility: RecyclingCenter | null) => void;
  facilities: RecyclingCenter[];
}

const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

export function FacilityProvider({ children }: { children: ReactNode }) {
  const [selectedFacility, setSelectedFacility] = useState<RecyclingCenter | null>(null);

  return (
    <FacilityContext.Provider
      value={{
        selectedFacility,
        setSelectedFacility,
        facilities: mockRecyclingCenters,
      }}
    >
      {children}
    </FacilityContext.Provider>
  );
}

export function useFacility() {
  const context = useContext(FacilityContext);
  if (context === undefined) {
    throw new Error('useFacility must be used within a FacilityProvider');
  }
  return context;
}

