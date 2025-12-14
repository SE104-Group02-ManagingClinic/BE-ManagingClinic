# BE-ManagingPassbook

## HƯỚNG DẪN SETUP
### 1. Cài đặt MySQL Server
- B1: Cài đặt MySQL Server theo hướng dẫn [tại đây](https://www.youtube.com/watch?v=NV13denKLtM)
- B2: Tạo database trên MySQL
- B3: Xem cơ sở dữ liệu:
  - B3.1: Dùng app MySQL Command Line Client đã tải ở bước 1
  - B3.2: `source <duong_dan_den_file_.sql>`
  - B3.3: `show databases;` để kiểm tra database đã được thêm hay chưa?
  - B3.4: `use clinic_db;` (tên user được khai báo trong file sql)
  - B3.5: `show tables;` để xem các bảng

### 2. Chạy backend
- Mở terminal trong repo đã kéo xuống và thực hiện tuần tự theo các lệnh dưới
```shell
# B1: Vị trí ban đầu là tại thư mục BE-MANAGINGCLINIC --> chuyển tới thư mục backend
cd .\backend\

# B2: Cài đặt các dependencies
npm install

# B3: Chạy server
node index.js
```
- Sau khi terminal hiển thị `Server is listening on port 5000` -> Mở đường link với URL: [http://localhost:5000/api-docs](http://localhost:5000/api-docs/) để xem các API

### 3. Các API 
- [x] Loại bệnh
- [x] Tham số
- [x] Bệnh nhân
- [x] Chức năng
- [x] Nhóm người dùng
- [x] Người dùng
- [x] Phân quyền
- [x] Cách dùng (thuốc)
- [x] Loại thuốc
- [x] Đơn vị tính
- [x] Phiếu nhập thuốc
- [x] CT báo cáo sử dụng thuốc
- [x] Báo cáo sử dụng thuốc
- [x] CT thuốc
- [x] CT bệnh
- [x] Phiếu khám bệnh
- [ ] Hóa đơn thanh toán
- [x] Báo cáo doanh thu
- [x] Chi tiết báo cáo doanh thu

## QUY TẮC LÀM VIỆC TRÊN GITHUB
- Trước khi bắt đầu làm, đọc kĩ quy trình làm việc với Git & GitHub [tại đây](https://www.figma.com/board/sAU9OhFxPQCTKGghPKQqbF/Quy-tr%C3%ACnh-Git-%26-GitHub?node-id=0-1&t=GYFBeSfRyeSQG1Zb-1).
- Chỉ commit khi hoàn thành 1 chức năng/ bug nào đó, không commit khi đang làm dở, không commit dồn.
- Ghi rõ nội dung commit: tiếng Việt, có dấu.
- Hoàn thành 1 task thì push vào branch của mình, không push vào nhánh main.
- Khi muốn task/feature merge vào main, tạo pull request (đã cài Protection rules), sau đó nhờ một bạn trong nhóm review code và approve pull request.
- Khi merge thành công --> xóa nhánh của mình --> thông báo cho team.
