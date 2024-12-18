import React, { useEffect, useState } from 'react';
import GroupService from '../../../services/groupService';
import { PagedResult } from '../../../models/GenericResponseDTO';
import PaginationControls from '../../../components/Pagination/PaginationControls'
import Table from '../../../components/Table/Table';
import { Box, Typography, TextField, IconButton, Tooltip } from '@mui/material';
import EditNoteTwoTone from '@mui/icons-material/EditNoteTwoTone';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import { FormattedDate } from '../../../utils/formatDate';
import { globalStyle } from '../../../styles/theme';
import EditDataModal from '../../../components/Modal/FormModal';
import CustomModal from '../../../components/Modal/ConfirmationModal';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { FormData } from '../../../models/formDTOs';
import { GroupDTO } from '../../../models/groupDTOs';

const GroupList: React.FC = () => {

  // Define state with proper initial structure
  const [pagedResult, setPagedResult] = useState<PagedResult<GroupDTO>>({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    searchTerm: ''
  });
  const [modalTitle, setModalTitle] = useState('')

  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const initialFormData = {
    name: { value: '', error: false, helperText: '' },
    email: { value: '', error: false, helperText: '' },
    phone: { value: '', error: false, helperText: '' },
    address: { value: '', error: false, helperText: '' },
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);



  const REQUIRED_FIELDS = ['name', 'email', 'phone'];
  const handleInputChange = (field: string, value: string) => {
    const isRequired = REQUIRED_FIELDS.includes(field);

    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        value: value,
        error: isRequired && value === '', // Set error only if the field is required and value is empty
        helperText: isRequired && value === '' ? ERROR_MESSAGES.REQUIRED_FIELD : '', // Set helper text only if the field is required and value is empty
      },
    });
  };


  const handleSave = () => {
    console.log('Data saved:', formData);
    closeEditModal()
  };

  const closeEditModal = () => {
    setFormData(initialFormData)
    setOpenEditModal(false);

  }

  const handleOpenEditModal = () => {
    setOpenEditModal(true)
    setModalTitle('Edit Group')
  }

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true)
    setModalTitle('Delete Group')
  }

  const handleConfirmDelete = () => {

  }


  const [searchTerm, setSearchTerm] = useState<string>(pagedResult.searchTerm);


  const fetchGroups = async () => {
    try {
      const result = await GroupService.getPaginatedAllGroups(
        pagedResult.pageNumber,
        pagedResult.pageSize,
        searchTerm
      );

      // console.log(result.data)
      setPagedResult(result.data);

      // console.log(result); 
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };

  // UseEffect hook to refetch groups based on page number, page size, or search term change
  useEffect(() => {
    fetchGroups();
  }, [pagedResult.pageNumber, pagedResult.pageSize, searchTerm]);

  const columns = [
    { label: 'Branch Code', accessor: 'code' },
    { label: 'Branch Name', accessor: 'name' },
    { label: 'Description', accessor: 'description' },
    {
      label: 'Date Created',
      render: (data: any) => (
        FormattedDate(data.dateCreated)
      ),
    },
    {
      label: 'Date Modifiedd',
      render: (data: any) => (
        FormattedDate(data.dateModified)
      ),
    },
    // { label: 'Created By', accessor: 'createdBy' },
    { label: 'Area', accessor: 'area' },
    { label: 'Division', accessor: 'division' },
    {
      label: 'Action',
      render: () => (
        <Box sx={globalStyle.buttonBox}>
          <Tooltip title="Edit">
            <IconButton color='primary' onClick={handleOpenEditModal}>
              <EditNoteTwoTone />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton sx={globalStyle.buttonRed} onClick={handleOpenDeleteModal}>
              <DeleteTwoTone />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const pageCount = Math.ceil(pagedResult.totalCount / pagedResult.pageSize);

  const handlePageChange = (newPage: number) => {
    setPagedResult({
      ...pagedResult,
      pageNumber: newPage,
    });
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    pagedResult.pageNumber = 1;
  };

  return (
    <>
      <Box sx={globalStyle.mainBox}>
        <Typography variant="h6" component="h6" gutterBottom>
          Groups
        </Typography>

        {/* Search input box with spacing */}
        <Box sx={globalStyle.searchBox}>
          {/* Search Input */}
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            sx={globalStyle.searchInput} // Make the input box flexible
            value={searchTerm}  // Controlled input
            onChange={handleSearchChange}  // Update search term as user types
          />
        </Box>
      </Box>

      {/* Table wrapped inside a responsive container */}
      <Table columns={columns} data={pagedResult.items} />

      {/* Pagination Controls Component */}
      <PaginationControls
        currentPage={pagedResult.pageNumber}
        totalPages={pageCount}
        onPageChange={handlePageChange}
        totalItems={pagedResult.totalCount}
      />

      <EditDataModal
        open={openEditModal}
        handleClose={closeEditModal}
        title={modalTitle}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        requiredFields={REQUIRED_FIELDS}
      />




      <CustomModal
        open={openDeleteModal}
        handleConfirm={handleConfirmDelete}
        title={modalTitle}
        handleClose={() => setOpenDeleteModal(false)}
        buttonName='Delete'
        content='Are you sure you want to delete this group?'
      />
    </>
  );
};

export default GroupList;
