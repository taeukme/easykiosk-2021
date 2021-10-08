import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";
import { Badge, Spinner } from "react-bootstrap";
import Webcam from "react-webcam";
import { useAppDispatch } from "../store/hooks";
import { setPredictedAge } from "../store/slices/userSlice";

import styles from "../styles/FaceRecognition.module.css";

let predictedAges: number[] = [];

function interpolateAgePredictions(age: number) {
  predictedAges = [age].concat(predictedAges).slice(0, 30);
  const avgPredictedAge =
    predictedAges.reduce((total, a) => total + a) / predictedAges.length;
  return avgPredictedAge;
}

export default function FaceRecognition() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [modelStatus, setModelStatus] = useState<
    "loaded" | "loading" | "notLoaded"
  >("notLoaded");
  const [age, setAge] = useState<number | null>(null);

  const dispatch = useAppDispatch();

  const withBoxes = true;

  const loadModels = async () => {
    const MODEL_PATH = "/weights";
    setModelStatus("loading");

    await Promise.all([
      faceapi.nets.tinyFaceDetector.load(MODEL_PATH),
      faceapi.nets.ageGenderNet.load(MODEL_PATH),
    ]);

    setModelStatus("loaded");
  };

  const handleLoadWaiting = async () => {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (webcamRef.current?.video?.readyState == 4) {
          resolve(true);
          clearInterval(timer);
        }
      }, 500);
    });
  };

  const faceRecognitionHandler = async () => {
    await handleLoadWaiting();

    if (webcamRef.current && canvasRef.current) {
      const webcam = webcamRef.current.video as HTMLVideoElement;
      const canvas = canvasRef.current;
      webcam.width = webcam.videoWidth;
      webcam.height = webcam.videoHeight;
      canvas.width = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      const video = webcamRef.current.video;

      (async function recognize() {
        console.log("recognize loop started");

        const result = await faceapi
          .detectSingleFace(video as any, new faceapi.TinyFaceDetectorOptions())
          .withAgeAndGender();

        if (result) {
          const dims = faceapi.matchDimensions(canvas, video as any, true);

          const resizedResult = faceapi.resizeResults(result, dims);
          faceapi.draw.drawDetections(canvas, resizedResult);

          if (withBoxes) {
            faceapi.draw.drawDetections(canvas, resizedResult);
          }
          const { age, gender, genderProbability } = resizedResult;

          // interpolate gender predictions over last 30 frames
          // to make the displayed age more stable
          const interpolatedAge = interpolateAgePredictions(age);
          setAge(interpolatedAge);
          new faceapi.draw.DrawTextField(
            [
              `${faceapi.utils.round(interpolatedAge, 0)} years`,
              //`${gender} (${faceapi.utils.round(genderProbability)})`,
            ],
            result.detection.box.bottomLeft
          ).draw(canvas);
        }
        requestAnimationFrame(recognize);
      })();
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    if (modelStatus === "loaded") {
      faceRecognitionHandler();
      setReady(true);
    }
  }, [modelStatus]);

  useEffect(() => {
    if (typeof age === "number") {
      dispatch(setPredictedAge(age));
    }
  }, [age]);

  if (!ready) {
    return (
      <>
        <Spinner animation="border" /> 얼굴 인식 모델 시작 중
      </>
    );
  }

  return (
    <>
      {age && age > 60 && (
        <style jsx global>{`
          html {
            font-size: 20px;
          }
        `}</style>
      )}
      <div className={`${styles.faceRecDisplay}`}>
        <Webcam
          audio={false}
          ref={webcamRef}
          className={`${styles.faceRecWebcam} rounded`}
        />
        <canvas
          ref={canvasRef}
          className={`${styles.faceRecOverlay} rounded`}
        />
      </div>
      <div className="text-center m-2 p-2 border">
        <div>
          <span className="fw-bold">[Debug]</span> 예측된 나이:{" "}
          {age?.toPrecision(2)}
        </div>
      </div>
    </>
  );
}
