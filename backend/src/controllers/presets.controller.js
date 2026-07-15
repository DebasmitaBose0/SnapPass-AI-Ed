import Preset from '../models/preset.model.js';
import { getCache, setCache, deleteCache } from '../config/redis.js';
import { successResponse, errorResponse } from '../utils/httpResponse.js';

const CACHE_TTL = 3600;

export const getPresets = async (req, res, next) => {
  try {
    const cacheKey = 'presets:all';
    const cached = await getCache(cacheKey);
    if (cached) return successResponse(res, cached, 'Presets fetched');

    const presets = await Preset.find({ active: true })
      .sort({ order: 1 })
      .lean();
    await setCache(cacheKey, presets, CACHE_TTL);
    successResponse(res, presets, 'Presets fetched');
  } catch (err) {
    next(err);
  }
};

export const getPresetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `presets:${id}`;
    const cached = await getCache(cacheKey);
    if (cached) return successResponse(res, cached, 'Preset fetched');

    const preset = await Preset.findById(id).lean();
    if (!preset) return errorResponse(res, 'Preset not found', 404);

    await setCache(cacheKey, preset, CACHE_TTL);
    successResponse(res, preset, 'Preset fetched');
  } catch (err) {
    next(err);
  }
};

export const createPreset = async (req, res, next) => {
  try {
    const preset = await Preset.create(req.body);
    await deleteCache('presets:all');
    successResponse(res, preset, 'Preset created', 201);
  } catch (err) {
    next(err);
  }
};

export const updatePreset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const preset = await Preset.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!preset) return errorResponse(res, 'Preset not found', 404);

    await deleteCache('presets:all');
    await deleteCache(`presets:${id}`);
    successResponse(res, preset, 'Preset updated');
  } catch (err) {
    next(err);
  }
};

export const deletePreset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const preset = await Preset.findByIdAndDelete(id);
    if (!preset) return errorResponse(res, 'Preset not found', 404);

    await deleteCache('presets:all');
    await deleteCache(`presets:${id}`);
    successResponse(res, null, 'Preset deleted');
  } catch (err) {
    next(err);
  }
};
