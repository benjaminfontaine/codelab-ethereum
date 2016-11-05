import {Component, View, Inject, ViewEncapsulation, EventEmitter} from 'angular2/core';
import {FORM_DIRECTIVES,Control,FormBuilder, Validators} from 'angular2/common';
import MonTierce from "../contracts/MonTierce.sol";

@Component({
	selector: 'my-app'
})
@View({
	templateUrl: './app/src/app/app.component.html',
	styleUrls: ['./app/src/app/app.component.css'],
	directives: [FORM_DIRECTIVES]
})
class AppComponent{
	static get parameters() {
		return [[FormBuilder]];
	}


	constructor (formBuilder) {
		this.formBuilder = formBuilder;
		this.currentBalanceEventEmitter = new EventEmitter();
		window.addEventListener('load', function() {
			// Supports Metamask and Mist, and other wallets that provide 'web3'.
			if (typeof web3 !== 'undefined') {
				// Use the Mist/wallet provider.
				window.web3 = new Web3(web3.currentProvider);
			} else {
				// No web3 detected. Show an error to the user or use Infura: https://infura.io/
			}
		});
		MonTierce.setProvider(window.web3.currentProvider);
		var contratTierce = MonTierce.deployed();

		this.chevauxEnCourse = ["cheval1", "cheval2", "cheval3","cheval4", "cheval5", "cheval6","cheval7", "cheval8", "cheval9"]; // List of cities
		this.currentAddress =web3.eth.defaultAccount;
		web3.eth.getBalance(this.currentAddress, function(error, result){
			if(!error){
			this.currentBalance = result.toNumber();
      	self.currentBalanceEventEmitter.emit(this.currentBalance);
			}
			else{
				console.error(error);
			}
		});

		this.pariForm = formBuilder.group({
			premierCourse: ["", Validators.required] // Setting the field to "required"
		});


		contratTierce.initialiserCourse([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], {from : "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"}).catch(function(error){
			alert(error.message);
		}).then(function(){

		});
	}
}

export {AppComponent};
