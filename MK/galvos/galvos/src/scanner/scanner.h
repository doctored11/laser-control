#pragma once
#include "shapes/shapes.h"  

void scanner_init(uint32_t pps);
void scanner_set_points(const ILDAPoint* points, size_t len);
void scanner_start();
