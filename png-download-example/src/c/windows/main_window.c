#include <pebble.h>

#include "c/windows/main_window.h"
#include "c/modules/loading_layer.h"

static Window *s_window;
static BitmapLayer *s_bitmap_layer;

static GBitmap *s_bitmap;

static void window_load(Window *window) {
  Layer *root_layer = window_get_root_layer(window);
  GRect bounds = GRect(0,0,120,120);//layer_get_bounds(root_layer);

  s_bitmap_layer = bitmap_layer_create(bounds);
  Layer *bitmap_root_layer = bitmap_layer_get_layer(s_bitmap_layer);
  bitmap_layer_set_compositing_mode(s_bitmap_layer, GCompOpSet);

  loading_layer_load(bitmap_root_layer);
  start_loading_animation();

  layer_add_child(root_layer, bitmap_layer_get_layer(s_bitmap_layer));
}

static void window_unload(Window *window) {
  bitmap_layer_destroy(s_bitmap_layer);
  loading_layer_unload();
  if(s_bitmap) {
    gbitmap_destroy(s_bitmap);
  }

  window_destroy(window);
}

void main_window_push() {
  s_window = window_create();
  window_set_background_color(s_window, GColorIslamicGreen);
  window_set_window_handlers(s_window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
  window_stack_push(s_window, true);
}

void main_window_set_image_data(uint8_t *data, int size) {
  stop_loading_animation();
  if(s_bitmap) {
    gbitmap_destroy(s_bitmap);
  }

  // Create new GBitmap from downloaded PNG data
  s_bitmap = gbitmap_create_from_png_data(data, size);

  if(s_bitmap) {
    bitmap_layer_set_bitmap(s_bitmap_layer, s_bitmap);
  } else {
    APP_LOG(APP_LOG_LEVEL_ERROR, "Error creating GBitmap from PNG data!");
  }
}
