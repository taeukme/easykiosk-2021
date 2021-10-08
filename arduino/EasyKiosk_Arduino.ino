#include <NewPing.h>

#define steps 5
#define dir 6
#define ms1 8
#define ms2 9
#define ms3 10 //핀연결

#define TRIG_TOP 2 //TRIG_TOP 핀 설정 (초음파 보내는 핀)
#define ECHO_TOP 3 //ECHO_TOP 핀 설정 (초음파 받는 핀)
#define MAX_DISTANCE 70

NewPing sonar_top(TRIG_TOP, ECHO_TOP, MAX_DISTANCE);

#define TRIG_DEVICE 7 //TRIG_TOP 핀 설정 (초음파 보내는 핀)
#define ECHO_DEVICE 4 //ECHO_TOP 핀 설정 (초음파 받는 핀)

NewPing sonar_device(TRIG_DEVICE, ECHO_DEVICE, MAX_DISTANCE);

#define MOVEDOWN 0
#define MOVEUP 1

#define HEIGHTMIN 10
#define HEIGHTMAX 45
#define HEIGHTDEF 57

long human, kiosk, target;

void setup() {
    Serial.begin(9600);
    pinMode(steps, OUTPUT);
    pinMode(dir, OUTPUT);
    pinMode(ms1, OUTPUT);
    pinMode(ms2, OUTPUT);
    pinMode(ms3, OUTPUT); //신호보낼 핀 출력설정

    digitalWrite(ms1, LOW);
    digitalWrite(ms2, LOW);
    digitalWrite(ms3, LOW); //분주설정
}

int threshold = 5;

void loop() {
    do {
      human = sonar_top.convert_cm(sonar_top.ping_median(10));
      Serial.println("E001/Top sonar got zero, trying again...");
      if (human == 0) {
        delay(50);
      }
    } while (human == 0);
    
    do {
      kiosk = sonar_device.convert_cm(sonar_device.ping_median(10));
      Serial.println("E002/Device sonar got zero, trying again...");
      if (kiosk == 0) {
        delay(50);
      }
    } while (kiosk == 0);

    target = HEIGHTDEF - human + 5;

    if (target - kiosk > threshold) {
      // Device needs to move up
      if (kiosk >= 50) {
        // Do not move kiosk any further up so that it doesn't damage the motors
        Serial.println("S002/Kiosk height gte 50, skipping UP...");
      } else {
        Serial.print("M001/");
        Serial.print(String(human));
        Serial.print(':');
        Serial.print(String(kiosk));
        Serial.println("/UP");
        onCycle(1000, 700, MOVEUP);
      }
    } else if (target - kiosk < -(threshold)) {
      // Device needs to move down

      if (kiosk <= 15) {
        // Do not move kiosk any further down so that it doesn't damage the motors
        Serial.println("S003/Kiosk height lte 15, skipping DOWN...");
      } else {
        Serial.print("M002/");
        Serial.print(String(human));
        Serial.print(':');
        Serial.print(String(kiosk));
        Serial.println("/DOWN");
        onCycle(1000, 700, MOVEDOWN);
      }
      
    } else {
      Serial.println("S001/Within threshold, skipping...");
    }

    delay(100);
}

void onCycle(unsigned int stepV, unsigned int delayV, unsigned int directV) {
    //400 5000 0 일때 한바퀴...  8mm 이동..
    //200 5000 0 일때 한바퀴...  4mm 이동..
    digitalWrite(dir, directV); //회전방향 출력

    for (int i = 0; i < stepV; i++) { //정해진 스텝수만큼 펄스입력
        digitalWrite(steps, HIGH);
        delayMicroseconds(delayV); //딜레이값
        digitalWrite(steps, LOW);
        delayMicroseconds(delayV);
    }
}
