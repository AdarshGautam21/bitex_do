import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    Link
  } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { withStyles } from '@mui/styles';

import {
    Typography,
} from '@mui/material';

import slideImg from '../../assets/img/home/slider-1.webp';
import buySellImg from '../../assets/img/buy-sell.webp';
import indicatorImg from '../../assets/img/indicator.webp';

import themeStyles from '../../assets/themeStyles'; 
import '../../assets/css/home.css';

class developer extends Component {
    componentDidMount() {
        // window.fcWidget.destroy();
        window.scrollTo(0, 0);
    }
    render() {
    
        return <React.Fragment>
        
        <div className={this.props.auth.expandNavBar ? "overlay" : "overlay hide"}></div>
        <div className="paddingTopbody"> </div>
        
        <div className="slider">
            <Container>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6} lg={5} className="oneCenterBox">
                        <div className="slideText">
                            <Typography variant="h1" className="">
                                <span>  Use our  <br/> </span>  Wallet  <span> and  </span> Exchange API  <span>  to build your own apps </span>
                             </Typography>

                            <Link to="/register" className="orange">
                                Sign Up Today
                            </Link>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={7}>
                        <div className="slideImg">
                            <img src={slideImg} alt="slider" />
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>



        
        
        <div className="chartSection">
            <Container>         

            <Grid container className="adjustpadding">
                <Grid item xs={12} md={1}>
                </Grid>

                <Grid item xs={12} md={10}>

                    <Grid container>
                        <Grid item xs={12} md={12}>
                            <div className="wrapTitle text-center">
                                <Typography variant="h2">
                                    Built for    <strong> developers </strong>
                                </Typography>

                                <Typography variant="body2" component="span" className="text">
                                    We have variety of features that make it an ideal place to buy and sell digital assets.
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>

                    <Grid container className="adjustpadding">
                        <Grid item xs={12} sm={6} md={6}>
                            <div className="subSections">
                                <Typography variant="h3">
                                    <strong> Libraries </strong>    
                                </Typography>                            

                                <Typography variant="h6">
                                Easy to integrate libraries with multi-platform support.
                                </Typography>                            
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                            <div className="WrapImg">
                                <img src={buySellImg} alt="Blockchain" />
                            </div>
                        </Grid>
                    </Grid>


                    <Grid container className=" flexRevers">
                        <Grid item xs={12} sm={6} md={6}>
                            <div className="WrapImg">
                                <img src={indicatorImg} alt="Bitcoin" />
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6}>
                            <div className="subSections">
                                <Typography variant="h3">
                                    <strong> Documentation  </strong> 
                                </Typography>

                                <Typography variant="h6">
                                Simple documentation to ease the development process.
                                </Typography>                           

                            </div>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item xs={12} md={1}>
                </Grid>
            </Grid>    


                
            </Container>
        </div>


        <div className="quicklySection">
            <Container>
                <Grid container  >
                    <Grid item xs={12} sm={6} md={6}>
                        <div className="service">
                            <Typography variant="h5"> PHP </Typography>      
                            <Typography variant="h5"> NODE JS </Typography>
                            <Typography variant="h5"> PYTHON </Typography>   
                            <Typography variant="h5"> JAVA </Typography>
                        </div>
                    </Grid>

                    

                    <Grid item xs={12} sm={6} md={6}>
                        <div className="investorText">
                            <Typography variant="h2">
                        
                                Powerful service
                                for powerful applications

                            </Typography>

                            <Typography variant="h6" className="text">
                            We relentlessly focus on providing the best experience possible for developers.
We do all the heavy-lifting in the background, so you can get started with just a few lines of code.    
                            </Typography>

                            

                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
        
        
           
        </React.Fragment>;
    }
}

developer.propTypes = {
    auth: PropTypes.object.isRequired,
}
  
const mapStateToProp = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProp, {

    }
)(withStyles(themeStyles)(developer));
