#include <Arduino.h>
#include "scanner/scanner.h"
#include "shapes/shapes.h"

ILDAPoint* shape = nullptr;
size_t shape_len = 0;

void setup() {
    Serial.begin(9600);
    shape = generate_test_square( &shape_len);
    if (!shape) {
        Serial.println("Failed to allocate shape");
        return;
    }

    scanner_init(15000);  
    scanner_set_points(shape, shape_len);
    scanner_start();
}

void loop() {
}
