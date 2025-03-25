// const images = [
//   {
//     img: 'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner1.png',
//     text: '1',
//   },
//   {
//     img: 'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner2.png',
//     text: '2',
//   },
//   {
//     img: 'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner3.png',
//     text: '3',
//   },
//   {
//     img: 'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner4.png',
//     text: '4',
//   },
//   {
//     img: 'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner5.png',
//     text: '5',
//   },
//   {
//     img: 'https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner6.png',
//     text: '6',
//   },
// ];

// 使用Unsplash提供的高质量餐饮美食相关图片
const images = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop', // 美食展示
  'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&auto=format&fit=crop', // 牛肉面
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop', // 中式炒菜
  'https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=800&auto=format&fit=crop', // 面食
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop'  // 美食餐厅
];

export function genSwiperImageList() {
  return images;
}
