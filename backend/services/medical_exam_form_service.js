const db = require('../config/database');

class MedicalExamForm {
    // Tao ma PKB
    static createId(lastId) {
        if (lastId === "") {
            return "PKB00001";
        }
        const id = parseInt(lastId.slice(3), 10) + 1;


        const newId = "PKB" + id.toString().padStart(5, "0");
        return newId;
    }

    static async createMedicalExamForm(data) {
        try {
            const {
                MaBN,
                NgayKham,
                TrieuChung,
                CT_Benh, 
                CT_Thuoc, 
                TongTienThuoc
            } = data;

            const [rows] = await db.query(
                "SELECT MaPKB FROM PHIEUKHAMBENH ORDER BY MaPKB DESC LIMIT 1"
            );

            let lastId = "";
            if (rows.length > 0) {
                lastId = rows[0].MaPKB;
            }
            const nextId = this.createId(lastId);

            // --- B. Insert Bảng PHIEUKHAMBENH ---
            const recordPKB = {
                MaPKB: nextId,
                MaBN,
                NgayKham,
                TrieuChung,
                TongTienThuoc
            };

            const [resultPKB] = await db.query(
                "INSERT INTO PHIEUKHAMBENH SET ?",
                [recordPKB]
            );

            // Nếu tạo header thành công
            if (resultPKB.affectedRows > 0) {
                    
                // --- C. Insert CT_BENH ---
                if (CT_Benh && CT_Benh.length > 0) {
                    for (const maBenh of CT_Benh) {
                        const recordBenh = {
                            MaPKB: nextId,
                            MaBenh: maBenh
                        };
                        await db.query("INSERT INTO CT_BENH SET ?", [recordBenh]);
                    }
                }

                // --- D. Insert CT_THUOC và TRỪ TỒN KHO ---
                if (CT_Thuoc && CT_Thuoc.length > 0) {
                    for (const t of CT_Thuoc) {
                        const thanhTien = t.SoLuong * t.DonGiaBan;
                            
                        const recordThuoc = {
                            MaThuoc: t.MaThuoc,
                            MaLo: t.MaLo,
                            MaPKB: nextId,
                            SoLuong: t.SoLuong,
                            DonGiaBan: t.DonGiaBan,
                            ThanhTien: thanhTien
                        };

                        await db.query("INSERT INTO CT_THUOC SET ?", [recordThuoc]);

                        await db.query(
                            "UPDATE LOTHUOC SET SoLuongTon = SoLuongTon - ? WHERE MaLo = ?",
                            [t.SoLuong, t.MaLo]
                        );
                    }
                }

                // --- E. Cập nhật lại DSKHAMBENH ---
                await db.query(
                    `UPDATE DSKHAMBENH
                    SET MaPKB = ?
                    WHERE MaBN = ? AND NgayKham = DATE(?)`,
                    [nextId, MaBN, NgayKham]
                );

                return nextId;
            }
            return null;
        } 
        catch (error) {
            console.log("MedicalExamForm createMedicalExamForm error: ", error);
            return null;
        }
    }


    // 2. Xác nhận thuốc (CHỈ KIỂM TRA - KHÔNG TRỪ KHO)
    static async confirmMedicalExamForm(danhSachThuoc) {
        try {
            const result = [];

            for (const item of danhSachThuoc) {
                const { MaThuoc, SoLuong } = item;

                // Tìm lô còn hạn, đủ số lượng, ưu tiên hạn gần nhất
                // CHÚ Ý: Logic này chỉ để SELECT xem có lô nào đáp ứng không
                const [rows] = await db.query(
                    `
                    SELECT MaLo, SoLuongTon, HanSuDung, GiaBan
                    FROM LOTHUOC
                    WHERE MaThuoc = ?
                    AND HanSuDung >= CURDATE()
                    AND SoLuongTon >= ?
                    ORDER BY HanSuDung ASC
                    LIMIT 1
                    `,
                    [MaThuoc, SoLuong]
                );

                if (rows.length === 0) {
                    // Không đủ thuốc hoặc hết hạn
                    result.push({
                        MaThuoc,
                        MaLo: null, // Frontend nhận null sẽ báo lỗi thuốc này hết hàng
                        Status: "Hết hàng hoặc không đủ số lượng"
                    });
                } else {
                    // Tìm thấy lô phù hợp
                    const lo = rows[0];
                    result.push({
                        MaThuoc,
                        MaLo: lo.MaLo,       // Trả về mã lô để FE điền vào form tạo
                        GiaBan: lo.GiaBan,   // Trả về giá bán hiện tại của lô đó
                        SoLuongTon: lo.SoLuongTon,
                        HanSuDung: lo.HanSuDung
                    });
                }
            }
            return result;
        } catch (error) {
            console.log("MedicalExamForm confirmMedicalExamForm error: ", error);
            return null;
        }
    }

    // Cập nhật phiếu khám bệnh (CÓ XỬ LÝ HOÀN TRẢ/TRỪ KHO)
    static async updateExamForm(MaPKB, data) {
        try {
            const {
                MaBN,
                NgayKham,
                TrieuChung,
                CT_Benh,
                CT_Thuoc,
                TongTienThuoc
            } = data;

            // 1. Cập nhật thông tin chung (Header)
            await db.query(
                `UPDATE PHIEUKHAMBENH 
                 SET MaBN=?, NgayKham=?, TrieuChung=?, TongTienThuoc=?
                 WHERE MaPKB=?`,
                [MaBN, NgayKham, TrieuChung, TongTienThuoc, MaPKB]
            );

            // 2. Xử lý CT_BENH (Xóa cũ -> Thêm mới)
            await db.query("DELETE FROM CT_BENH WHERE MaPKB=?", [MaPKB]);
            if (CT_Benh && CT_Benh.length > 0) {
                for (const maBenh of CT_Benh) {
                    await db.query("INSERT INTO CT_BENH SET ?", { MaPKB, MaBenh: maBenh });
                }
            }

            // 3. Xử lý CT_THUOC (Quan trọng: Hoàn kho cũ -> Xóa cũ -> Thêm mới -> Trừ kho mới)
            
            // 3a. Lấy danh sách thuốc CŨ để hoàn kho
            const [oldMedicines] = await db.query(
                "SELECT MaLo, SoLuong FROM CT_THUOC WHERE MaPKB = ?",
                [MaPKB]
            );

            // 3b. Hoàn trả số lượng thuốc cũ vào kho
            if (oldMedicines.length > 0) {
                for (const item of oldMedicines) {
                    await db.query(
                        "UPDATE LOTHUOC SET SoLuongTon = SoLuongTon + ? WHERE MaLo = ?",
                        [item.SoLuong, item.MaLo]
                    );
                }
            }

            // 3c. Xóa chi tiết thuốc cũ trong CT_THUOC
            await db.query("DELETE FROM CT_THUOC WHERE MaPKB=?", [MaPKB]);

            // 3d. Thêm chi tiết thuốc MỚI và Trừ kho
            if (CT_Thuoc && CT_Thuoc.length > 0) {
                for (const t of CT_Thuoc) {
                    const thanhTien = t.SoLuong * t.DonGiaBan;
                    const record = {
                        MaThuoc: t.MaThuoc,
                        MaLo: t.MaLo,
                        MaPKB,
                        SoLuong: t.SoLuong,
                        DonGiaBan: t.DonGiaBan,
                        ThanhTien: thanhTien
                    };

                    // Insert CT_THUOC mới
                    await db.query("INSERT INTO CT_THUOC SET ?", [record]);

                    // Trừ tồn kho mới
                    await db.query(
                        "UPDATE LOTHUOC SET SoLuongTon = SoLuongTon - ? WHERE MaLo = ?",
                        [t.SoLuong, t.MaLo]
                    );
                }
            }

            return true;
        } catch (error) {
            console.error("updateExamForm error:", error);
            return false;
        }
    }

    // Xóa phiếu khám bệnh (CÓ XỬ LÝ HOÀN TRẢ KHO)
    static async deleteExamForm(MaPKB) {
        try {
            // 1. Lấy danh sách thuốc trong phiếu này để hoàn kho trước khi xóa
            const [medicines] = await db.query(
                "SELECT MaLo, SoLuong FROM CT_THUOC WHERE MaPKB = ?",
                [MaPKB]
            );

            // 2. Hoàn trả số lượng vào kho
            if (medicines.length > 0) {
                for (const item of medicines) {
                    await db.query(
                        "UPDATE LOTHUOC SET SoLuongTon = SoLuongTon + ? WHERE MaLo = ?",
                        [item.SoLuong, item.MaLo]
                    );
                }
            }

            // 3. Xóa dữ liệu trong các bảng chi tiết
            await db.query("DELETE FROM CT_BENH WHERE MaPKB=?", [MaPKB]);
            await db.query("DELETE FROM CT_THUOC WHERE MaPKB=?", [MaPKB]);

            // 4. Xóa phiếu khám bệnh (Header)
            const [rows] = await db.query(
                "DELETE FROM PHIEUKHAMBENH WHERE MaPKB = ?",
                [MaPKB]
            );

            if (rows.affectedRows === 0) return false;
            return true;
        } catch (error) {
            console.error("deleteExamForm error:", error);
            return false;
        }
    }

    // Lấy danh sách phiếu khám bệnh theo ngày khám
    static async getExamFormsByDate(examDate) {
        try {
            const [rows] = await db.query(
                `SELECT 
                    pkb.MaPKB,
                    pkb.MaBN,
                    bn.HoTen,
                    bn.CCCD,
                    pkb.TrieuChung,
                    pkb.TongTienThuoc
                FROM PHIEUKHAMBENH pkb
                JOIN BENHNHAN bn ON pkb.MaBN = bn.MaBN
                WHERE pkb.NgayKham = ?`,
                [examDate]
            );

            return rows; // trả về dạng JSON array
        } catch (error) {
            console.error("getExamFormsByDate error:", error);
            return [];
        }
    }

    // Lấy thông tin của phiếu khám bệnh theo MaPKB
    static async getExamFormById(MaPKB) {
        try {
            // Lấy thông tin phiếu + bệnh nhân
            const [pkbRows] = await db.query(
                `SELECT 
                    pkb.MaPKB,
                    pkb.MaBN,
                    bn.HoTen,
                    bn.CCCD,
                    pkb.NgayKham,
                    pkb.TrieuChung,
                    pkb.TongTienThuoc
                FROM PHIEUKHAMBENH pkb
                JOIN BENHNHAN bn ON pkb.MaBN = bn.MaBN
                WHERE pkb.MaPKB = ?`,
                [MaPKB]
            );

            if (pkbRows.length === 0) return null;
            const examForm = pkbRows[0];

            // Lấy chi tiết bệnh (có tên bệnh)
            const [benhRows] = await db.query(
                `SELECT cb.MaBenh, b.TenBenh
                FROM CT_BENH cb
                JOIN BENH b ON cb.MaBenh = b.MaBenh
                WHERE cb.MaPKB = ?`,
                [MaPKB]
            );

            // Lấy chi tiết thuốc (có tên thuốc)
            const [thuocRows] = await db.query(
                `SELECT ct.MaThuoc, lt.TenThuoc, ct.SoLuong, ct.DonGiaBan, ct.ThanhTien
                FROM CT_THUOC ct
                JOIN LOAITHUOC lt ON ct.MaThuoc = lt.MaThuoc
                WHERE ct.MaPKB = ?`,
                [MaPKB]
            );

            // Trả về JSON đầy đủ
            return {
                MaPKB: examForm.MaPKB,
                MaBN: examForm.MaBN,
                HoTen: examForm.HoTen,
                CCCD: examForm.CCCD,
                NgayKham: examForm.NgayKham,
                TrieuChung: examForm.TrieuChung,
                TongTienThuoc: examForm.TongTienThuoc,
                CT_Benh: benhRows.map(b => ({
                    MaBenh: b.MaBenh,
                    TenBenh: b.TenBenh
                })),
                CT_Thuoc: thuocRows.map(t => ({
                    MaThuoc: t.MaThuoc,
                    TenThuoc: t.TenThuoc,
                    SoLuong: t.SoLuong,
                    DonGiaBan: t.DonGiaBan,
                    ThanhTien: t.ThanhTien
                }))
            };
        }
        catch (error) {
            console.error("getExamFormById error:", error);
            throw error;
        }
    }
}

module.exports = MedicalExamForm;