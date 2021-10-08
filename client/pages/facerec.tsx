import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Col } from "react-bootstrap";
import FaceRecognition from "../components/FaceRecognition";

export default function IdlePage() {
  return (
    <>
      <div className="text-center mt-3">
        <h1>
          <img src="/icons/apple-touch-icon-72x72.png" />
          &nbsp;EasyKiosk
        </h1>
      </div>
      <FaceRecognition />
    </>
  );
}
