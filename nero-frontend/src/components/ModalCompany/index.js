import React, { useState, useEffect, useContext } from "react";

import * as Yup from "yup";
import { toast } from "react-toastify";
import {
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
import ButtonWithSpinner from "../ButtonWithSpinner";

import { Edit as EditIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import QueueSelectCustom from "../QueueSelectCustom";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";


import usePlans from "../../hooks/usePlans";
import moment from "moment";

import { head, isArray, has } from "lodash";
import { useDate } from "../../hooks/useDate";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  multFieldLine: {
    display: "flex",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },

  btnWrapper: {
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  form_container: {
    margin: "20px 30px",
  },
  fullWidth: {
    width: "100%",
  },
  modal_container: {
	  margin: "20px 30px",
  },
}));

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const ModalCompany = (props) => {
  const { open, onSubmit, onDelete, onClose, companyId, initialValue, loading } = props;
  const classes = useStyles();
  const [plans, setPlans] = useState([]);
  // const [modalUser, setModalUser] = useState(false);
  // const [firstUser, setFirstUser] = useState({});

  const initialState = {
    name: "",
    email: "",
    password: "",
    profile: "user",
  };

  const [company, setCompany] = useState(initialState);

  const [record, setRecord] = useState({
    name: "",
    email: "",
    phone: "",
    planId: "",
    status: true,
    campaignsEnabled: false,
    dueDate: "",
    recurrence: "",
    CheckMsgIsGroup: false,
    call: false,
    ...initialValue,
  });

  const { list: listPlans } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const list = await listPlans();
      setPlans(list);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRecord((prev) => {
      if (moment(initialValue).isValid()) {
        initialValue.dueDate = moment(initialValue.dueDate).format(
          "YYYY-MM-DD"
        );
      }
      return {
        ...prev,
        ...initialValue,
      };
    });
  }, [initialValue]);

  const handleSubmit = async (data) => {
    if (data.dueDate === "" || moment(data.dueDate).isValid() === false) {
      data.dueDate = null;
    }
    onSubmit(data);
    onClose();
    setRecord({ ...initialValue, dueDate: "" });
  };

  // const handleOpenModalUsers = async () => {
  //   try {
  //     const { data } = await api.get("/users/list", {
  //       params: {
  //         companyId: initialValue.id,
  //       },
  //     });
  //     if (isArray(data) && data.length) {
  //       setFirstUser(head(data));
  //     }
  //     setModalUser(true);
  //   } catch (e) {
  //     toast.error(e);
  //   }
  // };

  // const handleCloseModalUsers = () => {
  //   setFirstUser({});
  //   setModalUser(false);
  // };

  const incrementDueDate = () => {
    const data = { ...record };
    if (data.dueDate !== "" && data.dueDate !== null) {
      switch (data.recurrence) {
        case "MENSAL":
          data.dueDate = moment(data.dueDate)
            .add(1, "month")
            .format("YYYY-MM-DD");
          break;
        case "BIMESTRAL":
          data.dueDate = moment(data.dueDate)
            .add(2, "month")
            .format("YYYY-MM-DD");
          break;
        case "TRIMESTRAL":
          data.dueDate = moment(data.dueDate)
            .add(3, "month")
            .format("YYYY-MM-DD");
          break;
        case "SEMESTRAL":
          data.dueDate = moment(data.dueDate)
            .add(6, "month")
            .format("YYYY-MM-DD");
          break;
        case "ANUAL":
          data.dueDate = moment(data.dueDate)
            .add(12, "month")
            .format("YYYY-MM-DD");
          break;
        default:
          break;
      }
    }
    setRecord(data);
  };
  const handleClose = () => {
    onClose();
    setCompany(initialState);
  };
  // const handleSaveUser = async (values) => {
  //   const userData = { ...values, companyId, queueIds: selectedQueueIds };
  //   try {
  //     if (companyId) {
  //       await api.put(`/users/${companyId}`, userData);
  //     } else {
  //       await api.post("/users", userData);
  //     }
  //     toast.success(i18n.t("userModal.success"));
  //   } catch (err) {
  //     toastError(err);
  //   }
  //   handleClose();
  // };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          {record.id
            ? `${i18n.t("companyModal.title.edit")}`
            : `${i18n.t("companyModal.title.add")}`}
        </DialogTitle>
      <Formik
        enableReinitialize
        initialValues={record}
        onSubmit={(values, { resetForm }) =>
          setTimeout(() => {
            handleSubmit(values);
            resetForm();
          }, 500)
        }
      >
        {(values, setValues) => (
          <Form className={classes.fullWidth}>
            <DialogContent dividers>
            <Grid spacing={2} container>
              <Grid xs={12} sm={6} md={2} item>
                <Field
                  as={TextField}
                  label="Name"
                  name="name"
                  variant="outlined"
                  className={classes.fullWidth}
                  margin="dense"
                  required
                />
              </Grid>
              <Grid xs={12} sm={6} md={2} item>
                <Field
                  as={TextField}
                  label="Admin Email"
                  name="email"
                  variant="outlined"
                  className={classes.fullWidth}
                  margin="dense"
                  required
                />
              </Grid>
              <Grid xs={12} sm={6} md={2} item>
                <Field
                  as={TextField}
                  label="Telephone"
                  name="phone"
                  variant="outlined"
                  className={classes.fullWidth}
                  margin="dense"
                />
              </Grid>
              <Grid xs={12} sm={6} md={2} item>
                <Field
                  as={TextField}
                  label="Connections Number"
                  type="number"
                  name="connections_number"
                  variant="outlined"
                  className={classes.fullWidth}
                  margin="dense"
                  required
                />
              </Grid>
              <Grid xs={12} sm={6} md={2} item>
                <Field
                  as={TextField}
                  label="Users Number"
                  type="number"
                  name="users_number"
                  variant="outlined"
                  className={classes.fullWidth}
                  margin="dense"
                  required
                />
              </Grid>
              <Grid xs={12} sm={6} md={2} item>
                <Field
                  as={TextField}
                  label="Queues Number"
                  type="number"
                  name="queues_number"
                  variant="outlined"
                  className={classes.fullWidth}
                  margin="dense"
                  required
                />
              </Grid>
              <Grid xs={12} sm={6} md={2} item>
                <FormControl margin="dense" variant="outlined" fullWidth>
                  <InputLabel htmlFor="status-selection">Status</InputLabel>
                  <Field
                    as={Select}
                    id="status-selection"
                    label="Status"
                    labelId="status-selection-label"
                    name="status"
                    margin="dense"
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              
              <Grid xs={12} sm={6} md={2} item>
                <FormControl margin="dense" variant="outlined" fullWidth>
                  <InputLabel htmlFor="status-selection">{i18n.t("settings.settings.call.name")}</InputLabel>
                  <Field
                    as={Select}
                    id="call-selection"
                    label="Call"
                    labelId="call-selection-label"
                    name="call"
                    margin="dense"
                  >
                    <MenuItem value={true}>{i18n.t("settings.settings.call.options.enabled")}</MenuItem>
                    <MenuItem value={false}>{i18n.t("settings.settings.call.options.disabled")}</MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6} md={3} item>
                <FormControl margin="dense" variant="outlined" fullWidth>
                  <InputLabel htmlFor="CheckMsgIsGroup-selection">{i18n.t("settings.settings.CheckMsgIsGroup.name")}</InputLabel>
                  <Field
                    as={Select}
                    id="CheckMsgIsGroup-selection"
                    label="CheckMsgIsGroup"
                    labelId="CheckMsgIsGroup-selection-label"
                    name="CheckMsgIsGroup"
                    margin="dense"
                    className={classes.fullWidth}
                  >
                    <MenuItem value={true}>
                    {i18n.t("settings.settings.CheckMsgIsGroup.options.enabled")}
                    </MenuItem>
                    <MenuItem value={false}>
                    {i18n.t("settings.settings.CheckMsgIsGroup.options.disabled")}
                    </MenuItem>
                  </Field>
                </FormControl>
              </Grid>

              <Grid xs={12} sm={6} md={2} item>
                <FormControl margin="dense" variant="outlined" fullWidth>
                  <InputLabel htmlFor="campaigns-selection">Campaigns</InputLabel>
                  <Field
                    as={Select}
                    id="campaigns-selection"
                    label="Campaigns"
                    labelId="campaigns-selection-label"
                    name="campaignsEnabled"
                    margin="dense"
                  >
                    <MenuItem value={true}>Enabled</MenuItem>
                    <MenuItem value={false}>Disabled</MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6} md={2} item>
                <FormControl variant="outlined" fullWidth>
                  <Field
                    as={TextField}
                    label="Expiration Date"
                    type="date"
                    name="dueDate"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    fullWidth
                    margin="dense"
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6} md={2} item>
                <FormControl margin="dense" variant="outlined" fullWidth>
                  <InputLabel htmlFor="recorrencia-selection">
                  Recurrent
                  </InputLabel>
                  <Field
                    as={Select}
                    label="Recurrent"
                    labelId="recorrencia-selection-label"
                    id="recurrence"
                    name="recurrence"
                    margin="dense"
                  >
                    <MenuItem value="MENSAL">Mensal</MenuItem>
                    <MenuItem value="BIMESTRAL">Bimestral</MenuItem>
                    <MenuItem value="TRIMESTRAL">Trimestral</MenuItem>
                    <MenuItem value="SEMESTRAL">Semestral</MenuItem>
                    <MenuItem value="ANUAL">Anual</MenuItem>
                  </Field>
                </FormControl>
              </Grid>
              
            </Grid>
            </DialogContent>
            <DialogActions>
              <Grid xs={12} item>
                <Grid justifyContent="flex-end" spacing={1} container>
                  <Grid xs={4} md={1} item>
                    <ButtonWithSpinner
                      className={classes.fullWidth}
                      style={{ marginTop: 7 }}
                      loading={loading}
                      onClick={handleClose}
                      variant="contained"
                    >
                      Close
                    </ButtonWithSpinner>
                  </Grid>
                  {record.id !== undefined ? (
                    <>
                      <Grid xs={6} md={1} item>
                        <ButtonWithSpinner
                          style={{ marginTop: 7 }}
                          className={classes.fullWidth}
                          loading={loading}
                          onClick={() => onDelete(record)}
                          variant="contained"
                          color="secondary"
                        >
                          Delete
                        </ButtonWithSpinner>
                      </Grid>
                      <Grid xs={6} md={2} item>
                        <ButtonWithSpinner
                          style={{ marginTop: 7 }}
                          className={classes.fullWidth}
                          loading={loading}
                          onClick={() => incrementDueDate()}
                          variant="contained"
                          color="primary"
                        >
                          + Maturity
                        </ButtonWithSpinner>
                      </Grid>
                      {/* <Grid xs={6} md={1} item>
                        <ButtonWithSpinner
                          style={{ marginTop: 7 }}
                          className={classes.fullWidth}
                          loading={loading}
                          onClick={() => handleOpenModalUsers()}
                          variant="contained"
                          color="primary"
                        >
                          User
                        </ButtonWithSpinner>
                      </Grid> */}
                    </>
                  ) : null}
                  <Grid xs={6} md={1} item>
                    <ButtonWithSpinner
                      className={classes.fullWidth}
                      style={{ marginTop: 7 }}
                      loading={loading}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {record.id
                    ? `${i18n.t("companyModal.buttons.okEdit")}`
                    : `${i18n.t("companyModal.buttons.okAdd")}`}
                    </ButtonWithSpinner>
                  </Grid>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        )}
      </Formik>
      </Dialog>
    </div>
  );
};

export default ModalCompany;
