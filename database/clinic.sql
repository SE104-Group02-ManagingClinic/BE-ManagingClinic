CREATE DATABASE IF NOT EXISTS CLINIC_DB;
USE CLINIC_DB;


-- Bảng lưu trữ thông tin về các loại bệnh
CREATE TABLE BENH (
    MaBenh VARCHAR(5) PRIMARY KEY,
    TenBenh NVARCHAR(255) NOT NULL,
    MoTa NVARCHAR(500)
);

-- Bảng lưu trữ thông tin bệnh nhân
CREATE TABLE BENHNHAN (
    MaBN VARCHAR(10) NOT NULL PRIMARY KEY,
    HoTenBN NVARCHAR(255) NOT NULL,
    NgaySinh DATE,
    GioiTinh NVARCHAR(50),
    DiaChi NVARCHAR(500),
    SDT VARCHAR(20)
);

-- Bảng lưu trữ thông tin đơn vị tính của thuốc (viên, hộp, chai,...)
CREATE TABLE DONVITINH (
    MaDVT VARCHAR(10) PRIMARY KEY,
    TenDVT NVARCHAR(50) NOT NULL
);

-- Bảng lưu trữ thông tin các loại thuốc
CREATE TABLE LOAITHUOC (
    MaLoaiThuoc VARCHAR(10) PRIMARY KEY,
    TenLoaiThuoc NVARCHAR(255) NOT NULL,
    MaDVT VARCHAR(10),
    GiaBan DECIMAL(18, 2) NOT NULL,
    FOREIGN KEY (MaDVT) REFERENCES DONVITINH(MaDVT)
);

-- Bảng lưu trữ cách dùng thuốc
CREATE TABLE CACHDUNG (
    MaCachDung VARCHAR(10) PRIMARY KEY,
    TenCachDung NVARCHAR(255) NOT NULL,
    MoTa NVARCHAR(500)
);

-- Bảng lưu trữ thông tin người dùng (Bác sĩ, nhân viên,...)
CREATE TABLE NGUOIDUNG (
    MaND VARCHAR(10) PRIMARY KEY,
    TenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    HoTenND NVARCHAR(255) NOT NULL
);

-- Bảng lưu trữ vai trò của người dùng (Admin, Bác sĩ, Thu ngân,...)
CREATE TABLE VAITRONGUOIDUNG (
    MaVaiTro VARCHAR(10) PRIMARY KEY,
    TenVaiTro NVARCHAR(50) NOT NULL
);

-- Bảng liên kết Người Dùng và Vai Trò (để 1 người có thể có nhiều vai trò)
CREATE TABLE NGUOIDUNG_VAITRO (
    MaND VARCHAR(10),
    MaVaiTro VARCHAR(10),
    PRIMARY KEY (MaND, MaVaiTro),
    FOREIGN KEY (MaND) REFERENCES NGUOIDUNG(MaND),
    FOREIGN KEY (MaVaiTro) REFERENCES VAITRONGUOIDUNG(MaVaiTro)
);

-- Bảng Phiếu Khám Bệnh (Chứa thông tin khám bệnh tổng quát)
CREATE TABLE PHIEUKHAMBENH (
    MaPKB VARCHAR(10) PRIMARY KEY,
    MaBN VARCHAR(10), -- Khóa ngoại từ BENHNHAN
    MaBacSi VARCHAR(10), -- Giả định là MaND của NGUOIDUNG
    NgayKham DATETIME NOT NULL,
    ChuanDoan NVARCHAR(500),
    TongTienKham DECIMAL(18, 2) DEFAULT 0,
    FOREIGN KEY (MaBN) REFERENCES BENHNHAN(MaBN),
    FOREIGN KEY (MaBacSi) REFERENCES NGUOIDUNG(MaND)
);

-- Bảng Chi Tiết Bệnh của Phiếu Khám Bệnh (Nhiều bệnh trong 1 lần khám)
CREATE TABLE CT_BENH (
    MaPKB VARCHAR(10),
    MaBenh VARCHAR(10),
    GhiChu NVARCHAR(500),
    PRIMARY KEY (MaPKB, MaBenh),
    FOREIGN KEY (MaPKB) REFERENCES PHIEUKHAMBENH(MaPKB),
    FOREIGN KEY (MaBenh) REFERENCES BENH(MaBenh)
);

-- Bảng Chi Tiết Thuốc trong Phiếu Khám Bệnh (Đơn thuốc)
CREATE TABLE CT_THUOC (
    MaCTThuoc INT PRIMARY KEY AUTO_INCREMENT,
    MaPKB VARCHAR(10),
    MaLoaiThuoc VARCHAR(10),
    SoLuong INT NOT NULL,
    MaCachDung VARCHAR(10), -- Khóa ngoại từ CACHDUNG
    GhiChu NVARCHAR(500),
    FOREIGN KEY (MaPKB) REFERENCES PHIEUKHAMBENH(MaPKB),
    FOREIGN KEY (MaLoaiThuoc) REFERENCES LOAITHUOC(MaLoaiThuoc),
    FOREIGN KEY (MaCachDung) REFERENCES CACHDUNG(MaCachDung)
);

-- Bảng Phiếu Nhập Thuốc
CREATE TABLE PHIEUNHAPTHUOC (
    MaPNT VARCHAR(10) PRIMARY KEY,
    NgayNhap DATE NOT NULL,
    MaNguoiLap VARCHAR(10), -- Giả định là MaND của NGUOIDUNG
    TongTienNhap DECIMAL(18, 2) DEFAULT 0,
    FOREIGN KEY (MaNguoiLap) REFERENCES NGUOIDUNG(MaND)
);

-- Bảng Chi Tiết Phiếu Nhập Thuốc
CREATE TABLE CT_NHAPTHUOC (
    MaPNT VARCHAR(10),
    MaLoaiThuoc VARCHAR(10),
    SoLuongNhap INT NOT NULL,
    DonGiaNhap DECIMAL(18, 2) NOT NULL,
    PRIMARY KEY (MaPNT, MaLoaiThuoc),
    FOREIGN KEY (MaPNT) REFERENCES PHIEUNHAPTHUOC(MaPNT),
    FOREIGN KEY (MaLoaiThuoc) REFERENCES LOAITHUOC(MaLoaiThuoc)
);

-- Bảng Thông Số liên quan đến thuốc (VD: Hạn sử dụng, lô sản xuất,...)
CREATE TABLE THAMSO (
    MaTS VARCHAR(10) PRIMARY KEY,
    TenTS NVARCHAR(255) NOT NULL,
    GiaTriTS NVARCHAR(255)
);

-- Bảng Chi Tiết Báo Cáo Sử Dụng Thuốc
CREATE TABLE CT_BCSDT (
    MaCTBCSDT INT PRIMARY KEY AUTO_INCREMENT,
    MaLoaiThuoc VARCHAR(10),
    ThangNam DATE, -- Tháng và Năm của báo cáo
    SoLuongSuDung INT DEFAULT 0,
    FOREIGN KEY (MaLoaiThuoc) REFERENCES LOAITHUOC(MaLoaiThuoc)
);

-- Bảng Báo Cáo Sử Dụng Thuốc (Tổng hợp)
CREATE TABLE BAOCAOSUDUNGTHUOC (
    MaBCSDT VARCHAR(10) PRIMARY KEY,
    ThangNamBC DATE NOT NULL,
    NguoiLap VARCHAR(10), -- Giả định là MaND của NGUOIDUNG
    FOREIGN KEY (NguoiLap) REFERENCES NGUOIDUNG(MaND)
);

-- Bảng Hóa Đơn Thanh Toán (Lưu trữ thông tin thanh toán cho Phiếu Khám Bệnh)
CREATE TABLE HOADONTHANHTOAN (
    MaHDTT VARCHAR(10) PRIMARY KEY,
    MaPKB VARCHAR(10) UNIQUE, -- Khóa ngoại từ PHIEUKHAMBENH (1 PKB chỉ có 1 HDTT)
    NgayLap DATE NOT NULL,
    TongTien DECIMAL(18, 2) NOT NULL,
    MaNguoiThu VARCHAR(10), -- Giả định là MaND của NGUOIDUNG
    FOREIGN KEY (MaPKB) REFERENCES PHIEUKHAMBENH(MaPKB),
    FOREIGN KEY (MaNguoiThu) REFERENCES NGUOIDUNG(MaND)
);

-- Bảng Báo Cáo Doanh Thu (Tổng hợp)
CREATE TABLE BAOCAO DOANHTHU (
    MaBCDT VARCHAR(10) PRIMARY KEY,
    NgayThangNam DATE NOT NULL, -- Ngày, tháng hoặc năm của báo cáo
    TongDoanhThu DECIMAL(18, 2) DEFAULT 0,
    NguoiLap VARCHAR(10), -- Giả định là MaND của NGUOIDUNG
    FOREIGN KEY (NguoiLap) REFERENCES NGUOIDUNG(MaND)
);

-- Bảng Chi Tiết Báo Cáo Doanh Thu (Chi tiết theo từng hóa đơn, loại dịch vụ/thuốc...)
CREATE TABLE CT_BCDT (
    MaBCDT VARCHAR(10),
    MaHDTT VARCHAR(10),
    ChiTietDoanhThu DECIMAL(18, 2),
    PRIMARY KEY (MaBCDT, MaHDTT),
    FOREIGN KEY (MaBCDT) REFERENCES BAOCAO_DOANHTHU(MaBCDT),
    FOREIGN KEY (MaHDTT) REFERENCES HOADONTHANHTOAN(MaHDTT)
);