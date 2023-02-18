import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link as RouterLink, useLocation, useHistory } from "react-router-dom";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import MenuBookIcon from "@material-ui/icons/MenuBook";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import { Badge, Collapse, List } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import HomeOutlined from "@material-ui/icons/HomeOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import SupervisorAccountOutlined from "@material-ui/icons/SupervisorAccountOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import VolumeUpOutlined from "@material-ui/icons/VolumeUpOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import EventIcon from "@material-ui/icons/Event";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PeopleIcon from "@material-ui/icons/People";
import ListIcon from "@material-ui/icons/ListAlt";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import ForumIcon from "@material-ui/icons/Forum";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";
import { socketConnection } from "../services/socket";
import { isArray } from "lodash";
import api from "../services/api";
import toastError from "../errors/toastError";



const reducer = (state, action) => {
  if (action.type === "LOAD_CHATS") {
    const chats = action.payload;
    const newChats = [];

    if (isArray(chats)) {
      chats.forEach((chat) => {
        const chatIndex = state.findIndex((u) => u.id === chat.id);
        if (chatIndex !== -1) {
          state[chatIndex] = chat;
        } else {
          newChats.push(chat);
        }
      });
    }

    return [...state, ...newChats];
  }

  if (action.type === "UPDATE_CHATS") {
    const chat = action.payload;
    const chatIndex = state.findIndex((u) => u.id === chat.id);

    if (chatIndex !== -1) {
      state[chatIndex] = chat;
      return [...state];
    } else {
      return [chat, ...state];
    }
  }

  if (action.type === "DELETE_CHAT") {
    const chatId = action.payload;

    const chatIndex = state.findIndex((u) => u.id === chatId);
    if (chatIndex !== -1) {
      state.splice(chatIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }

  if (action.type === "CHANGE_CHAT") {
    const changedChats = state.map((chat) => {
      if (chat.id === action.payload.chat.id) {
        return action.payload.chat;
      }
      return chat;
    });
    return changedChats;
  }
};

const useStyles = makeStyles((theme) => ({
  
  userinfo_photo:{
    textAlign: "center",
    display: "flex",
    "justify-content": "center",
    padding: "10px 10px",
  },
  userinfo_user_avatar: {
    width: "100%",
    height: "100%",
  },
  userinfo_user_photo:{
    "display": "flex",
    "justify-content": "center",
    width: "100px",
    height: "100px",
    transition: "1s",
    "&:hover > div":{
      opacity: "1",
    }
  },
  userinfo_user_photo_small:{
    "display": "flex",
    "justify-content": "center",
    width: "30px",
    height: "30px",
    transition: "1s",
  },
  userinfo_name:{
    "display": "flex",
    "justify-content": "center",
    "padding-top": "0px",
    "font-size": "23px",
    "color": "#128c7e",
    "font-weight": "700",
    "-webkit-text-stroke": "1px #128c7e",
    transition: "1s",
  },
  userinfo_email:{
    "display": "flex",
    "justify-content": "center",
    "font-size": "15px",
    "color": "#555",
    transition: "1s",
  },
  hidden:{
    "display": "flex",
    "justify-content": "center",
    "font-size": "0px",
    transition: "1s",
  },
  changePhoto1:{
    "position": "absolute",
    backgroundColor: "#626262cc",
    "font-size": "12px",
    "border-radius": "50px",
    "box-shadow": "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
    "padding": "41.5px 12px",
    opacity: 0,
    color: "#fff",
    transition: "0.5s",
    "&:hover > div > label":{
      cursor: "pointer",
    }
  },
    
  changePhoto2:{
    "position": "absolute",
    "top": "0px",
    "right": "0px",
    "font-size": "0px",
    opacity: 0,
    "border-radius": "0px",
    "padding": "0px 0px",
    transition: "1s",
  },
  uploadInput: {
		display: "none",
	},
  menuItemContainer: {
		"font-size": "10px",
    "&:hover .MuiListItemText-root":{
      "padding-left": "10px",
    }
	},
  menuItemIcon: {
		"font-size": "10px",
    transition: "0.3s",
	},
  menuItemText: {
		"font-size": "12px",
    transition: "0.3s",
    
	},
  selected: {
    '&.Mui-selected': {
        backgroundColor: "turquoise",
        color: "white",
        fontWeight: 600
    }
  }
}));

const MainListItems = (props) => {
  const classes = useStyles();
  const { drawerOpen } = props;
  
  const location = useLocation();

  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const [openCampaignSubmenu, setOpenCampaignSubmenu] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const history = useHistory();

  const [invisible, setInvisible] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam] = useState("");
  const [chats, dispatch] = useReducer(reducer, []);

  const changePhotoStyle = null

function ListItemLink(props) {
  const { icon, primary, to, className } = props;
  const location = useLocation();
  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink}
        selected={to === location.pathname} 
        className={classes.menuItemContainer}>
        {icon ? <ListItemIcon className={classes.menuItemIcon}>{icon}</ListItemIcon> : null}
        <ListItemText className={classes.menuItemText} primary={primary} />
      </ListItem>
    </li>
  );
}
  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketConnection({ companyId });

    socket.on(`company-${companyId}-chat`, (data) => {
      if (data.action === "new-message") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
      if (data.action === "update") {
        dispatch({ type: "CHANGE_CHAT", payload: data });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    let unreadsCount = 0;
    if (chats.length > 0) {
      for (let chat of chats) {
        for (let chatUser of chat.users) {
          if (chatUser.userId === user.id) {
            unreadsCount += chatUser.unreads;
          }
        }
      }
    }
    if (unreadsCount > 0) {
      setInvisible(false);
    } else {
      setInvisible(true);
    }
  }, [chats, user.id]);

  useEffect(() => {
    if (localStorage.getItem("cshow")) {
      setShowCampaigns(true);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CHATS", payload: data.records });
    } catch (err) {
      toastError(err);
    }
  };
 
  const changeUserPhoto = async (e) => {
    if (!e.target.files) {
			return;
		}

		const selectedMedias = Array.from(e.target.files);

    const formData = new FormData();
    formData.append("file", selectedMedias[0]);

    const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    }

		try {
			await api.post(`/users/photo/${user.id}`, formData, config);



		} catch (err) {
			toastError(err);
		}
  }
  return (
    <div >
      <div className={classes.userinfo_photo}>
        <div className={drawerOpen ? classes.userinfo_user_photo_small : classes.userinfo_user_photo}>
          {<Avatar className={classes.userinfo_user_avatar} src={process.env.REACT_APP_BACKEND_URL + user.photo} />}
          <div className={drawerOpen ? classes.changePhoto2 : classes.changePhoto1}>
            <div>
              <input
                type="file"
                id="upload-button"
                className={classes.uploadInput}
                onChange={changeUserPhoto}
              />
              <label htmlFor="upload-button">
                Change Photo
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className={drawerOpen ? classes.hidden : classes.userinfo_name}>
        <div>{user.name}</div>
      </div>
      <div className={drawerOpen ? classes.hidden : classes.userinfo_email}>
        <div>{user.profile}</div>
      </div>
      
      <Can
        role={user.profile}
        perform="dashboard:view"
        yes={() => (
          <ListItemLink
            to="/"
            primary="Dashboard"
            className={classes.menuItemContainer}
            icon={<HomeOutlined />}
          />
        )}
      />
      <ListItemLink
        to="/connections"
        primary={i18n.t("mainDrawer.listItems.connections")}
        icon={
          <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
            <SyncAltIcon />
          </Badge>
        }
      />
      <ListItemLink
        to="/tickets"
        primary={i18n.t("mainDrawer.listItems.tickets")}
        icon={<WhatsAppIcon />}
      />


      <ListItemLink
        to="/contacts"
        primary={i18n.t("mainDrawer.listItems.contacts")}
        icon={<PeopleAltOutlinedIcon />}
      />
      <ListItemLink
        to="/quick-messages"
        primary={i18n.t("mainDrawer.listItems.quickMessages")}
        icon={<FlashOnIcon />}
      />

      <ListItemLink
        to="/schedules"
        primary={i18n.t("mainDrawer.listItems.schedules")}
        icon={<EventIcon />}
      />

      <ListItemLink
        to="/tags"
        primary={i18n.t("mainDrawer.listItems.tags")}
        icon={<LocalOfferIcon />}
      />

      <ListItemLink
        to="/chats"
        primary={i18n.t("mainDrawer.listItems.chats")}
        icon={
          <Badge color="secondary" variant="dot" invisible={invisible}>
            <ForumIcon />
          </Badge>
        }
      />

      <ListItemLink
        to="/helps"
        primary={i18n.t("mainDrawer.listItems.helps")}
        icon={<HelpOutlineIcon />}
      />

      <Can
        role={user.profile}
        perform="drawer-moderator-items:view"
        yes={() => (
          <>
            <Divider />
            <ListSubheader inset>
              {i18n.t("mainDrawer.listItems.administration")}
            </ListSubheader>
            {showCampaigns && (
              <>
                <ListItem
                  button
                  onClick={() => setOpenCampaignSubmenu((prev) => !prev)}
                >
                  <ListItemIcon>
                    <EventAvailableIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={i18n.t("mainDrawer.listItems.campaigns")}
                  />
                  {openCampaignSubmenu ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItem>
                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openCampaignSubmenu}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem
                      selected={"/campaigns" === location.pathname} 
                      onClick={() => history.push("/campaigns")} button>
                      <ListItemIcon>
                        <ListIcon />
                      </ListItemIcon>
                      <ListItemText primary="Listagem" />
                    </ListItem>
                    <ListItem
                      selected={"/contact-lists" === location.pathname} 
                      onClick={() => history.push("/contact-lists")}
                      button
                    >
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Listas de Contatos" />
                    </ListItem>
                    <ListItem
                      selected={"/campaigns-config" === location.pathname} 
                      onClick={() => history.push("/campaigns-config")}
                      button
                    >
                      <ListItemIcon>
                        <SettingsOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Configurações" />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
            
            <ListItemLink
              to="/users"
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<SupervisorAccountOutlined />}
            />
            <ListItemLink
              to="/queues"
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<AccountTreeOutlinedIcon />}
            />
            
            <Divider />
            
          </>
        )}
      />
      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider />
            <ListSubheader inset>
              {i18n.t("mainDrawer.listItems.administration")}
            </ListSubheader>
            {showCampaigns && (
              <>
                <ListItem
                  button
                  onClick={() => setOpenCampaignSubmenu((prev) => !prev)}
                >
                  <ListItemIcon>
                    <EventAvailableIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={i18n.t("mainDrawer.listItems.campaigns")}
                  />
                  {openCampaignSubmenu ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItem>
                <Collapse
                  style={{ paddingLeft: 15 }}
                  in={openCampaignSubmenu}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem
                      selected={"/campaigns" === location.pathname} 
                      onClick={() => history.push("/campaigns")} button>
                      <ListItemIcon>
                        <ListIcon />
                      </ListItemIcon>
                      <ListItemText primary="Listagem" />
                    </ListItem>
                    <ListItem
                      selected={"/contact-lists" === location.pathname} 
                      onClick={() => history.push("/contact-lists")}
                      button
                    >
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Listas de Contatos" />
                    </ListItem>
                    <ListItem
                      selected={"/campaigns-config" === location.pathname} 
                      onClick={() => history.push("/campaigns-config")}
                      button
                    >
                      <ListItemIcon>
                        <SettingsOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Configurações" />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
            {/* {user.super && (
              <ListItemLink
                to="/announcements"
                primary={i18n.t("mainDrawer.listItems.annoucements")}
                icon={<AnnouncementIcon />}
              />
            )} */}
            {/* <ListItemLink
              to="/messages-api"
              primary={i18n.t("mainDrawer.listItems.messagesAPI")}
              icon={<CodeRoundedIcon />}
            /> */}
            <ListItemLink
              to="/users"
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<SupervisorAccountOutlined />}
            />
            {user.super && (<ListItemLink
              to="/companies"
              primary={i18n.t("mainDrawer.listItems.companies")}
              icon={<VolumeUpOutlined />}
            />)}
            <ListItemLink
              to="/queues"
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<AccountTreeOutlinedIcon />}
            />
            <ListItemLink
              to="/settings"
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<SettingsOutlinedIcon />}
            />
            <Divider />
            {/* <ListSubheader inset>
              {i18n.t("mainDrawer.listItems.api")}
            </ListSubheader>

            <ListItemLink
              to="/tokens"
              primary={i18n.t("mainDrawer.listItems.tokens")}
              icon={<VpnKeyIcon />}
            />

            <ListItemLink
              to="/docs"
              primary={i18n.t("mainDrawer.listItems.docs")}
              icon={<MenuBookIcon />}
            /> */}
          </>
        )}
      />
    </div>
  );
};

export default MainListItems;
