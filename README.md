# BE-ManagingPassbook

## HƯỚNG DẪN SETUP
### 1. Cài đặt MySQL Server
- B1: Cài đặt MySQL Server theo hướng dẫn [tại đây](https://www.youtube.com/watch?v=NV13denKLtM)
- B2: Tạo database trên MySQL

### 2. Chạy backend
```shell
# B1: Vị trí ban đầu là tại thư mục BE-MANAGINGCLINIC --> chuyển tới thư mục backend
cd .\backend\

# B2: Cài đặt các dependencies
npm install

# B3: Chạy server
node index.js
```

## QUY TẮC LÀM VIỆC TRÊN GITHUB
- Trước khi bắt đầu làm, đọc kĩ quy trình làm việc với Git & GitHub [tại đây](https://www.figma.com/board/sAU9OhFxPQCTKGghPKQqbF/Quy-tr%C3%ACnh-Git-%26-GitHub?node-id=0-1&t=GYFBeSfRyeSQG1Zb-1).
- Chỉ commit khi hoàn thành 1 chức năng/ bug nào đó, không commit khi đang làm dở, không commit dồn.
- Ghi rõ nội dung commit: tiếng Việt, có dấu.
- Hoàn thành 1 task thì push vào branch của mình, không push vào nhánh main.
- Khi muốn task/feature merge vào main, tạo pull request (đã cài Protection rules), sau đó nhờ một bạn trong nhóm review code và approve pull request.
- Khi merge thành công --> xóa nhánh của mình --> thông báo cho team.
