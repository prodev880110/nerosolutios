import React, { useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";

import SpeedIcon from "@material-ui/icons/Speed";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PersonIcon from "@material-ui/icons/Person";

import { makeStyles } from "@material-ui/core/styles";
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";

import {Timeline,
        TimelineItem,
        TimelineSeparator,
        TimelineConnector,
        TimelineContent,
        TimelineDot } from '@mui/lab';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import {timelineConnectorClasses} from '@mui/lab/TimelineConnector';
import {timelineDotClasses} from '@mui/lab/TimelineDot';
import {timelineItemClasses} from '@mui/lab/TimelineItem';
import {timelineContentClasses} from '@mui/lab/TimelineContent';
import {timelineClasses} from '@mui/lab/Timeline';

import ButtonWithSpinner from "../../components/ButtonWithSpinner";

import { BarChart, Bar, XAxis, Cell, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer } from 'recharts';

import CardCounter from "../../components/Dashboard/CardCounter";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";

import useDashboard from "../../hooks/useDashboard";

import { isEmpty } from "lodash";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: 240,
    overflowY: "auto",
    ...theme.scrollbarStyles,
  },
  cardAvatar: {
    fontSize: "55px",
    color: grey[500],
    backgroundColor: "#ffffff",
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  cardTitle: {
    fontSize: "18px",
    color: blue[700],
  },
  cardSubtitle: {
    color: grey[600],
    fontSize: "14px",
  },
  alignRight: {
    textAlign: "right",
  },
  fullWidth: {
    width: "100%",
  },
  selectContainer: {
    width: "100%",
    textAlign: "left",
  },
  chart_container:{
    height: 400,
    "border": "1px solid #999",
    "border-radius": "10px",
    display: "grid",
    "-webkit-box-shadow": "0px 2px 4px rgb(98 120 169 / 52%)",
    "box-shadow": "0px 2px 4px rgb(98 120 169 / 52%)",
  },
  chart_item:{
    height: "100%",
  },
  chart_title:{
    fontSize: 30,
    padding: "20px 20px 0px 20px",
    fontWeight: 700,
    "-webkit-text-stroke": "thin",
    "color": "#0c0c0c9e",
  },
  chart_tooltop_tooltip_container:{
    backgroundColor: "#ffffff00",
    border: "0px!important",
  },
  chart_tooltop_tooltip:{
    "color": "#000",
    "border": "2px solid #1cb14e",
    "border-radius": "4px",
    "background-color": "#ffffffe3",
  },
  chart_tooltop_label: {
    padding: "0px 10px",
    fontSize: 14,
    fontWeight: 700,
  },
  chart_tooltop_intro: {
    padding: "0px 10px",
    fontSize: 12,
  },
  chart_bar_content:{
    backgroundColor: "#ffffff00",
  },
  timeline_item:{
    height: "100%",
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [chart_data_message, setChartDataMessage] = useState([
    {
      name: 'All Msgs',
      value: 0,
    },
    {
      name: 'Checked Msgs',
      value: 0,
    },
    {
      name: 'Unchecked Msgs',
      value: 0,
    },
  ]);
  const [chart_data_schedule, setChartDataSchedule] = useState([]);
  const [chart_data_calls, setChartDataCall] = useState([
    {
      name: 'Su',
      value: 1240,
    },
    {
      name: 'Mo',
      value: 250,
    },
    {
      name: 'Tu',
      value: 648,
    },
    {
      name: 'We',
      value: 169,
    },
    {
      name: 'Th',
      value: 834,
    },
    {
      name: 'Fr',
      value: 556,
    },
    {
      name: 'Sa',
      value: 40,
    }
  ]);
  const { find } = useDashboard();

  
 

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    setLoading(true);

    let params = {};
    
    const data = await find(params);

    let _chart_data_schedule = [];
    for (let index = 0; index < data.schedules.length; index++) {
      const element = data.schedules[index];
      _chart_data_schedule.push({
        contents: element.body,
        status: element.status == "Waiting" ? "primary" : element.status == "Sending" ? "info" : element.status == "Finish" ? "success" : "error",
        time: moment(element.sendAt).format("YYYY-MM-DD H:m:s"),
      });
    }
    setChartDataSchedule(_chart_data_schedule);
    setChartDataMessage ( [
      {
        name: 'All Msgs',
        value: data.messages[0].allMessages,
      },
      {
        name: 'Checked Msgs',
        value: data.messages[0].readMessages,
      },
      {
        name: 'Unchecked Msgs',
        value: data.messages[0].unreadMessages,
      },
    ]);
    var d = new Date();
    d.setDate(d.getDate() - 7);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    setChartDataCall([
      {
        name: days[d.getDay()],
        value: data.messagesdaily[0].one,
      },
      {
        name: days[(d.getDay()+1)%7],
        value: data.messagesdaily[0].two,
      },
      {
        name: days[(d.getDay()+2)%7],
        value: data.messagesdaily[0].three,
      },
      {
        name: days[(d.getDay()+3)%7],
        value: data.messagesdaily[0].four,
      },
      {
        name: days[(d.getDay()+4)%7],
        value: data.messagesdaily[0].five,
      },
      {
        name: days[(d.getDay()+5)%7],
        value: data.messagesdaily[0].six,
      },
      {
        name: days[(d.getDay()+6)%7],
        value: data.messagesdaily[0].seven,
      }
    ]);
    setLoading(false);
  }

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

  const getIntroOfPage = (label) => {
    if (label === 'All Msgs') {
      return "Page A is about men's clothing";
    }
    if (label === 'Checked Msgs') {
      return "Page B is about women's dress";
    }
    if (label === 'Uncheckec Msgs') {
      return "Page C is about women's bag";
    }
    if (label === 'Sun') {
      return 'Page D is about household goods';
    }
    if (label === 'Mon') {
      return 'Page E is about food';
    }
    if (label === 'Tus') {
      return 'Page F is about baby food';
    }
    if (label === 'Wed') {
      return 'Page F is about baby food';
    }
    if (label === 'Thu') {
      return 'Page F is about baby food';
    }
    if (label === 'Fri') {
      return 'Page F is about baby food';
    }
    if (label === 'Sat') {
      return 'Page F is about baby food';
    }
    return '';
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={classes.chart_tooltop_tooltip}>
          <p className={classes.chart_tooltop_label}>{`${label} : ${payload[0].value}`}</p>
          <p className={classes.chart_tooltop_intro}>{getIntroOfPage(label)}</p>
        </div>
      );
    }
  
    return null;
  };
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
  const callColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
  const getCallsColor = (value) => {
    if(value < 50) return 0;
    else if(value < 150) return 1;
    else if(value < 350) return 2;
    else if(value < 650) return 3;
    else if(value < 100) return 4;
    else return 5;
  }
  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} justifyContent="flex-end">
          <Grid item xs={12}>
            {/* <Paper className={classes.fixedHeightPaper}> */}
              {/* <Chart /> */}
              <Grid spacing={2} container>
              <Grid xs={4} sm={4} item>
                <Grid xs={12} item className={classes.chart_container}>
                  <Grid xs={12} item>
                    <div className={classes.chart_title}>Schedules</div>
                  
                  <Timeline 
                      sx={{
                        [`& .${timelineClasses.root}`]: {
                          padding: "5px 0px",
                        },
                        [`& .${timelineOppositeContentClasses.root}`]: {
                          flex: 0.2,
                          padding: "0 10px",
                          textAlign: "left",
                        },
                        [`& .${timelineContentClasses.root}`]: {
                          padding: "0 5px",
                          textAlign: "right",
                        },
                        [`& .${timelineConnectorClasses.root}`]: {
                          margin: "0px 0px 0px 10px",
                        },
                        [`& .${timelineDotClasses.root}`]: {
                          padding: "1px",
                          margin: "5px 0px 5px 10px",
                        },
                        [`& .${timelineItemClasses.root}`]: {
                          minHeight: "30px",
                        },
                      }}>
                    {chart_data_schedule ? chart_data_schedule.map((entry, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator fontSize={12}>
                          <TimelineDot color={entry.status} />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineOppositeContent fontSize={12} color="textSecondary">
                          {entry.contents}
                        </TimelineOppositeContent>
                        <TimelineContent fontSize={12}>{entry.time}</TimelineContent>
                      </TimelineItem>
                    )) : ""}
                  </Timeline>
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={4} sm={4} item>
                <Grid xs={12} item className={classes.chart_container}>
                  <Grid item xs={12}>
                    <div className={classes.chart_title}>Messages</div>
                  </Grid>
                  <ResponsiveContainer width="100%" height="100%" item className={classes.chart_item}>
                    <BarChart
                      width={500}
                      height={300}
                      data={chart_data_message}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 30,
                        bottom: 5,
                      }}
                      barSize={100}
                    >
                      
                      <XAxis dataKey="name"/>
                      <Tooltip className={classes.chart_tooltop_tooltip_container} content={<CustomTooltip />} />
                      {/* <Legend /> */}
                      {/* <Bar dataKey="pv" fill="#8884d8" background={{ fill: '#eeeeee00' }} /> */}
                      <Bar dataKey="value" fill="#8884d8"  className={classes.chart_bar_content} label={{ position: 'top' }}>
                        {chart_data_message ? chart_data_message.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                        )) : ""}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
              <Grid xs={4} sm={4} item>
                <Grid xs={12} item className={classes.chart_container}>
                  <Grid xs={12} item>
                    <div className={classes.chart_title}>Calls per day</div>
                  </Grid>
                  <ResponsiveContainer width="100%" height="100%" item className={classes.chart_item}>
                    <BarChart
                      width={500}
                      height={300}
                      data={chart_data_calls}
                      margin={{
                        top: 20,
                        right: 50,
                        left: 50,
                        bottom: 5,
                      }}
                      barSize={50}
                    >
                      
                      <XAxis dataKey="name" />
                      <Tooltip className={classes.chart_tooltop_tooltip_container} content={<CustomTooltip />} />
                      {/* <Legend /> */}
                      {/* <Bar dataKey="pv" fill="#8884d8" className={classes.chart_bar_content} background={{ fill: '#eeeeee00' }} /> */}
                      <Bar dataKey="value" fill="#8884d8"  className={classes.chart_bar_content} label={{ position: 'top' }}>
                        {chart_data_calls ? chart_data_calls.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[getCallsColor(entry.value)]}></Cell>
                          
                        )) : ""}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
              </Grid>
            {/* </Paper> */}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
