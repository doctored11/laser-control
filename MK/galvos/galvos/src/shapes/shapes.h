#pragma once

#include <cstddef>  
#include <cstdint> 

struct ILDAPoint {
    uint16_t x, y;
    bool is_last;

    ILDAPoint() : x(0), y(0), is_last(false) {}
    ILDAPoint(uint16_t x, uint16_t y, bool is_last = false) 
        : x(x), y(y), is_last(is_last) {}
};

ILDAPoint* generate_test_square(size_t* out_count);
ILDAPoint* generate_test_star(size_t* out_count);

ILDAPoint* generate_square(uint16_t x0, uint16_t y0, uint16_t size, size_t* out_count);
