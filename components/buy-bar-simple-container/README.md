# buy-bar-simple-container 组件

## 组件介绍

`buy-bar-simple-container` 是一个简化版的购物车底部栏容器组件，用于在菜品分类页面底部显示购物车信息和结算按钮。该组件封装了 `buy-bar-simple` 组件，并负责处理与父组件的事件交互。

## 功能特点

- 显示购物车商品数量和总价
- 提供加入购物车和结算功能
- 支持底部安全区域适配（如iPhone X及以上机型）
- 优化的购物车弹出层，采用上下布局避免水平滚动问题

## 使用方法

```xml
<buy-bar-simple-container
  cartNum="{{cartNum}}"
  totalPrice="{{totalPrice}}"
  cartList="{{cartList}}"
  showMinPrice="{{true}}"
  minPrice="{{15}}"
  isIPhoneX="{{isIPhoneX}}"
  bind:toAddCart="toAddCart"
  bind:toBuyNow="toBuyNow"
  bind:fetchCartList="fetchCartList"
  bind:clearCart="clearCart"
  bind:updateCartItem="updateCartItem"
/>
```

## 属性说明

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|-----|------|-------|-----|------|
| cartNum | Number | 0 | 否 | 购物车商品总数 |
| totalPrice | Number/String | 0 | 否 | 购物车总价 |
| cartList | Array | [] | 否 | 购物车商品列表 |
| showMinPrice | Boolean | false | 否 | 是否显示起送价 |
| minPrice | Number/String | 0 | 否 | 起送价（元） |
| isIPhoneX | Boolean | false | 否 | 是否为iPhone X及以上机型 |

## 事件说明

| 事件名 | 说明 | 返回参数 |
|-------|------|---------|
| toAddCart | 点击加入购物车按钮时触发 | 无 |
| toBuyNow | 点击去结算按钮时触发 | 无 |
| fetchCartList | 获取购物车列表时触发 | 无 |
| clearCart | 清空购物车时触发 | 无 |
| updateCartItem | 更新购物车商品数量时触发 | {id: 商品ID, num: 更新后的数量} |

## 防止水平滚动的优化

为了解决页面水平滚动的问题，我们采取了以下优化措施：

1. **容器样式优化**：为组件容器添加 `overflow-x: hidden` 属性，确保内容不会溢出导致水平滚动。

```css
.buy-bar-simple-container {
  width: 100%;
  overflow-x: hidden;
  max-width: 100vw;
  box-sizing: border-box;
}
```

2. **弹出层布局优化**：采用优化的商品项布局，商品图片在左侧，右侧包含商品名称、规格和价格，右侧为数量控制。

```xml
<view class="cart-item">
  <view class="item-main">
    <!-- 左侧图片 -->
    <image class="item-image" src="{{item.thumb}}" mode="aspectFill"></image>
    
    <!-- 右侧商品信息 -->
    <view class="item-info">
      <!-- 商品名称 -->
      <view class="item-name">{{item.name}}</view>
      <!-- 商品规格 -->
      <view class="item-spec" wx:if="{{item.specText}}">{{item.specText}}</view>
      <!-- 商品价格 - 放在名称下方 -->
      <view class="item-price">¥{{item.price}}</view>
    </view>
    
    <!-- 数量控制 -->
    <view class="item-stepper">
      <!-- 加减按钮 -->
    </view>
  </view>
</view>
```

3. **弹性盒布局优化**：合理使用 `flex-shrink` 和 `min-width: 0` 确保弹性元素在空间不足时能够正确收缩。

4. **文本处理**：对长文本使用 `text-overflow: ellipsis` 和 `white-space: nowrap` 确保文本不会溢出容器。 