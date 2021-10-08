import {
  faGlobeAsia,
  faLightbulb,
  faShoppingBag,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../../styles/restaurant/main.module.css";

export default function HomePage() {
  const dataLocal = {
    name: "맛있는 버거집",
    logoUrl:
      "https://i.pinimg.com/originals/fc/91/03/fc910334d8988d3c7e4321322670660e.png",
    primaryAction: {
      name: "식사하기",
      data: "onpremise",
    },
    secondaryAction: {
      name: "포장하기",
      data: "togo",
    },
  };

  return (
    <>
      <Container>
        <Row className="justify-content-md-center mb-3">
          <Col md="auto">
            <img src={dataLocal.logoUrl} className={styles.locationLogo} />
          </Col>
        </Row>
        <Row className="justify-content-md-center mb-5">
          <Col md="auto">
            <span className={styles.locationName}>{dataLocal.name}</span>
          </Col>
        </Row>
        <Row className="justify-content-md-center mb-3">
          <Col md="auto">
            <div className={styles.actionButtonContainer}>
              <FontAwesomeIcon icon={faUtensils} size="3x" />
              <div className={styles.actionButtonText}>
                {dataLocal.primaryAction.name}
              </div>
            </div>
          </Col>
          <Col md="auto">
            <div className={styles.actionButtonContainer}>
              <FontAwesomeIcon icon={faShoppingBag} size="3x" />
              <div className={styles.actionButtonText}>
                {dataLocal.secondaryAction.name}
              </div>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <div className={styles.actionButtonContainer}>
              <FontAwesomeIcon icon={faGlobeAsia} size="3x" />
              <div className={styles.actionButtonText}>Language</div>
            </div>
          </Col>
          <Col md="auto">
            <div className={styles.actionButtonContainer}>
              <FontAwesomeIcon icon={faLightbulb} size="3x" />
              <div className={styles.actionButtonText}>배려등</div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
