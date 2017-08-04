"use strict";

function initializeDom() {

}
function isLazada(field) {
	
	var fieldRegex = /(^(https?:\/\/(?:www\.)?|(?:www\.))?|\s(https?:\/\/(?:www\.)?|(?:www\.))?)lazada/
	return fieldRegex.test(field);
}
function validateCompareForm(cache) {
	var valid = true;
	var inputFormGroup = cache.comareForm.find('.form-group');
	inputFormGroup.each(function( index ) {
		var productURL = $(this).find('input');
		if(isLazada(productURL.val())){
			productURL.next().remove();
		}else{

			if(productURL.next().length == 0) {
				productURL.closest('.form-group').append('<span class="error">plz enter the lazada product URL</span>');
			}
			valid = false;
			return valid;
		}
	});
	return valid;
}
function initializeEvents() {
	var cache = {
			comareForm : $('#compare-pd-form')
		}
	cache.comareForm.on('submit', function (e) {
		
		if(!validateCompareForm(cache)){
			e.preventDefault();
		}

	});
}

$(document).ready(function(){
	initializeEvents();
})