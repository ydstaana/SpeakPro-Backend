var Twocheckout = require('2checkout-node');

var tco = new Twocheckout({
    sellerId: "901378548",
    privateKey: "21D194AB-F4CD-4C8B-A7AF-0FC4768A4F72",
	sandbox: true   
});



module.exports = function(req, res, next){
	console.log("am i called");
	console.log(req.body);
	var params = {
	    "merchantOrderId": "123",
	    "token": req.body.tcoToken,
	    "currency": "USD",
	    "total": req.body.total,
	    "billingAddr": {
	        "name": `${req.body.user.firstName} ${req.body.user.lastName}`,
	        "addrLine1": "SpeakPro HQ",
	        "city": "Makati City",
	        "state": "NCR",
	        "zipCode": "1630",
	        "country": "PH",
			"email": req.body.user.email
	    }
	};

	console.log(params)

	tco.checkout.authorize(params, function (error, data) {
		console.log("i was called");
	    if (error) {
	    	console.log(error.message)
	        res.status(300).json({
				code: 300,
				message : error.message
			});
	    } else {
	    	console.log(data);
	        res.send(data);
	    }
	});
	
}