#include <Arduino.h>
#include "scanner.h"

const int X_DAC = 25;  
const int Y_DAC = 26;  

int SCAN_RATE = 1000;  // по идее надо 10_000 -> 20_000
//купить Цап

const int points[][2] = {
    {100, 100}, {200, 100}, 
    {200, 200}, {100, 200}, 
    {100, 100} 
};

const int numPoints = sizeof(points) / sizeof(points[0]);
volatile int currentPoint = 0;  

hw_timer_t *timer = NULL;

void IRAM_ATTR onTimer() {
    dacWrite(X_DAC, points[currentPoint][0]);
    dacWrite(Y_DAC, points[currentPoint][1]);
    currentPoint = (currentPoint + 1) % numPoints;
}

void scanner_init() {
    timer = timerBegin(0, 80, true);  
    timerAttachInterrupt(timer, &onTimer, true);
    timerAlarmWrite(timer, 1000000 / SCAN_RATE, true);  
    timerAlarmEnable(timer);
    timerRestart(timer);  
}