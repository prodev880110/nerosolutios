import React, { useState, useContext } from "react";
// import { Link as RouterLink } from "react-router-dom";


import { makeStyles } from "@material-ui/core/styles";
import { 
	Visibility, 
	VisibilityOff, 
	AccountCircleOutlined,
	VpnKeyOutlined,
	LockOutlined,
} from '@material-ui/icons';
import {
	Button,
	CssBaseline,
	TextField,
	InputAdornment,
	IconButton,
} from '@material-ui/core';
import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";

import {defaultBgColor} from '../../contant';

// const Copyright = () => {
// 	return (
// 		<Typography variant="body2" color="textSecondary" align="center">
// 			{"Copyleft "}
// 			<Link color="inherit" href="https://github.com/canove">
// 				Canove
// 			</Link>{" "}
// 			{new Date().getFullYear()}
// 			{"."}
// 		</Typography>
// 	);
// };

const useStyles = makeStyles(theme => ({
	paper: {
		"height": "100vh",
		"margin": "0 auto",
		"padding": "0 50px",
		"max-width": "450px",
		"display": "flex",
		"min-width": "350px",
		"min-height": "100%",
		"align-items": "center",
		"flex-direction": "column",
		"justify-content": "center",
		
	  },
	  form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	  },
	  submit: {
		margin: theme.spacing(3, 0, 2),
		width: "150px",
		backgroundColor: defaultBgColor,
	  },
	  left_bg: {
		left: 0,
		width: "50%",
		height: "100vh",
		position: "fixed",
	  },
	  right_bg: {
		"background-image": "url(bg.jpg)",
		"background-repeat": "no-repeat",
		"background-size": "cover",
		"background-position": "center",
		position: "fixed",
		right: 0,
		width: "50%",
		height: "100vh",
	  },
	  logo_name : {
		"font-size": "45px",
		"-webkit-text-stroke": "1px",
	  },
	  brand_name : {
		"color": defaultBgColor,
		"font-weight": "600",
	  },
	  '@media (max-width: 900px)':{
		left_bg: {
		  width: "100%"
		},
		right_bg: {
		  width: "0%"
		},
	  },
}));

const Login = () => {
	const classes = useStyles();

	const [user, setUser] = useState({ name: "", password: "", company: "" });
	const [showPassword, setShowPassword] = useState(false);

	const { handleLogin } = useContext(AuthContext);

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handlSubmit = e => {
		e.preventDefault();
		handleLogin(user);
	};

	return (
		<div>
			<CssBaseline />
			<div className={classes.left_bg}>
				<div className={classes.paper}>
				<div className={classes.logo_name}>{i18n.t("login.logoName")} <span className={classes.brand_name}>{i18n.t("login.brandName")}</span></div>
				<form className={classes.form} noValidate onSubmit={handlSubmit}>
			
					<TextField
						InputProps={{
						startAdornment: (
							<InputAdornment position="start">
							<VpnKeyOutlined />
							</InputAdornment>
						),
						}}
						variant="standard"
						margin="normal"
						required
						fullWidth
						id="company"
						label={i18n.t("login.form.company")}
						name="company"
						value={user.company}
						onChange={handleChangeInput}
						autoComplete="company"
						autoFocus
					/>
					<TextField
					InputProps={{
						startAdornment: (
						<InputAdornment position="start">
							<AccountCircleOutlined />
						</InputAdornment>
						),
					}}
					variant="standard"
					margin="normal"
					required
					fullWidth
					id="name"
					label={i18n.t("login.form.name")}
					name="name"
					value={user.name}
					onChange={handleChangeInput}
					autoComplete="name"
					autoFocus
					/>
					
					<TextField
					variant="standard"
					margin="normal"
					required
					fullWidth
					name="password"
					label={i18n.t("login.form.password")}
					id="password"
					value={user.password}
					onChange={handleChangeInput}
					autoComplete="current-password"
					type={showPassword ? 'text' : 'password'}
					InputProps={{
						startAdornment: (
						<InputAdornment position="start">
							<LockOutlined />
						</InputAdornment>
						),
						endAdornment: (
						<InputAdornment position="end">
							<IconButton
							aria-label="toggle password visibility"
							onClick={() => setShowPassword((e) => !e)}
							>
							{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
						)
					}}
					/>
					<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
					>
					{i18n.t("login.buttons.submit")}
					</Button>
					
				</form>
				</div>
			</div>
			<div className={classes.right_bg}></div>
		</div>
	);
};

export default Login;
