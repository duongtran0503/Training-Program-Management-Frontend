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
import { lecturerResponse } from '../../schemas/API/lecturerResposne';
interface Props<T extends GridValidRowModel> {
    columns: GridColDef[];
    data: T[];
    paginationModel: { page: number; pageSize: number };
    initialState?: GridInitialState;
    handleEdit: (data: lecturerResponse) => void;
    handleDelete: (data: lecturerResponse) => void;
}

export default function DataTable<T extends GridValidRowModel>(
    props: Props<T>
) {
    const {
        columns,
        data,
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
