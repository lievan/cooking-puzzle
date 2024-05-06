import React from "react";

var fullyear = new Date().getFullYear();
function Footer() {
  return (
    <footer>
      <p>Copyright @ {fullyear}</p>
    </footer>
  );
}

export default Footer;
