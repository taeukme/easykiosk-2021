import styles from "../../styles/restaurant/init.module.css";
import FaceRecognition from "../../components/FaceRecognition";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useGetRestaurantQuery } from "../../api/kioskApi";
import { useRouter } from "next/dist/client/router";

export default function InitPage() {
  const { data, error, isLoading } = useGetRestaurantQuery("2");
  const router = useRouter();

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-5">
        Cannot find the specified restaurant.
      </Alert>
    );
  }

  const startBtnHandler = () => {
    router.push("/restaurant/category");
  };

  return (
    <>
      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
          width: 100%;
        }

        * {
          color: black;
        }
      `}</style>
      <div className={`h-100 ${styles.bg} w-100`}>
        <div className="d-flex flex-column h-100 justify-content-center align-items-center">
          <div className="display-6 text-center">{data.name}</div>
          <div
            className="text-center text-muted my-3"
            style={{ fontSize: "1.4rem" }}
          >
            안녕하세요 고객님
          </div>
          <FaceRecognition />
          <Button
            variant="success"
            style={{ width: "500px", height: "150px", fontSize: "2em" }}
            onClick={() => startBtnHandler()}
          >
            여기를 눌러 주문하세요
            <br /> Touch to Start
          </Button>
        </div>
      </div>
    </>
  );
}
