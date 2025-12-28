const ListExamService = require('../services/list_examination_service');

exports.addInList = async (req, res) => {
    try {
        const { NgayKham, MaBN } = req.body;

        const data = { NgayKham, MaBN };

        const result = await ListExamService.addInList(data);

        if (!result.success) {
            return res.status(409).json({ message: result.message });
        }

        res.status(201).json({
            MaBN: result.data.MaBN,
            HoTen: result.data.HoTen,
            CCCD: result.data.CCCD,
            GioiTinh: result.data.GioiTinh,
            DiaChi: result.data.DiaChi,
            MaPKB: result.data.MaPKB
        });
    }
    catch (error) {
        console.error('Error addInList: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.removeFromList = async (req, res) => {
    try {
        const { NgayKham, MaBN } = req.body;

        const data = { NgayKham, MaBN };

        const result = await ListExamService.removeFromList(data);

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.status(200).json({
            NgayKham,
            MaBN
        });
    }
    catch (error) {
        console.error('Error removeFromList: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getDailyList = async (req, res) => {
    try {
        const { NgayKham } = req.params;

        const result = await ListExamService.getDailyList(NgayKham);

        if (result === null) {
            res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({
            NgayKham: result.NgayKham,
            TongSoBenhNhan: result.TongSoBenhNhan,
            DanhSachBenhNhan: result.DanhSachBenhNhan
        });
    }
    catch (error) {
        console.error('Error getDailyList: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};