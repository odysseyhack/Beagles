import React from "react";
import { NavLink } from "react-router-dom";
import { requestTypes } from "../../api/requestItems";

const Header = () => {
  const activeStyle = { color: "#F15B2A" };
  return (
    <nav>
      {/* <NavLink to="/" activeStyle={activeStyle} exact>
        Home
      </NavLink>
      {" | "} */}
      <NavLink
        to={"/request/" + requestTypes.Booking}
        activeStyle={activeStyle}
      >
        Booking
      </NavLink>
      {" | "}
      <NavLink
        to={"/request/" + requestTypes.Parking}
        activeStyle={activeStyle}
      >
        Parking
      </NavLink>
      {" | "}
      <NavLink
        to={"/request/" + requestTypes.AirportEntry}
        activeStyle={activeStyle}
      >
        Airport
      </NavLink>
      {" | "}
      <NavLink
        to={"/request/" + requestTypes.BorderControl}
        activeStyle={activeStyle}
      >
        Border control
      </NavLink>
      {" | "}
      <NavLink
        to={"/request/" + requestTypes.LoungeEntry}
        activeStyle={activeStyle}
      >
        Lounge
      </NavLink>
      {" | "}
      <NavLink
        to={"/request/" + requestTypes.Shopping}
        activeStyle={activeStyle}
      >
        Shopping
      </NavLink>
    </nav>
  );
};

export default Header;
