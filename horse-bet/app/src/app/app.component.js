import {Component} from 'angular2/core';
import MonTierce from "../contracts/MonTierce.sol";
class AppComponent {

	static get annotations() {
		return [
			new Component({
	    		selector: "my-app",
	    		templateUrl: './app/src/app/app.component.html'
	  		}),
		];
	}

	constructor () {
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
		alert(web3.eth.accounts);
		var contratTierce = MonTierce.deployed();
		contratTierce.initialiserCourse([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], {from : "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"}).catch(function(error){
      alert(error.message);
    }).then(function(){
      alert("top");
    });
	}
}

export {AppComponent};
