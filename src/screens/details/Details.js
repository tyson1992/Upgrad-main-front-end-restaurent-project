import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free-solid';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-free-regular';
import Card from '@material-ui/core/Card';
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import { withStyles, CardContent } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';



import "./Details.css"


const appStyles = (theme => ({

    shoppingCart: { 
        color: 'black',
        'background-color': 'white',
        width: '60px',
        height: '50px',
        'margin-left': '-20px',
    },
  
    cartItemButton: { 
        padding: '10px',
        'border-radius': '0',
        color: '#fdd835',
        '&:hover': {
            'background-color': '#ffee58',
        }
    },
    cardContent: { 
        'padding-top': '0px',
        'margin-left': '10px',
        'margin-right': '10px'
    },
    textRatingCost: {
        'text-overflow': 'clip',
        'width': '145px',
        'color': 'grey'
    },
     restaurantName: { 
        'padding': '8px 0px 8px 0px',
        'font-size': '30px',
    },
    restaurantCategory: { 
        'padding': '8px 0px 8px 0px'
    }, 
    avgCost: { 
        'padding-left': '5px'
    },
    itemPrice: {
        'padding-left': '5px'
    },
    addButton: {
        'margin-left': '25px',
    },
    menuItemName: { 
        'margin-left': '20px',
    },  
    cartHeader: { 
        'padding-bottom': '0px',
        'margin-left': '10px',
        'margin-right': '10px'
    },
    totalAmount: {
        'font-weight': 'bold'
    },
    checkOutButton: { 
        'font-weight': '400'
    }




}))



class Details extends Component {
    constructor() {
        super()
        this.state = {
            restaurantDetails: [],
            transition: Fade, 
             categories: [],
            cartItems: [],
            snackBarMessage: "",
            badgeVisible:false,
            totalAmount:0,
            snackBarOpen: false,
        }
    }
 
    componentDidMount() {
        let data = null;
        let that = this;
        let xhrRestaurantDetails = new XMLHttpRequest()


        xhrRestaurantDetails.addEventListener("readystatechange", function () {
            if (xhrRestaurantDetails.readyState === 4 && xhrRestaurantDetails.status === 200) {
                let response = JSON.parse(xhrRestaurantDetails.responseText);
                let categoriesName = [];
               
                response.categories.forEach(category => {
                    categoriesName.push(category.category_name);
                });
          
                let restaurantDetails = {
                    id: response.id,
                    name: response.restaurant_name,
                    photoURL: response.photo_URL,
                    avgCost: response.average_price,
                    rating: response.customer_rating,
                    noOfCustomerRated: response.number_customers_rated,
                    locality: response.address.locality,
                    categoriesName: categoriesName.toString(),
                }
                let categories = response.categories;
                that.setState({
                    ...that.state,
                    restaurantDetails: restaurantDetails,
                    categories: categories,

                })
            }

        })

        
        xhrRestaurantDetails.open('GET', this.props.baseUrl + 'restaurant/' + this.props.match.params.id)
        xhrRestaurantDetails.send(data);

    }


    exitSnackBarHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            ...this.state,
            snackBarMessage: "",
            snackBarOpen: false,
        })
    }

   
    addFoodEventHandler = (item) => {
        let cartItems = this.state.cartItems;
        let itemPresentInCart = false;
        cartItems.forEach(cartItem => { 
            if (cartItem.id === item.id) { 
                itemPresentInCart = true;
                cartItem.quantity++;
                cartItem.totalAmount = cartItem.price * cartItem.quantity; 
            }
        })
        if (!itemPresentInCart) { 
            let cartItem = {
                id:item.id,
                name: item.item_name,
                price: item.price,
                totalAmount:item.price,
                quantity: 1,
                itemType: item.item_type,
            }
            cartItems.push(cartItem);
        }
      
        let totalAmount = 0;
        cartItems.forEach(cartItem =>{
            totalAmount = totalAmount + cartItem.totalAmount; 
        })

       
        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: "Item added to cart!",
            totalAmount:totalAmount,
        
        })
    }

   
    minusClickEventHandler =  (item) => {
        let cartItems = this.state.cartItems;
        let index =  cartItems.indexOf(item);
        let itemRemoved = false;
        cartItems[index].quantity--;
        if(cartItems[index].quantity === 0){ 
            cartItems.splice(index,1);
            itemRemoved = true;
        }else{
            cartItems[index].totalAmount = cartItems[index].price * cartItems[index].quantity;
        }

       
        let totalAmount = 0;
        cartItems.forEach(cartItem =>{
            totalAmount = totalAmount + cartItem.totalAmount;
        })

      
        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: itemRemoved ? "Item removed from cart!" :"Item quantity decreased by 1!",
            totalAmount:totalAmount,

        })
    }

   
    
    addinCartEventHandler = (item) => {
        let cartItems = this.state.cartItems;
        let index =  cartItems.indexOf(item);
        cartItems[index].quantity++; 
        cartItems[index].totalAmount = cartItems[index].price * cartItems[index].quantity;
        
     
        let totalAmount = 0;
        cartItems.forEach(cartItem =>{
            totalAmount = totalAmount + cartItem.totalAmount;
        })

       
        this.setState({
            ...this.state,
            cartItems: cartItems,
            snackBarOpen: true,
            snackBarMessage: "Item quantity increased by 1!",
            totalAmount:totalAmount,

        })
    } 

   
    checkoutEventHandler= () => {
        let cartItems =  this.state.cartItems;
        let isLoggedIn = sessionStorage.getItem("access-token") == null ? false : true;
        if(!isLoggedIn){ 
            this.setState({
                ...this.state,
                snackBarOpen: true,
                snackBarMessage: "Please login first!",
            })
        }else if(cartItems.length === 0){ 
            this.setState({
            ...this.state,
            snackBarOpen: true,
            snackBarMessage: "Please add an item to your cart!",
            })
        } else{ 
            this.props.history.push({
                pathname: '/checkout',
                cartItems: this.state.cartItems,
                restaurantDetails: this.state.restaurantDetails,
            })
        }
    }


 
    changeBadgeVisibility = () => {
        this.setState({
            ...this.state,
            badgeVisible:!this.state.badgeVisible,
        })
    }

render() {
   
    const { classes } = this.props;
    return (

        <div>
            
            <Header baseUrl={this.props.baseUrl} showHeaderSearchBox={false} changeBadgeVisibility = {this.changeBadgeVisibility}></Header>
         
            <div className="panel-restaurant-details">
                <div>
                    <img src={this.state.restaurantDetails.photoURL} alt="Restaurant" height="215px" width="275px" />
                </div>
                <div className="restaurant-details">
                    <div className="restaurant-name">
                        <Typography variant="h5" component="h5" className={classes.restaurantName}>{this.state.restaurantDetails.name}</Typography>
                        <Typography variant="subtitle1" component="p" className={classes.restaurantLocation}>{this.state.restaurantDetails.locality}</Typography>
                        <Typography variant="subtitle1" component="p" className={classes.restaurantCategory}>{this.state.restaurantDetails.categoriesName}</Typography>
                    </div>
                    <div className="restaurant-rating-cost-container">
                        <div className="restaurant-rating-container">
                            <div className="restaurant-rating">
                                <FontAwesomeIcon icon="star" size="sm" color="black" />
                                <Typography variant="subtitle1" component="p">{this.state.restaurantDetails.rating}</Typography>
                            </div>
                            <Typography variant="caption" component="p" className={classes.textRatingCost}  >AVERAGE RATING BY {<span className="restaurant-NoOfCustomerRated">{this.state.restaurantDetails.noOfCustomerRated}</span>} CUSTOMERS</Typography>
                        </div>
                        <div className="restaurant-avg-cost-container">
                            <div className="restaurant-avg-cost">
                                <i className="fa fa-inr" aria-hidden="true"></i>
                                <Typography variant="subtitle1" component="p" className={classes.avgCost}>{this.state.restaurantDetails.avgCost}</Typography>
                            </div>
                            <Typography variant="caption" component="p" className={classes.textRatingCost} >AVERAGE COST FOR TWO PEOPLE</Typography>
                        </div>
                    </div>
                </div>
            </div>
         
            <div className="panel-menu-details-cart">

                <div className="menu-details">
                    {this.state.categories.map(category => ( 
                        <div key={category.id}>
                            <Typography variant="overline" component="p" className={classes.categoryName} >{category.category_name}</Typography>
                            <Divider />
                            {category.item_list.map(item => (
                                <div className='menu-item-container' key={item.id}>
                                    <FontAwesomeIcon icon="circle" size="sm" color={item.item_type === "NON_VEG" ? "#BE4A47" : "#5A9A5B"} />
                                    <Typography variant="subtitle1" component="p" className={classes.menuItemName} >{item.item_name[0].toUpperCase() + item.item_name.slice(1)}</Typography>
                                    <div className="item-price">
                                        <i className="fa fa-inr" aria-hidden="true"></i>
                                        <Typography variant="subtitle1" component="p" className={classes.itemPrice} >{item.price.toFixed(2)}</Typography>
                                    </div>
                                    <IconButton className={classes.addButton} aria-label="add" onClick={() => this.addFoodEventHandler(item)}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
              
                <div className="my-cart">
                    <Card className={classes.myCart}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="shopping-cart" className={classes.shoppingCart}>
                                    <Badge badgeContent={this.state.cartItems.length} color="primary" showZero = {true} invisible={this.state.badgeVisible} className={classes.badge}>
                                        <ShoppingCartIcon />
                                    </Badge>
                                </Avatar>
                            }
                            title="My Cart"
                            titleTypographyProps={{
                                variant: 'h6'
                            }}
                            className={classes.cartHeader}
                        />
                        <CardContent className={classes.cardContent}>
                            {this.state.cartItems.map(cartItem => ( 
                            <div className="cart-menu-item-container" key={cartItem.id}>
                                <i className="fa fa-stop-circle-o" aria-hidden="true" style={{color:cartItem.itemType === "NON_VEG" ? "#BE4A47" : "#5A9A5B"}}></i>
                                <Typography variant="subtitle1" component="p" className={classes.menuItemName} id="cart-menu-item-name" >{cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}</Typography>
                                <div className="quantity-container">
                                <IconButton className={classes.cartItemButton} id="minus-button" aria-label="remove" onClick = {() => this.minusClickEventHandler(cartItem)} >
                                    <FontAwesomeIcon icon="minus" size="xs" color="black" />
                                </IconButton>
                                <Typography variant="subtitle1" component="p" className={classes.itemQuantity}>{cartItem.quantity}</Typography>
                                <IconButton className={classes.cartItemButton} aria-label="add"  onClick = {() => this.addinCartEventHandler(cartItem)}>
                                    <FontAwesomeIcon icon="plus" size="xs" color="black" />
                                </IconButton>
                                </div>
                                <div className="item-price">
                                    <i className="fa fa-inr" aria-hidden="true" style={{ color: 'grey' }}></i>
                                    <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="cart-item-price">{cartItem.totalAmount.toFixed(2)}</Typography>
                                </div>
                            </div>
                            ))}
                            <div className="total-amount-container">
                                <Typography variant="subtitle2" component="p" className={classes.totalAmount}>TOTAL AMOUNT</Typography>
                                <div className="total-price">
                                    <i className="fa fa-inr" aria-hidden="true" ></i>
                                    <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="cart-total-price">{this.state.totalAmount.toFixed(2)}</Typography>
                                </div>
                            </div>

                            <Button variant="contained" color='primary' fullWidth={true} className={classes.checkOutButton} onClick = {this.checkoutEventHandler}>CHECKOUT</Button>

                        </CardContent>

                    </Card>
                </div>
            </div>
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackBarOpen}
                    autoHideDuration={4000}
                    onClose={this.exitSnackBarHandler}
                    TransitionComponent={this.state.transition}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.snackBarMessage}</span>}
                    action={
                        <IconButton color='inherit' onClick={this.exitSnackBarHandler}>
                            <CloseIcon/>
                        </IconButton>
                    }
                />
            </div>
        </div>
    )
}
}

export default withStyles(appStyles)(Details);