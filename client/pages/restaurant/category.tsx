import {
  faCartPlus,
  faCreditCard,
  faGlobeAsia,
  faLightbulb,
  faShoppingBag,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Modal,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  ListGroup,
} from "react-bootstrap";
import { getCategories } from "../../api/category";
import { getMenus } from "../../api/menus";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import styles from "../../styles/restaurant/category.module.css";
import { useSpeechSynthesis } from "../../lib/useSpeechSynthesis";
import Fuse from "fuse.js";
import { addMenu } from "../../store/slices/orderSlice";
import { useRouter } from "next/dist/client/router";
import swal from "sweetalert";

export default function Category() {
  const dispatch = useAppDispatch();
  const { speak, voices, isSupported } = useSpeechSynthesis({});

  const router = useRouter();

  const [categories, setCategories] = useState<any>();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [menus, setMenus] = useState<any>();
  const [voice, setVoice] = useState<SpeechSynthesisVoice | undefined>(
    undefined
  );
  const [fuseCategory, setFuseCategory] = useState<any>();
  const [fuseMenu, setFuseMenu] = useState<any>();

  const [showOrderSummary, setShowOrderSummary] = useState<boolean>(false);
  const [cart, setCart] = useState<any>([]);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setActiveMenu(null);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    console.log(voices);
    const found = voices.find((v) => {
      if (v.lang === "ko-KR") {
        if (v.name !== "Jinsoo Siri") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    setVoice(found);
    speak({ text: "???????????? ????????? ????????? ???????????????.", voice: found });

    //setVoice(voices[voiceIndex] || null);
  }, [voices]);

  useEffect(() => {
    getCategories(2)
      .then((data) => {
        setCategories(data.data);
        setFuseCategory(new Fuse(data.data, { keys: ["name"] }));
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
    startListening();
  }, []);

  useEffect(() => {
    if (activeCategory)
      getMenus(activeCategory)
        .then((data) => {
          setMenus(data.data);
          setFuseMenu(new Fuse(data.data, { keys: ["name"] }));
        })
        .catch((error) => {
          console.error(error);
        });
  }, [activeCategory]);

  const selectCategory = (category: any) => {
    setActiveCategory(category.id);
    speak({
      text: `${category.name}??? ???????????????. ?????? ????????? ????????????????`,
      voice: voice,
    });
  };

  const selectMenu = (menu: any) => {
    setActiveMenu(menu.id);
    handleShow();
    speak({
      text: `${menu.name}??? ????????? ??? ???????????????.`,
      voice: voice,
    });
  };

  const commands: any = [
    {
      command: ["* ??????", "* ??????", "* ?????????", "* ???????????????"],
      callback: (food: any) => {
        console.log(`Your order is for: ${food}`);
        if (!activeCategory) {
          const result = fuseCategory.search(food);
          if (result.length > 0) {
            selectCategory(result[0].item);
          }
          //selectCategory(categories.find((c: any) => c.name === food));
        } else {
          console.log(fuseMenu.search(food));
          const result = fuseMenu.search(food);
          if (result.length > 0) {
            selectMenu(result[0].item);
          } //selectMenu(menus.find((c: any) => c.name === food));
        }
      },
    },
    {
      command: "????????????",
      callback: () => {
        if (activeMenu) {
          buyBtnHandler(menus.find((m: any) => m.id === activeMenu!));
        }
      },
    },
    {
      command: ["????????????", "???????????????"],
      callback: () => {
        setShowOrderSummary(true);
      },
    },
    {
      command: ["??????", "????????????", "cancel", "????????????", "back"],
      callback: () => {
        if (activeMenu) {
          handleClose();
        } else if (activeCategory) {
          setActiveCategory(null);
        } else {
          router.push("/restaurant/start");
        }
        speak({
          text: "?????? ????????????.",
          voice: voice,
        });
      },
    },
  ];

  const { transcript, listening, resetTranscript } = useSpeechRecognition({
    commands,
  });
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "ko" });

  const buyBtnHandler = (menu: any) => {
    dispatch(addMenu(menu));
    let _cart: any = [...cart];
    _cart.push(menu);
    setCart(_cart);
    handleClose();
    speak({
      text: `${menu.name}??? ???????????????.`,
      voice: voice,
    });
  };

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const { predictedAge } = useAppSelector((state) => state.user);

  const creditCardBtnHandler = () => {
    swal({
      title: "EasyKiosk - ?????????????????? ???????????????",
      text: "??????????????? ???????????????.",
      icon: "success",
    }).then(() => {
      router.push("/restaurant/start");
    });
  };

  return (
    <>
      {predictedAge && predictedAge > 60 && (
        <style jsx global>{`
          html {
            font-size: 20px;
          }
        `}</style>
      )}
      {
        <Container className="mt-5">
          {!showOrderSummary &&
            !activeCategory &&
            categories &&
            categories.length > 0 && (
              <>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-primary"
                    size="lg"
                    onClick={() => router.push("/restaurant/start")}
                  >
                    &lt; ????????????
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    onClick={() => setShowOrderSummary(true)}
                  >
                    <FontAwesomeIcon icon={faCartPlus} /> ????????????
                  </Button>
                </div>
                <h1 className="text-center mb-5">
                  ???????????? ????????? ????????? ???????????????.
                </h1>
                <Row xs={1} sm={2} md={3} className="justify-content-center">
                  {categories.map((category: any) => {
                    return (
                      <Col>
                        <Button
                          variant="outline-secondary"
                          style={{ width: "100%" }}
                          onClick={() => selectCategory(category)}
                        >
                          <Image
                            src={`http://tp15.local:1337${category.image.url}`}
                            height="200px"
                            width="100%"
                            style={{ objectFit: "contain" }}
                          />
                          <div style={{ fontSize: "2.5rem" }}>
                            {category.name}
                          </div>
                        </Button>
                      </Col>
                    );
                  })}
                </Row>
              </>
            )}
          {!showOrderSummary && activeCategory && menus && menus.length > 0 && (
            <>
              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={() => setActiveCategory(null)}
                >
                  &lt; ????????????
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={() => setShowOrderSummary(true)}
                >
                  <FontAwesomeIcon icon={faCartPlus} /> ????????????
                </Button>
              </div>
              <h1 className="text-center mb-5">???????????? ????????? ???????????????.</h1>
              <Row xs={1} sm={2} md={3} className="justify-content-center">
                {menus.map((menu: any) => {
                  return (
                    <Col>
                      <Button
                        variant="outline-secondary"
                        style={{ width: "100%" }}
                        onClick={() => selectMenu(menu)}
                      >
                        <Image
                          src={`http://tp15.local:1337${menu.image.url}`}
                          height="200px"
                          width="100%"
                          style={{ objectFit: "contain" }}
                        />
                        <div style={{ fontSize: "2.5rem" }}>{menu.name}</div>
                        <div style={{ fontSize: "1.7rem" }}>???{Number(menu.price).toLocaleString()}</div>
                      </Button>
                    </Col>
                  );
                })}
              </Row>
            </>
          )}
          {showOrderSummary && (
            <>
              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={() => setShowOrderSummary(false)}
                >
                  &lt; ????????????
                </Button>
              </div>
              <h1 className="text-center mb-5">?????? ??? ????????? ?????????.</h1>
              <Row xs={1} sm={2} md={3} className="justify-content-center">
                <ListGroup>
                  {cart.map((item: any) => {
                    return (
                      <ListGroup.Item style={{ fontSize: "1.8rem" }}>
                        <div className="d-flex justify-content-between">
                          <span>{item.name}</span>
                          <span>???{Number(item.price).toLocaleString()}</span>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Row>
              <Row xs={1} sm={2} md={3} className="justify-content-center">
                <p className="text-center fw-bold display-6 mt-4">
                  ??????: ???
                  {Number(
                    cart.reduce((accumulator: any, current: any) => {
                      console.log(accumulator + current.price);
                      return accumulator + current.price;
                    }, 0)
                  ).toLocaleString()}
                </p>
              </Row>
              <Row xs={1} sm={2} md={3} className="justify-content-around mt-5">
                <Button size="lg" onClick={creditCardBtnHandler}>
                  <FontAwesomeIcon icon={faCreditCard} /> ?????? ??????
                </Button>
              </Row>
            </>
          )}
        </Container>
      }
      <>
        {!showOrderSummary && menus && activeMenu && (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {menus.find((m: any) => m.id === activeMenu!).name} ????????????
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{ fontSize: "1.6rem" }} className="fw-bold">
                ??????
              </div>
              <MenuOptionsRadio />
              {menus
                .find((m: any) => m.id === activeMenu!)
                .name.includes("??????") && (
                <>
                  <hr />
                  <div style={{ fontSize: "1.6rem" }} className="fw-bold">
                    ??????
                  </div>
                  <ToggleButtonGroup
                    type="radio"
                    name="options1"
                    defaultValue={1}
                    style={{ width: "450px", height: "70px" }}
                  >
                    <ToggleButton
                      id="tbga-radio-1"
                      value={1}
                      variant="secondary"
                      style={{ fontSize: "1.3rem" }}
                    >
                      ??????
                    </ToggleButton>
                    <ToggleButton
                      id="tbga-radio-2"
                      value={2}
                      variant="secondary"
                      style={{ fontSize: "1.3rem" }}
                    >
                      ???????????? (+500???)
                    </ToggleButton>
                    <ToggleButton
                      id="tbga-radio-3"
                      value={3}
                      variant="secondary"
                      style={{ fontSize: "1.3rem" }}
                    >
                      ?????? (+500???)
                    </ToggleButton>
                  </ToggleButtonGroup>
                </>
              )}
              {menus
                .find((m: any) => m.id === activeMenu!)
                .name.includes("??????") && (
                <>
                  <hr />
                  <div style={{ fontSize: "1.6rem" }} className="fw-bold">
                    ?????? ??????
                  </div>
                  <ToggleButtonGroup
                    type="radio"
                    name="options1"
                    defaultValue={1}
                    style={{ width: "300px", height: "70px" }}
                  >
                    <ToggleButton
                      id="tbga-radio-1"
                      value={1}
                      variant="secondary"
                      style={{ fontSize: "2rem" }}
                    >
                      ?????????
                    </ToggleButton>
                    <ToggleButton
                      id="tbga-radio-2"
                      value={2}
                      variant="secondary"
                      style={{ fontSize: "2rem" }}
                    >
                      ??????
                    </ToggleButton>
                  </ToggleButtonGroup>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="warning" onClick={handleClose} size="lg">
                ??????
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  buyBtnHandler(menus.find((m: any) => m.id === activeMenu!))
                }
                size="lg"
              >
                ????????????
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    </>
  );
}

function MenuOptionsRadio() {
  return (
    <>
      <ToggleButtonGroup
        type="radio"
        name="options"
        defaultValue={1}
        style={{ width: "300px", height: "70px" }}
      >
        <ToggleButton
          id="tbg-radio-1"
          value={1}
          variant="secondary"
          style={{ fontSize: "2rem" }}
        >
          ???
        </ToggleButton>
        <ToggleButton
          id="tbg-radio-2"
          value={2}
          variant="secondary"
          style={{ fontSize: "2rem" }}
        >
          ???
        </ToggleButton>
        <ToggleButton
          id="tbg-radio-3"
          value={3}
          variant="secondary"
          style={{ fontSize: "2rem" }}
        >
          ???
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
