import {
    DataGrid,
    GridColDef,
    GridInitialState,
    GridPaginationModel,
    GridValidRowModel,
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Props<T extends GridValidRowModel> = {
    data: T[];
    columns: GridColDef[]; // Properly typed columns
    loading?: boolean;
    paginationModel?: GridPaginationModel;
    initialState?: GridInitialState;
    handleEdit?: (data: T) => void;
    handleDelete?: (id: string) => void;
    getRowId?: (row: T) => string | number; // Add this line
};

export default function DataTable<T extends GridValidRowModel>({
    columns,
    data,
    loading = false,
    paginationModel,
    initialState,
    handleEdit,
    handleDelete,
    getRowId = (row) => row.courseCode,
}: Props<T>) {
    const fields: GridColDef[] = [
        ...columns,
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const row = params.row as T;
                return (
                    <Box sx={{ display: 'flex', gap: '5px' }}>
                        {handleEdit && (
                            <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleEdit(row);
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        )}
                        {handleDelete && (
                            <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleDelete(row.id as string);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                );
            },
        },
    ];

    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={data.map((row) => ({ ...row, id: getRowId(row) }))}
                columns={fields}
                loading={loading}
                initialState={{
                    pagination: { paginationModel },
                    ...initialState,
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
                getRowId={(row) => row.id}
            />
        </Paper>
    );
}