import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Generator from "./components/Generator";
import Resolver from "./components/Resolver";
import "./App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Url Shortening Service
          </Typography>
        </Toolbar>
      </AppBar>
      <React.Fragment>
        <CssBaseline />
        <Container
          maxWidth="sm"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Router>
            <Switch>
              <Route path="/:slug">
                <Resolver />
              </Route>
              <Route path="/">
                <Generator></Generator>
              </Route>
            </Switch>
          </Router>
        </Container>
      </React.Fragment>
    </div>
  );
}

export default App;
