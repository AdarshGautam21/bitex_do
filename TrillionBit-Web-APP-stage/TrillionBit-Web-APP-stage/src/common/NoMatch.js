import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link, Route } from "react-router-dom";

import { Container, Grid } from "@mui/material";
import { Typography, Toolbar } from "@mui/material";

import whiteLogo from "../assets/img/white-logo.webp";

function Status({ code, children }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) staticContext.status = code;
        return children;
      }}
    />
  );
}

function NoMatch() {
  return (
    <Status code={404}>
      <React.Fragment>
        <Toolbar className="homeLighttoolbar">
          <Link className="logoBox" to="/">
            <img src={whiteLogo} alt="Bitex UAE" />
          </Link>
        </Toolbar>
        <div>
          <div className="slider" style={{ height: "100vh" }}>
            <Container>
              <Grid container>
                <Grid item md={3}></Grid>
                <Grid item xs={12} sm={6} md={6} className="oneCenterBox">
                  <div className="pageNotFound">
                    <Typography variant="h1" className="">
                      PAGE NOT FOUND
                    </Typography>

                    <Typography variant="body1" className="subtext">
                      Sorry we couldn't find what you are looking for.
                    </Typography>

                    <Link to="/" className="orange">
                      Back to TrillionBit UAE
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>
        </div>
      </React.Fragment>
    </Status>
  );
}

// class NoMatch extends Component {
//     render() {
//         return <Route
//             render={({ staticContext }) => {
//                 if (staticContext) staticContext.status = 404;
//                 return <React.Fragment>
//                 <Toolbar className="homeLighttoolbar">
//                     <Link className="logoBox" to="/">
//                         <img src={whiteLogo} alt="Bitex UAE" />
//                     </Link>
//                 </Toolbar>
//                 <div>
//                     <div className="slider" style={{height: '100vh'}}>
//                         <Container >
//                             <Grid container>
//                                 <Grid item md={3}></Grid>
//                                 <Grid item xs={12} sm={6} md={6} className="oneCenterBox">
//                                     <div className="pageNotFound">
//                                         <Typography variant="h1" className="">
//                                             PAGE NOT FOUND
//                                         </Typography>

//                                         <Typography variant="body1" className="subtext">
//                                             Sorry we couldn't find what you are looking for.
//                                         </Typography>

//                                         <Link to="/" className="orange">
//                                             Back to TrillionBit UAE
//                                         </Link>
//                                     </div>
//                                 </Grid>
//                             </Grid>
//                         </Container>
//                     </div>
//                 </div>
//               </React.Fragment>;
//             }}
//         />
//     }
// }

NoMatch.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProp, {})(NoMatch);
