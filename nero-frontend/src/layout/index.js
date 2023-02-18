import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";

import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  MenuItem,
  IconButton,
  Menu,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircle from "@material-ui/icons/AccountCircle";

import MainListItems from "./MainListItems";
import NotificationsPopOver from "../components/NotificationsPopOver";
import UserModal from "../components/UserModal";
import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";
import { i18n } from "../translate/i18n";
import toastError from "../errors/toastError";
import AnnouncementsPopover from "../components/AnnouncementsPopover";

import logo from "../assets/zapsimples.png";
import { socketConnection } from "../services/socket";
import ChatPopover from "../pages/Chat/ChatPopover";
import * as setting from '../contant';


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 56px)",
    },
  },

  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: setting.defaultBgColor,
    color: setting.defaultTextColor,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8px",
    minHeight: "48px",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    // marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 0,
    width: "237px",
    textAlign: "center",
    transition: "cubic-bezier(0.4, 0, 0.6, 1) 500ms",
  },
  topBlankSpace: {
    flexGrow: 1,
  },
  titleHidden: {
    width: "0px",
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: "280px",
    overflowX: "hidden",
    transition: "0.5s",
  },
  drawerPaperClose: {
    position: "relative",
    whiteSpace: "nowrap",
    width: "70px",
    overflowX: "hidden",
    transition: "0.5s",
  },
  appBarSpacer: {
    minHeight: "48px",
  },
  content: {
    flex: 1,
    overflow: "auto",
    ...theme.scrollbarStyles,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  containerWithScroll: {
    flex: 1,
    padding: "3px",
    overflowY: "scroll",
    overflowX: "hidden",
    ...theme.scrollbarStyles,
    "&:hover div": {
      transitions: "0.5s",
    },
  },
  
}));

const LoggedInLayout = ({ children }) => {
  const classes = useStyles();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout, loading } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerHidden, setDrawerHidden] = useState(false);
  const [drawerwidth, setDrawerWidth] = useState(280);
  const [menuStatus, setMenuOpenStatus] = useState(true);
  const [nowLocation, setNowLocation] = useState(null);
  const [drawerVariant, setDrawerVariant] = useState("permanent");
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const theme = useTheme();
  const greaterThenSm = useMediaQuery(theme.breakpoints.up("sm"));

  
  useEffect(() => {
    if(location.pathname == "/tickets"){
      setMenuOpenStatus(false);
      setDrawerOpen(true);
      setDrawerWidth(70);
      setNowLocation(location.pathname);
    }
  }, []);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const userId = localStorage.getItem("userId");

    const socket = socketConnection({ companyId });

    socket.on(`company-${companyId}-auth`, (data) => {
      if (data.user.id === +userId) {
        toastError("Sua conta foi acessada em outro computador.");
        setTimeout(() => {
          localStorage.clear();
          window.location.reload();
        }, 1000);
      }
    });

    socket.emit("userStatus");
    const interval = setInterval(() => {
      socket.emit("userStatus");
    }, 1000 * 60 * 5);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseMenu();
  };

  const handleClickLogout = () => {
    handleCloseMenu();
    handleLogout();
  };
  const drawerShow = (value) => {
    if(nowLocation != location.pathname && location.pathname != "/tickets"){
      setMenuOpenStatus(true);
      setNowLocation(location.pathname);
    }
    else if(nowLocation != location.pathname && location.pathname == "/tickets"){
      setMenuOpenStatus(false);
      setDrawerOpen(true);
      setDrawerWidth(70);
      setNowLocation(location.pathname);
    }
    else{
      setNowLocation(location.pathname);
      if(nowLocation != "/tickets"){
        if(value.pageX < drawerwidth){
            setDrawerOpen(false);
            setDrawerWidth(280);
        }else{
          if(!menuStatus){
            setDrawerOpen(true);
            setDrawerWidth(70);
          }
        }
      }
      else {
        if(value.pageX < drawerwidth){
          setDrawerOpen(false);
          setDrawerWidth(280);
        }else{
          if(!menuStatus){
            setMenuOpenStatus(false);
            setDrawerOpen(true);
            setDrawerWidth(70);
          }
        }
      }
    }
    // console.log(location);
    
  };
  const drawerShow_ = (value) => {
    setMenuOpenStatus(value);
    setDrawerOpen(!value);
    if(value) setDrawerWidth(280);
    else setDrawerWidth(70);
  };

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <div className={classes.root}
        onMouseMove={(e) => drawerShow(e)}>
      <Drawer
        variant={drawerVariant}
        
        classes={{
          paper: clsx(
            classes.drawerPaper,
            drawerOpen && classes.drawerPaperClose
          ),
        }}
        open={drawerOpen}
        onMouseOver={(e) => drawerShow(e)}
      >
        <div className={classes.toolbarIcon}>
          
        </div>
        <Divider />
        <List className={classes.containerWithScroll}>
          <MainListItems drawerOpen={drawerOpen}/>
        </List>
        <Divider />
      </Drawer>
      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userId={user?.id}
      />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, !drawerOpen && classes.appBarShift)}
        color="inherit"
      >
        <Toolbar variant="dense" className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={clsx(classes.title, !menuStatus && classes.titleHidden)}
          >
            {greaterThenSm ? (
              <>
                NeroChat
              </>
            ) : (
              user.name
            )}
          </Typography>
          <IconButton
            edge="start"
            variant="contained"
            aria-label="open drawer"
            color="inherit"
            onClick={() => drawerShow_(!menuStatus)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.topBlankSpace}>
          </Typography>
          {user.id && <NotificationsPopOver />}

          <AnnouncementsPopover />

          <ChatPopover />

          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              variant="contained"
              color={"inherit"}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={menuOpen}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleOpenUserModal}>
                {i18n.t("mainDrawer.appBar.user.profile")}
              </MenuItem>
              <MenuItem onClick={handleClickLogout}>
                {i18n.t("mainDrawer.appBar.user.logout")}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        {children ? children : null}
      </main>
    </div>
  );
};

export default LoggedInLayout;
