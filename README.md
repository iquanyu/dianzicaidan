<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png">
  </a>
</p>

<p align="center">
  <a href="https://img.shields.io/github/stars/Tencent/tdesign-miniprogram-starter-retail">
    <img src="https://img.shields.io/github/stars/Tencent/tdesign-miniprogram-starter-retail" alt="License">
  </a>  
  <a href="https://github.com/Tencent/tdesign-miniprogram-starter-retail/issues">
    <img src="https://img.shields.io/github/issues/Tencent/tdesign-miniprogram-starter-retail" alt="License">
  </a>  
  <a href="https://github.com/Tencent/tdesign-miniprogram-starter-retail/LICENSE">
    <img src="https://img.shields.io/github/license/Tencent/tdesign-miniprogram-starter-retail" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-miniprogram">
    <img src="https://img.shields.io/npm/v/tdesign-miniprogram.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/tdesign-miniprogram">
    <img src="https://img.shields.io/npm/dw/tdesign-miniprogram" alt="Downloads">
  </a>
</p>

# TDesign 零售行业模版示例小程序

TDesign 零售模版示例小程序采用 [TDesign 企业级设计体系小程序解决方案](https://tdesign.tencent.com/miniprogram/overview) 进行搭建，依赖 [TDesign 微信小程序组件库](https://github.com/Tencent/tdesign-miniprogram)，涵盖完整的基本零售场景需求。

## :high_brightness: 预览

<p>请使用微信扫描以下二维码：</p>

 <img src="https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-mp/common/qrcode.jpeg" width = "200" height = "200" alt="模版小程序二维码" align=center />

## :pushpin: 项目介绍

### 1. 业务介绍

零售行业模版小程序是个经典的单店版电商小程序，涵盖了电商的黄金链路流程，从商品->购物车->结算->订单等。小程序总共包含 28 个完整的页面，涵盖首页，商品详情页，个人中心，售后流程等基础页面。采用 mock 数据进行展示，提供了完整的零售商品展示、交易与售后流程。页面详情：

<img src="https://cdn-we-retail.ym.tencent.com/tsr/tdesign-starter-readmeV1.png" width = "650" height = "900" alt="模版小程序页面详情" align=center />



主要页面截图如下：

<p align="center">
    <img alt="example-home" width="200" src="https://cdn-we-retail.ym.tencent.com/tsr/example/v1/home.png" />
    <img alt="example-sort" width="200" src="https://cdn-we-retail.ym.tencent.com/tsr/example/v2/sort.png" />
    <img alt="example-cart" width="200" src="https://cdn-we-retail.ym.tencent.com/tsr/example/v1/cart.png" />
    <img alt="example-user-center" width="200" src="https://cdn-we-retail.ym.tencent.com/tsr/example/v1/user-center.png" />
    <img alt="example-goods-detail" width="200" src="https://cdn-we-retail.ym.tencent.com/tsr/example/v1/goods-detail.png" />
    <img alt="example-pay" width="200" src="https://cdn-we-retail.ym.tencent.com/tsr/example/v1/pay.png" />
    <img alt="example-order" width="200" src="https://cdn-we-retail.ym.tencent.com/tsr/example/v1/order.png" />
    <img alt="example-order-detail" width="200" src="https://cdn-we-retail.ym.tencent.com/tsr/example/v2/order.png" />
</p>



### 2. 项目构成

零售行业模版小程序采用基础的 JavaScript + WXSS + ESLint 进行构建，降低了使用门槛。

项目目录结构如下：

```
|-- tdesign-miniprogram-starter
    |-- README.md
    |-- app.js
    |-- app.json
    |-- app.wxss
    |-- components	//	公共组件库
    |-- config	//	基础配置
    |-- custom-tab-bar	//	自定义 tabbar
    |-- model	//	mock 数据
    |-- pages
    |   |-- cart	//	购物车相关页面
    |   |-- coupon	//	优惠券相关页面
    |   |-- goods	//	商品相关页面
    |   |-- home	//	首页
    |   |-- order	//	订单售后相关页面
    |   |-- promotion-detail	//	营销活动页面
    |   |-- usercenter	//	个人中心及收货地址相关页面
    |-- services	//	请求接口
    |-- style	//	公共样式与iconfont
    |-- utils	//	工具库
```

### 3. 数据模拟

零售小程序采用真实的接口数据，模拟后端返回逻辑，在小程序展示完整的购物场景与购物体验逻辑。

### 4. 添加新页面

1. 在 `pages `目录下创建对应的页面文件夹
2. 在 `app.json` 文件中的 ` "pages"` 数组中加上页面路径
3. [可选] 在 `project.config.json` 文件的 `"miniprogram-list"` 下添加页面配置

## :hammer: 构建运行

1. `npm install`
2. 小程序开发工具中引入工程
3. 构建 npm

## :art: 代码风格控制

`eslint` `prettier`

## :iphone: 基础库版本

最低基础库版本`^2.6.5`

## :dart: 反馈

企业微信群
TDesign 团队会及时在企业微信大群中同步发布版本、问题修复信息，也会有一些关于组件库建设的讨论，欢迎微信或企业微信扫码入群交流：

<img src="https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/doc/TDesign%20IM.png" width = "200" height = "200" alt="模版小程序页面详情" align=center />


邮件联系：tdesign@tencent.com

## :link: TDesign 其他技术栈实现

- 移动端 小程序 实现：[mobile-miniprogram](https://github.com/Tencent/tdesign-miniprogram)
- 桌面端 Vue 2 实现：[web-vue](https://github.com/Tencent/tdesign-vue)
- 桌面端 Vue 3 实现：[web-vue-next](https://github.com/Tencent/tdesign-vue-next)
- 桌面端 React 实现：[web-react](https://github.com/Tencent/tdesign-react)

## :fork_and_knife: 电子菜单改造更新

基于TDesign零售模板，我们将其改造为一个功能完善的餐厅电子菜单小程序。

### 主要更新内容

1. **数据模型调整**：
   - 将商品模型转换为菜品模型
   - 增加餐饮特有属性：辣度、烹饪时间、推荐度等
   - 使用真实菜品数据替换商品数据

2. **视觉体验升级**：
   - 使用Unsplash高质量食物图片
   - 优化首页轮播图，突出餐饮主题
   - 自定义菜品分类标签，增强用户体验

3. **餐饮功能扩展**：
   - 增加热门菜品、主食、热菜、凉菜等餐饮分类
   - 优化菜品详情页，展示更多餐饮相关信息
   - 添加营养信息和口味标签

4. **用户体验优化**：
   - 简化点餐流程
   - 优化菜品分类展示
   - 加强视觉反馈

5. **结算流程优化**：
   - 修复购物车结算传递数据问题
   - 完善立即购买功能逻辑
   - 增强订单确认页的健壮性和错误处理
   - 统一商品数据格式，确保各流程一致性
   - 简化订单确认页面，移除配送地址、优惠券和发票等不必要的组件
   - 优化订单确认页布局和样式，提升用户体验
   - 精简结算数据处理模型，移除不必要的逻辑
   - 改进订单确认UI，使其更贴合餐厅点餐场景
   - 简化下单流程，用户点击"立即下单"后直接生成订单，取消了支付环节
   - 使下单按钮交互更流畅，添加了点击反馈和视觉效果
   - 优化订单号生成逻辑，确保订单跟踪有效

### 技术改进

1. **代码结构优化**：
   - 改进数据服务层，支持多种数据源
   - 增强组件复用性
   - 模块化业务逻辑

2. **性能优化**：
   - 优化图片加载策略
   - 改进列表渲染性能
   - 优化数据请求逻辑

### 后续计划

1. **功能扩展**：
   - 扫码点餐功能
   - 桌号选择
   - 菜品评分系统
   - 会员系统集成

2. **营销功能**：
   - 特价菜推荐
   - 套餐推荐
   - 首次点餐优惠

3. **数据分析准备**：
   - 菜品点击率和转化率跟踪
   - 用户行为分析
   - 高峰时段分析

## :page_with_curl: 开源协议

TDesign 遵循 [MIT 协议](https://github.com/Tencent/tdesign-miniprogram-starter-retail/LICENSE).