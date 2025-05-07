import {
    DataGrid,
    GridColDef,
    GridInitialState,
    GridValidRowModel,
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LecturerResponse } from '../../schemas/API/lecturerResposne';
interface Props<T extends GridValidRowModel> {
    columns: GridColDef[];
    data: T[];
    loading?: boolean;
    paginationModel: { page: number; pageSize: number };
    initialState?: GridInitialState;
    handleEdit: (data: LecturerResponse) => void;
    handleDelete: (data: LecturerResponse) => void;
}

export default function DataTable<T extends GridValidRowModel>(
    props: Props<T>
) {
    const {
        columns,
        data,
        loading = false,
        paginationModel,
        initialState,
        handleDelete,
        handleEdit,
    } = props;
    const fields: GridColDef[] = [
        ...columns,
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 120,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: '5px' }}>
                    <IconButton
                        aria-label='edit'
                        size='small'
                        onClick={(event) => {
                            event.stopPropagation();
                            handleEdit(params.row);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        aria-label='delete'
                        size='small'
                        onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(params.row);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];
    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={fields}
                loading={loading}
                initialState={{
                    pagination: { paginationModel },
                    ...initialState,
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );
}
