// Shared Tour & Scene Repository for Express Backend
import fs from "fs";
import path from "path";

export let toursStore = [];

export const addTour = (tour) => {
  toursStore.unshift(tour);
  return tour;
};

export const getTourById = (tourId) => {
  return toursStore.find((t) => t.id === tourId);
};

export const deleteTour = (tourId) => {
  const idx = toursStore.findIndex((t) => t.id === tourId);
  if (idx !== -1) {
    toursStore.splice(idx, 1);
    return true;
  }
  return false;
};
