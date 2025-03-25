import { cdnBase } from '../config/index';
const imgPrefix = cdnBase;

// 餐厅基本信息
const restaurantInfo = {
  id: '1001',
  name: '味美轩餐厅',
  logo: `${imgPrefix}/common/store-logo.png`,
  cover: `${imgPrefix}/common/store-cover.png`,
  address: '北京市朝阳区建国路888号',
  phone: '010-12345678',
  businessHours: '10:00-22:00',
  description: '味美轩餐厅是一家集川菜、粤菜于一体的中式餐厅，提供正宗的地方特色菜品，环境优雅，服务周到。',
  announcement: '疫情期间，请顾客配合测温、扫码，保持社交距离，谢谢配合。',
  tags: ['中式餐厅', '川菜', '粤菜', '家常菜'],
  averagePrice: 8800, // 人均88元
  deliveryFee: 500, // 配送费5元
  minimumOrder: 2000, // 起送金额20元
  rating: 4.8, // 评分
  ratingCount: 1253, // 评价数量
  images: [
    `${imgPrefix}/common/store-image1.png`,
    `${imgPrefix}/common/store-image2.png`,
    `${imgPrefix}/common/store-image3.png`
  ],
  facilities: ['停车场', 'WiFi', '包间', '空调', '提供发票'],
  keywords: ['味美轩', '川菜', '粤菜', '特色菜', '家常菜'],
};

// 区域类型
const AREA_TYPE = {
  HALL: '大厅',         // 大厅
  PRIVATE_ROOM: '包间', // 包间
  OUTDOOR: '户外',      // 户外
  BAR: '吧台'           // 吧台
};

// 桌台状态
const TABLE_STATUS = {
  AVAILABLE: 0,     // 空闲
  OCCUPIED: 1,      // 已占用
  RESERVED: 2,      // 已预订
  CLEANING: 3,      // 清洁中
  UNAVAILABLE: 4    // 不可用
};

// 桌台信息
const tables = [
  // 大厅区域
  {
    id: '101',
    name: 'A1',
    area: AREA_TYPE.HALL,
    seats: 4,
    status: TABLE_STATUS.AVAILABLE,
    position: { x: 100, y: 150 },
    shape: 'circle',
    size: { width: 80, height: 80 },
    minConsumption: 0, // 最低消费，0表示没有限制
    reservable: true   // 是否可预订
  },
  {
    id: '102',
    name: 'A2',
    area: AREA_TYPE.HALL,
    seats: 4,
    status: TABLE_STATUS.AVAILABLE,
    position: { x: 200, y: 150 },
    shape: 'circle',
    size: { width: 80, height: 80 },
    minConsumption: 0,
    reservable: true
  },
  {
    id: '103',
    name: 'A3',
    area: AREA_TYPE.HALL,
    seats: 6,
    status: TABLE_STATUS.OCCUPIED,
    position: { x: 320, y: 150 },
    shape: 'rectangle',
    size: { width: 120, height: 80 },
    minConsumption: 0,
    reservable: true
  },
  {
    id: '104',
    name: 'A4',
    area: AREA_TYPE.HALL,
    seats: 6,
    status: TABLE_STATUS.RESERVED,
    position: { x: 460, y: 150 },
    shape: 'rectangle',
    size: { width: 120, height: 80 },
    minConsumption: 0,
    reservable: true
  },
  // 包间区域
  {
    id: '201',
    name: 'VIP1',
    area: AREA_TYPE.PRIVATE_ROOM,
    seats: 8,
    status: TABLE_STATUS.AVAILABLE,
    position: { x: 100, y: 300 },
    shape: 'rectangle',
    size: { width: 150, height: 100 },
    minConsumption: 50000, // 500元起
    reservable: true
  },
  {
    id: '202',
    name: 'VIP2',
    area: AREA_TYPE.PRIVATE_ROOM,
    seats: 12,
    status: TABLE_STATUS.OCCUPIED,
    position: { x: 300, y: 300 },
    shape: 'rectangle',
    size: { width: 180, height: 120 },
    minConsumption: 80000, // 800元起
    reservable: true
  },
  // 户外区域
  {
    id: '301',
    name: 'O1',
    area: AREA_TYPE.OUTDOOR,
    seats: 4,
    status: TABLE_STATUS.AVAILABLE,
    position: { x: 100, y: 450 },
    shape: 'circle',
    size: { width: 80, height: 80 },
    minConsumption: 0,
    reservable: true
  },
  {
    id: '302',
    name: 'O2',
    area: AREA_TYPE.OUTDOOR,
    seats: 4,
    status: TABLE_STATUS.AVAILABLE,
    position: { x: 200, y: 450 },
    shape: 'circle',
    size: { width: 80, height: 80 },
    minConsumption: 0,
    reservable: true
  },
  // 吧台区域
  {
    id: '401',
    name: 'B1',
    area: AREA_TYPE.BAR,
    seats: 1,
    status: TABLE_STATUS.AVAILABLE,
    position: { x: 100, y: 550 },
    shape: 'circle',
    size: { width: 40, height: 40 },
    minConsumption: 0,
    reservable: false
  },
  {
    id: '402',
    name: 'B2',
    area: AREA_TYPE.BAR,
    seats: 1,
    status: TABLE_STATUS.AVAILABLE,
    position: { x: 150, y: 550 },
    shape: 'circle',
    size: { width: 40, height: 40 },
    minConsumption: 0,
    reservable: false
  },
  {
    id: '403',
    name: 'B3',
    area: AREA_TYPE.BAR,
    seats: 1,
    status: TABLE_STATUS.OCCUPIED,
    position: { x: 200, y: 550 },
    shape: 'circle',
    size: { width: 40, height: 40 },
    minConsumption: 0,
    reservable: false
  },
  {
    id: '404',
    name: 'B4',
    area: AREA_TYPE.BAR,
    seats: 1,
    status: TABLE_STATUS.AVAILABLE,
    position: { x: 250, y: 550 },
    shape: 'circle',
    size: { width: 40, height: 40 },
    minConsumption: 0,
    reservable: false
  },
];

/**
 * 获取餐厅信息
 * @returns 餐厅基本信息
 */
export function getRestaurantInfo() {
  return restaurantInfo;
}

/**
 * 获取所有桌台信息
 * @returns 所有桌台信息
 */
export function getAllTables() {
  return tables;
}

/**
 * 根据区域获取桌台信息
 * @param {string} area 区域类型
 * @returns 指定区域的桌台信息
 */
export function getTablesByArea(area) {
  return tables.filter(table => table.area === area);
}

/**
 * 根据ID获取桌台信息
 * @param {string} id 桌台ID
 * @returns 桌台信息
 */
export function getTableById(id) {
  return tables.find(table => table.id === id);
}

/**
 * 获取可用桌台
 * @param {number} seats 座位数
 * @param {string} area 区域类型（可选）
 * @returns 符合条件的可用桌台
 */
export function getAvailableTables(seats, area) {
  let availableTables = tables.filter(table => table.status === TABLE_STATUS.AVAILABLE);
  
  if (seats) {
    availableTables = availableTables.filter(table => table.seats >= seats);
  }
  
  if (area) {
    availableTables = availableTables.filter(table => table.area === area);
  }
  
  return availableTables;
}

// 导出常量
export const RESTAURANT_AREA_TYPE = AREA_TYPE;
export const RESTAURANT_TABLE_STATUS = TABLE_STATUS; 