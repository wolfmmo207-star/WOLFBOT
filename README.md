*XIN LỖI VÌ BOT CÒN QUÁ NHIỀU LỖI CHƯA ĐƯỢC SỬA HẾT Ạ , MONG MỌI NGƯỜI THÔNG CẢM VÀ ĐỪNG SỬ DỤNG*

Những gì được sửa đều ghi trong FIXES_SUMMARY.md

👉 Bot được *mod lại từ Mirai*, *Niio*, *Lunar-Krystal* và nhiều source khác.


---

# 🐺 **WOLFBOT – Messenger Bot All-in-One**

WOLFBOT là một dự án **bot Messenger đa năng**, được xây dựng dựa trên việc **mod lại và nâng cấp** từ nhiều nền tảng bot nổi tiếng như **Mirai**, **Niio**, **Lunar-Krystal** và nhiều module của cộng đồng. Dự án được chỉnh sửa sâu, tái cấu trúc, bổ sung chức năng, tối ưu hoá hiệu năng và thêm nhiều hệ thống mới để phù hợp với trải nghiệm người dùng hiện đại.

Bot hướng tới mục tiêu:
**Ổn định – Mạnh mẽ – Dễ tùy chỉnh – Hỗ trợ AI hoàn chỉnh.**

---

## 🚀 **Tính năng chính**

### ⚙️ *Quản lý nhóm*

* Tag All tất cả thành viên
* Kick thành viên theo ID hoặc theo BXH
* Đổi biệt danh thành viên
* Chào mừng người mới, tạm biệt người rời nhóm
* Tự động cập nhật bảng xếp hạng tin nhắn mỗi ngày

### 🤖 *Hệ thống AI*

* Chat AI từ ChatGPT, Simi, goibot1
* Tối ưu phản hồi “giống người thật”
* Chat thông minh tránh bị checkpoint

### 🛠️ *Tiện ích đa năng*

* Menu lệnh
* Gửi ảnh random
* Gửi tin nhắn thoại (TTS)
* Tìm kiếm Google
* Tra cứu tỷ giá
* Phát nhạc / xử lý yêu cầu YouTube
* Hệ thống thuê bot tự động (nếu bật)

---

## 🧬 **Nguồn gốc & cấu trúc**

WOLFBOT được mod lại từ nhiều mã nguồn khác nhau:

### 🟣 **Dựa theo MiraiBot**

* Hệ thống lệnh mô-đun
* Cấu trúc command handler
* Cơ chế load plugin

### 🔵 **Dựa theo Niio & NiioV3**

* Cách quản lý API Facebook
* Một số lệnh quản lý nhóm
* Công cụ đăng nhập nhanh

### 🟢 **Dựa theo Lunar-Krystal**

* Hệ thống AI goibot1, sim.js
* Một số module tiện ích
* Các function hỗ trợ Messenger

### 🟡 **Và nhiều file khác từ cộng đồng**

* Các module: random ảnh, TTS, currency, google search…
* Nhiều lệnh nhỏ được chỉnh sửa lại hoàn toàn
* Hệ thống thuê bot được viết lại và mở rộng

Bot hiện đã được **tái thiết kế lớn**, sửa lỗi, tối ưu và đồng bộ hóa để phù hợp với cách hoạt động của Facebook hiện tại.

---

## 📦 **Cài đặt**

### 1. Clone source

```
git clone https://github.com/ngdgnam/WOLFBOT.git
cd WOLFBOT
```

### 2. Cài thư viện

```
npm i
```

### 3. Cấu hình

* `config.json` – cấu hình chính
* `sim.js`, `goibot.js`, `Wolfsamson.js` – module AI + Monitor
* `modules/commands/` – nơi chứa các lệnh

### 4. Chạy bot

```
npm start
```

---

## 🧨 **Lỗi đang có (được bảo toàn nguyên gốc)**

Vì dự án được mod từ nhiều source nên một số lỗi gốc vẫn tồn tại:

### ❗ Lỗi chung

* Các module không đồng bộ API
* Một số lệnh chưa kiểm tra quyền admin
* Lỗi EPERM khi cài npm trên Termux/Windows
* Một số thư viện cũ cần cập nhật

### ❗ Lỗi phần hệ thống *Thuê Bot*

* Chưa ổn định timer
* Khi hết thời gian đôi khi không tự tắt
* Database chưa lock → dễ ghi đè
* Một số điều kiện thuê chưa hoàn chỉnh

Các lỗi này sẽ được bảo toàn vì bạn yêu cầu **giữ toàn bộ "lỗi gốc" của source**.

---

## ❤️ **Đóng góp & phát triển**

Dự án mở hoàn toàn. Bạn có thể:

* Fork
* Đóng góp module
* Báo lỗi
* Tối ưu lại code

WOLFBOT luôn sẵn sàng để nâng cấp thêm chức năng mới.

---

## 📬 **Liên hệ**

Nếu cần sửa lỗi, bổ sung tính năng hoặc tối ưu toàn bộ code, hãy liên hệ chủ dự án qua GitHub hoặc Messenger.

---
