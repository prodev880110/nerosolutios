import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import { Button, IconButton, StepContent, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import api from "../../services/api";
import toastError from "../../errors/toastError";

import { FormControlLabel } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import { Field } from "formik";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 400,
    [theme.breakpoints.down("sm")]: {
      maxHeight: "20vh",
    },
  },
  button: {
    marginRight: theme.spacing(1),
  },
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  addButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  userinfo_user_avatar: {
    minWidth: "200px",
    height: "300px",
  },
  changePhoto1:{
    "position": "relative",
    backgroundColor: "#626262cc",
    width: "fit-content",
    "font-size": "12px",
    "border-radius": "50px",
    "box-shadow": "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
    "padding": "0px 15px",
    color: "#fff",
    transition: "0.5s",
    "&:hover > div > label":{
      cursor: "pointer",
    }
  },
  uploadInput: {
		display: "none",
	},
}));

export function QueueOptionStepper({ queueId, options, updateOptions }) {
  const classes = useStyles();
  const [activeOption, setActiveOption] = useState(-1);

  console.log(options);
  const handleOption = (index) => async () => {
    setActiveOption(index);
    const option = options[index];

    if (option !== undefined && option.id !== undefined) {
      try {
        const { data } = await api.request({
          url: "/queue-options",
          method: "GET",
          params: { queueId, parentId: option.id },
        });
        const optionList = data.map((option) => {
          return {
            ...option,
            children: [],
            edition: false,
          };
        });
        option.children = optionList;

        updateOptions();
      } catch (e) {
        toastError(e);
      }
    }
  };

  const handleSave = async (option) => {
    try {
      if (option.id) {
        await api.request({
          url: `/queue-options/${option.id}`,
          method: "PUT",
          data: option,
        });
      } else {
        const { data } = await api.request({
          url: `/queue-options`,
          method: "POST",
          data: option,
        });
        option.id = data.id;
      }
      option.edition = false;
      updateOptions();
    } catch (e) {
      toastError(e);
    }
  };

  const handleEdition = (index) => {
    options[index].edition = !options[index].edition;
    updateOptions();
  };

  const handleDeleteOption = async (index) => {
    const option = options[index];
    if (option !== undefined && option.id !== undefined) {
      try {
        await api.request({
          url: `/queue-options/${option.id}`,
          method: "DELETE",
        });
      } catch (e) {
        toastError(e);
      }
    }
    options.splice(index, 1);
    options.forEach(async (option, order) => {
      option.option = order + 1;
      await handleSave(option);
    });
    updateOptions();
  };

  const handleOptionChangeTitle = (event, index) => {
    options[index].title = event.target.value;
    updateOptions();
  };

  const handleOptionChangeMessage = (event, index) => {
    options[index].message = event.target.value;
    console.log(options[index]);
    updateOptions();
  };
  const handleOptionChangeIsAgent = (event, index) => {
    options[index].isAgent = event.target.checked;
    updateOptions();
  };
  const handleOptionChangeMediaUrl = async (event, index) => {
    if (!event.target.files) {
			return;
		}
    console.log(event.target);
    console.log(event.target.name);
    console.log(options[index]);
    const selectedMedias = Array.from(event.target.files);

    const formData = new FormData();
    formData.append("file", selectedMedias[0]);

    const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    }

		try {
			const {data} = await api.post(`queue-options/${event.target.name}`, formData, config);
      options[index].mediaUrl = data;
      updateOptions();
		} catch (err) {
			toastError(err);
		}
  };

  const renderTitle = (index) => {
    const option = options[index];
    if (option.edition) {
      return (
        <>
          <TextField
            value={option.title}
            onChange={(event) => handleOptionChangeTitle(event, index)}
            size="small"
            className={classes.input}
            placeholder="Option Title"
          />
          {option.edition && (
            <>
              <FormControlLabel
                control={
                  <Field
                    as={Switch}
                    color="primary"
                    name={`isAgent`}
                    checked={
                      option.isAgent
                    }
                    onChange={(event) => handleOptionChangeIsAgent(event, index)}
                  />
                }
                label="Atendente"
              />
              <IconButton
                color="primary"
                variant="outlined"
                size="small"
                className={classes.button}
                onClick={() => handleSave(option)}
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                variant="outlined"
                color="secondary"
                size="small"
                className={classes.button}
                onClick={() => handleDeleteOption(index)}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </>
          )}
        </>
      );
    }
    return (
      <>
        <Typography>
          {option.title !== "" ? option.title : "Undefined Title"}
          <IconButton
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={() => handleEdition(index)}
          >
            <EditIcon />
          </IconButton>
        </Typography>
      </>
    );
  };

  const renderMessage = (index) => {
    const option = options[index];
    if (option.edition) {
      if(option.id > 0){
        return (
          <>
            <TextField
              style={{ width: "100%" }}
              multiline
              value={option.message}
              onChange={(event) => handleOptionChangeMessage(event, index)}
              size="small"
              className={classes.input}
              placeholder="Digite o texto da opção"
            />
            {<img className={classes.userinfo_user_avatar} src={process.env.REACT_APP_BACKEND_URL + option.mediaUrl} />}
            <div className={classes.changePhoto1}>
              <div>
                <input
                  type="file"
                  id={`upload-mediaFile-${option.id}`}
                  name={option.id}
                  className={classes.uploadInput}
                  onChange={(event) => handleOptionChangeMediaUrl(event, index)}
                />
                <label htmlFor={`upload-mediaFile-${option.id}`}>
                  Choose Media
                </label>
              </div>
            </div>
            </>
        );
      }
      else{
        return (
          <>
            <TextField
              style={{ width: "100%" }}
              multiline
              value={option.message}
              onChange={(event) => handleOptionChangeMessage(event, index)}
              size="small"
              className={classes.input}
              placeholder="Digite o texto da opção"
            />
            
          </>
        );
      }
    }
    return (
      <>
        <Typography onClick={() => handleEdition(index)}>
          {option.message}
        </Typography>
      </>
    );
  };
  
  const handleAddOption = (index) => {
    const optionNumber = options[index].children.length + 1;
    options[index].children.push({
      title: "",
      message: "",
      edition: false,
      option: optionNumber,
      queueId,
      isAgent: false,
      mediaUrl: null,
      parentId: options[index].id,
      children: [],
    });
    updateOptions();
  };

  const renderStep = (option, index) => {
    return (
      <Step key={index}>
        <StepLabel style={{ cursor: "pointer" }} onClick={handleOption(index)}>
          {renderTitle(index)}
        </StepLabel>
        <StepContent>
          {renderMessage(index)}

          {option.id !== undefined && (
            <>
              <Button
                color="primary"
                size="small"
                onClick={() => handleAddOption(index)}
                startIcon={<AddIcon />}
                variant="outlined"
                className={classes.addButton}
              >
                Adicionar
              </Button>
            </>
          )}
          <QueueOptionStepper
            queueId={queueId}
            options={option.children}
            updateOptions={updateOptions}
          />
        </StepContent>
      </Step>
    );
  };

  const renderStepper = () => {
    return (
      <Stepper
        style={{ marginBottom: 0, paddingBottom: 0 }}
        nonLinear
        activeStep={activeOption}
        orientation="vertical"
      >
        {options.map((option, index) => renderStep(option, index))}
      </Stepper>
    );
  };

  return renderStepper();
}

export function QueueOptions({ queueId }) {
  const classes = useStyles();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (queueId) {
      const fetchOptions = async () => {
        try {
          const { data } = await api.request({
            url: "/queue-options",
            method: "GET",
            params: { queueId, parentId: -1 },
          });
          const optionList = data.map((option) => {
            return {
              ...option,
              children: [],
              edition: false,
            };
          });
          setOptions(optionList);
        } catch (e) {
          toastError(e);
        }
      };
      fetchOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStepper = () => {
    if (options.length > 0) {
      return (
        <QueueOptionStepper
          queueId={queueId}
          updateOptions={updateOptions}
          options={options}
        />
      );
    }
  };

  const updateOptions = () => {
    setOptions([...options]);
  };

  const addOption = () => {
    const newOption = {
      title: "",
      message: "",
      edition: false,
      option: options.length + 1,
      queueId,
      isAgent: false,
      mediaUrl: null,
      parentId: null,
      children: [],
    };
    setOptions([...options, newOption]);
  };

  return (
    <div className={classes.root}>
      <br />
      <Typography>
      Options
        <Button
          color="primary"
          size="small"
          onClick={addOption}
          startIcon={<AddIcon />}
          style={{ marginLeft: 10 }}
          variant="outlined"
        >
          Adicionar
        </Button>
      </Typography>
      {renderStepper()}
    </div>
  );
}
