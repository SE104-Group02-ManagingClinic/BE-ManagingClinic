const ArgumentService =  require('../services/argument_service');

// Tạo các giá trị tham số
exports.createThamSo = async (req, res) => {
    try {
        const {
            so_benh_nhan,
            ti_le,
            tien_kham
        } = req.body;
        const data = {
            so_benh_nhan,
            ti_le,
            tien_kham            
        };
        const record = await ArgumentService.createThamSo(data);
        // console.log(record);
        res.status(201).json({
            SoBenhNhanToiDa: record.SoBenhNhanToiDa,
            TiLeTinhDonGiaBan: record.TiLeTinhDonGiaBan,
            TienKham: record.TienKham
        });
    }
    catch (error) {
        console.error('Error createThamSo: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Lấy các giá trị tham số
exports.getThamSo = async (req, res) => {
    try {
        const record = await ArgumentService.getThamSo();
        res.status(200).json({
            SoBenhNhanToiDa: record.SoBenhNhanToiDa,
            TiLeTinhDonGiaBan: record.TiLeTinhDonGiaBan,
            TienKham: record.TienKham
        });
    }
    catch (error) {
        console.error('Error getThamSo: ', error);
        res.status(500).json({error: 'Internal Server Error'});

    }
}

// Cập nhât Só bệnh nhân tối đa
exports.updateSoBenhNhanToiDa = async (req, res) => {
    try {
        const {so_benh_nhan_moi} = req.body;
        const record = await ArgumentService.updateSoBenhNhanToiDa(so_benh_nhan_moi);
        res.status(200).json({
            SoBenhNhanToiDa: record.SoBenhNhanToiDa,
            TiLeTinhDonGiaBan: record.TiLeTinhDonGiaBan,
            TienKham: record.TienKham
        });
    }
    catch (error) {
        console.error('Error updateSoBenhNhanToiDa: ', error);
        res.status(500).json({error: 'Internal Server Error'});        
    }
}

// Cập nhật Tỉ lệ tinh đơn giá bán
exports.updateTiLeTinhDonGiaBan = async (req, res) => {
    try {
        const {ti_le_moi} = req.body;
        const record = await ArgumentService.updateTiLeTinhDonGiaBan(ti_le_moi);
        res.status(200).json({
            SoBenhNhanToiDa: record.SoBenhNhanToiDa,
            TiLeTinhDonGiaBan: record.TiLeTinhDonGiaBan,
            TienKham: record.TienKham
        });
    }
    catch (error) {
        console.error('Error updateTiLeTinhDonGiaBan: ', error);
        res.status(500).json({error: 'Internal Server Error'});  
    }
}

// Cập nhật Tiền khám
exports.updateTienKham = async (req, res) => {
    try {
        const {tien_kham} = req.body;
        const record = await ArgumentService.updateTienKham(tien_kham);
        res.status(200).json({
            SoBenhNhanToiDa: record.SoBenhNhanToiDa,
            TiLeTinhDonGiaBan: record.TiLeTinhDonGiaBan,
            TienKham: record.TienKham
        });
    }
    catch (error) {
        console.error('Error updateTienKham: ', error);
        res.status(500).json({error: 'Internal Server Error'});  
    }
}