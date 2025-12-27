const MedicalExamFormService = require('../services/medical_exam_form_service');
const PatientService = require('../services/patient_service');

// 1. Tạo phiếu khám bệnh (Create)
exports.createMedicalExamForm = async (req, res) => {
  try {
    const {
      MaBN,
      NgayKham,
      TrieuChung,
      CT_Benh,
      CT_Thuoc,
      TongTienThuoc
    } = req.body;

    if (!MaBN || !NgayKham) {
      return res.status(400).json({
        message: "Thiếu dữ liệu bắt buộc (MaBN, NgayKham)"
      });
    }

    // Kiểm tra bệnh nhân tồn tại (Optional - nếu muốn kỹ)
    // const existed = await PatientService.existedPatientById(MaBN);
    // if (!existed) return res.status(409).json({message: "Bệnh nhân không tồn tại"});

    const result = await MedicalExamFormService.createMedicalExamForm({
      MaBN,
      NgayKham,
      TrieuChung,
      CT_Benh,
      CT_Thuoc,
      TongTienThuoc
    });

    if (result === null) {
      return res.status(500).json({
        error: "Internal Server Error"
      });
    }

    // Trả về MaPKB mới tạo
    return res.status(201).json({
        message: "Tạo phiếu khám thành công",
        MaPKB: result
    });

  } catch (error) {
    console.error("createMedicalExamForm error:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

// 2. Xác nhận thuốc (Confirm)
exports.confirmMedicalExamForm = async (req, res) => {
  try {
    const danhSachThuoc = req.body; // Array [{MaThuoc, SoLuong}]

    if (!Array.isArray(danhSachThuoc) || danhSachThuoc.length === 0) {
      return res.status(400).json({
        message: "Danh sách thuốc không hợp lệ"
      });
    }

    const result = await MedicalExamFormService.confirmMedicalExamForm(danhSachThuoc);
    
    if (result === null) {
        return res.status(500).json({ error: "Lỗi hệ thống khi kiểm tra thuốc" });
    }

    return res.status(200).json(result);
  } 
  catch (error) {
    console.error("confirmMedicalExamForm error:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

// Cập nhật Phiếu kham benh
exports.updateMedicalExamForm = async(req, res) => {
    try {
        const {MaPKB} = req.params;
        const {
            MaBN,
            NgayKham,
            TrieuChung,
            CT_Benh,
            CT_Thuoc,
            TongTienThuoc
        } = req.body;

        // Kiem tra benh nhan co ton tai khong
        const existed = await PatientService.existedPatientById(MaBN);
        if (existed === false) {
            res.status(409).json({message: "Bệnh nhân không tồn tại"});
        }

        const updateData = {
            MaBN,
            NgayKham,
            TrieuChung,
            CT_Benh,
            CT_Thuoc,
            TongTienThuoc
        }
        const result = await MedicalExamFormService.updateExamForm(MaPKB, updateData);

        if (result === null || result === false) {
            return res.status(500).json({error: 'Internal Server Error'});        
        }
        return res.status(200).json({success: "Cập nhật thành công"});
    }
    catch (error) {
        console.error('Error updateMedicalExamForm: ', error);
        res.status(500).json({error: 'Internal Server Error'});      
    }
}

// Xóa phiếu khám bệnh
exports.deleteMedicalExamForm = async (req, res) => {
    try {
        const {MaPKB} = req.params;
        if (MaPKB !== "") {
            const result = await MedicalExamFormService.deleteExamForm(MaPKB);
            if (result === null) {
                return res.status(500).json({error: 'Internal Server Error'});
            }
            if (result === false) {
                return res.status(400).json({message: "Xóa không thành công"});
            }
            return res.status(200).json({success: "Xóa thành công"});
        }
    }
    catch (error) {
        console.error('Error deleteMedicalExamForm: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Lấy danh sách Phiếu khám bệnh theo ngày khám
exports.getExamFormsByDate = async (req, res) => {
    try {
        const {NgayKham} = req.params;
        const list = await MedicalExamFormService.getExamFormsByDate(NgayKham);
        res.status(200).json(list);
    }
    catch (error) {
        console.error('Error getExamFormsByDate: ', error);
        res.status(500).json({error: 'Internal Server Error'});  
    }
}

// Lấy thông tin phiếu khám bệnh theo MaPKB
exports.getExamFormById = async (req, res) => {
    try {
        const {MaPKB} = req.params;
        const result = await MedicalExamFormService.getExamFormById(MaPKB);
        if (result === null) {
            res.status(404).json({message: "Không tìm thấy"});
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error getExamFormById: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

