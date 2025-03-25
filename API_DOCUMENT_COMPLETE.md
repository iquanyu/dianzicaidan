# 电子菜单小程序 Laravel API 接口文档

## 1. 概述

本文档详细描述了电子菜单小程序与Laravel后端API的交互规范。我们将使用RESTful API架构，JSON作为数据交换格式，JWT作为认证机制。

### 基本信息
- **基础URL**: `https://api.example.com/api/v1`
- **认证方式**: JWT (JSON Web Token)
- **内容类型**: `application/json`

### 响应格式标准

所有API响应都采用以下统一格式：

```json
{
  "code": "Success", // 状态码，Success表示成功，其他为错误代码
  "data": {}, // 响应数据主体
  "msg": null, // 提示信息，成功时通常为null
  "success": true, // 请求是否成功的布尔值
  "requestId": "req-xxxx" // 请求ID，用于追踪
}
```

### 错误处理

当API请求失败时，将返回以下格式：

```json
{
  "code": "ERROR_CODE", // 错误代码
  "data": null, // 无数据返回
  "msg": "错误详细描述", // 错误消息
  "success": false, // 请求失败
  "requestId": "req-xxxx" // 请求ID
}
```

## 2. 用户认证接口

### 2.1 微信登录

**接口**: `POST /auth/wechat-login`

**描述**: 通过微信小程序登录码获取用户信息并返回JWT token

**请求参数**:
```json
{
  "code": "微信登录code", // 微信登录时获取的code
  "userInfo": {
    "nickName": "用户昵称", // 用户微信昵称
    "avatarUrl": "用户头像URL", // 用户微信头像
    "gender": 1 // 性别：0未知，1男，2女
  }
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "token": "eyJhbGc...", // JWT token，用于后续接口认证
    "expires_in": 7200, // token有效期（秒）
    "user": {
      "id": 1, // 用户ID
      "openid": "wx_openid...", // 微信openid
      "nickname": "用户昵称", // 用户昵称
      "avatar": "头像URL", // 用户头像
      "phone": "手机号（如已绑定）", // 用户手机号
      "created_at": "2023-12-01T12:00:00Z" // 用户创建时间
    }
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

### 2.2 绑定手机号

**接口**: `POST /auth/bind-phone`

**描述**: 绑定用户手机号（需要认证）

**请求头**:
```
Authorization: Bearer {token} // JWT token
```

**请求参数**:
```json
{
  "encrypted_data": "加密数据", // 微信加密数据
  "iv": "加密算法的初始向量" // 加密算法的初始向量
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "phone": "13800138000" // 解密后的手机号
  },
  "msg": "手机号绑定成功",
  "success": true,
  "requestId": "req-xxxx"
}
```

## 3. 菜品分类与列表接口

### 3.1 获取首页数据

**接口**: `GET /home`

**描述**: 获取首页轮播图、菜品分类和推荐菜品

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "swiper": [ // 轮播图列表
      {
        "id": 1, // 轮播图ID
        "img_url": "轮播图1URL", // 轮播图图片URL
        "link_url": "跳转链接" // 点击跳转链接
      }
    ],
    "tabList": [ // 分类标签列表
      {
        "text": "热门菜品", // 标签文本
        "key": 0 // 标签标识
      }
    ],
    "recommendDishes": [ // 推荐菜品列表
      {
        "id": 101, // 菜品ID
        "title": "宫保鸡丁", // 菜品名称
        "price": "3800", // 菜品价格（单位：分）
        "originPrice": "4200", // 原价（单位：分）
        "desc": "菜品描述", // 菜品简短描述
        "thumb": "缩略图URL", // 菜品缩略图
        "spuId": "spu101", // 菜品SPU ID
        "primaryImage": "主图URL", // 菜品主图
        "images": ["图片URL"], // 菜品图片列表
        "tags": ["辣", "招牌"], // 菜品标签
        "spicy_level": 2, // 辣度等级：0-不辣，1-微辣，2-中辣，3-重辣
        "cooking_time": 15, // 烹饪时间（分钟）
        "recommendation": 5 // 推荐度：1-5
      }
    ]
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

### 3.2 获取菜品分类

**接口**: `GET /categories`

**描述**: 获取所有菜品分类

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "categoryList": [ // 分类列表
      {
        "id": 1, // 分类ID
        "name": "热门推荐", // 分类名称
        "icon": "图标URL", // 分类图标
        "sub_categories": [ // 子分类列表
          {
            "id": 101, // 子分类ID
            "name": "招牌菜", // 子分类名称
            "parent_id": 1 // 父分类ID
          }
        ]
      }
    ]
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

### 3.3 获取分类下菜品

**接口**: `GET /dishes`

**描述**: 获取指定分类下的菜品列表，支持分页和排序

**请求参数**:
```
category_id: 1 (可选，分类ID)
page: 1 (页码，默认1)
page_size: 20 (每页数量，默认20)
sort_type: price_asc (排序方式：综合排序-overall, 价格升序-price_asc, 价格降序-price_desc)
keyword: 搜索关键词 (可选)
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "totalCount": 100, // 总记录数
    "pageSize": 20, // 每页数量
    "currentPage": 1, // 当前页码
    "spuList": [ // 菜品列表
      {
        "id": 101, // 菜品ID
        "title": "宫保鸡丁", // 菜品名称
        "price": "3800", // 菜品价格（单位：分）
        "originPrice": "4200", // 原价（单位：分）
        "desc": "菜品描述", // 菜品描述
        "thumb": "缩略图URL", // 菜品缩略图
        "spuId": "spu101", // 菜品SPU ID
        "primaryImage": "主图URL", // 菜品主图
        "images": ["图片URL"], // 菜品图片列表
        "tags": ["辣", "招牌"], // 菜品标签
        "spicy_level": 2, // 辣度等级
        "cooking_time": 15, // 烹饪时间（分钟）
        "recommendation": 5, // 推荐度
        "stock_quantity": 100, // 库存数量
        "sold_count": 230, // 销量
        "has_spec": true // 是否有规格选项
      }
    ]
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

### 3.4 搜索菜品

**接口**: `GET /dishes/search`

**描述**: 根据关键词搜索菜品

**请求参数**:
```
keyword: 搜索关键词
page: 1
page_size: 20
```

**响应参数**: 与获取分类下菜品的响应格式相同

## 4. 菜品详情接口

### 4.1 获取菜品详情

**接口**: `GET /dishes/{spuId}`

**描述**: 获取指定菜品的详细信息

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "id": 101, // 菜品ID
    "title": "宫保鸡丁", // 菜品名称
    "price": "3800", // 菜品价格（单位：分）
    "originPrice": "4200", // 原价（单位：分）
    "desc": "经典川菜，选用鲜嫩鸡丁...", // 菜品简短描述
    "detail": "详细描述HTML", // 菜品详细描述（HTML格式）
    "thumb": "缩略图URL", // 菜品缩略图
    "spuId": "spu101", // 菜品SPU ID
    "primaryImage": "主图URL", // 菜品主图
    "images": ["图片1URL", "图片2URL"], // 菜品图片列表
    "tags": ["辣", "招牌"], // 菜品标签
    "spicy_level": 2, // 辣度等级
    "cooking_time": 15, // 烹饪时间（分钟）
    "recommendation": 5, // 推荐度
    "stock_quantity": 100, // 库存数量
    "sold_count": 230, // 销量
    "nutrition": { // 营养成分
      "calories": 350, // 卡路里
      "protein": "15g", // 蛋白质
      "fat": "12g", // 脂肪
      "carbs": "30g" // 碳水化合物
    },
    "specs": [ // 规格列表
      {
        "spec_id": 1, // 规格ID
        "spec_name": "份量", // 规格名称
        "spec_values": [ // 规格值列表
          {
            "value_id": 101, // 规格值ID
            "value": "小份", // 规格值名称
            "price_adjust": 0 // 价格调整（单位：分）
          },
          {
            "value_id": 102,
            "value": "大份",
            "price_adjust": 1000 // 加价10元
          }
        ]
      }
    ],
    "sku_list": [ // SKU列表
      {
        "sku_id": "sku10101", // SKU ID
        "spec_values": [101, 201], // 规格值ID列表
        "price": "3800", // SKU价格（单位：分）
        "stock_quantity": 30 // SKU库存
      }
    ],
    "related_dishes": [ // 相关菜品
      {
        "id": 102, // 菜品ID
        "title": "鱼香肉丝", // 菜品名称
        "price": "3600", // 菜品价格（单位：分）
        "thumb": "缩略图URL" // 菜品缩略图
      }
    ],
    "comments": { // 评论信息
      "total": 150, // 总评论数
      "good_rate": 0.95, // 好评率
      "top_comments": [ // 最新3条评论
        {
          "user_name": "张先生", // 用户昵称
          "avatar": "头像URL", // 用户头像
          "content": "味道不错，下次还会点", // 评论内容
          "rating": 5, // 评分（1-5）
          "images": ["评价图片URL"], // 评价图片
          "create_time": "2023-11-20T15:30:00Z" // 评论时间
        }
      ]
    }
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

## 5. 购物车接口

### 5.1 获取购物车列表

**接口**: `GET /cart`

**描述**: 获取用户购物车内容

**请求头**:
```
Authorization: Bearer {token}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "isNotEmpty": true,
    "storeGoods": [
      {
        "storeId": "1000",
        "storeName": "默认门店",
        "isSelected": true,
        "storeStockShortage": false,
        "promotionGoodsList": [
          {
            "promotionId": null,
            "goodsPromotionList": [
              {
                "id": 1,
                "spuId": "spu101",
                "skuId": "sku10101",
                "title": "宫保鸡丁",
                "price": "3800",
                "originPrice": "4200",
                "image": "菜品图片URL",
                "skuImage": "规格图片URL",
                "specInfo": "小份;微辣",
                "quantity": 2,
                "stockQuantity": 30,
                "stockStatus": 1,
                "isSelected": true
              }
            ]
          }
        ],
        "shortageGoodsList": []
      }
    ],
    "invalidGoodItems": []
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

### 5.2 添加商品到购物车

**接口**: `POST /cart/add`

**描述**: 添加菜品到购物车

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "spuId": "spu101",
  "skuId": "sku10101",
  "quantity": 1,
  "specInfo": "小份;微辣" // 规格信息文本
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "cart_count": 5 // 购物车总数量
  },
  "msg": "添加成功",
  "success": true,
  "requestId": "req-xxxx"
}
```

### 5.3 更新购物车商品数量

**接口**: `PUT /cart/update`

**描述**: 更新购物车内商品数量

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "spuId": "spu101",
  "skuId": "sku10101", 
  "quantity": 2
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {},
  "msg": "更新成功",
  "success": true,
  "requestId": "req-xxxx"
}
```

### 5.4 删除购物车商品

**接口**: `DELETE /cart/remove`

**描述**: 从购物车中删除指定商品

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "items": [
    {
      "spuId": "spu101",
      "skuId": "sku10101"
    }
  ]
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {},
  "msg": "删除成功",
  "success": true,
  "requestId": "req-xxxx"
}
```

### 5.5 清空购物车

**接口**: `DELETE /cart/clear`

**描述**: 清空购物车

**请求头**:
```
Authorization: Bearer {token}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {},
  "msg": "购物车已清空",
  "success": true,
  "requestId": "req-xxxx"
}
```

### 5.6 更新购物车商品选中状态

**接口**: `PUT /cart/select`

**描述**: 更新购物车内商品选中状态

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "spuId": "spu101",
  "skuId": "sku10101",
  "isSelected": true
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {},
  "msg": "更新成功",
  "success": true,
  "requestId": "req-xxxx"
}
```

## 6. 订单接口

### 6.1 获取结算详情

**接口**: `POST /orders/settle`

**描述**: 获取订单结算页相关数据

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "goodsRequestList": [
    {
      "spuId": "spu101",
      "skuId": "sku10101",
      "quantity": 2,
      "price": "3800",
      "specText": "小份 | 微辣",
      "image": "图片URL",
      "title": "宫保鸡丁"
    }
  ]
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "settleType": 1,
    "totalGoodsCount": 2,
    "packageCount": 1,
    "totalAmount": "7600",
    "totalPayAmount": "7600",
    "totalSalePrice": "7600",
    "storeGoodsList": [
      {
        "storeId": "1000",
        "storeName": "默认门店",
        "goodsCount": 2,
        "skuDetailVos": [
          {
            "spuId": "spu101",
            "skuId": "sku10101",
            "goodsName": "宫保鸡丁",
            "image": "图片URL",
            "quantity": 2,
            "payPrice": "3800",
            "totalSkuPrice": "7600",
            "settlePrice": "3800",
            "skuSpecLst": [
              {
                "specTitle": "份量",
                "specValue": "小份"
              },
              {
                "specTitle": "辣度",
                "specValue": "微辣"
              }
            ]
          }
        ]
      }
    ]
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

### 6.2 提交订单

**接口**: `POST /orders`

**描述**: 提交订单

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "goodsRequestList": [
    {
      "spuId": "spu101",
      "skuId": "sku10101",
      "quantity": 2,
      "price": "3800",
      "specText": "小份 | 微辣"
    }
  ],
  "totalAmount": "7600",
  "storeInfoList": [
    {
      "storeId": "1000",
      "storeName": "默认门店",
      "remark": "不要葱"
    }
  ],
  "tableNumber": "A15", // 桌号
  "dinnerTime": "2023-12-15T18:30:00Z" // 用餐时间（可选）
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "settleType": 1,
    "tradeNo": "202312151830000001", // 订单号
    "channel": "wechat",
    "payInfo": null, // 不需要支付，直接下单
    "interactId": null,
    "transactionId": null
  },
  "msg": "下单成功",
  "success": true,
  "requestId": "req-xxxx"
}
```

### 6.3 获取订单列表

**接口**: `GET /orders`

**描述**: 获取用户订单列表

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```
status: 1 (订单状态：1-待处理，10-处理中，40-已完成，60-已评价，0-退款/售后)
page: 1
page_size: 10
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "totalCount": 25,
    "pageSize": 10,
    "currentPage": 1,
    "orderList": [
      {
        "orderId": 1,
        "orderNo": "202312151830000001",
        "orderStatus": 1,
        "orderStatusName": "待处理",
        "paymentAmount": "7600",
        "paymentVO": {
          "paymentType": 0,
          "paySuccessTime": null
        },
        "createTime": "2023-12-15T18:30:00Z",
        "finishTime": null,
        "orderItemVOs": [
          {
            "id": 1,
            "goodsName": "宫保鸡丁",
            "goodsPictureUrl": "图片URL",
            "specifications": [
              {
                "specTitle": "份量",
                "specValue": "小份"
              },
              {
                "specTitle": "辣度",
                "specValue": "微辣"
              }
            ],
            "buyQuantity": 2,
            "actualPrice": "3800",
            "spuId": "spu101",
            "skuId": "sku10101"
          }
        ],
        "tableNumber": "A15",
        "dinnerTime": "2023-12-15T18:30:00Z"
      }
    ]
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

### 6.4 获取订单详情

**接口**: `GET /orders/{orderNo}`

**描述**: 获取指定订单的详细信息

**请求头**:
```
Authorization: Bearer {token}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "orderId": 1,
    "orderNo": "202312151830000001",
    "parentOrderNo": null,
    "storeId": "1000",
    "storeName": "默认门店",
    "orderStatus": 1,
    "orderStatusName": "待处理",
    "paymentAmount": "7600",
    "goodsAmountApp": "7600",
    "createTime": "2023-12-15T18:30:00Z",
    "paymentVO": {
      "paymentType": 0,
      "paySuccessTime": null
    },
    "tableNumber": "A15",
    "dinnerTime": "2023-12-15T18:30:00Z",
    "orderItemVOs": [
      {
        "id": 1,
        "goodsName": "宫保鸡丁",
        "goodsPictureUrl": "图片URL",
        "specifications": [
          {
            "specTitle": "份量",
            "specValue": "小份"
          },
          {
            "specTitle": "辣度",
            "specValue": "微辣"
          }
        ],
        "buyQuantity": 2,
        "actualPrice": "3800",
        "spuId": "spu101",
        "skuId": "sku10101"
      }
    ],
    "remarks": "不要葱",
    "buttonVOs": [
      {
        "code": "APPLY_REFUND",
        "name": "申请退款",
        "primary": true
      }
    ]
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

### 6.5 取消订单

**接口**: `POST /orders/{orderNo}/cancel`

**描述**: 取消指定订单

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "cancelReason": "我不想要了"
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {},
  "msg": "订单已取消",
  "success": true,
  "requestId": "req-xxxx"
}
```

## 7. 评价接口

### 7.1 提交评价

**接口**: `POST /comments`

**描述**: 为订单提交评价

**请求头**:
```
Authorization: Bearer {token} // 需要用户登录
```

**请求参数**:
```json
{
  "order_no": "202312151830000001", // 订单号
  "dish_id": 101, // 菜品ID (dish_id和spu_id二选一)
  "spu_id": "spu101", // 菜品SPU ID (dish_id和spu_id二选一)
  "sku_id": "sku10101", // 菜品SKU ID (可选)
  "rating": 5, // 评分(1-5)
  "content": "味道很好，下次还会点", // 评价内容
  "images": ["图片URL1", "图片URL2"], // 评价图片URL数组
  "is_anonymous": false, // 是否匿名
  "overall_rating": 5 // 总体评分(1-5)
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {},
  "msg": "评价提交成功",
  "success": true,
  "requestId": "req-xxxx"
}
```

### 7.2 获取菜品评价列表

**接口**: `GET /dishes/{spuId}/comments`

**描述**: 获取指定菜品的评价列表，支持多种筛选方式

**请求参数**:
```
filter_type: all       // 筛选类型：all-全部评论，good-好评(4-5星)，medium-中评(3星)，bad-差评(1-2星)，image-带图，self-我的评论
page: 1                // 页码，默认1
page_size: 10          // 每页数量，默认10
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "totalCount": 150, // 总评论数
    "goodRate": 0.95, // 好评率
    "averageRating": 4.8, // 平均评分
    "ratingDistribution": { // 各星级评论分布
      "5": 135, // 5星评论数
      "4": 10, // 4星评论数
      "3": 3, // 3星评论数
      "2": 1, // 2星评论数
      "1": 1 // 1星评论数
    },
    "filterCounts": { // 各筛选条件下的评论数量
      "all": 150, // 全部评论数
      "good": 145, // 好评数
      "medium": 3, // 中评数
      "bad": 2, // 差评数
      "image": 75, // 带图评论数
      "self": 3 // 用户自己的评论数(未登录时为0)
    },
    "commentList": [ // 评论列表
      {
        "id": 1, // 评论ID
        "user_name": "张先生", // 用户昵称(匿名时显示"匿名用户")
        "avatar": "头像URL", // 用户头像
        "content": "味道不错，下次还会点", // 评价内容
        "rating": 5, // 评分
        "images": ["评价图片URL1", "评价图片URL2"], // 评价图片
        "specs": "小份 | 微辣", // 规格信息
        "create_time": "2023-11-20T15:30:00Z", // 评论时间
        "reply": "感谢您的评价，欢迎再次光临！", // 商家回复(如有)
        "is_self": false // 是否是当前登录用户的评论
      }
    ],
    "current_page": 1, // 当前页码
    "total_pages": 15, // 总页数
    "page_size": 10 // 每页数量
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

**筛选类型说明**:

1. **全部评论(all)**: 显示所有评论
2. **好评(good)**: 显示评分为4-5星的评论
3. **中评(medium)**: 显示评分为3星的评论
4. **差评(bad)**: 显示评分为1-2星的评论
5. **带图评论(image)**: 显示包含图片的评论
6. **我的评论(self)**: 显示当前登录用户发表的评论(需要用户登录)

### 7.3 获取用户评论列表

**接口**: `GET /comments`

**描述**: 获取当前登录用户的所有评价记录

**请求头**:
```
Authorization: Bearer {token} // 需要用户登录
```

**请求参数**:
```
per_page: 10 // 每页数量，默认10
page: 1 // 页码，默认1
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "comments": [ // 评论列表
      {
        "id": 1, // 评论ID
        "user_id": 1, // 用户ID
        "order_id": 1, // 订单ID
        "order_no": "202312151830000001", // 订单号
        "dish_id": 101, // 菜品ID
        "dish": { // 菜品信息
          "id": 101,
          "title": "宫保鸡丁",
          "thumb": "菜品图片URL"
        },
        "sku_id": "sku10101", // SKU ID
        "rating": 5, // 评分
        "content": "味道很好，下次还会点", // 评价内容
        "images": ["评价图片URL1", "评价图片URL2"], // 评价图片
        "spec_info": "小份 | 微辣", // 规格信息
        "is_anonymous": false, // 是否匿名
        "created_at": "2023-11-20T15:30:00Z" // 评论时间
      }
    ],
    "pagination": { // 分页信息
      "total": 25, // 总记录数
      "per_page": 10, // 每页数量
      "current_page": 1, // 当前页码
      "last_page": 3 // 最后一页
    }
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

## 8. 个人中心接口

### 8.1 获取用户信息

**接口**: `GET /user`

**描述**: 获取当前登录用户的信息

**请求头**:
```
Authorization: Bearer {token}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "userInfo": {
      "id": 1,
      "nickName": "用户昵称",
      "avatarUrl": "头像URL",
      "phone": "手机号码",
      "gender": 1
    },
    "countsData": [
      {
        "type": "order",
        "num": 5
      },
      {
        "type": "coupon",
        "num": 2
      }
    ],
    "orderTagInfos": [
      {
        "title": "待处理",
        "orderNum": 1,
        "tabType": 1,
        "status": 1
      },
      {
        "title": "处理中",
        "orderNum": 2,
        "tabType": 10,
        "status": 1
      },
      {
        "title": "已完成",
        "orderNum": 1,
        "tabType": 40,
        "status": 1
      },
      {
        "title": "待评价",
        "orderNum": 1,
        "tabType": 60,
        "status": 1
      },
      {
        "title": "退款/售后",
        "orderNum": 0,
        "tabType": 0,
        "status": 0
      }
    ],
    "customerServiceInfo": {
      "servicePhone": "4006666666",
      "serviceWorkTime": "每周三至周日 9:00-18:00"
    }
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

### 8.2 更新用户信息

**接口**: `PUT /user`

**描述**: 更新用户个人信息

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "nickName": "新的昵称",
  "gender": 1
}
```

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "userInfo": {
      "nickName": "新的昵称",
      "gender": 1
    }
  },
  "msg": "更新成功",
  "success": true,
  "requestId": "req-xxxx"
}
```

## 9. 系统配置接口

### 9.1 获取门店信息

**接口**: `GET /store`

**描述**: 获取门店基本信息

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "storeId": "1000",
    "storeName": "默认门店",
    "logo": "门店Logo",
    "address": "门店地址",
    "telphone": "联系电话",
    "longitude": 116.397428,
    "latitude": 39.90923,
    "businessTime": ["10:00-14:00", "17:00-22:00"],
    "announcement": "门店公告内容"
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

### 9.2 获取系统配置

**接口**: `GET /config`

**描述**: 获取系统全局配置

**响应参数**:
```json
{
  "code": "Success",
  "data": {
    "appName": "电子菜单",
    "contactPhone": "400-123-4567",
    "serviceTimes": "9:00-18:00",
    "agreementUrl": "用户协议URL",
    "privacyUrl": "隐私政策URL",
    "aboutUsUrl": "关于我们URL"
  },
  "msg": null,
  "success": true,
  "requestId": "req-xxxx"
}
```

## 10. Laravel 后端搭建所需的数据表结构

以下是实现上述API接口所需的主要数据表结构：

1. `users` - 用户表
2. `dish_categories` - 菜品分类表
3. `dishes` - 菜品表
4. `dish_specs` - 菜品规格表
5. `dish_spec_values` - 菜品规格值表
6. `dish_skus` - 菜品SKU表
7. `cart_items` - 购物车表
8. `orders` - 订单表
9. `order_items` - 订单项目表
10. `comments` - 评价表
11. `stores` - 门店表
12. `system_configs` - 系统配置表 