({
    handleClick : function(component,event){
       
        var cartValue1 = component.get("v.inputCartValue");
        //alert("Cart Value" + cartValue1);
        var currentExistingCart = component.get("v.existingCart");
        //alert("Value" + currentExistingCart);
        var cartResult = parseInt(cartValue1) + parseInt(currentExistingCart);
        
        component.set("v.existingCart",cartResult);
        
        var pname = event.currentTarget.dataset.name;
        var pImage = event.currentTarget.dataset.img;
        var pPrice = event.currentTarget.dataset.price;
        var pQty = event.currentTarget.dataset.qty;
        //alert("Values :" +  pname +  pImage + pPrice + pQty);
        component.set("v.selectedProducts.Name",pname);
        component.set("v.selectedProducts.Image",pImage);
        component.set("v.selectedProducts.Price",pPrice);
        component.set("v.selectedProducts.Qty",pPrice);
        
        var productMenu = component.set("v.productList");
        var itemIndex = event.getSource().get("v.value");
        console.log("Menu index -" + productMenu[itemIndex]);
        productMenu[itemIndex].Qty = productMenu[itemIndex].quantity+1;
        component.set("v.selectedProductList",productMenu);
        
        
        
    },	
    searchProduct : function(component,event){
        var action = component.get("c.searchProductDetail");
        action.setParams({ keyWord : component.find("enter-search").get("v.value") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //alert("Working");
                component.set("v.products",response.getReturnValue());
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        $A.enqueueAction(action);
    },
    
    showSummaryCard : function(component,event,cartResult){
        //alert("Product Value" + JSON.stringify(component.get("v.selectedProducts")));
        //alert("Cart Value :"+ JSON.stringify(cartResult));
        component.set("v.productCard",false);
        component.set("v.summaryCard",true);
    },
    backToProducts : function(component,event){
        component.set("v.productCard",true);
        component.set("v.summaryCard",false);
    },
    goToNextScreen : function(component,event,helper){
        helper.closeModal(component, event);
        component.set("v.productCard",false);
        component.set("v.summaryCard",true);
        component.set("v.checkOutScreen1",false);
        component.set("v.checkOutScreen2",true);
        component.set("v.checkOutScreen3",false);
        component.set("v.showEditBA",false);
        component.set("v.showEditSA",false);
        helper.getContactDetails(component,event);
    },
    goToNextScreen2 : function(component,event){
        component.set("v.productCard",false);
        component.set("v.summaryCard",true);
        component.set("v.checkOutScreen1",false);
        component.set("v.checkOutScreen2",false);
        component.set("v.checkOutScreen3",true);
        component.set("v.showEditBA",false);
        component.set("v.showEditSA",false);
        
    },
    goToFinishScreen : function(component,event){
        //alert("Hello");
        component.set("v.productCard",false);
        component.set("v.summaryCard",false);
        component.set("v.checkOutScreen1",false);
        component.set("v.checkOutScreen2",false);
        component.set("v.checkOutScreen3",false);
        component.set("v.checkOutScreen3",false);
        component.set("v.showEditBA",false);
        component.set("v.showEditSA",false);
        component.set("v.finishCard",true);
        
        
    },
    StateChange  : function(component, event, helper) {  
        
        var cartValue = event.getSource().get("v.value");
        
        component.set("v.inputCartValue",cartValue);
    },
    moveToEditScreen : function(component,event,helper){
        component.set("v.productCard",false);
        component.set("v.summaryCard",false);
        component.set("v.checkOutScreen1",false);
        component.set("v.checkOutScreen2",false);
        component.set("v.checkOutScreen3",false);
        component.set("v.checkOutScreen3",false);
        component.set("v.finishCard",false);
        component.set("v.showEditBA",true);
    },
    moveToSAEditScreen : function(component,event,helper){
        component.set("v.productCard",false);
        component.set("v.summaryCard",false);
        component.set("v.checkOutScreen1",false);
        component.set("v.checkOutScreen2",false);
        component.set("v.checkOutScreen3",false);
        component.set("v.checkOutScreen3",false);
        component.set("v.finishCard",false);
        component.set("v.showEditBA",false);
        component.set("v.showEditSA",true);
    },
    doInit : function(component, event, helper) {
        helper.getYears(component);
        helper.getUserInfo(component);
        helper.getCart(component);
        helper.getProducts(component);
    },
    addedToCart : function(component, event, helper) {
        var productAdded = event.getParam("product");
        productAdded = JSON.parse(productAdded);
        console.log('productAdded',productAdded);
        var products = component.get('v.products');
        // console.log('products',products)
        var product;
        
        for (var i = 0; i < products.length; i++) {
            
            if (products[i].Product2Id == productAdded.productId) {
                
                product = products[i];
            }
        }
        
        //console.log('product', product);
        var cart = component.get('v.cart');
        var orderItemCarts = component.get('v.orderItemCart');
        var existingItemIndex;
        var result = cart.filter(function (item, index) {
            existingItemIndex = index;
            
            return item.productId === product.Product2Id;
        })
        
        var cartItem;
        var orderItem;
        if ( result.length > 0 ) {
            cartItem = result[0];
            cartItem.quantity = productAdded.quantity;
            cartItem.total = cartItem.price * cartItem.quantity;
            cart = cart.filter(function( item ) {
                return item.Id !== cartItem.Id;
            });
            
        } else {
            cartItem = {
                productId : product.Product2.Id,
                name : product.Product2.Name,
                price : product.UnitPrice,
                quantity : productAdded.quantity,
                total : productAdded.quantity * product.UnitPrice,
                image : product.Product2.Product_Catalog_Image__c,
                product : product.Product2
            }
            orderItem ={
                product2Id : product.Product2.Id,
                Quantity : productAdded.quantity
            }
        }
        
        cart.push(cartItem);
        orderItemCarts.push(orderItem);
    
        component.set('v.cart', cart);
         component.set('v.orderItemCart', orderItemCarts);
    },
    sumCart : function(component, event, helper) {
        // console.log('sumCart');
        var cart = component.get('v.cart');
        var totalPrice = 0;
        var totalQuantity = 0;
        for (var i = 0; i < cart.length; i++) {
            totalPrice += cart[i].total;
            totalQuantity += cart[i].quantity;
            //Create or Update Cart Item except for items saved on cart from previous session
            
            if (cart[i].Id == null) {
                helper.updateCart(component, event, cart[i]);
                
                
            } else {
                helper.updateCartItems(component, cart[i].Id, cart[i].quantity);
            }
        }
        component.set('v.cartTotalPrice', totalPrice);
        component.set('v.cartTotalQuantity', totalQuantity);
        
        var tax = component.get('v.tax');
        var taxPercentage = parseFloat(component.get("v.taxPercentage"));
        
        tax = totalPrice * (taxPercentage/100);
        component.set('v.tax', tax);
        
        var orderTotal = component.get('v.orderTotal');
        orderTotal = totalPrice + tax + parseFloat(component.get('v.shipping'));
        component.set('v.orderTotal', orderTotal);
    },
    showCart : function(component, event, helper) {
        var modal = component.find('modal');
        $A.util.addClass(modal, 'slds-fade-in-open');
        var backdrop = component.find('backdrop');
        $A.util.addClass(backdrop, 'slds-backdrop--open');
    },
    closeCart : function(component, event, helper) {
        helper.closeModal(component, event);
        
    },
    removeItem : function(component, event, helper) {
        //var selectedItem = event.currentTarget;
        //var removeItem = selectedItem.dataset.id;

        var removeItem = event.getSource().get("v.value");

        var cart = component.get('v.cart');
        cart.splice(removeItem, 1);
        component.set('v.cart', cart);
    },
    changeQuantity : function(component, event, helper) {
        
        var fieldName = event.getSource().get('v.name');

        //alert('fieldName: ' + fieldName);

        var pos = fieldName.indexOf("_");
        var index = fieldName.substring(pos + 1);

        //alert('index: ' + index);

        var changeItem = parseInt(index);
        var qty = event.getSource().get('v.value');

        //alert('qty: ' + qty);

        //alert('typeof qty: ' + (typeof qty));

        if(qty === undefined || isNaN(qty) || qty === '' || qty === null) {
            return;
        }

        var newQuantity = parseInt(qty);
        var cart = component.get('v.cart');
        var cartItem = cart[changeItem];
        cartItem.quantity = newQuantity;
        cartItem.total = cartItem.price * newQuantity;
        component.set('v.cart', cart);
    },
    clearCart1 : function(component, event, helper) {
        var cart = component.get('v.cart');
        cart = [];
        component.set('v.cart', cart);
        
        helper.deleteCartItems(component);
    },
    checkout : function(component, event, helper) {
        helper.closeModal(component, event);
        var catalog = component.find('catalog');
        $A.util.addClass(catalog, 'hidden');
        var checkout = component.find('checkout');
        $A.util.removeClass(checkout, 'hidden');
    },
    placeOrder : function(component, event, helper) {
        var flow = component.find("flowData");
        flow.startFlow("CreateWorkOrder");
        var cardValidity = component.find("cardnumber").get("v.validity");
        var codeValidity = component.find("securityCode").get("v.validity");
        if (cardValidity.valid && codeValidity.valid) {
            var spinner = component.find("mySpinner");
            $A.util.removeClass(spinner, "slds-hide");
            var checkout = component.find('checkout');
            $A.util.addClass(checkout, 'hidden');
            var confirmation = component.find('confirmation');
            $A.util.removeClass(confirmation, 'hidden');
            var cardNumber = component.find('cardnumber').get("v.value");
            var hiddenCardNumber = '**** **** **** ' + cardNumber.slice(-4);
            var formValues = {
                cardnumber : hiddenCardNumber,
                expiration : component.find('expMonth').get("v.value") + "/" + component.find('expYear').get("v.value"),
                securityCode : component.find('securityCode').get("v.value"),
                firstName : component.find('firstName').get("v.value"),
                lastName : component.find('lastName').get("v.value"),
                company : component.find('company').get("v.value"),
                street : component.find('street').get("v.value"),
                city : component.find('city').get("v.value"),
                state : component.find('state').get("v.value"),
                zip : component.find('zip').get("v.value")
            }
            component.set('v.formValues', formValues);
            helper.closeOrder(component, component.get('v.cartRecord').Id, cardNumber, formValues.expiration, formValues.securityCode, component.get('v.tax'), component.get('v.shipping'));
            helper.updateUserInfo(component,component.find('firstName').get("v.value"),
                                  component.find('lastName').get("v.value"),
                                  component.find('company').get("v.value"),
                                  component.find('street').get("v.value"),
                                  component.find('city').get("v.value"),
                                  component.find('state').get("v.value"),
                                  component.find('zip').get("v.value"));
        } else {
            if (!cardValidity.valid) {
                component.find("cardnumber").showHelpMessageIfInvalid();
            }
            if (!codeValidity.valid) {
                component.find("securityCode").showHelpMessageIfInvalid();
            }
        }
    },
    showSaveCart : function(component, event, helper) {
        console.log('showSaveCart');
        component.set('v.showSaveCartButton', true);
    },
    saveTheCart : function(component, event, helper) {
        console.log('saveTheCart');
        
        var cmpTarget = component.find('modalLib2');
        $A.util.removeClass(cmpTarget, 'slds-hide');
    },
    finalClick : function(component, event, helper) {
        debugger
        console.log('finalClick');
        var cmpTarget = component.find('modalLib2');
        $A.util.addClass(cmpTarget, 'slds-hide');
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            'title' : 'Success!',
            'type' : 'success',
            'message' : 'The Cart has been saved successfully.'
        });
        toastEvent.fire();
        component.set('v.showSaveCartButton', false);
        
        //helper.fireApex( arguments, "c.", { },  (object) => helper.cont(arguments, object) )
        
        
    },
    clearCart : function(component,event,helper){
        component.set("v.cartTotalQuantity",0);
        helper.deleteCartItems(component);
    },
    
    uncheckout : function(component, event, helper) {
        helper.closeModal(component, event);
        var catalog = component.find('catalog');
        $A.util.removeClass(catalog, 'hidden');
        var checkout = component.find('checkout');
        $A.util.addClass(checkout, 'hidden');
    },
    getOrderDetails : function(component,event,helper){
        //alert(JSON.stringify(component.get("v.cartRecord")));
        var result = component.get("v.cartRecord");
        //alert(result.Id);
        var orderCreation = component.get("c.createOrder");
        
        orderCreation.setParams({ cartId :result.Id,
                                 contactId : component.get("v.recordId"),
                                 storeId : component.get("v.storeId"),
                                 odmId : component.get("v.odmId") ,
                                 priceBook : component.get("v.priceBook"),
                                 accountId : component.get("v.accountId")                        
                                });
        orderCreation.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //alert("Working");
                //component.set("v.searchProductList",response.getReturnValue());
                //alert();
                 var toastEvent = $A.get("e.force:showToast");
    toastEvent.setParams({
        "title": "Success!",
        "message": "The Order has been Activated successfully.",
        "type":'success'
    });
    toastEvent.fire();
                let result = response.getReturnValue();
                component.set('v.orderId',result.Id);
                component.set('v.showNavigation',true);
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0]) {
                            console.log("Error message: " + JSON.stringify(errors[0]));
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        $A.enqueueAction(orderCreation);
    },
    
navigateToRecord : function (component, event, helper) {
    var navEvt = $A.get("e.force:navigateToSObject");
    navEvt.setParams({
      "recordId": component.get('v.orderId'),
      "slideDevName": "detail"
    });
    navEvt.fire();
}
     

    
    
})