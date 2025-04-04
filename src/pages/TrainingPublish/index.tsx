import { Box, Button } from '@mui/material';
import { styledSystem } from '../../constans/styled';
import { TitleCustom } from '../../components/custom/Title';
import { FormButtonCustom } from '../../components/custom/Button/FormButtonCustom';
import AddIcon from '@mui/icons-material/Add';
import { FormInputCustom } from '../../components/custom/Input/FormInputCustom';
import DataTable from '../../components/Table';
import { GridColDef } from '@mui/x-data-grid';
import { lecturerResponse } from '../../schemas/API/lecturerResposne';
import { useState } from 'react';
import ModalWrapper from '../../components/Modal/ModalWrapper';
import FormAddLecturer from '../../components/Modal/FormAddLecturer';

const rows: lecturerResponse[] = [
    {
        id: '123123',
        role: 'lecturer',
        avatar: 'sdf',
        name: 'nguyen van a',
        lecturerCode: '123123',
        isMale: true,
        status: true,
        dob: '2000-10-10',
        startDateOfTeaching: '2000-10-10',
        endDateOfTeaching: '2000-10-10',
        createAt: '2000-10-10',
        updateAt: '2000-10-10',
    },
];
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70, hideable: true },
    { field: 'role', headerName: 'role', width: 70, hideable: true },
    {
        field: 'avatar',
        headerName: 'avatar',
        width: 100,
    },
    { field: 'name', headerName: 'Tên', width: 100 },
    { field: 'lecturerCode', headerName: 'Mã giảng viên', width: 100 },
    { field: 'isMale', headerName: 'Giới tính nam', width: 70 },
    { field: 'status', headerName: 'Đang công tác', width: 70 },
    { field: 'dob', headerName: 'Ngày sinh', width: 100 },
    {
        field: 'startDateOfTeaching',
        headerName: 'Ngày bắt vào trường',
        width: 100,
    },
    { field: 'endDateOfTeaching', headerName: 'Ngày rời trường', width: 100 },
    { field: 'craeteAt', headerName: 'Ngày tạo', width: 100 },
    { field: 'updateAt', headerName: 'Ngày cập nhật', width: 100 },
];

export default function TrainingPublish() {
    const [isOpenModalAddLecturer, setIsOpenModalAddLecturer] =
        useState<boolean>(false);
    const handleEdit = (value: lecturerResponse) => {
        console.log(value.id);
    };
    const handleDelete = (value: lecturerResponse) => {
        console.log(value);
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
                <TitleCustom>Xuất bản chương trình đào tạo</TitleCustom>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                }}
            >
                <Box>
                    <FormInputCustom
                        sx={{ width: '300px' }}
                        placeholder='search...'
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: '10px',
                    }}
                >
                    <FormButtonCustom
                        sx={{
                            width: '100px',
                            height: '35px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        startIcon={<AddIcon />}
                        onClick={() => setIsOpenModalAddLecturer(true)}
                    >
                        Thêm
                    </FormButtonCustom>
                    <ModalWrapper
                        open={isOpenModalAddLecturer}
                        handleClose={() => setIsOpenModalAddLecturer(false)}
                    >
                        <FormAddLecturer
                            handlClose={() => setIsOpenModalAddLecturer(false)}
                        />
                    </ModalWrapper>
                    <Button
                        sx={{
                            border: '1px solid gray',
                            fontSize: '12px',
                            borderRadius: '10px',
                        }}
                    >
                        Export file excel
                    </Button>
                </Box>
            </Box>
            <Box sx={{ marginTop: '10px' }}>
                <DataTable<lecturerResponse>
                    columns={columns}
                    data={rows}
                    paginationModel={{ page: 0, pageSize: 5 }}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                                role: false,
                            },
                        },
                    }}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </Box>
        </Box>
    );
}
