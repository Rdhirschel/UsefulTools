
function validatebeforesubmit(thisform) {
var yout = thisform.ytlink.value;
if(yout==null || yout == "")
   {
   alert("Please Enter the Youtube Video URL");
   thisform.ytlink.focus();
   return false;
   }
return true;
}   