const InvoiceService = require('../services/invoice_service');

// Tạo hóa đơn thanh toán mới
exports.createInvoice = async (req, res) => {
    try {
        const {
            MaPKB,
            NgayThanhToan,
            TienKham,
            TienThuoc // = 0 nghĩa là không mua thuốc
        } = req.body;

        // Kiểm tra logic cơ bản
        if (!MaPKB) {
             return res.status(400).json({ message: "Thiếu mã phiếu khám bệnh" });
        }

        const existed = await InvoiceService.existedInvoice(MaPKB);
        if (existed !== "" && existed !== null) {
            res.status(409).json({
                message: "Đã tồn tại hóa đơn thanh toán cho phiếu khám bệnh",
                MaHD: existed
            });
        }
        else {
            const data = {
                MaPKB,
                NgayThanhToan,
                TienKham: TienKham || 0,
                TienThuoc: TienThuoc || 0
            }
            
            const addInvoice = await InvoiceService.createInvoice(data);
            
            if (addInvoice === null) {
                res.status(500).json({error: 'Internal Server Error'});        
            } else {
                res.status(201).json({
                    message: "Tạo thành công hóa đơn thanh toán", 
                    MaHD: addInvoice.MaHD,
                    TongTien: addInvoice.TongTien,
                    GhiChu: addInvoice.Note // Trả về để biết có hoàn kho hay không
                });
            }
        }
    }
    catch (error) {
        console.error('Error createInvoice: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Lay tat ca hoa don thanh toan trong ngay
exports.getInvoicesByDate = async (req, res) => {
    try {
        const {NgayThanhToan} = req.params;
        const invoices = await InvoiceService.getInvoicesByDate(NgayThanhToan);
        res.status(200).json(invoices);
    }
    catch (error) {
        console.error('Error getInvoicesByDate: ', error);
        res.status(500).json({error: 'Internal Server Error'})
    }
}

// Lấy thông tin hóa đơn theo MaHD
exports.getInvoiceById = async (req, res) => {
    try {
        const {MaHD} = req.params;
        const invoice = await InvoiceService.getInvoiceById(MaHD);
        if (invoice === null) {
            res.status(404).json({message: "Không tìm thấy"});
        }
        else res.status(200).json(invoice);
    }
    catch (error) {
        console.error('Error getInvoiceById: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

exports.getInvoiceByPKB = async (req, res) => {
    try {
        const { MaPKB } = req.params;
        const invoice = await InvoiceService.getInvoiceByPKB(MaPKB);
        
        if (invoice === null) {
            res.status(404).json({ message: "Không tìm thấy hóa đơn cho phiếu khám này" });
        } else {
            res.status(200).json(invoice);
        }
    }
    catch (error) {
        console.error('Error getInvoiceByPKB: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Cập nhật tiền khám và tiền thuốc theo MaHD
exports.updateInvoice = async (req, res) => {
    try {
        const {MaHD} = req.params;
        const {
            TienKham,
            TienThuoc
        } = req.body;

        const result = await InvoiceService.updateInvoice(MaHD, {TienKham, TienThuoc});
        if (result === null) {
            res.status(404).json({message: "Không tìm thấy hóa đơn để cập nhật"});
        }
        res.status(200).json({
            message: "Cập nhật thành công",
            result
        });
    }
    catch (error) {
        console.error('Error updateInvoice: ', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

// Xóa hóa đơn thanh toán theo MaHD
exports.deleteInvoice = async (req, res) => {
    try {
        const {MaHD} = req.params;
        const result = await InvoiceService.deleteInvoiceById(MaHD);
        if (result === null) {
            return res.status(500).json({error: 'Internal Server Error'});
        }
        if (result === false) {
            return res.status(400).json({message: "Xóa không thành công"});
        }
        return res.status(200).json({success: "Xóa thành công"});    
    }
    catch (error) {
        console.error('Error deleteInvoice: ', error);
        res.status(500).json({error: 'Internal Server Error'}); 
    }
}