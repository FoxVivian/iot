import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import Header from "../../components/Header";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import axios from 'axios';

const History = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [searchText, setSearchText] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(new Date(Date.now()));

    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [totalRows, setTotalRows] = useState(0);

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'device_id', headerName: 'DEVICE ID' },
        { field: 'device.device_name', headerName: 'DEVICE NAME', flex: 1 },
        {
            field: 'action', headerName: 'ACTION', flex: 1, renderCell: (params) => {
                return params.value === 1 ? 'ON' : 'OFF';
            }
        },
        { field: 'user_id', headerName: 'USER ID', flex: 1 },
        { field: 'time', headerName: 'TIME', flex: 1 },
    ];

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchText(value);
    };

    const handleFilterChange = (event) => {
        const value = event.target.value.toLowerCase();
        setSelectedAction(value);
    };

    const isValidDate = (dateStr) => {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = { page: page + 1, pageSize, searchText, selectedAction } // Cộng 1 vì API thường bắt đầu từ 1
                if (isValidDate(startDate) && isValidDate(endDate)) {
                    params.startDate = startDate;
                    params.endDate = endDate;
                } 
                const response = await axios.get(`http://localhost:3000/api/data/data_devices`, {
                    params 
                });
                setData(response.data.items);
                setTotalRows(response.data.total);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, [page, pageSize, searchText, selectedAction, startDate, endDate]);


    return (
        <Box m="20px" >
            <Box>
                <Header title="DEVICES STATUS" />
                <Grid container spacing={2} alignItems="center" marginBottom={2} width="100%" >
                    <Grid item md={2}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            value={searchText}
                            onChange={handleSearch}
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={2}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Action</InputLabel>
                            <Select
                                value={selectedAction}
                                onChange={handleFilterChange}
                                label="action"
                            >
                                <MenuItem value="">
                                    <em>All</em>
                                </MenuItem>
                                <MenuItem value="1">ON</MenuItem>
                                <MenuItem value="0">OFF</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={2}>
                        <TextField
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item md={2}>
                        <TextField
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleSearch} size='large'>
                            Search
                        </Button>
                    </Grid>

                </Grid>
                <Box
                    m="20px 0 0 0"
                    height="70vh"
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
                        rowCount={totalRows} // Tổng số hàng
                        page={page}

                        onPageChange={(newPage) => setPage(newPage)} // Cập nhật page
                        onPageSizeChange={(newPageSize) => {
                            setPage(0); // Quay về trang đầu khi thay đổi kích thước trang
                            setPageSize(newPageSize);
                        }} />
                </Box>
            </Box>
        </Box>
    );
};

export default History;