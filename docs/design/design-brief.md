# 花漾生活 Design Brief

## Design Direction

花漾生活的新版視覺方向是「精品花禮 x 日系清雅」。整體要比一般學生作業型電商更接近真實花禮品牌：溫暖、乾淨、可信任，並保留購物與付款流程的實用性。

核心關鍵字：

- Premium Floral Gift
- Soft Luxury
- Warm Minimal
- Japanese Floral Boutique
- Elegant Checkout
- Gift Ceremony

## Visual System

色彩以暖白背景、柔玫瑰主色、鼠尾草綠狀態色、低飽和棕色文字與少量金色點綴構成。

- Background: `#FAF7F2`
- Surface: `#FFFFFF`
- Primary: `#C96F7F`
- Primary Dark: `#A95666`
- Secondary: `#8A6F5A`
- Accent Gold: `#D8B46A`
- Success: `#4F8A6D`
- Danger: `#B85C5C`
- Border: `#E9DED8`

字體方向：

- 主要標題使用高雅 serif / semi-serif，例如 `Noto Serif TC`
- 內文與操作介面使用清楚易讀的 sans-serif，例如 `Noto Sans TC`
- 結帳、訂單、付款頁優先確保資訊可掃描與按鈕易辨識

## Mascot Guide Assistant

既定角色資產：

```txt
docs/design/assets/mascot-guide.png
```

正式頁面若需要使用，請複製到：

```txt
public/images/mascot-guide.png
```

並在 EJS 中以以下路徑引用：

```txt
/images/mascot-guide.png
```

角色定位：

- 原創 Q 版花禮導覽小助手
- 僅作為品牌輔助視覺與狀態提示
- 可出現在商品列表、購物車、訂單詳情、付款結果頁
- 不重新產生角色圖片
- 不讓角色成為主要內容
- 不遮擋付款、訂單、商品資訊
- 風格維持精品花禮 x 日系清雅

使用原則：

- 商品列表：可在 hero 或導覽提示中小尺寸出現
- 購物車：可放在摘要附近或空購物車狀態
- 訂單詳情：可作為狀態說明輔助，但不可蓋過訂單編號、金額或狀態
- 付款結果：可作為慶祝或安撫型視覺，但付款結果、金額、下一步 CTA 必須優先

## Page Concepts

### Product List

重點是建立品牌第一印象與商品選購效率。首屏使用花禮情境圖、清楚品牌標題與 CTA，商品卡呈現圖片、名稱、場合說明、價格與加入購物車。

### Cart

購物車採雙欄：左側商品清單，右側訂單摘要。結帳 CTA 保持主要視覺層級，小助手只提供運費或下一步提醒。

### Order Detail

訂單詳情以狀態與訂單編號開場，接著是收件資訊、付款狀態說明、商品明細與可執行動作。行為規則沿用既有 order status logic。

### Payment Result

付款結果頁要清楚傳達成功或失敗狀態，包含訂單編號、付款金額、付款方式、綠界交易編號與後續動作。小助手可出現，但不可搶走結果資訊。

## Implementation Notes

- 不修改綠界 checksum 邏輯
- 不修改綠界 callback 邏輯
- 不修改 payment routes
- 不修改資料庫 schema
- 不移除既有 order status logic
- 正式 EJS/CSS redesign 應在設計確認後再開始
