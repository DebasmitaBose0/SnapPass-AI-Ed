import api from './api';
import { getReviewFingerprint } from '../utils/reviewClient';

const SAMPLE_TESTIMONIALS = [
  {
    id: 'seed-1',
    name: 'Tanya Oberio',
    rating: 5,
    commentEn:
      'As a photographer and Instagram handler, SnapPassAI is one of the best tools for me. It helps me quickly maintain lot of time with its simple and minimal workflow.',
    commentHi:
      'एक फोटोग्राफर और इंस्टाग्राम हैंडलर के रूप में, SnapPassAI मेरे लिए सबसे अच्छे टूल्स में से एक है। इसका सरल और न्यूनतम वर्कफ़्लो मेरा काफी समय बचाता है।',
    date: '2026-05-25T10:00:00.000Z',
  },
  {
    id: 'seed-2',
    name: 'Rahul Sharma',
    rating: 5,
    commentEn:
      'Amazing tool! Got my passport photo ready in seconds. Highly recommended!',
    commentHi:
      'शानदार टूल! मेरी पासपोर्ट फोटो कुछ ही सेकंड में तैयार हो गई। अत्यधिक अनुशंसित!',
    date: '2026-05-24T14:30:00.000Z',
  },
  {
    id: 'seed-3',
    name: 'Priya Patel',
    rating: 4,
    commentEn: 'Very easy to use. The background removal works perfectly.',
    commentHi:
      'उपयोग करने में बहुत आसान। बैकग्राउंड हटाने की सुविधा बेहतरीन तरीके से काम करती है।',
    date: '2026-05-23T09:15:00.000Z',
  },
];

function buildFallbackPayload() {
  return {
    testimonials: SAMPLE_TESTIMONIALS,
    stats: {
      averageRating: 4.7,
      count: SAMPLE_TESTIMONIALS.length,
    },
    userReview: null,
  };
}

export async function fetchTestimonials() {
  const fingerprint = getReviewFingerprint();

  if (!import.meta.env.VITE_API_URL) {
    return buildFallbackPayload();
  }

  try {
    const { data } = await api.get('/testimonials', {
      params: { fingerprint },
      headers: { 'X-Client-Fingerprint': fingerprint },
    });

    return data.data;
  } catch {
    return buildFallbackPayload();
  }
}

function ensureApiConfigured() {
  if (!import.meta.env.VITE_API_URL) {
    throw new Error('Review submission is unavailable until the backend API is configured.');
  }
}

export async function submitTestimonial(payload) {
  ensureApiConfigured();
  const clientFingerprint = getReviewFingerprint();
  const { data } = await api.post('/testimonials', {
    ...payload,
    clientFingerprint,
    website: payload.website || '',
  });

  return data.data.testimonial;
}

export async function updateTestimonial(payload) {
  ensureApiConfigured();
  const clientFingerprint = getReviewFingerprint();
  const { data } = await api.put('/testimonials', {
    ...payload,
    clientFingerprint,
    website: payload.website || '',
  });

  return data.data.testimonial;
}
