const PatientService = require("../services/patient_service");

// Tao thong tin benh nhan
exports.createPatient = async (req, res) => {
    try {
        const {
            HoTen,
            CCCD,
            GioiTinh,
            NamSinh,
            DiaChi,
            SDT
        } = req.body;
        // Kiem tra benh nhan da ton tai hay chua
        const existed = await PatientService.existedPatient(CCCD);
        if (existed) {
            res.status(409).json({message: "Bệnh nhân đã tồn tại"});
        }
        const data = {
            HoTen,
            CCCD,
            GioiTinh,
            NamSinh,
            DiaChi,
            SDT
        }
        const addPatient = await PatientService.createPatient(data);
        if (addPatient === null) {
            res.status(500).json({error: 'Internal Server Error'});        
        }
        res.status(201).json({
            MaBN: addPatient.MaBN,
            HoTen: addPatient.HoTen,
            CCCD: addPatient.CCCD,
            GioiTinh: addPatient.GioiTinh,
            NamSinh: addPatient.NamSinh,
            DiaChi: addPatient.DiaChi,
            SDT: addPatient.SDT
        })
    } 
    catch (error) {
        console.error('Error createPatient: ', error);
        res.status(500).json({error: 'Internal Server Error'}); 
    }
}

// Tra cuu benh nhan
exports.searchPatient = async (req, res) => {
    try {
        const {cccd} = req.params;
        if (cccd === null) {
            res.status(400).json({message: "CCCD patient is empty"});
        }
        const rows = await PatientService.searchPatient(cccd);
        if (rows === null) {
            res.status(500).json({error: 'Internal Server Error'});        
        }
        else if (rows.length === 0) {
            res.status(404).json({message: "Not found."});
        }
        else res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error searchPatient: ", error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Cap nhap thong tin benh nhan theo MaBN
exports.updatePatient = async (req, res) => {
    try {
        const {MaBN} = req.params;
        const {
            HoTen,
            CCCD,
            GioiTinh,
            NamSinh,
            DiaChi,
            SDT
        } = req.body;
        const updateData = {
            HoTen,
            CCCD,
            GioiTinh,
            NamSinh,
            DiaChi,
            SDT
        }
        const result = await PatientService.updatePatient(MaBN, updateData);
        if (result === null) {
            return res.status(500).json({error: 'Internal Server Error'});        
        }
        if (result === false) {
            return res.status(400).json({message: "Thông tin không thay đổi"});
        }
        return res.status(200).json({success: "Cập nhật thành công"});
    }
    catch (error) {
        console.error('Error updateBenh: ', error);
        res.status(500).json({error: 'Internal Server Error'}); 
    }
}

// Xoa benh nhan theo MaBN
exports.deletePatient = async(req, res) => {
    try {
        const {MaBN} = req.params;
        if (MaBN !== "") {
            const result = await PatientService.deletePatient(MaBN);
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
        console.error('Error deletePatient: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}