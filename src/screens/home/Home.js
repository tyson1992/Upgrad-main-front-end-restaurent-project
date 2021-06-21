import React, { Component } from 'react';
import Header from '../../common/header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free-solid';
import '@fortawesome/fontawesome-svg-core';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


import './Home.css';

const appStyles = (theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },

    
    gridCard: { 
        '@media (min-width: 1200px)': { 

            'flex-grow': '0',
            'max-width': '25%',
            'flex-basis': '25%',
        },

        '@media (min-width: 960px) and (max-width:1200px)': { 
            'flex-grow': '0',
            'max-width': '33%',
            'flex-basis': '33%',
        },
    },
    grid: {  
        "padding": "20px",
        "margin-left": "0.5%",
        "margin-right": "0.5%",
        transform: 'translateZ(0)',
        cursor: 'pointer',
    },

    card: {
        height: "500px",
        '@media (min-width: 1300px)': { 
            height: "500px",
        },
        '@media (min-width: 960px) and (max-width:1300px)': {  
            height: "375px",
        }
    },

    media: { 
        height: "40%",
        width: "100%",
    },
    
    categories: {
        "font-size": "16px",
        '@media (min-width: 1300px)': {
            "font-size": "22px",
        },
        '@media (min-width: 960px) and (max-width:1300px)': {
            "font-size": "20px",
        },
        '@media (max-width: 960px)': {
            "font-size": "22px",
        }
    },
    title: {
        "font-size": "25px",
        '@media (min-width: 1300px)': {
            "font-size": "40px",
        },
        '@media (min-width: 960px) and (max-width:1300px)': {
            "font-size": "30px",
        },
        '@media (max-width: 960px)': {
            "font-size": "40px",
        }
    },


    cardContent: { 
        "padding": "10px",
        "height": "20%",
        "display": "flex",
        "align-items": "center",
        "margin-left": "20px",
        "margin-right": "20px",
    },
    cardActionArea: { 
        "flex-direction": "column",
        "align-items": "normal",
        "justify-content": "space-between",
        "display": "flex",
        "height": "100%",

    }

}))

class Home extends Component {
    constructor() {
        super()
        this.state = {
            restaurant: [],
            isSearchOn: false,
        }
    }

   
    componentDidMount() {
        let data = null;
        let xhrRestaurant = new XMLHttpRequest();
        let that = this;
        xhrRestaurant.addEventListener("readystatechange", function () {
            if (xhrRestaurant.readyState === 4 && xhrRestaurant.status === 200) {
                let restaurant = JSON.parse(xhrRestaurant.responseText)
                that.setState({
                    restaurant: restaurant.restaurants
                });
            }
        })
        xhrRestaurant.open("GET", this.props.baseUrl + "restaurant") // Getting all data from the restaurant endpoint.
        xhrRestaurant.send(data)
    }


   searchRestaurantEventHandle = (searchRestaurant, searchOn) => {
        let allRestaurantData = [];
        if (searchOn) {
            if (!this.state.isSearchOn) {
                allRestaurantData = this.state.restaurant;
                this.setState({
                    restaurant: searchRestaurant,
                    allRestaurantData: allRestaurantData,
                    isSearchOn: true,
                })
            } else {
                this.setState({
                    ...this.state,
                    restaurant: searchRestaurant,
                })
            }
        } else {
            allRestaurantData = this.state.allRestaurantData;
            this.setState({
                restaurant: allRestaurantData,
                isSearchOn: false,
            });
        }
    }


    getRestaurantDetailsHandler = (restaurantId) => {
        this.props.history.push('/restaurant/' + restaurantId);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
               
                <Header baseUrl={this.props.baseUrl} showHeaderSearchBox={true} searchRestaurantEventHandle={this.searchRestaurantEventHandle}></Header>
                <div className="flex-container">
                    <Grid container spacing={3} wrap="wrap" alignContent="center" className={classes.grid}>
                      {this.state.restaurant !== null ? this.state.restaurant.map(restaurant => (
                        
                            <Grid key={restaurant.id} item xs={12} sm={6} md={3} className={classes.gridCard}>
                                <Card className={classes.card}>
                                    <CardActionArea className={classes.cardActionArea} onClick={() => this.getRestaurantDetailsHandler(restaurant.id)}>
                                        <CardMedia
                                            className={classes.media}
                                            image={restaurant.photo_URL}
                                            title={restaurant.restaurant_name}
                                        />
                                        <CardContent className={classes.cardContent}>
                                            <Typography className={classes.title} variant="h5" component="h2">
                                                {restaurant.restaurant_name}
                                            </Typography>
                                        </CardContent>
                                        <CardContent className={classes.cardContent}>
                                            <Typography variant="subtitle1" component="p" className={classes.categories}>
                                                {restaurant.categories}
                                            </Typography>
                                        </CardContent>
                                        <CardContent className={classes.cardContent}>
                                            <div className="below-cardinformation">
                                                <span className="restaurant-rating-detail">
                                                    <span>
                                                        <FontAwesomeIcon icon="star" size="lg" color="white" />
                                                    </span>
                                                    <Typography variant="caption" component="p" >{restaurant.customer_rating}</Typography>
                                                    <Typography variant="caption" component="p" >({restaurant.number_customers_rated})</Typography>
                                                </span>
                                                <span className="restaurant-panel">
                                                    <Typography variant="caption" component="p" style={{fontSize: '14px'}}>
                                                        <i className="fa fa-inr" aria-hidden="true"></i>
                                                        {restaurant.average_price}
                                                    </Typography>
                                                    <Typography variant="caption" component="p" style={{fontSize: '14px'}}>for two</Typography>
                                                </span>
                                            </div>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))
                    :<Typography variant='body1' component='p'>
                        No restaurant with given name.
                    </Typography>
                    }
                    </Grid>
                </div>
            </div>
        )
    }
}

export default withStyles(appStyles)(Home);