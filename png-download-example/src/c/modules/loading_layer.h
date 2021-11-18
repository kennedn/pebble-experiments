#pragma once

#include <pebble.h>


void loading_layer_load(Layer *parent);
void loading_layer_unload();

void start_loading_animation();
void stop_loading_animation();
