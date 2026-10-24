import { Meal } from '../types';

export const SEED_MEALS: Meal[] = [
  // Minimum (around 10 minutes, one pan, almost no prep)
  {
    id: 'seed-min-1',
    name: 'Boiled plantain and egg',
    effort: 'minimum',
    notes: 'Boil ripe plantain slices and make quick scrambled or sunny eggs',
    createdAt: '2026-10-01T12:00:00.000Z',
  },
  {
    id: 'seed-min-2',
    name: 'Yam and egg sauce',
    effort: 'minimum',
    notes: 'Quick boiled yam cubes with tomato-onion egg sauce',
    createdAt: '2026-10-01T12:05:00.000Z',
  },
  {
    id: 'seed-min-3',
    name: 'Rice and fried egg',
    effort: 'minimum',
    notes: 'Pre-cooked or quick rice with crispy fried eggs and chili',
    createdAt: '2026-10-01T12:10:00.000Z',
  },
  {
    id: 'seed-min-4',
    name: 'Fried plantain and beans',
    effort: 'minimum',
    notes: 'From a batch; quick reheat and pan-fried dodo',
    createdAt: '2026-10-01T12:15:00.000Z',
  },

  // Normal (regular cooked meal)
  {
    id: 'seed-norm-1',
    name: 'Jollof rice and chicken',
    effort: 'normal',
    notes: 'Classic stovetop party jollof with grilled/fried chicken',
    createdAt: '2026-10-01T12:20:00.000Z',
  },
  {
    id: 'seed-norm-2',
    name: 'Fried rice and fish',
    effort: 'normal',
    notes: 'Seasoned fried rice with mixed vegetables and crispy fish',
    createdAt: '2026-10-01T12:25:00.000Z',
  },
  {
    id: 'seed-norm-3',
    name: 'White rice and stew',
    effort: 'normal',
    notes: 'Fluffy white jasmine or basmati rice with rich pepper stew',
    createdAt: '2026-10-01T12:30:00.000Z',
  },
  {
    id: 'seed-norm-4',
    name: 'Beans and plantain',
    effort: 'normal',
    notes: 'Slow-simmered brown or black-eyed beans with fried ripe plantain',
    createdAt: '2026-10-01T12:35:00.000Z',
  },
  {
    id: 'seed-norm-5',
    name: 'Vegetable soup and swallow',
    effort: 'normal',
    notes: 'Efo riro / mixed greens soup served with eba or pounded yam',
    createdAt: '2026-10-01T12:40:00.000Z',
  },
  {
    id: 'seed-norm-6',
    name: 'Moi moi and pap',
    effort: 'normal',
    notes: 'Steamed bean pudding served with warm spiced ogi/pap',
    createdAt: '2026-10-01T12:45:00.000Z',
  },

  // Batch (big cook that makes several portions)
  {
    id: 'seed-batch-1',
    name: 'Big pot of stew',
    effort: 'batch',
    notes: 'For rice and yam throughout the coming week',
    createdAt: '2026-10-01T12:50:00.000Z',
  },
  {
    id: 'seed-batch-2',
    name: 'Big pot of beans',
    effort: 'batch',
    notes: 'Hearty slow-cooked pot to portion into fridge containers',
    createdAt: '2026-10-01T12:55:00.000Z',
  },
  {
    id: 'seed-batch-3',
    name: 'Pepper soup',
    effort: 'batch',
    notes: 'Fragrant aromatic broth with catfish, goat meat, or chicken',
    createdAt: '2026-10-01T13:00:00.000Z',
  },
  {
    id: 'seed-batch-4',
    name: 'Egusi soup',
    effort: 'batch',
    notes: 'Rich melon seed soup with spinach, stockfish, and assorted meats',
    createdAt: '2026-10-01T13:05:00.000Z',
  },
];
