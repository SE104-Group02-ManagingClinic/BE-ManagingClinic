CREATE DATABASE IF NOT EXISTS CLINIC_DB;
USE CLINIC_DB;

CREATE TABLE CHUCNANG(
    MaChucNang VARCHAR(5) PRIMARY KEY,
    TenChucNang VARCHAR(30) UNIQUE,
    TenManHinhDuocLoad TEXT
);

CREATE TABLE NHOMNGUOIDUNG(
    MaNhom VARCHAR(5) PRIMARY KEY,
    TenNhom VARCHAR(20) UNIQUE
);

CREATE TABLE PHANQUYEN(
    MaNhom VARCHAR(5),
    MaChucNang VARCHAR(5),
    PRIMARY KEY(MaNhom, MaChucNang),
    FOREIGN KEY (MaNhom) REFERENCES NHOMNGUOIDUNG(MaNhom),
    FOREIGN KEY (MaChucNang) REFERENCES CHUCNANG(MaChucNang)
);

CREATE TABLE NGUOIDUNG(
    TenDangNhap VARCHAR(60) PRIMARY KEY,
    MatKhau VARCHAR(60),
    MaNhom VARCHAR(5),
    FOREIGN KEY (MaNhom)  REFERENCES NHOMNGUOIDUNG(MaNhom)
);

-- Bảng lưu trữ thông tin về các loại bệnh
CREATE TABLE BENH (
    MaBenh VARCHAR(5) PRIMARY KEY NOT NULL,
    TenBenh VARCHAR(50) UNIQUE,
    TrieuChung TEXT,
    NguyenNhan TEXT,
    BienPhapChanDoan TEXT,
    CachDieuTri TEXT
);

-- Bảng lưu trữ thông tin bệnh nhân
CREATE TABLE BENHNHAN (
    MaBN VARCHAR(5) NOT NULL PRIMARY KEY,
    HoTen VARCHAR(40) NOT NULL,
    CCCD VARCHAR(12) UNIQUE,
    GioiTinh VARCHAR(5),
    NamSinh DATE,
    DiaChi NVARCHAR(100),
    SDT VARCHAR(10)
);

-- Bảng lưu trữ thông tin đơn vị tính của thuốc (viên, hộp, chai,...)
CREATE TABLE DONVITINH (
    MaDVT VARCHAR(5) PRIMARY KEY NOT NULL,
    TenDVT NVARCHAR(20) UNIQUE
);

-- Bảng lưu trữ cách dùng thuốc
CREATE TABLE CACHDUNG (
    MaCachDung VARCHAR(5) PRIMARY KEY,
    TenCachDung VARCHAR(20) UNIQUE
);

-- Bảng lưu trữ thông tin các loại thuốc
CREATE TABLE LOAITHUOC (
    MaThuoc VARCHAR(5),
    SoLo VARCHAR(8), 
    TenThuoc VARCHAR(20) UNIQUE,
    CongDung  TEXT,
    MaCachDung VARCHAR(5),
    MaDVT VARCHAR(5),
    TacDungPhu  TEXT,
    SoLuongTon  INT not null default 0,
    GiaBan INTEGER not null default 0,
    HanSuDung DATE,

    PRIMARY KEY (MaThuoc, SoLo),
    FOREIGN KEY (MaDVT) REFERENCES DONVITINH(MaDVT),
    FOREIGN KEY (MaCachDung) REFERENCES CACHDUNG(MaCachDung)
);


-- Bảng Phiếu Khám Bệnh (Chứa thông tin khám bệnh tổng quát)
CREATE TABLE PHIEUKHAMBENH (
    MaPKB VARCHAR(8) PRIMARY KEY,
    MaBN VARCHAR(5), -- Khóa ngoại từ BENHNHAN
    NgayKham DATE,
    TrieuChung TEXT,
    TongTienThuoc INT default 0,
    FOREIGN KEY (MaBN) REFERENCES BENHNHAN(MaBN)
);

-- Bảng Chi Tiết Thuốc trong Phiếu Khám Bệnh (Đơn thuốc)
CREATE TABLE CT_THUOC (
    MaThuoc VARCHAR(5),
    SoLo VARCHAR(8),
    MaPKB VARCHAR(8),
    SoLuong INT,
    DonGiaBan INT,
    ThanhTien INT,
    PRIMARY KEY (MaPKB, MaThuoc, SoLo),
    FOREIGN KEY (MaPKB) REFERENCES PHIEUKHAMBENH(MaPKB),
    FOREIGN KEY (MaThuoc, SoLo) REFERENCES LOAITHUOC(MaThuoc, SoLo)
);

-- Bảng Chi Tiết Bệnh của Phiếu Khám Bệnh (Nhiều bệnh trong 1 lần khám)
CREATE TABLE CT_BENH (
    MaPKB VARCHAR(8),
    MaBenh VARCHAR(5),
    PRIMARY KEY (MaPKB, MaBenh),
    FOREIGN KEY (MaPKB) REFERENCES PHIEUKHAMBENH(MaPKB),
    FOREIGN KEY (MaBenh) REFERENCES BENH(MaBenh)
);

-- Bảng Phiếu Nhập Thuốc
CREATE TABLE PHIEUNHAPTHUOC (
    MaPNT VARCHAR(6) PRIMARY KEY not null,
    MaThuoc VARCHAR(5),
    GiaNhap INT,
    NgayNhap DATE,
    SoLuongNhap INT,
    FOREIGN KEY (MaThuoc) REFERENCES LOAITHUOC(MaThuoc)
);

-- Bảng Thông Số liên quan đến thuốc (VD: Hạn sử dụng, lô sản xuất,...)
CREATE TABLE THAMSO (
    SoBenhNhanToiDa int not null,
    TiLeTinhDonGiaBan float not null,
    TienKham INT not null
);

-- Bảng Báo Cáo Sử Dụng Thuốc (Tổng hợp)
CREATE TABLE BAOCAOSUDUNGTHUOC (
    MaBCSDT VARCHAR(8),
    Thang INT,
    Nam INT,
    PRIMARY KEY(MaBCSDT, Thang, Nam)
);

-- Bảng Chi Tiết Báo Cáo Sử Dụng Thuốc
CREATE TABLE CT_BCSDT (
    MaBCSDT VARCHAR(8),
    MaThuoc VARCHAR(5),
    SoLanDung INT,
    SoLuongDung INT,
    FOREIGN KEY (MaThuoc) REFERENCES LOAITHUOC(MaThuoc),
    FOREIGN KEY (MaBCSDT) REFERENCES BAOCAOSUDUNGTHUOC(MaBCSDT),
    PRIMARY KEY (MaBCSDT, MaThuoc)
);

-- Bảng Hóa Đơn Thanh Toán (Lưu trữ thông tin thanh toán cho Phiếu Khám Bệnh)
CREATE TABLE HOADONTHANHTOAN (
    MaHD VARCHAR(7) PRIMARY KEY,
    MaPKB VARCHAR(8), -- Khóa ngoại từ PHIEUKHAMBENH (1 PKB chỉ có 1 HDTT)
    NgayTHANHTOAN DATE,
    TienKham INT,
    TienThuoc INT,
    TongTien INT,
    FOREIGN KEY (MaPKB) REFERENCES PHIEUKHAMBENH(MaPKB)
);

-- Bảng Báo Cáo Doanh Thu (Tổng hợp)
CREATE TABLE BAOCAODOANHTHU (
    MaBCDT VARCHAR(8) PRIMARY KEY,
    THANG INT,
    NAM INT,
    TongDoanhThu INT
);

-- Bảng Chi Tiết Báo Cáo Doanh Thu (Chi tiết theo từng hóa đơn, loại dịch vụ/thuốc...)
CREATE TABLE CT_BCDT (
    MaBCDT VARCHAR(8),
    Ngay    DATE,
    SoBenhNhan INT,
    DOANHTHU INT,
    TyLe DECIMAL(12,2),
    PRIMARY KEY (MaBCDT, Ngay),
    FOREIGN KEY (MaBCDT) REFERENCES BAOCAODOANHTHU(MaBCDT)
);
