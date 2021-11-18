/**
 * Animation source:
 * http://bestanimations.com/Science/Physics/Physics2.html
 */

#include <pebble.h>
#include "c/modules/loading_layer.h"

static GBitmap *loading_bitmap = NULL;
static BitmapLayer *loading_bitmap_layer;
static GBitmapSequence *loading_sequence = NULL;
static AppTimer *loading_timer;
void start_loading_animation();


static void timer_handler(void *context) {
  uint32_t next_delay;

  // Advance to the next APNG frame
  if(gbitmap_sequence_update_bitmap_next_frame(loading_sequence, loading_bitmap, &next_delay)) {
    bitmap_layer_set_bitmap(loading_bitmap_layer, loading_bitmap);
    layer_mark_dirty(bitmap_layer_get_layer(loading_bitmap_layer));

    // Timer for that delay
    loading_timer = app_timer_register(next_delay, timer_handler, NULL);
  } else {
    // Start again
    start_loading_animation();
  }
}

void start_loading_animation() {
  // Make bitmap layer visible
  layer_set_hidden(bitmap_layer_get_layer(loading_bitmap_layer), false);
  
  // Free old data
  if(loading_sequence) {
    gbitmap_sequence_destroy(loading_sequence);
    loading_sequence = NULL;
  }
  if(loading_bitmap) {
    gbitmap_destroy(loading_bitmap);
    loading_bitmap = NULL;
  }

  // Create sequence
  loading_sequence = gbitmap_sequence_create_with_resource(RESOURCE_ID_LOADING_ANIMATION);

  // Create GBitmap
  loading_bitmap = gbitmap_create_blank(gbitmap_sequence_get_bitmap_size(loading_sequence), GBitmapFormat8Bit);

  // Begin animation
  loading_timer = app_timer_register(1, timer_handler, NULL);
}

void stop_loading_animation() {
  app_timer_cancel(loading_timer);
  loading_timer = NULL;
  layer_set_hidden(bitmap_layer_get_layer(loading_bitmap_layer), true);
}


void loading_layer_load(Layer *parent) {
  GRect bounds = layer_get_bounds(parent);
  loading_bitmap_layer = bitmap_layer_create(bounds);
  bitmap_layer_set_alignment(loading_bitmap_layer, GAlignCenter);
  bitmap_layer_set_compositing_mode(loading_bitmap_layer, GCompOpSet);
  layer_add_child(parent, bitmap_layer_get_layer(loading_bitmap_layer));
}

void loading_layer_unload() {
  bitmap_layer_destroy(loading_bitmap_layer);
  free(loading_bitmap);
}


