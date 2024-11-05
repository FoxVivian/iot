import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Grid, Box, useTheme } from '@mui/material';
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from 'axios';

const Team = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [totalRows, setTotalRows] = useState(0);
    const [searchText, setSearchText] = useState('');

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "temperature", headerName: "TEMPERATURE", flex: 1 },
        { field: "humidity", headerName: "HUMIDITY", flex: 1 },
        { field: "light", headerName: "LIGHT", flex: 1 },
        { field: "time", headerName: "TIME", flex: 1 },
    ];

    const handleSearch = (event) => {
        setSearchText(event.target.value.toLowerCase());
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = { page: page + 1, pageSize, searchText }; // Cộng 1 vì API thường bắt đầu từ 1
                const response = await axios.get(`http://localhost:5000/api/data/data_sensors`, { params });
                setData(response.data.items); 
                setTotalRows(response.data.total); 
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, [page, pageSize, searchText]);

    return (
        <Box m="20px">
            <Header title="DATA SENSORS" subtitle="based on time" />
            <Grid container spacing={2} alignItems="center" marginBottom={2}>
                <Grid item md={2}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchText}
                        onChange={handleSearch}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => setPage(0)}>
                        Search
                    </Button>
                </Grid>
            </Grid>
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                        fontSize: "16px",
                    },
                    "& .MuiDataGrid-row": {
                        borderBottom: '1px solid #ddd',
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid 
                    checkboxSelection 
                    rows={data} 
                    columns={columns}
                    pagination
                    paginationMode="server"
                    rowCount={totalRows}
                    page={page}
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newPageSize) => {
                        setPage(0);
                        setPageSize(newPageSize);
                    }}
                />
            </Box>
        </Box>
    );
};

export default Team;
