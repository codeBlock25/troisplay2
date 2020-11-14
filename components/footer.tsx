import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fab } from "@material-ui/core";
import React from "react";
import moment from "moment";

export default function Footer() {
  return (
    <footer id="contact">
      <div className="content">
        <div className="title">
          <span className="logo" />
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, est quasi
          quisquam delectus neque, dolores esse adipisci consequatur voluptates
          tenetur vo.
        </p>
        <div className="links">
          <Fab className="link">
            <FontAwesomeIcon icon={faFacebookF} />
          </Fab>
          <Fab className="link">
            <FontAwesomeIcon icon={faTwitter} />
          </Fab>
          <Fab className="link">
            <FontAwesomeIcon icon={faInstagram} />
          </Fab>
        </div>
      </div>
      <div className="content">
        <h3 className="main_title">Content</h3>
        <ul>
          <li>Blog</li>
          <li>Support</li>
          <li>FAQ</li>
          <li>Term of service</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      <span className="ryt">
        Copyright &copy;{moment().format("YYYY")} Troisplay LTD
      </span>
    </footer>
  );
}
