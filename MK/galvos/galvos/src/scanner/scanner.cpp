#include <Arduino.h>
#include <SPI.h>
#include "scanner.h"

#define CS_PIN 2
#define MOSI_PIN 27
#define SCK_PIN 14

static const ILDAPoint* scan_points = nullptr;
static size_t scan_point_count = 0;
static volatile size_t current_index = 0;
static hw_timer_t* timer = nullptr;

static void setDAC(uint8_t channel, uint16_t value) {
    if (value > 4095) value = 4095;

    uint16_t command = 0b00110000; 
    if (channel == 1) command |= 0b10000000; 
    command |= (value >> 8) & 0x0F;

    digitalWrite(CS_PIN, LOW);
    SPI.transfer(command);
    SPI.transfer(value & 0xFF);
    digitalWrite(CS_PIN, HIGH);
}

void IRAM_ATTR onTimer() {
    if (!scan_points || scan_point_count == 0) return;
    setDAC(0, scan_points[current_index].x);
    setDAC(1, scan_points[current_index].y);
    current_index = (current_index + 1) % scan_point_count;
}

void scanner_init(uint32_t scan_rate_hz) {
    pinMode(CS_PIN, OUTPUT);
    digitalWrite(CS_PIN, HIGH);
    SPI.begin(SCK_PIN, -1, MOSI_PIN, CS_PIN);

    timer = timerBegin(0, 80, true);
    timerAttachInterrupt(timer, &onTimer, true);
    timerAlarmWrite(timer, 1000000 / scan_rate_hz, true);
}

void scanner_set_points(const ILDAPoint* points_array, size_t num_points) {
    scan_points = points_array;
    scan_point_count = num_points;
    current_index = 0;
}

void scanner_start() {
    if (timer) timerAlarmEnable(timer);
}

void scanner_stop() {
    if (timer) timerAlarmDisable(timer);
}
