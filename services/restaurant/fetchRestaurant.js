import { config } from '../../config/index';

/** 获取餐厅信息 */
function mockFetchRestaurantInfo() {
  const { delay } = require('../_utils/delay');
  const { getRestaurantInfo } = require('../../model/restaurant');
  return delay().then(() => getRestaurantInfo());
}

/** 获取餐厅信息 */
export function fetchRestaurantInfo() {
  if (config.useMock) {
    return mockFetchRestaurantInfo();
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 获取所有桌台信息 */
function mockFetchAllTables() {
  const { delay } = require('../_utils/delay');
  const { getAllTables } = require('../../model/restaurant');
  return delay().then(() => getAllTables());
}

/** 获取所有桌台信息 */
export function fetchAllTables() {
  if (config.useMock) {
    return mockFetchAllTables();
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 根据区域获取桌台信息 */
function mockFetchTablesByArea(area) {
  const { delay } = require('../_utils/delay');
  const { getTablesByArea } = require('../../model/restaurant');
  return delay().then(() => getTablesByArea(area));
}

/** 根据区域获取桌台信息 */
export function fetchTablesByArea(area) {
  if (config.useMock) {
    return mockFetchTablesByArea(area);
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 根据ID获取桌台信息 */
function mockFetchTableById(id) {
  const { delay } = require('../_utils/delay');
  const { getTableById } = require('../../model/restaurant');
  return delay().then(() => getTableById(id));
}

/** 根据ID获取桌台信息 */
export function fetchTableById(id) {
  if (config.useMock) {
    return mockFetchTableById(id);
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 获取可用桌台 */
function mockFetchAvailableTables(seats, area) {
  const { delay } = require('../_utils/delay');
  const { getAvailableTables } = require('../../model/restaurant');
  return delay().then(() => getAvailableTables(seats, area));
}

/** 获取可用桌台 */
export function fetchAvailableTables(seats, area) {
  if (config.useMock) {
    return mockFetchAvailableTables(seats, area);
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
} 