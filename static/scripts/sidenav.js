function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("mySidenav").style.opacity = "1";
  document.getElementById("myTab").style.left = "250px";
  document.getElementById("myTab").style.opacity = "0";
  document.getElementById("myTab").style.width = "0";
  document.getElementById("myArrow").style.visibility = "hidden";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "30px";
  document.getElementById("mySidenav").style.opacity = "0";
  document.getElementById("myTab").style.left = "0";
  document.getElementById("myTab").style.opacity = "1";
  document.getElementById("myTab").style.width = "30px";
  document.getElementById("myArrow").style.visibility = "visible";
}