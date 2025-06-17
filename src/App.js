import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import Login from "./Pages/Login/Login";
import Registration from "./Pages/Login/Registration";
import About from "./Pages/About/About";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Scholarship from "./Pages/scholarship/Scholarship";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Contact from "./Pages/Contact/Contact";
import History from "./Pages/History/History";
import AdmitCard from "./Pages/Dashboard/AdmitCard";
import ResultPage from "./Pages/Dashboard/Result/ResultPage";
import Fotter from "./components/Fotter";
import Product from "./Pages/Product/Product";

import "./App.css";
import MainLoader from "./components/Loader/MainLoader";
import Quize from "./Pages/Quize/Quize";
import QuizeMainPage from "./Pages/Quize/QuizeMainPage";
import Chat from "./Pages/Chat/Chat";
import PublicScholarship from "./Pages/scholarship/PublicScholarship";
import CheckoutPage from "./Pages/Product/CheckoutPage";
import CoursePage from "./Pages/Course/CoursePage";
import CourseDetailsPage from "./Pages/Course/CourseDetailsPage";
import ApplicationForm from "./Pages/scholarship/ApplicationForm";
import PublicQuiz from "./Pages/Quize/PublicQuize";
import ScholarshipPayment from "./Pages/Dashboard/ScholarshipPayment";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate a loading time of 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  if (loading) {
    return <MainLoader />;
  }

  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/quizeMain" component={QuizeMainPage} />
        <Route exact path="/publicQuize" component={PublicQuiz} />
        <Route exact path="/product" component={Product} />
        <Route exact path="/checkout" component={CheckoutPage} />
        <Route exact path="/registration" component={Registration} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/result" component={ResultPage} />
        <Route exact path="/history" component={History} />
        <Route exact path="/course" component={CoursePage} />
        <Route exact path="/course/:id" component={CourseDetailsPage} />
        <Route exact path="/about" component={About} />
        <Route exact path="/scholarship-public" component={PublicScholarship} />
        <Route
          exact
          path="/scholarship-payment"
          component={ScholarshipPayment}
        />
        <PrivateRoute path="/admitCard/:id" component={AdmitCard} />
        <PrivateRoute path="/scholarship" component={Scholarship} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/quize" component={Quize} />
        <PrivateRoute path="/chat" component={Chat} />
        <PrivateRoute path="/courses" component={CoursePage} />
        <PrivateRoute path="/applicationForm" component={ApplicationForm} />
      </Switch>
      <Fotter />
      <ToastContainer />
    </div>
  );
};

export default App;
