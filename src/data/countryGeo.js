import { feature } from 'topojson-client';

export const getCountryData = async () => {
  try {
    const response = await fetch('/world-110m.json');
    const topology = await response.json();
    return feature(topology, topology.objects.countries).features;
  } catch (error) {
    console.error('Error loading country data:', error);
    return [];
  }
};