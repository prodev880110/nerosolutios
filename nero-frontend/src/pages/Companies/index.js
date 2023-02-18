import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Select,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import ButtonWithSpinner from "../../components/ButtonWithSpinner";
import ConfirmationModal from "../../components/ConfirmationModal";

import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";

import { toast } from "react-toastify";
import useCompanies from "../../hooks/useCompanies";
import usePlans from "../../hooks/usePlans";
import ModalUsers from "../../components/ModalUsers";
import ModalCompany from "../../components/ModalCompany";
import api from "../../services/api";
import { head, isArray, has } from "lodash";
import { useDate } from "../../hooks/useDate";


import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import toastError from "../../errors/toastError";


import { i18n } from "../../translate/i18n";

import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  mainPaper: {
    width: "100%",
    flex: 1,
    padding: theme.spacing(2),
  },
  fullWidth: {
    width: "100%",
  },
  _content:{
	display: "content",
  },
  tableContainer: {
    width: "100%",
    overflowX: "scroll",
    ...theme.scrollbarStyles,
  },
  textfield: {
    width: "100%",
  },
  textRight: {
    textAlign: "right",
  },
  row: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  control: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  buttonContainer: {
    textAlign: "right",
    padding: theme.spacing(1),
  },
}));


export function CompaniesManagerGrid(props) {
  const { records, onSelect, onEditUser, onDelete } = props;
  const classes = useStyles();
  const { dateToClient } = useDate();

  const renderStatus = (row) => {
    return row.status === false ? "Não" : "Sim";
  };

//   const renderPlan = (row) => {
//     return row.planId !== null ? row.plan.name : "-";
//   };
  
  
  const renderCampaignsStatus = (row) => {
    if (
      has(row, "settings") &&
      isArray(row.settings) &&
      row.settings.length > 0
    ) {
      const setting = row.settings.find((s) => s.key === "campaignsEnabled");
      if (setting) {
        return setting.value === "true" ? "Enabled" : "Disabled";
      }
    }
    return "Disabled";
  };

  const rowStyle = (record) => {
    if (moment(record.dueDate).isValid()) {
      const now = moment();
      const dueDate = moment(record.dueDate);
      const diff = dueDate.diff(now, "days");
      if (diff === 5) {
        return { backgroundColor: "#fffead" };
      }
      if (diff >= -3 && diff <= 4) {
        return { backgroundColor: "#f7cc8f" };
      }
      if (diff === -4) {
        return { backgroundColor: "#fa8c8c" };
      }
    }
    return {};
  };
	
  return (
	
    <Paper className={classes.tableContainer}>
		
      <Table
        className={classes.fullWidth}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{ width: "1%" }}>
              #
            </TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Code</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Telephone</TableCell>
            <TableCell align="left">Connections</TableCell>
            <TableCell align="left">Users</TableCell>
            <TableCell align="left">Queues</TableCell>
            <TableCell align="left">Campaigns</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Created in</TableCell>
            <TableCell align="left">Maturity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row, key) => (
            <TableRow style={rowStyle(row)} key={key}>
              <TableCell align="center" style={{ width: "1%" }}>
                <IconButton size="small" style={{ fontSize: "13px"}} onClick={() => onSelect(row)} aria-label="delete">
                  <EditIcon  fontSize="small"/>
                </IconButton>
				          <IconButton size="small" style={{ fontSize: "10px"}} onClick={() => onDelete(row.id)} aria-label="delete">
                  <DeleteIcon  fontSize="small"/>
                </IconButton>
              </TableCell>
              <TableCell align="left"  style={{ fontSize: "13px", minWidth: "140px" }}>{row.name || "-"}</TableCell>
              <TableCell align="left">{row.code}</TableCell>
              <TableCell align="left">
                <IconButton size="small" style={{ fontSize: "15px" }} sizeSmall onClick={() => onEditUser(row.id)} aria-label="delete">
                  {row.email || "---"}
                </IconButton>
              </TableCell>
              <TableCell align="left">{row.phone || "-"}</TableCell>
              <TableCell align="left">{row.connections_number}</TableCell>
              <TableCell align="left">{row.users_number}</TableCell>
              <TableCell align="left">{row.queues_number}</TableCell>
              <TableCell align="left">{renderCampaignsStatus(row)}</TableCell>
              <TableCell align="left">{renderStatus(row)}</TableCell>
              <TableCell align="left">{dateToClient(row.createdAt)}</TableCell>
              <TableCell align="left">
                {dateToClient(row.dueDate)}
                <br />
                <span>{row.recurrence}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default function Companies() {
  const classes = useStyles();
  const { list, save, update, remove } = useCompanies();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState({
    name: "",
    email: "",
    phone: "",
	connections_number: "",
	users_number: "",
	queues_number: "",
    status: true,
    campaignsEnabled: false,
    dueDate: "",
    recurrence: "",
  });
  
  const [pageNumber, setPageNumber] = useState(1);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleteCompany, setDeletieCompany] = useState(null);
  const [deletingCompany, setDeletingCompany] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [modalCompany, setModalCompany] = useState(false);

  const [modalUser, setModalUser] = useState(false);
  const [firstUser, setFirstUser] = useState({});


  useEffect(() => {
    loadPlans();
  }, [searchParam]);
  

  const loadPlans = async () => {
    setLoading(true);
    try {
	  let _companyList = [];
      const companyList = await list();

	  companyList.forEach(element => {
		if(searchParam == "" || element.name.search(searchParam) > -1)
		_companyList.push(element);

		console.log(element.name.search(searchParam));
	  });
	  
      setRecords(_companyList);
    } catch (e) {
      toast.error("Não foi possível carregar a lista de registros");
    }
    setLoading(false);
  };

  const handleOpenModalCompany = (id) => {
    setSelectedCompany(id);
    setModalCompany(true);
  };

  const handleCloseModalCompany = () => {
    setSelectedCompany(null);
    setModalCompany(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (data.id !== undefined) {
        await update(data);
      } else {
        await save(data);
      }
      await loadPlans();
      handleCancel();
      toast.success("Operação realizada com sucesso!");
    } catch (e) {
      toast.error(
        "Unable to perform the operation. Check if a company with the same name already exists or if the fields have been filled in correctly"
      );
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await remove(deleteCompany);
      await loadPlans();
      handleCancel();
      toast.success("Operação realizada com sucesso!");
    } catch (e) {
      toast.error("Não foi possível realizar a operação");
    }
    setLoading(false);
	setDeletingCompany(null);
    // setSearchParam("");
    setPageNumber(1);
  };
  const handleOpenDeleteDialog = (id) => {
	setDeletieCompany(id);
    setShowConfirmDialog(true);
  };

  const handleCancel = () => {
    setRecord((prev) => ({
      ...prev,
      name: "",
      email: "",
      phone: "",
      connections_number: "",
      users_number: "",
      queues_number: "",
      status: true,
      campaignsEnabled: false,
      dueDate: "",
      recurrence: "",
    }));
  };

  const handleSelect = (data) => {
    let campaignsEnabled = false;

    const setting = data.settings.find(
      (s) => s.key.indexOf("campaignsEnabled") > -1
    );
    if (setting) {
      campaignsEnabled =
        setting.value === "true" || setting.value === "enabled";
    }

    setRecord((prev) => ({
      ...prev,
      id: data.id,
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      connections_number: data.connections_number || "",
      users_number: data.users_number || "",
      queues_number: data.queues_number || "",
      status: data.status === false ? false : true,
      campaignsEnabled,
      dueDate: data.dueDate || "",
      recurrence: data.recurrence || "",
    }));

	setSelectedCompany(data.id);
    setModalCompany(true);

  };
  const handleOpenModalUsers = async (id) => {
    try {
      const { data } = await api.get("/users/list", {
        params: {
          companyId: id,
        },
      });
      if (isArray(data) && data.length) {
        setFirstUser(head(data));
      }
      setModalUser(true);
    } catch (e) {
      toast.error(e);
    }
  };

  const handleCloseModalUsers = () => {
    setFirstUser({});
    setModalUser(false);
  };
  return (

    <MainContainer className={classes._content}>
		<ModalUsers
			userId={firstUser.id}
			companyId={selectedCompany}
			open={modalUser}
			onClose={handleCloseModalUsers}
		/>
		<ModalCompany
        initialValue={record}
		onDelete={handleOpenDeleteDialog}
		onSubmit={handleSubmit}
		loading={loading}
        open={modalCompany}
		companyId={record.id}
        onClose={handleCloseModalCompany}
      />
      
	  <MainHeader>
        <Title>{i18n.t("companies.title")}</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("contacts.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModalCompany}
          >
            {i18n.t("companies.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Grid >
        {/* <Grid xs={12} item>
          <CompanyForm
            initialValue={record}
            onDelete={handleOpenDeleteDialog}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </Grid> */}
        <Grid xs={12} item>
          <CompaniesManagerGrid records={records} onEditUser={handleOpenModalUsers} onDelete={handleOpenDeleteDialog} onSelect={handleSelect} />
        </Grid>
      </Grid>
      <ConfirmationModal
        title="Delete Company"
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => handleDelete()}
      >
        Do you really want to delete this record?
      </ConfirmationModal>
    </MainContainer>
  );
}
