operators = ['+', '-', '/', '*', '%'];
nonfunctional = ['C', 'CE'];

$(document).ready(function() {

  //Subtract button click
  $('.inputKey').click(function() {
    calcLogic(this.value);
  });

  function calcLogic(pressedButtonVal) {
    var currScrValue = $('#screenInput').val();
    //If the first keypress is a operator dont allow it
    var isNotAnOperator = $.inArray(pressedButtonVal, operators);
    var isNotNonFunctional = $.inArray(pressedButtonVal, nonfunctional);
  
    //No double operators press allowed
    var isPreviousKeyAOperator = $.inArray(currScrValue.substr(currScrValue.length - 1), operators);
    if(isNotAnOperator>=0 && isPreviousKeyAOperator >=0){
      return;
    }
    if (currScrValue === '' && isNotAnOperator < 0 && isNotNonFunctional < 0) {
      $('#screenInput').val(currScrValue + pressedButtonVal);
    } else if ('CE' === pressedButtonVal) {
      backspace();
    } else if ('C' === pressedButtonVal) {
      $('#screenInput').val('');
    }  else if ('EQ' === pressedButtonVal) {
     $('#screenInput').val(eval( $('#screenInput').val()));
    } else if (isNotNonFunctional < 0) {
      $('#screenInput').val(currScrValue + pressedButtonVal);
    } 
  }

  //Remove character one by one from right
  function backspace() {
    var temp = $('#screenInput').val();
    $('#screenInput').val(temp.substring(0, temp.length - 1));
  }

});