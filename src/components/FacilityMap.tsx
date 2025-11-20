'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RecyclingCenter } from '@/types';
import { Box, Card, CardContent, CardActions, Button, Typography, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RecyclingIcon from '@mui/icons-material/Recycling';

// Fix for default marker icon in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FacilityMapProps {
  facilities: RecyclingCenter[];
  onSelectFacility: (facility: RecyclingCenter) => void;
  selectedFacilityId?: string;
}

export default function FacilityMap({ facilities, onSelectFacility, selectedFacilityId }: FacilityMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const popupRef = useRef<HTMLDivElement | null>(null);

  const getOpeningHoursText = (facility: RecyclingCenter) => {
    const weekdayHours = facility.openingHours.find((h: any) => h.dayOfWeek === 1);
    if (!weekdayHours) return 'See details';
    return `${weekdayHours.coreStart} - ${weekdayHours.coreEnd}`;
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on Hamburg
    const map = L.map(mapContainerRef.current).setView([53.5511, 9.9937], 12);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    // Add markers for each facility
    facilities.forEach(facility => {
      const marker = L.marker([facility.coordinates.lat, facility.coordinates.lng])
        .addTo(mapRef.current!);

      // Create custom popup content
      const popupContent = document.createElement('div');
      popupContent.style.minWidth = '280px';
      popupContent.innerHTML = `
        <div id="facility-popup-${facility.id}"></div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: 'facility-popup',
      });

      marker.on('click', () => {
        // Render React component into popup after it opens
        setTimeout(() => {
          const container = document.getElementById(`facility-popup-${facility.id}`);
          if (container) {
            renderPopupContent(container, facility);
          }
        }, 100);
      });

      markersRef.current.set(facility.id, marker);
    });

    // Open popup for selected facility
    if (selectedFacilityId && markersRef.current.has(selectedFacilityId)) {
      const marker = markersRef.current.get(selectedFacilityId)!;
      marker.openPopup();
      mapRef.current.setView(marker.getLatLng(), 14);
    }
  }, [facilities, selectedFacilityId]);

  const renderPopupContent = (container: HTMLElement, facility: RecyclingCenter) => {
    container.innerHTML = `
      <div style="padding: 8px;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <svg style="width: 32px; height: 32px; margin-right: 8px; fill: #164656;" viewBox="0 0 24 24">
            <path d="M21 12v-2h-1c-1.04 0-2.08.35-3 1-1.83-1.3-4.17-1.3-6 0-1.83-1.3-4.17-1.3-6 0-.92-.65-1.96-1-3-1H1v2h1c1.03 0 2.05.35 3 1v7c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-7c.95-.65 1.97-1 3-1h1zm-2 8H5v-6.05c1.38-.86 3.12-.86 4.5 0 1.38.86 3.12.86 4.5 0 1.38-.86 3.12-.86 4.5 0V20z"/>
          </svg>
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${facility.name}</h3>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
          <svg style="width: 16px; height: 16px; margin-right: 6px; margin-top: 2px; fill: #666;" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span style="font-size: 13px; color: #666;">${facility.address}</span>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <svg style="width: 16px; height: 16px; margin-right: 6px; fill: #666;" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span style="font-size: 13px; color: #666;">${getOpeningHoursText(facility)}</span>
        </div>
        
        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; color: #666; margin-bottom: 6px;">Available waste types:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${facility.wasteTypes.slice(0, 4).map(type => `
              <span style="background-color: ${type.color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">
                ${type.name}
              </span>
            `).join('')}
            ${facility.wasteTypes.length > 4 ? `
              <span style="border: 1px solid #ccc; padding: 2px 8px; border-radius: 12px; font-size: 11px; color: #666;">
                +${facility.wasteTypes.length - 4} more
              </span>
            ` : ''}
          </div>
        </div>
        
        <button 
          id="select-facility-${facility.id}"
          style="width: 100%; background-color: #164656; color: white; border: none; padding: 10px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; margin-top: 8px;"
        >
          Select Facility
        </button>
      </div>
    `;

    // Add click handler to button
    const button = container.querySelector(`#select-facility-${facility.id}`);
    if (button) {
      button.addEventListener('click', () => {
        onSelectFacility(facility);
      });
    }
  };

  return (
    <Box
      ref={mapContainerRef}
      sx={{
        width: '100%',
        height: { xs: '400px', md: '600px' },
        borderRadius: 1,
        overflow: 'hidden',
        '& .leaflet-popup-content-wrapper': {
          borderRadius: 1,
        },
      }}
    />
  );
}

