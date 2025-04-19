import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { FormButtonCustom } from '../../../components/custom/Button/FormButtonCustom';
import { FormInputCustom } from '../../../components/custom/Input/FormInputCustom';
import { TitleCustom } from '../../../components/custom/Title';
import FormAddSubject from '../../../components/Modal/FormAddSubject';
import ModalWrapper from '../../../components/Modal/ModalWrapper';
import DataTable from '../../../components/Table';
import { styledSystem } from '../../../constans/styled';

export interface HocPhanResponse {
    id: number;
    maHp: string;
    tenHp: string;
    soTinChi: number;
    soTietLyThuyet: number;
    soTietThucHanh: number;
    soTietThucTap: number;
    heSo: number;
}
//  data
const rows: HocPhanResponse[] = [
    {
        id: 1,
        maHp: 'CS101',
        tenHp: 'Nhập môn lập trình',
        soTinChi: 3,
        soTietLyThuyet: 30,
        soTietThucHanh: 15,
        soTietThucTap: 0,
        heSo: 1.0,
    },
    {
        id: 2,
        maHp: 'CS202',
        tenHp: 'Cấu trúc dữ liệu',
        soTinChi: 4,
        soTietLyThuyet: 45,
        soTietThucHanh: 30,
        soTietThucTap: 10,
        heSo: 1.2,
    },
];

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'maHp', headerName: 'Mã học phần', width: 150 },
    { field: 'tenHp', headerName: 'Tên học phần', width: 200 },
    { field: 'soTinChi', headerName: 'Số tín chỉ', width: 100 },
    { field: 'soTietLyThuyet', headerName: 'LT', width: 80 },
    { field: 'soTietThucHanh', headerName: 'TH', width: 80 },
    { field: 'soTietThucTap', headerName: 'TT', width: 80 },
    { field: 'heSo', headerName: 'Hệ số', width: 80 },
];

export default function ManagerSubject() {
    const [isOpenModalAddSubject, setIsOpenModalAddSubject] = useState(false);

    const handleEdit = (value: HocPhanResponse) => {
        console.log('Edit:', value);
    };

    const handleDelete = (value: HocPhanResponse) => {
        console.log('Delete:', value);
    };

    return (
        <Box
            sx={{
                padding: '10px',
                borderRadius: '10px',
                boxShadow: styledSystem.secondBoxShadow,
                minHeight: '700px',
            }}
        >
            <Box>
                <TitleCustom>Quản lý học phần</TitleCustom>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                }}
            >
                <FormInputCustom
                    sx={{ width: '300px' }}
                    placeholder="Tìm kiếm mã hoặc tên học phần..."
                />
                <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '10px' }}>
                    <FormButtonCustom
                        sx={{ width: '100px', height: '35px', fontSize: '12px' }}
                        startIcon={<AddIcon />}
                        onClick={() => setIsOpenModalAddSubject(true)}
                    >
                        Thêm
                    </FormButtonCustom>
                    <ModalWrapper
                        open={isOpenModalAddSubject}
                        handleClose={() => setIsOpenModalAddSubject(false)}
                    >
                        <FormAddSubject handleClose={() => setIsOpenModalAddSubject(false)} />
                    </ModalWrapper>
                    <Button
                        sx={{
                            border: '1px solid gray',
                            fontSize: '12px',
                            borderRadius: '10px',
                        }}
                    >
                        Export file Excel
                    </Button>
                </Box>
            </Box>

            <Box sx={{ marginTop: '10px' }}>
                <DataTable<HocPhanResponse>
                    columns={columns}
                    data={rows}
                    paginationModel={{ page: 0, pageSize: 5 }}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </Box>
        </Box>
    );
}
