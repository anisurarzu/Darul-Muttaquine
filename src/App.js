import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import HeroSection from "./components/Home/HeroSection/HeroSection";
import Home from "./components/Home/Home";
import Login from "./Pages/Login/Login";
import Registration from "./Pages/Login/Registration";
import About from "./Pages/About/About";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import "./App.css";
import Scholarship from "./Pages/scholarship/Scholarship";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Contact from "./Pages/Contact/Contact";
import History from "./Pages/History/History";
import AdmitCard from "./Pages/Dashboard/AdmitCard";
import ResultPage from "./Pages/Dashboard/Result/ResultPage";

const App = () => {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/registration">
          <Registration />
        </Route>
        <Route exact path="/contact">
          <Contact />
        </Route>
        <Route exact path="/result">
          <ResultPage />
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
        {/* <PrivateRoute path="/about" component={About} /> */}
        <PrivateRoute path="/admitCard/:id" component={AdmitCard} />
        <PrivateRoute path="/history" component={History} />
        <PrivateRoute path="/scholarship" component={Scholarship} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
      </Switch>
      <ToastContainer />
    </div>
  );
};

export default App;
